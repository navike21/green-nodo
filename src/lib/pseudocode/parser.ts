import type {
  Expression,
  FunctionNode,
  PipelineStage,
  Statement,
} from "./ast";
import { ErrorCode, PseudocodeError } from "./errors";
import { type Token, TokenType } from "./tokens";

const BLOCK_CLOSING_KEYWORDS = new Set<TokenType>([
  TokenType.SI,
  TokenType.PARA,
  TokenType.MIENTRAS,
  TokenType.FUNCION,
  TokenType.SEGUN,
  TokenType.CLASE,
  TokenType.INTENTAR,
  TokenType.PRUEBA,
]);

export class Parser {
  private pos = 0;

  constructor(private readonly tokens: Token[]) {}

  static parseProgram(tokens: Token[]): Statement {
    return new Parser(tokens).parseProgram();
  }

  // ---------- utilidades de lectura de tokens ----------

  private peek(offset = 0): Token {
    return this.tokens[Math.min(this.pos + offset, this.tokens.length - 1)];
  }

  private check(type: TokenType): boolean {
    return this.peek().type === type;
  }

  private checkNext(type: TokenType): boolean {
    return this.peek(1).type === type;
  }

  private advance(): Token {
    const tok = this.peek();
    if (tok.type !== TokenType.EOF) this.pos += 1;
    return tok;
  }

  private match(type: TokenType): boolean {
    if (this.check(type)) {
      this.advance();
      return true;
    }
    return false;
  }

  private expect(type: TokenType, label?: string): Token {
    if (this.check(type)) return this.advance();
    const tok = this.peek();
    throw new PseudocodeError(
      ErrorCode.SYNTAX_ERROR,
      `Se esperaba ${label ?? type} pero se encontró "${tok.value || tok.type}".`,
      tok.line,
      tok.column,
    );
  }

  private expectIdentifier(): string {
    return this.expect(TokenType.IDENTIFIER, "un identificador").value;
  }

  private expectString(): string {
    return this.expect(TokenType.STRING, "un texto entre comillas").value;
  }

  private syntaxError(message: string): never {
    const tok = this.peek();
    throw new PseudocodeError(ErrorCode.SYNTAX_ERROR, message, tok.line, tok.column);
  }

  private atFin(keyword: TokenType): boolean {
    return this.check(TokenType.FIN) && this.checkNext(keyword);
  }

  private expectFin(keyword: TokenType, label: string): void {
    this.expect(TokenType.FIN, "FIN");
    this.expect(keyword, label);
  }

  // ---------- programa ----------

  parseProgram(): Statement {
    const start = this.peek();
    const body: Statement[] = [];

    if (this.check(TokenType.INICIO)) {
      const line = this.peek().line;
      this.advance();
      while (!this.check(TokenType.EOF) && this.peek().line === line) this.advance();
    }

    while (!this.check(TokenType.EOF)) {
      if (this.check(TokenType.FIN) && !BLOCK_CLOSING_KEYWORDS.has(this.peek(1).type)) {
        const line = this.peek().line;
        this.advance();
        while (!this.check(TokenType.EOF) && this.peek().line === line) this.advance();
        break;
      }
      body.push(this.parseStatement());
    }

    return { kind: "Program", body, line: start.line, column: start.column };
  }

  private parseBlockUntilFin(keyword: TokenType): Statement[] {
    const body: Statement[] = [];
    while (!this.atFin(keyword)) {
      if (this.check(TokenType.EOF)) {
        this.syntaxError("El programa terminó sin cerrar un bloque abierto (falta un FIN).");
      }
      body.push(this.parseStatement());
    }
    this.advance(); // FIN
    this.advance(); // palabra clave
    return body;
  }

  // ---------- sentencias ----------

