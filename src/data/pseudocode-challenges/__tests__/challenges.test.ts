import { describe, expect, it } from "vitest";
import { runPseudocode, runWithTests } from "../../../lib/pseudocode/runner";
import { pseudocodeChallenges } from "../index";

describe("Suites de calificación ocultas — solución de referencia", () => {
  for (const challenge of pseudocodeChallenges) {
    describe(challenge.topicId, () => {
      if (challenge.hiddenTestSource) {
        it("la solución de referencia pasa la suite oculta completa", () => {
          const r = runWithTests(challenge.referenceSource, challenge.hiddenTestSource!);
          expect(r.ok).toBe(true);
          const failed = r.tests.filter((t) => !t.passed);
          expect(failed).toEqual([]);
          expect(r.tests.length).toBeGreaterThan(0);
        });
      }

      if (challenge.alternateStyleSource) {
        it("una solución de estilo alternativo (misma lógica, otra forma) también pasa la suite oculta", () => {
          const r = runWithTests(challenge.alternateStyleSource!, challenge.hiddenTestSource ?? "");
          expect(r.ok).toBe(true);
          const failed = r.tests.filter((t) => !t.passed);
          expect(failed).toEqual([]);
        });
      }

      if (challenge.scriptCases) {
        for (const scriptCase of challenge.scriptCases) {
          it(`caso de guion: ${scriptCase.description}`, () => {
            const r = runPseudocode(challenge.referenceSource, { inputs: scriptCase.inputs });
            expect(r.ok).toBe(true);
            expect(r.output).toEqual(scriptCase.expectedOutput);
          });
        }
      }
    });
  }
});
