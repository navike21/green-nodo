const STORAGE_KEY = "df_student_v1";
const STUDENT_UPDATED_EVENT = "student-updated";

export interface Student {
  firstName: string;
  lastName: string;
  email: string;
}

function readStudent(): Student | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function getStudent(): Student | null {
  return readStudent();
}

export function saveStudent(student: Student) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(student));
  window.dispatchEvent(new CustomEvent(STUDENT_UPDATED_EVENT));
}

export function onStudentUpdated(callback: () => void) {
  window.addEventListener(STUDENT_UPDATED_EVENT, callback);
}

export function getInitials(student: Student): string {
  return `${student.firstName[0] ?? ""}${student.lastName[0] ?? ""}`.toUpperCase();
}