  private parseStatement(): Statement {
    const tok = this.peek();
    switch (tok.type) {
      case TokenType.RECIBIR:
        return this.parseReceive();
      case TokenType.DEFINIR:
        return this.parseDeclare();
      case TokenType.ASIGNAR:
        return this.parseAssign();
      case TokenType.MODIFICAR:
        return this.parseAssign();
      case TokenType.CALCULAR:
        return this.parseCalculate();
      case TokenType.MOSTRAR:
        return this.parseShow();
      case TokenType.TERMINAR:
        this.advance();
        return { kind: "Terminate", line: tok.line, column: tok.column };
      case TokenType.SI:
        return this.parseIf();
      case TokenType.SEGUN:
        return this.parseSwitch();
      case TokenType.PARA:
        return this.parseFor();
      case TokenType.MIENTRAS:
        return this.parseWhile();
      case TokenType.ROMPER:
        this.advance();
        return { kind: "Break", line: tok.line, column: tok.column };
      case TokenType.CONTINUAR:
        this.advance();
        return { kind: "Continue", line: tok.line, column: tok.column };
      case TokenType.FUNCION: {
        const fn = this.parseFunctionNode();
        return { kind: "FunctionDeclaration", fn, line: tok.line, column: tok.column };
      }
      case TokenType.RETORNAR:
        return this.parseReturn();
      case TokenType.CLASE:
        return this.parseClassDeclaration();
      case TokenType.INTENTAR:
        return this.parseTry();
      case TokenType.LANZAR:
        return this.parseThrow();
      case TokenType.PRUEBA:
        return this.parseTestCase();
      case TokenType.VERIFICAR:
        return this.parseVerify();
      case TokenType.LLAMAR: {
        this.advance();
        const expression = this.parseExpression();
        return { kind: "ExpressionStatement", expression, line: tok.line, column: tok.column };
      }
      default: {
        const expression = this.parseExpression();
        return { kind: "ExpressionStatement", expression, line: tok.line, column: tok.column };
      }
    }
  }

  private parseReceive(): Statement {
    const tok = this.expect(TokenType.RECIBIR);
    if (this.check(TokenType.DEL) && this.checkNext(TokenType.USUARIO)) {
      this.advance();
      this.advance();
    }
    const name = this.expectIdentifier();
    if (this.check(TokenType.DEL) && this.checkNext(TokenType.USUARIO)) {
      this.advance();
      this.advance();
    }
    return { kind: "Receive", name, line: tok.line, column: tok.column };
  }

  private parseDeclare(): Statement {
    const tok = this.expect(TokenType.DEFINIR);
    const name = this.expectIdentifier();
    this.expect(TokenType.EQUALS, '"="');
    const init = this.parseExpression();
    return { kind: "Declare", name, init, line: tok.line, column: tok.column };
  }

  // Una "referencia": identificador con posibles .propiedad / [índice], pero SIN
  // llamada a función. Se usa tanto para el objetivo de ASIGNAR/MODIFICAR como
  // para el argumento "colección" de los comandos bareword (AGREGAR_AL_FINAL,
  // APILAR, etc.) — así "AGREGAR_AL_FINAL resultados (numero ÷ divisor)" no
  // confunde el "(numero ÷ divisor)" con una llamada a "resultados(...)".
  private parseReference(): Expression {
    const tok = this.peek();
    let expr: Expression = {
      kind: "Identifier",
      name: this.expectIdentifier(),
      line: tok.line,
      column: tok.column,
    };
    for (;;) {
      if (this.match(TokenType.DOT)) {
        const nameTok = this.peek();
        const property = this.expectIdentifier();
        expr = { kind: "Member", object: expr, property, line: nameTok.line, column: nameTok.column };
      } else if (this.match(TokenType.LBRACKET)) {
        const index = this.parseExpression();
        this.expect(TokenType.RBRACKET, '"]"');
        expr = { kind: "Index", object: expr, index, line: tok.line, column: tok.column };
      } else {
        break;
      }
    }
    return expr;
  }

  private parseAssign(): Statement {
    const tok = this.advance(); // ASIGNAR o MODIFICAR
    const target = this.parseReference();
    this.expect(TokenType.EQUALS, '"="');
    const value = this.parseExpression();
    return { kind: "Assign", target, value, line: tok.line, column: tok.column };
  }

  private parseCalculate(): Statement {
    const tok = this.expect(TokenType.CALCULAR);
    const name = this.expectIdentifier();
    this.expect(TokenType.EQUALS, '"="');
    const value = this.parseExpression();
    return { kind: "Calculate", name, value, line: tok.line, column: tok.column };
  }

  private parseShow(): Statement {
    const tok = this.expect(TokenType.MOSTRAR);
    const value = this.parseExpression();
    return { kind: "Show", value, line: tok.line, column: tok.column };
  }

