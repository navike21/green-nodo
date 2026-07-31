import type { FunctionNode, Statement } from "./ast";
import type { Environment } from "./environment";

// Modelo de valores en tiempo de ejecución. Números/strings/booleanos/null usan
// los tipos nativos de JS directamente; el resto son clases propias.

export class PObject {
  props = new Map<string, unknown>();
}

export class PSet {
  items: unknown[] = [];
}

export class PStack {
  items: unknown[] = [];
}

export class PQueue {
  items: unknown[] = [];
}

export class PFunction {
  constructor(
    public readonly name: string,
    public readonly params: string[],
    public readonly body: Statement[],
    public readonly closure: Environment,
  ) {}
}

export class PClass {
  constructor(
    public readonly name: string,
    public readonly properties: string[],
    public readonly methods: Map<string, PFunction>,
  ) {}
}

export class PInstance {
  props = new Map<string, unknown>();
  constructor(public readonly cls: PClass) {}
}

export function isTruthy(value: unknown): boolean {
  return value !== false && value !== null && value !== 0 && value !== "";
}

export function deepEquals(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((item, i) => deepEquals(item, b[i]));
  }
  if (a instanceof PObject && b instanceof PObject) {
    if (a.props.size !== b.props.size) return false;
    for (const [key, value] of a.props) {
      if (!b.props.has(key) || !deepEquals(value, b.props.get(key))) return false;
    }
    return true;
  }
  if (a instanceof PSet && b instanceof PSet) {
    if (a.items.length !== b.items.length) return false;
    return a.items.every((item) => b.items.some((other) => deepEquals(item, other)));
  }
  if (a instanceof PStack && b instanceof PStack) return deepEquals(a.items, b.items);
  if (a instanceof PQueue && b instanceof PQueue) return deepEquals(a.items, b.items);
  return false;
}

export function deepClone<T>(value: T): T {
  if (Array.isArray(value)) return value.map((v) => deepClone(v)) as unknown as T;
  if (value instanceof PObject) {
    const clone = new PObject();
    for (const [k, v] of value.props) clone.props.set(k, deepClone(v));
    return clone as unknown as T;
  }
  if (value instanceof PSet) {
    const clone = new PSet();
    clone.items = value.items.map((v) => deepClone(v));
    return clone as unknown as T;
  }
  if (value instanceof PStack) {
    const clone = new PStack();
    clone.items = value.items.map((v) => deepClone(v));
    return clone as unknown as T;
  }
  if (value instanceof PQueue) {
    const clone = new PQueue();
    clone.items = value.items.map((v) => deepClone(v));
    return clone as unknown as T;
  }
  // primitivos, funciones e instancias se comparten por referencia al "copiar"
  return value;
}

function setContentsToInspect(items: unknown[]): string {
  return `{ ${items.map(toInspectString).join(", ")} }`;
}

export function toInspectString(value: unknown): string {
  if (typeof value === "string") return `"${value}"`;
  if (typeof value === "number") return String(value);
  if (typeof value === "boolean") return value ? "verdadero" : "falso";
  if (value === null || value === undefined) return "nulo";
  if (Array.isArray(value)) return `[${value.map(toInspectString).join(", ")}]`;
  if (value instanceof PSet) return setContentsToInspect(value.items);
  if (value instanceof PStack || value instanceof PQueue) return `[${value.items.map(toInspectString).join(", ")}]`;
  if (value instanceof PObject) {
    const entries = Array.from(value.props.entries()).map(([k, v]) => `"${k}": ${toInspectString(v)}`);
    return `{ ${entries.join(", ")} }`;
  }
  if (value instanceof PInstance) {
    const entries = Array.from(value.props.entries()).map(([k, v]) => `${k}: ${toInspectString(v)}`);
    return `${value.cls.name}(${entries.join(", ")})`;
  }
  if (value instanceof PFunction) return `<función ${value.name || "anónima"}>`;
  if (value instanceof PClass) return `<clase ${value.name}>`;
  return String(value);
}

// toDisplayString: lo que produce MOSTRAR para un valor de nivel superior
// (un string "crudo" no lleva comillas; los contenedores sí las llevan en sus elementos).
export function toDisplayString(value: unknown): string {
  if (typeof value === "string") return value;
  return toInspectString(value);
}

export function functionNodeName(fn: FunctionNode): string {
  return fn.name;
}
