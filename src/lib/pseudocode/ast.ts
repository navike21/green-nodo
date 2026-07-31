// Definiciones de nodos del AST. Se agrupan por Statement / Expression.
// Cada nodo lleva line/column del token que lo originó, para mensajes de error.

export interface Position {
  line: number;
  column: number;
}

export type Statement =
  | ({ kind: "Program"; body: Statement[] } & Position)
  | ({ kind: "Declare"; name: string; init: Expression } & Position) // DEFINIR
  | ({ kind: "Assign"; target: Expression; value: Expression } & Position) // ASIGNAR / MODIFICAR
  | ({ kind: "Calculate"; name: string; value: Expression } & Position) // CALCULAR
  | ({ kind: "Receive"; name: string } & Position) // RECIBIR (DEL USUARIO)? name
  | ({ kind: "Show"; value: Expression } & Position) // MOSTRAR
  | ({ kind: "Terminate" } & Position) // TERMINAR
  | ({
      kind: "If";
      condition: Expression;
      thenBranch: Statement[];
      elseBranch: Statement[] | null;
    } & Position)
  | ({
      kind: "Switch";
      discriminant: Expression;
      cases: { test: Expression | null; body: Statement[] }[];
    } & Position) // SEGÚN/CASO/POR DEFECTO (con fall-through real)
  | ({
      kind: "ForRange";
      varName: string;
      from: Expression;
      to: Expression;
      body: Statement[];
    } & Position)
  | ({ kind: "ForEach"; varName: string; iterable: Expression; body: Statement[] } & Position)
  | ({ kind: "While"; condition: Expression; body: Statement[] } & Position)
  | ({ kind: "Break" } & Position)
  | ({ kind: "Continue" } & Position)
  | ({ kind: "FunctionDeclaration"; fn: FunctionNode } & Position)
  | ({ kind: "Return"; value: Expression | null } & Position)
  | ({
      kind: "ClassDeclaration";
      name: string;
      properties: string[];
      methods: FunctionNode[];
    } & Position)
  | ({
      kind: "Try";
      tryBlock: Statement[];
      catchParam: string | null;
      catchBlock: Statement[] | null;
      finallyBlock: Statement[] | null;
    } & Position)
  | ({ kind: "Throw"; message: Expression } & Position)
  | ({ kind: "TestCase"; description: string; body: Statement[] } & Position) // PRUEBA
  | ({ kind: "Verify"; condition: Expression } & Position) // VERIFICAR QUE <expr-booleana>
  | ({ kind: "ExpressionStatement"; expression: Expression } & Position);

export interface FunctionNode extends Position {
  name: string;
  params: string[];
  body: Statement[];
}

export type Expression =
  | ({ kind: "NumberLiteral"; value: number } & Position)
  | ({ kind: "StringLiteral"; value: string } & Position)
  | ({ kind: "BooleanLiteral"; value: boolean } & Position)
  | ({ kind: "NullLiteral" } & Position)
  | ({ kind: "Identifier"; name: string } & Position)
  | ({ kind: "This" } & Position) // ESTE
  | ({ kind: "ArrayLiteral"; elements: Expression[] } & Position)
  | ({ kind: "ObjectLiteral"; properties: { key: string; value: Expression }[] } & Position)
  | ({ kind: "SetLiteral"; elements: Expression[] } & Position)
  | ({ kind: "EmptySet" } & Position) // CONJUNTO_VACIO
  | ({ kind: "EmptyStack" } & Position) // PILA_VACIA
  | ({ kind: "EmptyQueue" } & Position) // COLA_VACIA
  | ({ kind: "Member"; object: Expression; property: string } & Position)
  | ({ kind: "Index"; object: Expression; index: Expression } & Position)
  | ({ kind: "Call"; callee: Expression; args: Expression[] } & Position)
  | ({
      kind: "New";
      className: string;
      args: { name: string; value: Expression }[];
    } & Position)
  | ({ kind: "Binary"; operator: BinaryOperator; left: Expression; right: Expression } & Position)
  | ({ kind: "Unary"; operator: "NO" | "-"; operand: Expression } & Position)
  | ({
      kind: "IsCheck";
      operand: Expression;
      check: "VERDADERO" | "FALSO" | "NULO";
      negate: boolean;
    } & Position) // x (NO)? ES VERDADERO|FALSO|NULO
  | ({ kind: "Membership"; operand: Expression; collection: Expression } & Position) // x EXISTE EN col
  | ({
      kind: "Conditional";
      test: Expression;
      consequent: Expression;
      alternate: Expression;
    } & Position) // ternario
  | ({ kind: "Lambda"; params: string[]; body: Expression } & Position)
  | ({ kind: "FunctionExpression"; fn: FunctionNode } & Position)
  | ({
      kind: "Pipeline";
      source: Expression;
      stages: PipelineStage[];
    } & Position)
  | ({
      kind: "Builtin";
      name:
        | "CONVERTIR_A_NUMERO"
        | "COPIA_DE"
        | "UNION"
        | "INTERSECCION"
        | "DIFERENCIA"
        | "TAMANO";
      args: Expression[];
    } & Position)
  | ({ kind: "CopyWith"; source: Expression; overrides: Expression } & Position) // COPIA_DE(x) CON {...}
  | ({ kind: "Compare"; mode: "LAXA" | "ESTRICTA"; left: Expression; right: Expression } & Position)
  | ({
      kind: "Command";
      command:
        | "AGREGAR_A"
        | "AGREGAR_AL_FINAL"
        | "ELIMINAR_ULTIMO"
        | "APILAR"
        | "DESAPILAR"
        | "ENCOLAR"
        | "DESENCOLAR";
      collection: Expression;
      value: Expression | null;
    } & Position);

// Nota: "Pipeline.stages" arriba se corrige a un arreglo (ver parser.ts), TypeScript
// no permite describir bien un arreglo de intersección inline sin este comentario:
export interface PipelineStage extends Position {
  name: "FILTRAR" | "TRANSFORMAR" | "REDUCIR";
  args: Expression[];
}

export type BinaryOperator =
  | "+"
  | "-"
  | "×"
  | "÷"
  | "MOD"
  | "<"
  | ">"
  | "<="
  | ">="
  | "ES_IGUAL_A"
  | "ES_DIFERENTE_DE"
  | "Y"
  | "O";