  private parseIf(): Statement {
    const tok = this.expect(TokenType.SI);
    const condition = this.parseExpression();
    const entonces = this.expect(TokenType.ENTONCES, "ENTONCES");
    const sameLine = this.peek().line === entonces.line;

    if (sameLine) {
      const thenBranch = [this.parseStatement()];
      return { kind: "If", condition, thenBranch, elseBranch: null, line: tok.line, column: tok.column };
    }

    const thenBranch: Statement[] = [];
    while (
      !(this.check(TokenType.SI) && this.checkNext(TokenType.NO)) &&
      !this.atFin(TokenType.SI)
    ) {
      if (this.check(TokenType.EOF)) this.syntaxError("Falta FIN SI para cerrar este bloque SI.");
      thenBranch.push(this.parseStatement());
    }

    let elseBranch: Statement[] | null = null;
    if (this.check(TokenType.SI) && this.checkNext(TokenType.NO)) {
      this.advance(); // SI
      this.advance(); // NO
      elseBranch = [];
      while (!this.atFin(TokenType.SI)) {
        if (this.check(TokenType.EOF)) this.syntaxError("Falta FIN SI para cerrar este bloque SI NO.");
        elseBranch.push(this.parseStatement());
      }
    }

    this.expectFin(TokenType.SI, "SI");
    return { kind: "If", condition, thenBranch, elseBranch, line: tok.line, column: tok.column };
  }

  private parseSwitch(): Statement {
    const tok = this.expect(TokenType.SEGUN);
    const discriminant = this.parseExpression();
    this.expect(TokenType.HACER, "HACER");
    const cases: { test: Expression | null; body: Statement[] }[] = [];

    const atCaseBoundary = () =>
      this.check(TokenType.CASO) ||
      (this.check(TokenType.POR) && this.checkNext(TokenType.DEFECTO)) ||
      this.atFin(TokenType.SEGUN);

    while (!this.atFin(TokenType.SEGUN)) {
      let test: Expression | null;
      if (this.match(TokenType.CASO)) {
        test = this.parseExpression();
      } else if (this.check(TokenType.POR) && this.checkNext(TokenType.DEFECTO)) {
        this.advance();
        this.advance();
        test = null;
      } else {
        this.syntaxError('Se esperaba CASO, POR DEFECTO o FIN SEGÚN dentro de un bloque SEGÚN.');
      }
      this.expect(TokenType.COLON, '":"');
      const body: Statement[] = [];
      while (!atCaseBoundary()) {
        if (this.check(TokenType.EOF)) this.syntaxError("Falta FIN SEGÚN para cerrar este bloque.");
        body.push(this.parseStatement());
      }
      cases.push({ test, body });
    }

    this.expectFin(TokenType.SEGUN, "SEGÚN");
    return { kind: "Switch", discriminant, cases, line: tok.line, column: tok.column };
  }

  private parseFor(): Statement {
    const tok = this.expect(TokenType.PARA);
    if (this.match(TokenType.CADA)) {
      const varName = this.expectIdentifier();
      this.expect(TokenType.EN, "EN");
      const iterable = this.parseExpression();
      this.expect(TokenType.HACER, "HACER");
      const body = this.parseBlockUntilFin(TokenType.PARA);
      return { kind: "ForEach", varName, iterable, body, line: tok.line, column: tok.column };
    }
    const varName = this.expectIdentifier();
    this.expect(TokenType.DESDE, "DESDE");
    const from = this.parseExpression();
    this.expect(TokenType.HASTA, "HASTA");
    const to = this.parseExpression();
    this.expect(TokenType.HACER, "HACER");
    const body = this.parseBlockUntilFin(TokenType.PARA);
    return { kind: "ForRange", varName, from, to, body, line: tok.line, column: tok.column };
  }

  private parseWhile(): Statement {
    const tok = this.expect(TokenType.MIENTRAS);
    const condition = this.parseExpression();
    this.expect(TokenType.HACER, "HACER");
    const body = this.parseBlockUntilFin(TokenType.MIENTRAS);
    return { kind: "While", condition, body, line: tok.line, column: tok.column };
  }

  private parseFunctionNode(): FunctionNode {
    const tok = this.expect(TokenType.FUNCION);
    const name = this.expectIdentifier();
    this.expect(TokenType.LPAREN, '"("');
    const params: string[] = [];
    if (!this.check(TokenType.RPAREN)) {
      params.push(this.expectIdentifier());
      while (this.match(TokenType.COMMA)) params.push(this.expectIdentifier());
    }
    this.expect(TokenType.RPAREN, '")"');
    const body = this.parseBlockUntilFin(TokenType.FUNCION);
    return { name, params, body, line: tok.line, column: tok.column };
  }

