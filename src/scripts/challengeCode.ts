const STORAGE_KEY = "df_challenge_code_v1";

type CodeStore = Record<string, string>;

function readStore(): CodeStore {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
  } catch {
    return {};
  }
}

function writeStore(store: CodeStore) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

export function getSavedCode(topicId: string): string | null {
  return readStore()[topicId] ?? null;
}

export function saveCode(topicId: string, code: string) {
  const store = readStore();
  store[topicId] = code;
  writeStore(store);
}

export function clearSavedCode(topicId: string) {
  const store = readStore();
  delete store[topicId];
  writeStore(store);
}
