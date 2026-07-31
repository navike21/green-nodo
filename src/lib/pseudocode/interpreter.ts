import type { Expression, FunctionNode, Statement } from "./ast";
import { Environment } from "./environment";
import {
  BreakSignal,
  ContinueSignal,
  ErrorCode,
  PseudocodeError,
  ReturnSignal,
  TerminateSignal,
  ThrownProgramError,
  VerifyFailure,
} from "./errors";
import {
  deepClone,
  deepEquals,
  isTruthy,
  PClass,
  PFunction,
  PInstance,
  PObject,
  PQueue,
  PSet,
  PStack,
  toDisplayString,
  toInspectString,
} from "./values";

const MAX_STEPS = 200_000;
const MAX_CALL_DEPTH = 400;

export interface TestResult {
  description: string;
  passed: boolean;
  message?: string;
}

function errorMessageOf(e: unknown): string {
  if (e instanceof ThrownProgramError) return e.message;
  if (e instanceof PseudocodeError) return e.message;
  if (e instanceof VerifyFailure) return e.message;
  if (e instanceof Error) return e.message;
  return String(e);
}

export class Interpreter {
  readonly output: string[] = [];
  readonly testReport: TestResult[] = [];

  private steps = 0;
  private callDepth = 0;
  private readonly thisStack: (PInstance | undefined)[] = [];
  private inputCursor = 0;

  private currentTestPassed = true;
  private currentTestMessage: string | undefined;
  private inTest = false;

  constructor(private readonly inputs: unknown[] = []) {}

  run(program: Statement): void {
    if (program.kind !== "Program") throw new Error("Se esperaba un nodo Program.");
    const globalEnv = new Environment(null);
    try {
      this.executeBlock(program.body, globalEnv);
    } catch (e) {
      if (e instanceof TerminateSignal) return;
      throw e;
    }
  }

  private stepGuard(line: number, column: number): void {
    this.steps += 1;
    if (this.steps > MAX_STEPS) {
      throw new PseudocodeError(
        ErrorCode.EXECUTION_LIMIT_EXCEEDED,
        "El programa se detuvo: superó el límite de pasos de ejecución (posible bucle infinito o recursión sin caso base).",
        line,
        column,
      );
    }
  }

  // ---------- sentencias ----------

  private executeBlock(statements: Statement[], env: Environment): void {
    for (const stmt of statements) this.execute(stmt, env);
  }