  private parseReturn(): Statement {
    const tok = this.expect(TokenType.RETORNAR);
    if (
      this.check(TokenType.FIN) ||
      this.check(TokenType.EOF) ||
      this.peek().line !== tok.line
    ) {
      return { kind: "Return", value: null, line: tok.line, column: tok.column };
    }
    const value = this.parseExpression();
    return { kind: "Return", value, line: tok.line, column: tok.column };
  }

  private parseClassDeclaration(): Statement {
    const tok = this.expect(TokenType.CLASE);
    const name = this.expectIdentifier();
    this.expect(TokenType.PROPIEDADES, "PROPIEDADES");
    this.expect(TokenType.COLON, '":"');
    const properties = [this.expectIdentifier()];
    while (this.match(TokenType.COMMA)) properties.push(this.expectIdentifier());
    const methods: FunctionNode[] = [];
    while (!this.atFin(TokenType.CLASE)) {
      if (this.check(TokenType.EOF)) this.syntaxError("Falta FIN CLASE para cerrar esta clase.");
      methods.push(this.parseFunctionNode());
    }
    this.expectFin(TokenType.CLASE, "CLASE");
    return { kind: "ClassDeclaration", name, properties, methods, line: tok.line, column: tok.column };
  }

  private parseTry(): Statement {
    const tok = this.expect(TokenType.INTENTAR);
    const tryBlock: Statement[] = [];
    const atBoundary = () =>
      this.check(TokenType.CAPTURAR) || this.check(TokenType.FINALMENTE) || this.atFin(TokenType.INTENTAR);
    while (!atBoundary()) {
      if (this.check(TokenType.EOF)) this.syntaxError("Falta FIN INTENTAR para cerrar este bloque.");
      tryBlock.push(this.parseStatement());
    }

    let catchParam: string | null = null;
    let catchBlock: Statement[] | null = null;
    if (this.match(TokenType.CAPTURAR)) {
      catchParam = this.expectIdentifier();
      this.expect(TokenType.EN, "EN");
      catchBlock = [];
      while (!this.check(TokenType.FINALMENTE) && !this.atFin(TokenType.INTENTAR)) {
        if (this.check(TokenType.EOF)) this.syntaxError("Falta FIN INTENTAR para cerrar este bloque.");
        catchBlock.push(this.parseStatement());
      }
    }

    let finallyBlock: Statement[] | null = null;
    if (this.match(TokenType.FINALMENTE)) {
      finallyBlock = [];
      while (!this.atFin(TokenType.INTENTAR)) {
        if (this.check(TokenType.EOF)) this.syntaxError("Falta FIN INTENTAR para cerrar este bloque.");
        finallyBlock.push(this.parseStatement());
      }
    }

    this.expectFin(TokenType.INTENTAR, "INTENTAR");
    return {
      kind: "Try",
      tryBlock,
      catchParam,
      catchBlock,
      finallyBlock,
      line: tok.line,
      column: tok.column,
    };
  }

  private parseThrow(): Statement {
    const tok = this.expect(TokenType.LANZAR);
    this.expect(TokenType.ERROR, "ERROR");
    const message = this.parseExpression();
    return { kind: "Throw", message, line: tok.line, column: tok.column };
  }

  private parseTestCase(): Statement {
    const tok = this.expect(TokenType.PRUEBA);
    const description = this.expectString();
    const body = this.parseBlockUntilFin(TokenType.PRUEBA);
    return { kind: "TestCase", description, body, line: tok.line, column: tok.column };
  }

  private parseVerify(): Statement {
    const tok = this.expect(TokenType.VERIFICAR);
    this.expect(TokenType.QUE, "QUE");
    const condition = this.parseExpression();
    return { kind: "Verify", condition, line: tok.line, column: tok.column };
  }

  // ---------- expresiones ----------

  parseExpression(): Expression {
    return this.parseTernary();
  }

  private parseTernary(): Expression {
    const test = this.parseOr();
    const tok = this.peek();
    if (this.match(TokenType.QUESTION)) {
      const consequent = this.parseExpression();
      this.expect(TokenType.COLON, '":"');
      const alternate = this.parseExpression();
      return { kind: "Conditional", test, consequent, alternate, line: tok.line, column: tok.column };
    }
    return test;
  }

