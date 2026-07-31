import { Interpreter, type TestResult } from "./interpreter";
import { tokenize } from "./lexer";
import { parse } from "./parser";
import { PseudocodeError, ThrownProgramError } from "./errors";

export interface RunOptions {
  inputs?: unknown[];
}

export interface RunError {
  code: string;
  message: string;
  line: number;
  column: number;
}

export interface RunResult {
  ok: boolean;
  output: string[];
  tests: TestResult[];
  error?: RunError;
}

export function runPseudocode(source: string, options: RunOptions = {}): RunResult {
  const interpreter = new Interpreter(options.inputs ?? []);
  try {
    const tokens = tokenize(source);
    const program = parse(tokens);
    interpreter.run(program);
    return { ok: true, output: interpreter.output, tests: interpreter.testReport };
  } catch (e) {
    if (e instanceof PseudocodeError) {
      return { ok: false, output: interpreter.output, tests: interpreter.testReport, error: e.toJSON() };
    }
    if (e instanceof ThrownProgramError) {
      return {
        ok: false,
        output: interpreter.output,
        tests: interpreter.testReport,
        error: { code: "UNCAUGHT_THROW", message: e.message, line: e.line, column: e.column },
      };
    }
    throw e;
  }
}

// Ejecuta el código del estudiante junto a una suite de PRUEBA oculta (no
// visible para el estudiante), como un único programa: las funciones/clases
// declaradas en `source` quedan visibles para los bloques PRUEBA de `hiddenTestSource`.
export function runWithTests(source: string, hiddenTestSource: string, options: RunOptions = {}): RunResult {
  return runPseudocode(`${source}\n${hiddenTestSource}`, options);
}