  private execute(stmt: Statement, env: Environment): void {
    this.stepGuard(stmt.line, stmt.column);
    switch (stmt.kind) {
      case "Program":
        this.executeBlock(stmt.body, env);
        return;
      case "Declare":
        env.declare(stmt.name, this.evaluate(stmt.init, env));
        return;
      case "Assign":
        this.assignTo(stmt.target, this.evaluate(stmt.value, env), env);
        return;
      case "Calculate":
        env.calculate(stmt.name, this.evaluate(stmt.value, env));
        return;
      case "Receive": {
        if (this.inputCursor >= this.inputs.length) {
          throw new PseudocodeError(
            ErrorCode.NO_MORE_INPUT,
            `RECIBIR ${stmt.name}: no hay más entradas simuladas disponibles.`,
            stmt.line,
            stmt.column,
          );
        }
        const value = this.inputs[this.inputCursor];
        this.inputCursor += 1;
        env.calculate(stmt.name, value);
        return;
      }
      case "Show":
        this.output.push(toDisplayString(this.evaluate(stmt.value, env)));
        return;
      case "Terminate":
        throw new TerminateSignal();
      case "If": {
        if (isTruthy(this.evaluate(stmt.condition, env))) {
          this.executeBlock(stmt.thenBranch, new Environment(env));
        } else if (stmt.elseBranch) {
          this.executeBlock(stmt.elseBranch, new Environment(env));
        }
        return;
      }
      case "Switch": {
        // Semántica observada en el curso: un CASO con cuerpo vacío "cae" al
        // siguiente CASO (para agrupar varios valores bajo una misma acción),
        // pero el primer cuerpo no vacío que se ejecuta detiene la búsqueda
        // (no es fall-through estilo JS hasta un BREAK, que aquí no existe).
        const value = this.evaluate(stmt.discriminant, env);
        let matchIndex = -1;
        let defaultIndex = -1;
        for (let i = 0; i < stmt.cases.length; i += 1) {
          const c = stmt.cases[i];
          if (c.test === null) {
            if (defaultIndex === -1) defaultIndex = i;
            continue;
          }
          if (deepEquals(this.evaluate(c.test, env), value)) {
            matchIndex = i;
            break;
          }
        }
        const startIndex = matchIndex !== -1 ? matchIndex : defaultIndex;
        if (startIndex !== -1) {
          let i = startIndex;
          while (i < stmt.cases.length && stmt.cases[i].body.length === 0) i += 1;
          if (i < stmt.cases.length) this.executeBlock(stmt.cases[i].body, new Environment(env));
        }
        return;
      }
      case "ForRange": {
        const from = this.requireNumber(this.evaluate(stmt.from, env), stmt.line, stmt.column);
        const to = this.requireNumber(this.evaluate(stmt.to, env), stmt.line, stmt.column);
        for (let i = from; i <= to; i += 1) {
          this.stepGuard(stmt.line, stmt.column);
          const loopEnv = new Environment(env);
          loopEnv.declare(stmt.varName, i);
          try {
            this.executeBlock(stmt.body, loopEnv);
          } catch (e) {
            if (e instanceof BreakSignal) break;
            if (e instanceof ContinueSignal) continue;
            throw e;
          }
        }
        return;
      }
      case "ForEach": {
        const iterable = this.evaluate(stmt.iterable, env);
        const items = this.toIterableArray(iterable, stmt.line, stmt.column);
        for (const item of items) {
          this.stepGuard(stmt.line, stmt.column);
          const loopEnv = new Environment(env);
          loopEnv.declare(stmt.varName, item);
          try {
            this.executeBlock(stmt.body, loopEnv);
          } catch (e) {
            if (e instanceof BreakSignal) break;
            if (e instanceof ContinueSignal) continue;
            throw e;
          }
        }
        return;
      }
      case "While": {
        while (isTruthy(this.evaluate(stmt.condition, env))) {
          this.stepGuard(stmt.line, stmt.column);
          const loopEnv = new Environment(env);
          try {
            this.executeBlock(stmt.body, loopEnv);
          } catch (e) {
            if (e instanceof BreakSignal) break;
            if (e instanceof ContinueSignal) continue;
            throw e;
          }
        }
        return;
      }
      case "Break":
        throw new BreakSignal();
      case "Continue":
        throw new ContinueSignal();
      case "FunctionDeclaration": {
        const fn = this.makeFunction(stmt.fn, env);
        env.declare(stmt.fn.name, fn);
        return;
      }
      case "Return":
        throw new ReturnSignal(stmt.value ? this.evaluate(stmt.value, env) : null);
      case "ClassDeclaration": {
        const methods = new Map<string, PFunction>();
        for (const m of stmt.methods) methods.set(m.name, this.makeFunction(m, env));
        const cls = new PClass(stmt.name, stmt.properties, methods);
        env.declare(stmt.name, cls);
        return;
      }
      case "Try":
        this.executeTry(stmt, env);
        return;
      case "Throw": {
        const message = toDisplayString(this.evaluate(stmt.message, env));
        throw new ThrownProgramError(message, stmt.line, stmt.column);
      }
      case "TestCase":
        this.executeTestCase(stmt, env);
        return;
      case "Verify": {
        const value = this.evaluate(stmt.condition, env);
        if (!isTruthy(value)) {
          throw new VerifyFailure(
            this.describeVerifyFailure(stmt.condition, env),
            stmt.line,
            stmt.column,
          );
        }
        return;
      }
      case "ExpressionStatement":
        this.evaluate(stmt.expression, env);
        return;
      default: {
        const exhaustive: never = stmt;
        throw new Error(`Sentencia no soportada: ${JSON.stringify(exhaustive)}`);
      }
    }
  }