  private parseOr(): Expression {
    let left = this.parseAnd();
    while (this.check(TokenType.O)) {
      const tok = this.advance();
      const right = this.parseAnd();
      left = { kind: "Binary", operator: "O", left, right, line: tok.line, column: tok.column };
    }
    return left;
  }

  private parseAnd(): Expression {
    let left = this.parseEquality();
    while (this.check(TokenType.Y)) {
      const tok = this.advance();
      const right = this.parseEquality();
      left = { kind: "Binary", operator: "Y", left, right, line: tok.line, column: tok.column };
    }
    return left;
  }

  private parseEquality(): Expression {
    let left = this.parseRelational();

    let negate = false;
    const tok = this.peek();
    if (this.check(TokenType.NO) && this.checkNext(TokenType.ES)) {
      this.advance();
      negate = true;
    }

    if (this.check(TokenType.ES)) {
      this.advance();
      if (this.match(TokenType.IGUAL)) {
        this.expect(TokenType.A, "A");
        const right = this.parseRelational();
        left = { kind: "Binary", operator: "ES_IGUAL_A", left, right, line: tok.line, column: tok.column };
        if (negate) left = { kind: "Unary", operator: "NO", operand: left, line: tok.line, column: tok.column };
      } else if (this.match(TokenType.DIFERENTE)) {
        this.expect(TokenType.DE, "DE");
        const right = this.parseRelational();
        left = {
          kind: "Binary",
          operator: "ES_DIFERENTE_DE",
          left,
          right,
          line: tok.line,
          column: tok.column,
        };
        if (negate) left = { kind: "Unary", operator: "NO", operand: left, line: tok.line, column: tok.column };
      } else if (this.match(TokenType.VERDADERO)) {
        left = { kind: "IsCheck", operand: left, check: "VERDADERO", negate, line: tok.line, column: tok.column };
      } else if (this.match(TokenType.FALSO)) {
        left = { kind: "IsCheck", operand: left, check: "FALSO", negate, line: tok.line, column: tok.column };
      } else if (this.match(TokenType.NULO)) {
        left = { kind: "IsCheck", operand: left, check: "NULO", negate, line: tok.line, column: tok.column };
      } else {
        this.syntaxError("Después de ES se esperaba IGUAL A, DIFERENTE DE, VERDADERO, FALSO o NULO.");
      }
    } else if (this.check(TokenType.EXISTE)) {
      this.advance();
      this.expect(TokenType.EN, "EN");
      const collection = this.parseRelational();
      left = { kind: "Membership", operand: left, collection, line: tok.line, column: tok.column };
    }

    return left;
  }

  private parseRelational(): Expression {
    let left = this.parseAdditive();
    while (
      this.check(TokenType.LT) ||
      this.check(TokenType.GT) ||
      this.check(TokenType.LTE) ||
      this.check(TokenType.GTE)
    ) {
      const opTok = this.advance();
      const right = this.parseAdditive();
      left = {
        kind: "Binary",
        operator: opTok.value as "<" | ">" | "<=" | ">=",
        left,
        right,
        line: opTok.line,
        column: opTok.column,
      };
    }
    return left;
  }

  private parseAdditive(): Expression {
    let left = this.parseMultiplicative();
    while (this.check(TokenType.PLUS) || this.check(TokenType.MINUS)) {
      const opTok = this.advance();
      const right = this.parseMultiplicative();
      left = {
        kind: "Binary",
        operator: opTok.value as "+" | "-",
        left,
        right,
        line: opTok.line,
        column: opTok.column,
      };
    }
    return left;
  }

  private parseMultiplicative(): Expression {
    let left = this.parseUnary();
    while (this.check(TokenType.TIMES) || this.check(TokenType.DIVIDE) || this.check(TokenType.MOD)) {
      const opTok = this.advance();
      const operator = opTok.type === TokenType.MOD ? "MOD" : (opTok.value as "×" | "÷");
      const right = this.parseUnary();
      left = { kind: "Binary", operator, left, right, line: opTok.line, column: opTok.column };
    }
    return left;
  }

  private parseUnary(): Expression {
    if (this.check(TokenType.MINUS)) {
      const tok = this.advance();
      const operand = this.parseUnary();
      return { kind: "Unary", operator: "-", operand, line: tok.line, column: tok.column };
    }
    if (this.check(TokenType.NO)) {
      const tok = this.advance();
      const operand = this.parseUnary();
      return { kind: "Unary", operator: "NO", operand, line: tok.line, column: tok.column };
    }
    return this.parsePipeline();
  }

