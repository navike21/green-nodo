import { challenge as algorithmicThinking } from "./01-algorithmic-thinking";
import { challenge as variablesDataTypesMemory } from "./02-variables-data-types-memory";
import { challenge as controlFlowRecursion } from "./03-control-flow-recursion";
import { challenge as dataStructuresComplexity } from "./04-data-structures-complexity";
import { challenge as functionsProgrammingParadigms } from "./05-functions-programming-paradigms";
import { challenge as errorHandlingDebuggingTesting } from "./06-error-handling-debugging-testing";
import type { PseudocodeChallenge } from "./types";

export const pseudocodeChallenges: PseudocodeChallenge[] = [
  algorithmicThinking,
  variablesDataTypesMemory,
  controlFlowRecursion,
  dataStructuresComplexity,
  functionsProgrammingParadigms,
  errorHandlingDebuggingTesting,
];

export type { PseudocodeChallenge, ScriptCase } from "./types";