  private executeTry(
    stmt: Extract<Statement, { kind: "Try" }>,
    env: Environment,
  ): void {
    let pending: unknown = null;
    try {
      this.executeBlock(stmt.tryBlock, new Environment(env));
    } catch (e) {
      if (e instanceof BreakSignal || e instanceof ContinueSignal || e instanceof ReturnSignal) {
        pending = e;
      } else if (stmt.catchBlock !== null && stmt.catchParam !== null) {
        const catchEnv = new Environment(env);
        const errObj = new PObject();
        errObj.props.set("mensaje", errorMessageOf(e));
        catchEnv.declare(stmt.catchParam, errObj);
        try {
          this.executeBlock(stmt.catchBlock, catchEnv);
        } catch (e2) {
          pending = e2;
        }
      } else {
        pending = e;
      }
    }
    if (stmt.finallyBlock) {
      this.executeBlock(stmt.finallyBlock, new Environment(env));
    }
    if (pending) throw pending;
  }

  private executeTestCase(
    stmt: Extract<Statement, { kind: "TestCase" }>,
    env: Environment,
  ): void {
    const wasInTest = this.inTest;
    const prevPassed = this.currentTestPassed;
    const prevMessage = this.currentTestMessage;
    this.inTest = true;
    this.currentTestPassed = true;
    this.currentTestMessage = undefined;
    try {
      this.executeBlock(stmt.body, new Environment(env));
    } catch (e) {
      if (e instanceof ReturnSignal || e instanceof BreakSignal || e instanceof ContinueSignal) {
        // no debería ocurrir dentro de una PRUEBA; se ignora silenciosamente.
      } else {
        this.currentTestPassed = false;
        this.currentTestMessage = errorMessageOf(e);
      }
    }
    this.testReport.push({
      description: stmt.description,
      passed: this.currentTestPassed,
      message: this.currentTestMessage,
    });
    this.inTest = wasInTest;
    this.currentTestPassed = prevPassed;
    this.currentTestMessage = prevMessage;
  }

  private describeVerifyFailure(condition: Expression, env: Environment): string {
    if (condition.kind === "Binary" && condition.operator === "ES_IGUAL_A") {
      const left = this.evaluate(condition.left, env);
      const right = this.evaluate(condition.right, env);
      return `Se esperaba ${toInspectString(right)} pero se obtuvo ${toInspectString(left)}.`;
    }
    if (condition.kind === "Unary" && condition.operator === "NO") {
      return "La condición negada de VERIFICAR QUE no se cumplió.";
    }
    return "La condición de VERIFICAR QUE no se cumplió.";
  }

  private assignTo(target: Expression, value: unknown, env: Environment): void {
    if (target.kind === "Identifier") {
      env.assign(target.name, value, target.line, target.column);
      return;
    }
    if (target.kind === "Member") {
      const obj = this.evaluate(target.object, env);
      this.setProperty(obj, target.property, value, target.line, target.column);
      return;
    }
    if (target.kind === "Index") {
      const obj = this.evaluate(target.object, env);
      const index = this.evaluate(target.index, env);
      this.setIndex(obj, index, value, target.line, target.column);
      return;
    }
    throw new PseudocodeError(
      ErrorCode.SYNTAX_ERROR,
      "Objetivo de asignación no válido.",
      target.line,
      target.column,
    );
  }

  // ---------- funciones / clases ----------

  private makeFunction(fn: FunctionNode, env: Environment): PFunction {
    const wrapper = new Environment(env);
    const value = new PFunction(fn.name, fn.params, fn.body, wrapper);
    if (fn.name) wrapper.declare(fn.name, value); // permite auto-recursión
    return value;
  }

  private callFunction(
    fn: PFunction,
    args: unknown[],
    boundThis: PInstance | undefined,
    line: number,
    column: number,
  ): unknown {
    if (args.length !== fn.params.length) {
      throw new PseudocodeError(
        ErrorCode.WRONG_ARGUMENT_COUNT,
        `"${fn.name || "función"}" espera ${fn.params.length} argumento(s) pero se recibieron ${args.length}.`,
        line,
        column,
      );
    }
    this.callDepth += 1;
    if (this.callDepth > MAX_CALL_DEPTH) {
      this.callDepth -= 1;
      throw new PseudocodeError(
        ErrorCode.EXECUTION_LIMIT_EXCEEDED,
        "Se superó la profundidad máxima de llamadas (posible recursión sin caso base).",
        line,
        column,
      );
    }
    this.thisStack.push(boundThis);
    const callEnv = new Environment(fn.closure);
    fn.params.forEach((p, i) => callEnv.declare(p, args[i]));
    try {
      this.executeBlock(fn.body, callEnv);
      return null;
    } catch (e) {
      if (e instanceof ReturnSignal) return e.value;
      throw e;
    } finally {
      this.thisStack.pop();
      this.callDepth -= 1;
    }
  }

