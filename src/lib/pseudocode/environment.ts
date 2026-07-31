import { ErrorCode, PseudocodeError } from "./errors";

// Cadena de scopes (Global / Función / Bloque son todas instancias de esta misma clase,
// una por cada FUNCIÓN, PARA, MIENTRAS, SI, CASO, INTENTAR/CAPTURAR/FINALMENTE, etc.).
export class Environment {
  private readonly values = new Map<string, unknown>();
  readonly parent: Environment | null;

  constructor(parent: Environment | null = null) {
    this.parent = parent;
  }

  // DEFINIR: siempre crea un binding nuevo en ESTE scope (permite Shadowing intencional).
  declare(name: string, value: unknown): void {
    this.values.set(name, value);
  }

  has(name: string): boolean {
    return this.values.has(name) || (this.parent?.has(name) ?? false);
  }

  hasOwn(name: string): boolean {
    return this.values.has(name);
  }

  get(name: string, line: number, column: number): unknown {
    if (this.values.has(name)) return this.values.get(name);
    if (this.parent) return this.parent.get(name, line, column);
    throw new PseudocodeError(
      ErrorCode.UNDEFINED_VARIABLE,
      `La variable "${name}" no está definida.`,
      line,
      column,
    );
  }

  // ASIGNAR / MODIFICAR / CALCULAR (cuando ya existe): busca hacia arriba en la cadena
  // de scopes hasta encontrar dónde vive la variable y reasigna ahí.
  assign(name: string, value: unknown, line: number, column: number): void {
    if (this.values.has(name)) {
      this.values.set(name, value);
      return;
    }
    if (this.parent) {
      this.parent.assign(name, value, line, column);
      return;
    }
    throw new PseudocodeError(
      ErrorCode.UNDEFINED_VARIABLE,
      `La variable "${name}" no está definida.`,
      line,
      column,
    );
  }

  // CALCULAR: declara en el scope actual si el nombre no existe todavía en NINGÚN
  // scope visible, o reasigna donde ya exista si sí existe.
  calculate(name: string, value: unknown): void {
    if (this.has(name)) {
      this.assign(name, value, 0, 0);
    } else {
      this.declare(name, value);
    }
  }
}