  private parsePipeline(): Expression {
    let expr = this.parsePostfix();
    if (this.check(TokenType.PIPE)) {
      const start = this.peek();
      const stages: PipelineStage[] = [];
      while (this.match(TokenType.PIPE)) {
        stages.push(this.parsePipelineStage());
      }
      expr = { kind: "Pipeline", source: expr, stages, line: start.line, column: start.column };
    }
    return expr;
  }

  private parsePipelineStage(): PipelineStage {
    const tok = this.peek();
    let name: "FILTRAR" | "TRANSFORMAR" | "REDUCIR";
    if (this.match(TokenType.FILTRAR)) name = "FILTRAR";
    else if (this.match(TokenType.TRANSFORMAR)) name = "TRANSFORMAR";
    else if (this.match(TokenType.REDUCIR)) name = "REDUCIR";
    else return this.syntaxError('Se esperaba FILTRAR, TRANSFORMAR o REDUCIR después de "→".');
    this.expect(TokenType.LPAREN, '"("');
    const args: Expression[] = [];
    if (!this.check(TokenType.RPAREN)) {
      args.push(this.parseStageArg());
      while (this.match(TokenType.COMMA)) args.push(this.parseStageArg());
    }
    this.expect(TokenType.RPAREN, '")"');
    return { name, args, line: tok.line, column: tok.column };
  }

  // Un argumento de etapa de pipeline puede ser una lambda (x => expr / (a, b) => expr)
  // o una expresión normal (que se resuelve con scope implícito del elemento en el intérprete).
  private parseStageArg(): Expression {
    const tok = this.peek();

    if (this.check(TokenType.IDENTIFIER) && this.checkNext(TokenType.FATARROW)) {
      const param = this.advance().value;
      this.advance(); // =>
      const body = this.parseExpression();
      return { kind: "Lambda", params: [param], body, line: tok.line, column: tok.column };
    }

    if (this.check(TokenType.LPAREN)) {
      const params = this.tryScanParenParamList();
      if (params) {
        this.pos = params.nextPos;
        const body = this.parseExpression();
        return { kind: "Lambda", params: params.names, body, line: tok.line, column: tok.column };
      }
    }

    return this.parseExpression();
  }

  // Mira hacia adelante sin consumir: ¿"(" IDENT ("," IDENT)* ")" "=>" ...?
  private tryScanParenParamList(): { names: string[]; nextPos: number } | null {
    let i = this.pos + 1;
    const names: string[] = [];
    if (this.tokens[i]?.type === TokenType.IDENTIFIER) {
      names.push(this.tokens[i].value);
      i += 1;
      while (this.tokens[i]?.type === TokenType.COMMA) {
        i += 1;
        if (this.tokens[i]?.type !== TokenType.IDENTIFIER) return null;
        names.push(this.tokens[i].value);
        i += 1;
      }
    }
    if (this.tokens[i]?.type === TokenType.RPAREN && this.tokens[i + 1]?.type === TokenType.FATARROW) {
      return { names, nextPos: i + 2 };
    }
    return null;
  }

  private parsePostfix(): Expression {
    let expr = this.parsePrimary();
    for (;;) {
      if (this.match(TokenType.DOT)) {
        const tok = this.peek();
        const property = this.expectIdentifier();
        expr = { kind: "Member", object: expr, property, line: tok.line, column: tok.column };
      } else if (this.match(TokenType.LBRACKET)) {
        const tok = this.peek();
        const index = this.parseExpression();
        this.expect(TokenType.RBRACKET, '"]"');
        expr = { kind: "Index", object: expr, index, line: tok.line, column: tok.column };
      } else if (this.match(TokenType.LPAREN)) {
        const tok = this.peek();
        const args = this.parseArgs();
        this.expect(TokenType.RPAREN, '")"');
        expr = { kind: "Call", callee: expr, args, line: tok.line, column: tok.column };
      } else {
        break;
      }
    }
    return expr;
  }

  private parseArgs(): Expression[] {
    const args: Expression[] = [];
    if (!this.check(TokenType.RPAREN)) {
      args.push(this.parseExpression());
      while (this.match(TokenType.COMMA)) args.push(this.parseExpression());
    }
    return args;
  }