  // ---------- expresiones ----------

  private evaluate(expr: Expression, env: Environment): unknown {
    switch (expr.kind) {
      case "NumberLiteral":
        return expr.value;
      case "StringLiteral":
        return expr.value;
      case "BooleanLiteral":
        return expr.value;
      case "NullLiteral":
        return null;
      case "Identifier":
        return env.get(expr.name, expr.line, expr.column);
      case "This": {
        const current = this.thisStack[this.thisStack.length - 1];
        if (current === undefined) {
          throw new PseudocodeError(
            ErrorCode.TYPE_ERROR,
            "ESTE solo puede usarse dentro de un método de una clase.",
            expr.line,
            expr.column,
          );
        }
        return current;
      }
      case "ArrayLiteral":
        return expr.elements.map((e) => this.evaluate(e, env));
      case "ObjectLiteral": {
        const obj = new PObject();
        for (const prop of expr.properties) obj.props.set(prop.key, this.evaluate(prop.value, env));
        return obj;
      }
      case "SetLiteral": {
        const set = new PSet();
        for (const el of expr.elements) this.addToSet(set, this.evaluate(el, env));
        return set;
      }
      case "EmptySet":
        return new PSet();
      case "EmptyStack":
        return new PStack();
      case "EmptyQueue":
        return new PQueue();
      case "Member": {
        const obj = this.evaluate(expr.object, env);
        return this.getProperty(obj, expr.property, expr.line, expr.column);
      }
      case "Index": {
        const obj = this.evaluate(expr.object, env);
        const index = this.evaluate(expr.index, env);
        return this.getIndex(obj, index, expr.line, expr.column);
      }
      case "Call":
        return this.evaluateCall(expr, env);
      case "New":
        return this.evaluateNew(expr, env);
      case "Binary":
        return this.evaluateBinary(expr, env);
      case "Unary": {
        const operand = this.evaluate(expr.operand, env);
        if (expr.operator === "-") return -this.requireNumber(operand, expr.line, expr.column);
        return !isTruthy(operand);
      }
      case "IsCheck": {
        const operand = this.evaluate(expr.operand, env);
        let result: boolean;
        if (expr.check === "VERDADERO") result = operand === true;
        else if (expr.check === "FALSO") result = operand === false;
        else result = operand === null;
        return expr.negate ? !result : result;
      }
      case "Membership": {
        const operand = this.evaluate(expr.operand, env);
        const collection = this.evaluate(expr.collection, env);
        return this.checkMembership(operand, collection, expr.line, expr.column);
      }
      case "Conditional":
        return isTruthy(this.evaluate(expr.test, env))
          ? this.evaluate(expr.consequent, env)
          : this.evaluate(expr.alternate, env);
      case "Lambda":
        return new PFunction("", expr.params, [
          { kind: "Return", value: expr.body, line: expr.line, column: expr.column },
        ], env);
      case "FunctionExpression":
        return this.makeFunction(expr.fn, env);
      case "Pipeline":
        return this.evaluatePipeline(expr, env);
      case "Builtin":
        return this.evaluateBuiltin(expr, env);
      case "CopyWith": {
        const source = this.evaluate(expr.source, env);
        const overrides = this.evaluate(expr.overrides, env);
        if (!(source instanceof PObject) && !(source instanceof PInstance)) {
          throw new PseudocodeError(
            ErrorCode.TYPE_ERROR,
            "COPIA_DE(...) CON {...} solo funciona sobre objetos.",
            expr.line,
            expr.column,
          );
        }
        if (!(overrides instanceof PObject)) {
          throw new PseudocodeError(
            ErrorCode.TYPE_ERROR,
            "Lo que sigue a CON debe ser un objeto literal { clave: valor }.",
            expr.line,
            expr.column,
          );
        }
        const clone = deepClone(source);
        for (const [k, v] of overrides.props) clone.props.set(k, v);
        return clone;
      }
      case "Compare": {
        const left = this.evaluate(expr.left, env);
        const right = this.evaluate(expr.right, env);
        if (expr.mode === "ESTRICTA") return typeof left === typeof right && deepEquals(left, right);
        return this.looseEquals(left, right);
      }
      case "Command":
        return this.evaluateCommand(expr, env);
      default: {
        const exhaustive: never = expr;
        throw new Error(`Expresión no soportada: ${JSON.stringify(exhaustive)}`);
      }
    }
  }

