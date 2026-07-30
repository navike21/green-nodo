import type { ChipVariants } from "../components/atoms/Chip.astro";

export const CATEGORY_SLUGS = ["fundamentos", "desarrollo-web", "apps-movil", "datos-ia"] as const;

export type CourseCategory = (typeof CATEGORY_SLUGS)[number];

export const CATEGORY_META: Record<CourseCategory, { label: string; icon: string; chipVariant: ChipVariants }> = {
  fundamentos: { label: "Fundamentos", icon: "🧩", chipVariant: "success" },
  "desarrollo-web": { label: "Desarrollo Web", icon: "🌐", chipVariant: "information" },
  "apps-movil": { label: "Apps / Móvil", icon: "📱", chipVariant: "purple" },
  "datos-ia": { label: "Datos & IA", icon: "🧠", chipVariant: "warning" },
};
