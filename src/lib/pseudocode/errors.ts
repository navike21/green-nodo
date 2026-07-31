export enum ErrorCode {
  SYNTAX_ERROR = "SYNTAX_ERROR",
  UNDEFINED_VARIABLE = "UNDEFINED_VARIABLE",
  DIVISION_BY_ZERO = "DIVISION_BY_ZERO",
  NOT_A_FUNCTION = "NOT_A_FUNCTION",
  WRONG_ARGUMENT_COUNT = "WRONG_ARGUMENT_COUNT",
  MISSING_PROPERTY = "MISSING_PROPERTY",
  UNKNOWN_PROPERTY = "UNKNOWN_PROPERTY",
  TYPE_ERROR = "TYPE_ERROR",
  NO_MORE_INPUT = "NO_MORE_INPUT",
  EXECUTION_LIMIT_EXCEEDED = "EXECUTION_LIMIT_EXCEEDED",
  THROWN_ERROR = "THROWN_ERROR",
}

export class PseudocodeError extends Error {
  code: ErrorCode;
  line: number;
  column: number;

  constructor(code: ErrorCode, message: string, line: number, column: number) {
    super(message);
    this.name = "PseudocodeError";
    this.code = code;
    this.line = line;
    this.column = column;
  }

  toJSON() {
    return { code: this.code, message: this.message, line: this.line, column: this.column };
  }
}

// Excepción interna usada para representar un LANZAR ERROR "..." del propio programa,
// distinta de un PseudocodeError de la plataforma (para que CAPTURAR pueda diferenciarlas si hiciera falta).
export class ThrownProgramError extends Error {
  line: number;
  column: number;

  constructor(message: string, line: number, column: number) {
    super(message);
    this.name = "ThrownProgramError";
    this.line = line;
    this.column = column;
  }
}

// Señales de control de flujo internas (no son errores de verdad, solo usan
// el mecanismo de excepciones de JS para desenrollar la pila del evaluador).
export class BreakSignal {}
export class ContinueSignal {}
export class TerminateSignal {}
export class ReturnSignal {
  value: unknown;
  constructor(value: unknown) {
    this.value = value;
  }
}

// Falla de una aserción VERIFICAR QUE dentro de un bloque PRUEBA.
export class VerifyFailure extends Error {
  line: number;
  column: number;
  constructor(message: string, line: number, column: number) {
    super(message);
    this.name = "VerifyFailure";
    this.line = line;
    this.column = column;
  }
}