  private evaluateCall(expr: Extract<Expression, { kind: "Call" }>, env: Environment): unknown {
    if (expr.callee.kind === "Member") {
      const obj = this.evaluate(expr.callee.object, env);
      const fnValue = this.getProperty(obj, expr.callee.property, expr.line, expr.column);
      if (!(fnValue instanceof PFunction)) {
        throw new PseudocodeError(
          ErrorCode.NOT_A_FUNCTION,
          `"${expr.callee.property}" no es una función.`,
          expr.line,
          expr.column,
        );
      }
      const args = expr.args.map((a) => this.evaluate(a, env));
      const boundThis = obj instanceof PInstance ? obj : undefined;
      return this.callFunction(fnValue, args, boundThis, expr.line, expr.column);
    }
    const callee = this.evaluate(expr.callee, env);
    if (!(callee instanceof PFunction)) {
      throw new PseudocodeError(
        ErrorCode.NOT_A_FUNCTION,
        "Se intentó llamar algo que no es una función.",
        expr.line,
        expr.column,
      );
    }
    const args = expr.args.map((a) => this.evaluate(a, env));
    return this.callFunction(callee, args, undefined, expr.line, expr.column);
  }

  private evaluateNew(expr: Extract<Expression, { kind: "New" }>, env: Environment): unknown {
    const cls = env.get(expr.className, expr.line, expr.column);
    if (!(cls instanceof PClass)) {
      throw new PseudocodeError(
        ErrorCode.TYPE_ERROR,
        `"${expr.className}" no es una clase.`,
        expr.line,
        expr.column,
      );
    }
    const provided = new Map(expr.args.map((a) => [a.name, a.value]));
    for (const name of provided.keys()) {
      if (!cls.properties.includes(name)) {
        throw new PseudocodeError(
          ErrorCode.UNKNOWN_PROPERTY,
          `"${cls.name}" no tiene una propiedad llamada "${name}".`,
          expr.line,
          expr.column,
        );
      }
    }
    for (const propName of cls.properties) {
      if (!provided.has(propName)) {
        throw new PseudocodeError(
          ErrorCode.MISSING_PROPERTY,
          `Falta la propiedad "${propName}" al crear una instancia de "${cls.name}".`,
          expr.line,
          expr.column,
        );
      }
    }
    const instance = new PInstance(cls);
    for (const [name, valueExpr] of provided) instance.props.set(name, this.evaluate(valueExpr, env));
    return instance;
  }

  private evaluatePipeline(expr: Extract<Expression, { kind: "Pipeline" }>, env: Environment): unknown {
    let current: unknown = this.evaluate(expr.source, env);
    for (const stage of expr.stages) {
      const items = this.toIterableArray(current, stage.line, stage.column, true);
      if (stage.name === "FILTRAR") {
        current = items.filter((item) => isTruthy(this.evaluateStageArg(stage.args[0], item, env)));
      } else if (stage.name === "TRANSFORMAR") {
        current = items.map((item) => this.evaluateStageArg(stage.args[0], item, env));
      } else {
        const reducer = stage.args[0];
        let acc = this.evaluate(stage.args[1], env);
        for (const item of items) {
          acc = this.evaluateReducerArg(reducer, acc, item, env);
        }
        current = acc;
      }
    }
    return current;
  }

  // Un argumento de etapa que NO es una lambda se evalúa con "scope implícito":
  // los identificadores que no resuelven en el entorno normal caen de vuelta a item[nombre].
  private evaluateStageArg(arg: Expression, item: unknown, env: Environment): unknown {
    if (arg.kind === "Lambda") {
      const fn = new PFunction("", arg.params, [
        { kind: "Return", value: arg.body, line: arg.line, column: arg.column },
      ], env);
      return this.callFunction(fn, [item], undefined, arg.line, arg.column);
    }
    const implicitEnv = new ImplicitItemEnvironment(env, item);
    return this.evaluate(arg, implicitEnv);
  }

