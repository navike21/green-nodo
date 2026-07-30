const STORAGE_KEY = "df_quiz_attempts_v1";

export interface QuizAttempt {
  questionIndexes: number[];
  selections: number[][];
  submitted: boolean;
}

type AttemptStore = Record<string, QuizAttempt>;

function readStore(): AttemptStore {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
  } catch {
    return {};
  }
}

function writeStore(store: AttemptStore) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

export function getQuizAttempt(topicId: string): QuizAttempt | null {
  return readStore()[topicId] ?? null;
}

export function saveQuizAttempt(topicId: string, attempt: QuizAttempt) {
  const store = readStore();
  store[topicId] = attempt;
  writeStore(store);
}

export function clearQuizAttempt(topicId: string) {
  const store = readStore();
  delete store[topicId];
  writeStore(store);
}
