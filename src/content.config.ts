import { defineCollection, reference } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

const courses = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/courses" }),
  schema: z.object({
    name: z.string(),
    description: z.string(),
    phases: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        slug: z.string(),
      }),
    ),
  }),
});

const topics = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/topics" }),
  schema: z.object({
    course: reference("courses"),
    phase: z.string(),
    order: z.number(),
    type: z.enum(["leccion", "proyecto"]).default("leccion"),
    name: z.string(),
    description: z.string(),
    level: z.enum(["Avanzado", "Básico", "Intermedio"]),
    technicalTerms: z.object({
      title: z.string(),
      subTitle: z.string().optional(),
      summary: z.string(),
    }),
    analogy: z.object({
      title: z.string(),
      summary: z.string(),
    }),
    informationCard: z.array(
      z.object({
        icon: z.string(),
        title: z.string(),
        summary: z.string(),
        cardColor: z.enum(["green", "yellow", "red", "blue", "purple"]),
      }),
    ),
  }),
});

const evaluations = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/evaluations" }),
  schema: z.object({
    topic: reference("topics"),
    questions: z
      .array(
        z.object({
          type: z.enum(["single", "multiple"]).default("single"),
          question: z.string(),
          options: z.array(z.string()).max(6),
          correctIndexes: z.array(z.number()),
          explanation: z.string(),
        }),
      )
      .length(8),
  }),
});

export const collections = { courses, topics, evaluations };