  private evaluateReducerArg(arg: Expression, acc: unknown, item: unknown, env: Environment): unknown {
    if (arg.kind === "Lambda") {
      const fn = new PFunction("", arg.params, [
        { kind: "Return", value: arg.body, line: arg.line, column: arg.column },
      ], env);
      return this.callFunction(fn, [acc, item], undefined, arg.line, arg.column);
    }
    // Forma sin lambda explícita para REDUCIR: se evalúa con scope implícito del item
    // (acc no tiene nombre disponible en ese caso, así que solo se soporta la forma lambda).
    throw new PseudocodeError(
      ErrorCode.SYNTAX_ERROR,
      "REDUCIR necesita una lambda de 2 parámetros: (acumulado, actual) => expresión.",
      arg.line,
      arg.column,
    );
  }

  private evaluateBuiltin(expr: Extract<Expression, { kind: "Builtin" }>, env: Environment): unknown {
    const args = expr.args.map((a) => this.evaluate(a, env));
    switch (expr.name) {
      case "CONVERTIR_A_NUMERO": {
        const value = args[0];
        if (typeof value === "number") return value;
        if (typeof value === "string") {
          const n = Number(value.trim());
          if (Number.isNaN(n)) {
            throw new PseudocodeError(
              ErrorCode.TYPE_ERROR,
              `No se pudo convertir "${value}" a número.`,
              expr.line,
              expr.column,
            );
          }
          return n;
        }
        throw new PseudocodeError(
          ErrorCode.TYPE_ERROR,
          "CONVERTIR_A_NUMERO solo acepta texto o números.",
          expr.line,
          expr.column,
        );
      }
      case "COPIA_DE":
        return deepClone(args[0]);
      case "TAMANO": {
        const value = args[0];
        if (Array.isArray(value)) return value.length;
        if (value instanceof PSet) return value.items.length;
        if (value instanceof PObject) return value.props.size;
        if (typeof value === "string") return value.length;
        throw new PseudocodeError(ErrorCode.TYPE_ERROR, "TAMAÑO no soporta ese tipo de valor.", expr.line, expr.column);
      }
      case "UNION": {
        const [a, b] = args as [PSet, PSet];
        this.requireSet(a, expr.line, expr.column);
        this.requireSet(b, expr.line, expr.column);
        const result = new PSet();
        for (const item of a.items) this.addToSet(result, item);
        for (const item of b.items) this.addToSet(result, item);
        return result;
      }
      case "INTERSECCION": {
        const [a, b] = args as [PSet, PSet];
        this.requireSet(a, expr.line, expr.column);
        this.requireSet(b, expr.line, expr.column);
        const result = new PSet();
        for (const item of a.items) if (b.items.some((x) => deepEquals(x, item))) this.addToSet(result, item);
        return result;
      }
      case "DIFERENCIA": {
        const [a, b] = args as [PSet, PSet];
        this.requireSet(a, expr.line, expr.column);
        this.requireSet(b, expr.line, expr.column);
        const result = new PSet();
        for (const item of a.items) if (!b.items.some((x) => deepEquals(x, item))) this.addToSet(result, item);
        return result;
      }
      default:
        throw new Error(`Builtin no soportado: ${expr.name}`);
    }
  }

  private evaluateCommand(expr: Extract<Expression, { kind: "Command" }>, env: Environment): unknown {
    const collection = this.evaluate(expr.collection, env);
    const value = expr.value ? this.evaluate(expr.value, env) : undefined;
    const { line, column } = expr;
    switch (expr.command) {
      case "AGREGAR_A":
        this.requireSet(collection, line, column);
        this.addToSet(collection as PSet, value);
        return collection;
      case "AGREGAR_AL_FINAL":
        this.requireArray(collection, line, column);
        (collection as unknown[]).push(value);
        return collection;
      case "ELIMINAR_ULTIMO":
        this.requireArray(collection, line, column);
        return (collection as unknown[]).pop() ?? null;
      case "APILAR":
        this.requireStack(collection, line, column);
        (collection as PStack).items.push(value);
        return collection;
      case "DESAPILAR":
        this.requireStack(collection, line, column);
        return (collection as PStack).items.pop() ?? null;
      case "ENCOLAR":
        this.requireQueue(collection, line, column);
        (collection as PQueue).items.push(value);
        return collection;
      case "DESENCOLAR":
        this.requireQueue(collection, line, column);
        return (collection as PQueue).items.shift() ?? null;
      default:
        throw new Error(`Comando no soportado: ${expr.command}`);
    }
  }