  private parseNewArgs(): { name: string; value: Expression }[] {
    const args: { name: string; value: Expression }[] = [];
    if (!this.check(TokenType.RPAREN)) {
      const name = this.expectIdentifier();
      this.expect(TokenType.COLON, '":"');
      const value = this.parseExpression();
      args.push({ name, value });
      while (this.match(TokenType.COMMA)) {
        const n = this.expectIdentifier();
        this.expect(TokenType.COLON, '":"');
        const v = this.parseExpression();
        args.push({ name: n, value: v });
      }
    }
    return args;
  }

  private parseBraceLiteral(): Expression {
    const tok = this.expect(TokenType.LBRACE);
    if (this.match(TokenType.RBRACE)) {
      return { kind: "ObjectLiteral", properties: [], line: tok.line, column: tok.column };
    }

    const properties: { key: string; value: Expression }[] = [];
    const elements: Expression[] = [];
    let sawObjectEntry = false;
    let sawSetElement = false;

    for (;;) {
      if (this.check(TokenType.FUNCION)) {
        const fn = this.parseFunctionNode();
        properties.push({
          key: fn.name,
          value: { kind: "FunctionExpression", fn, line: fn.line, column: fn.column },
        });
        sawObjectEntry = true;
      } else if (
        (this.check(TokenType.IDENTIFIER) || this.check(TokenType.STRING)) &&
        this.checkNext(TokenType.COLON)
      ) {
        const key = this.advance().value;
        this.advance(); // ":"
        const value = this.parseExpression();
        properties.push({ key, value });
        sawObjectEntry = true;
      } else {
        elements.push(this.parseExpression());
        sawSetElement = true;
      }

      if (this.match(TokenType.COMMA)) continue;
      if (this.check(TokenType.FUNCION)) continue;
      break;
    }

    this.expect(TokenType.RBRACE, '"}"');

    if (sawObjectEntry && sawSetElement) {
      this.syntaxError('No se puede mezclar "clave: valor" con elementos sueltos dentro de "{ }".');
    }
    if (sawObjectEntry) return { kind: "ObjectLiteral", properties, line: tok.line, column: tok.column };
    return { kind: "SetLiteral", elements, line: tok.line, column: tok.column };
  }

