import { runPseudocode, runWithTests } from "../../lib/pseudocode/runner";
import type { PseudocodeChallenge } from "./types";

export interface TestRowResult {
  description: string;
  passed: boolean;
  message?: string;
}

export interface GradeResult {
  // true únicamente si el código corrió sin errores Y todas las filas pasaron.
  ok: boolean;
  results: TestRowResult[];
  // Solo se llena cuando el código del estudiante no llegó a ejecutar ninguna
  // prueba (camino hiddenTestSource) — no aplica al camino scriptCases, donde
  // un caso que falla se convierte en su propia fila, no en un error global.
  runtimeError?: { message: string; line: number; column: number };
}

const MAX_MESSAGE_LENGTH = 300;

function truncate(message: string): string {
  return message.length > MAX_MESSAGE_LENGTH ? `${message.slice(0, MAX_MESSAGE_LENGTH)}…` : message;
}

// Solo lo necesario para calificar — no requiere referenceSource/topicId/etc.,
// así el widget del navegador no necesita (ni serializa) el resto de la challenge.
export type Gradable = Pick<PseudocodeChallenge, "hiddenTestSource" | "scriptCases">;

export function gradeChallenge(challenge: Gradable, studentSource: string): GradeResult {
  if (challenge.hiddenTestSource) {
    const run = runWithTests(studentSource, challenge.hiddenTestSource);
    if (!run.ok) {
      return {
        ok: false,
        results: [],
        runtimeError: run.error && {
          message: truncate(run.error.message),
          line: run.error.line,
          column: run.error.column,
        },
      };
    }
    const results = run.tests.map((t) => ({
      description: t.description,
      passed: t.passed,
      message: t.message ? truncate(t.message) : undefined,
    }));
    return { ok: results.length > 0 && results.every((r) => r.passed), results };
  }

  if (challenge.scriptCases) {
    const results = challenge.scriptCases.map((scriptCase) => {
      const run = runPseudocode(studentSource, { inputs: scriptCase.inputs });
      if (!run.ok) {
        return {
          description: scriptCase.description,
          passed: false,
          message: run.error ? truncate(run.error.message) : "El programa no se pudo ejecutar.",
        };
      }
      const matches =
        run.output.length === scriptCase.expectedOutput.length &&
        run.output.every((line, i) => line === scriptCase.expectedOutput[i]);
      return {
        description: scriptCase.description,
        passed: matches,
        message: matches
          ? undefined
          : truncate(
              `Se esperaba: ${scriptCase.expectedOutput.join(" / ") || "(sin salida)"} — Tu programa mostró: ${
                run.output.join(" / ") || "(sin salida)"
              }`,
            ),
      };
    });
    return { ok: results.every((r) => r.passed), results };
  }

  return { ok: false, results: [] };
}