  private evaluateBinary(expr: Extract<Expression, { kind: "Binary" }>, env: Environment): unknown {
    if (expr.operator === "Y") {
      const left = this.evaluate(expr.left, env);
      if (!isTruthy(left)) return false;
      return isTruthy(this.evaluate(expr.right, env));
    }
    if (expr.operator === "O") {
      const left = this.evaluate(expr.left, env);
      if (isTruthy(left)) return true;
      return isTruthy(this.evaluate(expr.right, env));
    }

    const left = this.evaluate(expr.left, env);
    const right = this.evaluate(expr.right, env);
    const { line, column } = expr;

    switch (expr.operator) {
      case "+":
        if (typeof left === "string" || typeof right === "string") {
          return toDisplayString(left) + toDisplayString(right);
        }
        if (typeof left === "number" && typeof right === "number") return left + right;
        throw new PseudocodeError(
          ErrorCode.TYPE_ERROR,
          "No se puede sumar esos dos tipos directamente. ¿Falta CONVERTIR_A_NUMERO?",
          line,
          column,
        );
      case "-":
        return this.requireNumber(left, line, column) - this.requireNumber(right, line, column);
      case "×":
        return this.requireNumber(left, line, column) * this.requireNumber(right, line, column);
      case "÷": {
        const r = this.requireNumber(right, line, column);
        if (r === 0) throw new PseudocodeError(ErrorCode.DIVISION_BY_ZERO, "División entre cero.", line, column);
        return this.requireNumber(left, line, column) / r;
      }
      case "MOD": {
        const r = this.requireNumber(right, line, column);
        if (r === 0) throw new PseudocodeError(ErrorCode.DIVISION_BY_ZERO, "MOD entre cero.", line, column);
        return this.requireNumber(left, line, column) % r;
      }
      case "<":
      case ">":
      case "<=":
      case ">=": {
        if (typeof left === "number" && typeof right === "number") return this.compareNumbers(expr.operator, left, right);
        if (typeof left === "string" && typeof right === "string") return this.compareStrings(expr.operator, left, right);
        throw new PseudocodeError(ErrorCode.TYPE_ERROR, "Solo se pueden comparar números con números o texto con texto.", line, column);
      }
      case "ES_IGUAL_A":
        return deepEquals(left, right);
      case "ES_DIFERENTE_DE":
        return !deepEquals(left, right);
      default:
        throw new Error(`Operador no soportado: ${expr.operator}`);
    }
  }

  private compareNumbers(op: string, a: number, b: number): boolean {
    if (op === "<") return a < b;
    if (op === ">") return a > b;
    if (op === "<=") return a <= b;
    return a >= b;
  }

  private compareStrings(op: string, a: string, b: string): boolean {
    if (op === "<") return a < b;
    if (op === ">") return a > b;
    if (op === "<=") return a <= b;
    return a >= b;
  }

  private looseEquals(a: unknown, b: unknown): boolean {
    if (typeof a === typeof b) return deepEquals(a, b);
    const na = this.coerceToNumber(a);
    const nb = this.coerceToNumber(b);
    if (na !== null && nb !== null) return na === nb;
    return toDisplayString(a) === toDisplayString(b);
  }

  private coerceToNumber(value: unknown): number | null {
    if (typeof value === "number") return value;
    if (typeof value === "string") {
      const n = Number(value.trim());
      return Number.isNaN(n) ? null : n;
    }
    return null;
  }

  private checkMembership(operand: unknown, collection: unknown, line: number, column: number): boolean {
    if (collection instanceof PSet) return collection.items.some((x) => deepEquals(x, operand));
    if (collection instanceof PObject) return collection.props.has(String(operand));
    if (Array.isArray(collection)) return collection.some((x) => deepEquals(x, operand));
    throw new PseudocodeError(ErrorCode.TYPE_ERROR, "EXISTE EN no soporta ese tipo de colección.", line, column);
  }

  private addToSet(set: PSet, value: unknown): void {
    if (!set.items.some((x) => deepEquals(x, value))) set.items.push(value);
  }

