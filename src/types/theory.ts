export interface Theory {
  description: string;
  id: string;
  name: string;
  phases: Phase[];
}

export interface Phase {
  id: string;
  name: string;
  slug: string;
}

export interface Topic {
  description: string;
  id: string;
  href: string;
  phaseId: string;
  name: string;
  level: "Avanzado" | "Básico" | "Intermedio";
  order: number;
  topicType: "leccion" | "proyecto";
}