  private parsePrimary(): Expression {
    const tok = this.peek();

    switch (tok.type) {
      case TokenType.NUMBER:
        this.advance();
        return { kind: "NumberLiteral", value: Number(tok.value), line: tok.line, column: tok.column };
      case TokenType.STRING:
        this.advance();
        return { kind: "StringLiteral", value: tok.value, line: tok.line, column: tok.column };
      case TokenType.VERDADERO:
        this.advance();
        return { kind: "BooleanLiteral", value: true, line: tok.line, column: tok.column };
      case TokenType.FALSO:
        this.advance();
        return { kind: "BooleanLiteral", value: false, line: tok.line, column: tok.column };
      case TokenType.NULO:
        this.advance();
        return { kind: "NullLiteral", line: tok.line, column: tok.column };
      case TokenType.ESTE:
        this.advance();
        return { kind: "This", line: tok.line, column: tok.column };
      case TokenType.IDENTIFIER:
        this.advance();
        return { kind: "Identifier", name: tok.value, line: tok.line, column: tok.column };
      case TokenType.LPAREN: {
        this.advance();
        const expr = this.parseExpression();
        this.expect(TokenType.RPAREN, '")"');
        return expr;
      }
      case TokenType.LBRACKET: {
        this.advance();
        const elements: Expression[] = [];
        if (!this.check(TokenType.RBRACKET)) {
          elements.push(this.parseExpression());
          while (this.match(TokenType.COMMA)) elements.push(this.parseExpression());
        }
        this.expect(TokenType.RBRACKET, '"]"');
        return { kind: "ArrayLiteral", elements, line: tok.line, column: tok.column };
      }
      case TokenType.LBRACE:
        return this.parseBraceLiteral();
      case TokenType.CONJUNTO_VACIO:
        this.advance();
        return { kind: "EmptySet", line: tok.line, column: tok.column };
      case TokenType.PILA_VACIA:
        this.advance();
        return { kind: "EmptyStack", line: tok.line, column: tok.column };
      case TokenType.COLA_VACIA:
        this.advance();
        return { kind: "EmptyQueue", line: tok.line, column: tok.column };
      case TokenType.NUEVA: {
        this.advance();
        const className = this.expectIdentifier();
        this.expect(TokenType.LPAREN, '"("');
        const args = this.parseNewArgs();
        this.expect(TokenType.RPAREN, '")"');
        return { kind: "New", className, args, line: tok.line, column: tok.column };
      }
      case TokenType.FUNCION: {
        const fn = this.parseFunctionNode();
        return { kind: "FunctionExpression", fn, line: tok.line, column: tok.column };
      }
      case TokenType.CONVERTIR_A_NUMERO: {
        this.advance();
        this.expect(TokenType.LPAREN, '"("');
        const arg = this.parseExpression();
        this.expect(TokenType.RPAREN, '")"');
        return { kind: "Builtin", name: "CONVERTIR_A_NUMERO", args: [arg], line: tok.line, column: tok.column };
      }
      case TokenType.COPIA_DE: {
        this.advance();
        this.expect(TokenType.LPAREN, '"("');
        const source = this.parseExpression();
        this.expect(TokenType.RPAREN, '")"');
        if (this.match(TokenType.CON)) {
          const overrides = this.parseExpression();
          return { kind: "CopyWith", source, overrides, line: tok.line, column: tok.column };
        }
        return { kind: "Builtin", name: "COPIA_DE", args: [source], line: tok.line, column: tok.column };
      }
      case TokenType.UNION:
      case TokenType.INTERSECCION:
      case TokenType.DIFERENCIA: {
        this.advance();
        this.expect(TokenType.LPAREN, '"("');
        const a = this.parseExpression();
        this.expect(TokenType.COMMA, '","');
        const b = this.parseExpression();
        this.expect(TokenType.RPAREN, '")"');
        const name = tok.type === TokenType.UNION ? "UNION" : tok.type === TokenType.INTERSECCION ? "INTERSECCION" : "DIFERENCIA";
        return { kind: "Builtin", name, args: [a, b], line: tok.line, column: tok.column };
      }
      case TokenType.TAMANO: {
        this.advance();
        this.expect(TokenType.LPAREN, '"("');
        const arg = this.parseExpression();
        this.expect(TokenType.RPAREN, '")"');
        return { kind: "Builtin", name: "TAMANO", args: [arg], line: tok.line, column: tok.column };
      }
      case TokenType.COMPARAR_LAXA:
      case TokenType.COMPARAR_ESTRICTA: {
        this.advance();
        const mode = tok.type === TokenType.COMPARAR_LAXA ? "LAXA" : "ESTRICTA";
        const left = this.parseRelational();
        this.expect(TokenType.CON, "CON");
        const right = this.parseRelational();
        return { kind: "Compare", mode, left, right, line: tok.line, column: tok.column };
      }
      case TokenType.AGREGAR: {
        this.advance();
        const value = this.parseExpression();
        this.expect(TokenType.A, "A");
        const collection = this.parseReference();
        return { kind: "Command", command: "AGREGAR_A", collection, value, line: tok.line, column: tok.column };
      }
      case TokenType.AGREGAR_AL_FINAL: {
        this.advance();
        const collection = this.parseReference();
        const value = this.parseExpression();
        return {
          kind: "Command",
          command: "AGREGAR_AL_FINAL",
          collection,
          value,
          line: tok.line,
          column: tok.column,
        };
      }
      case TokenType.ELIMINAR_ULTIMO: {
        this.advance();
        const collection = this.parseReference();
        return { kind: "Command", command: "ELIMINAR_ULTIMO", collection, value: null, line: tok.line, column: tok.column };
      }
      case TokenType.APILAR: {
        this.advance();
        const collection = this.parseReference();
        const value = this.parseExpression();
        return { kind: "Command", command: "APILAR", collection, value, line: tok.line, column: tok.column };
      }
      case TokenType.DESAPILAR: {
        this.advance();
        const collection = this.parseReference();
        return { kind: "Command", command: "DESAPILAR", collection, value: null, line: tok.line, column: tok.column };
      }
      case TokenType.ENCOLAR: {
        this.advance();
        const collection = this.parseReference();
        const value = this.parseExpression();
        return { kind: "Command", command: "ENCOLAR", collection, value, line: tok.line, column: tok.column };
      }
      case TokenType.DESENCOLAR: {
        this.advance();
        const collection = this.parseReference();
        return { kind: "Command", command: "DESENCOLAR", collection, value: null, line: tok.line, column: tok.column };
      }
      default:
        return this.syntaxError(`Se esperaba una expresión, se encontró "${tok.value || tok.type}".`);
    }
  }
}

export function parse(tokens: Token[]): Statement {
  return Parser.parseProgram(tokens);
}