  private getProperty(obj: unknown, name: string, line: number, column: number): unknown {
    if (obj instanceof PInstance) {
      if (obj.props.has(name)) return obj.props.get(name);
      if (obj.cls.methods.has(name)) return obj.cls.methods.get(name);
      return null;
    }
    if (obj instanceof PObject) {
      return obj.props.has(name) ? obj.props.get(name) : null;
    }
    throw new PseudocodeError(
      ErrorCode.TYPE_ERROR,
      `No se puede acceder a la propiedad "${name}" de ese valor.`,
      line,
      column,
    );
  }

  private setProperty(obj: unknown, name: string, value: unknown, line: number, column: number): void {
    if (obj instanceof PInstance || obj instanceof PObject) {
      obj.props.set(name, value);
      return;
    }
    throw new PseudocodeError(ErrorCode.TYPE_ERROR, `No se puede asignar la propiedad "${name}" de ese valor.`, line, column);
  }

  private getIndex(obj: unknown, index: unknown, line: number, column: number): unknown {
    if (Array.isArray(obj)) {
      const i = this.requireNumber(index, line, column);
      return obj[i] ?? null;
    }
    if (obj instanceof PObject) {
      return obj.props.has(String(index)) ? obj.props.get(String(index)) : null;
    }
    throw new PseudocodeError(ErrorCode.TYPE_ERROR, "No se puede indexar ese valor con [ ].", line, column);
  }

  private setIndex(obj: unknown, index: unknown, value: unknown, line: number, column: number): void {
    if (Array.isArray(obj)) {
      const i = this.requireNumber(index, line, column);
      obj[i] = value;
      return;
    }
    if (obj instanceof PObject) {
      obj.props.set(String(index), value);
      return;
    }
    throw new PseudocodeError(ErrorCode.TYPE_ERROR, "No se puede asignar con [ ] a ese valor.", line, column);
  }

  private toIterableArray(value: unknown, line: number, column: number, allowStrings = false): unknown[] {
    if (Array.isArray(value)) return value;
    if (value instanceof PSet) return value.items;
    if (value instanceof PStack) return value.items;
    if (value instanceof PQueue) return value.items;
    if (allowStrings && typeof value === "string") return value.split("");
    throw new PseudocodeError(ErrorCode.TYPE_ERROR, "Ese valor no se puede recorrer con PARA CADA.", line, column);
  }

  private requireNumber(value: unknown, line: number, column: number): number {
    if (typeof value === "number") return value;
    throw new PseudocodeError(ErrorCode.TYPE_ERROR, "Se esperaba un número.", line, column);
  }

  private requireSet(value: unknown, line: number, column: number): asserts value is PSet {
    if (!(value instanceof PSet)) throw new PseudocodeError(ErrorCode.TYPE_ERROR, "Se esperaba un Set (CONJUNTO_VACIO).", line, column);
  }

  private requireArray(value: unknown, line: number, column: number): asserts value is unknown[] {
    if (!Array.isArray(value)) throw new PseudocodeError(ErrorCode.TYPE_ERROR, "Se esperaba un arreglo.", line, column);
  }

  private requireStack(value: unknown, line: number, column: number): asserts value is PStack {
    if (!(value instanceof PStack)) throw new PseudocodeError(ErrorCode.TYPE_ERROR, "Se esperaba una Pila (PILA_VACIA).", line, column);
  }

  private requireQueue(value: unknown, line: number, column: number): asserts value is PQueue {
    if (!(value instanceof PQueue)) throw new PseudocodeError(ErrorCode.TYPE_ERROR, "Se esperaba una Cola (COLA_VACIA).", line, column);
  }
}

// Entorno especial usado dentro de una etapa de pipeline cuyo argumento no es una
// lambda explícita: los identificadores no resueltos normalmente caen de vuelta a
// item[nombre] (para soportar `FILTRAR(activo)` o `FILTRAR(activo Y precio > 50)`).
class ImplicitItemEnvironment extends Environment {
  constructor(
    parent: Environment,
    private readonly item: unknown,
  ) {
    super(parent);
  }

  override get(name: string, line: number, column: number): unknown {
    if (this.hasOwn(name) || this.parent?.has(name)) return super.get(name, line, column);
    if (this.item instanceof PObject) return this.item.props.has(name) ? this.item.props.get(name) : null;
    if (this.item instanceof PInstance) return this.item.props.has(name) ? this.item.props.get(name) : null;
    return super.get(name, line, column);
  }
}
