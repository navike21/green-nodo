const STORAGE_KEY = "df_progress_v1";
const PROGRESS_UPDATED_EVENT = "progress-updated";
const PASS_RATIO = 0.75;

interface TopicProgress {
  score: number;
  total: number;
  passed: boolean;
  completedAt: string;
}

type ProgressStore = Record<string, TopicProgress>;

function readStore(): ProgressStore {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
  } catch {
    return {};
  }
}

function writeStore(store: ProgressStore) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  window.dispatchEvent(new CustomEvent(PROGRESS_UPDATED_EVENT));
}

export function markTopicCompleted(topicId: string, score: number, total: number) {
  const store = readStore();
  store[topicId] = {
    score,
    total,
    passed: total > 0 && score / total >= PASS_RATIO,
    completedAt: new Date().toISOString(),
  };
  writeStore(store);
}

export function getCompletedTopicIds(): string[] {
  const store = readStore();
  return Object.keys(store).filter((topicId) => store[topicId].passed);
}

export function isTopicUnlocked(topicId: string, orderedTopicIds: string[]): boolean {
  const index = orderedTopicIds.indexOf(topicId);
  if (index <= 0) return true;

  const previousTopicId = orderedTopicIds[index - 1];
  return getCompletedTopicIds().includes(previousTopicId);
}

export function resetProgress() {
  writeStore({});
}

export function onProgressUpdated(callback: () => void) {
  window.addEventListener(PROGRESS_UPDATED_EVENT, callback);
}
