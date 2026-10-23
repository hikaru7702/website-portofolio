export interface Skill {
  _id: string;
  name: string;
  category: "core" | "tool";
  level: number;
  yearsOfUse?: number;
  filterTag?: string;
}

export const skills: Skill[] = [
  {
    _id: "s1",
    name: "React",
    category: "core",
    level: 5,
    yearsOfUse: 3,
    filterTag: "React",
  },
  {
    _id: "s2",
    name: "Next.js",
    category: "core",
    level: 5,
    yearsOfUse: 2,
    filterTag: "Next.js",
  },
  {
    _id: "s3",
    name: "TypeScript",
    category: "core",
    level: 4,
    yearsOfUse: 2,
    filterTag: "TypeScript",
  },
  {
    _id: "s4",
    name: "Tailwind CSS",
    category: "core",
    level: 5,
    yearsOfUse: 2,
    filterTag: "Tailwind",
  },
  {
    _id: "s5",
    name: "Node.js",
    category: "core",
    level: 3,
    yearsOfUse: 1,
    filterTag: "Node.js",
  },
  {
    _id: "s6",
    name: "UI Design",
    category: "core",
    level: 4,
    yearsOfUse: 2,
    filterTag: "Figma",
  },
  { _id: "s7", name: "Figma", category: "tool", level: 4, filterTag: "Figma" },
  { _id: "s8", name: "Git", category: "tool", level: 4 },
  { _id: "s9", name: "PostgreSQL", category: "tool", level: 3 },
  { _id: "s10", name: "Prisma", category: "tool", level: 3 },
  { _id: "s11", name: "Vite", category: "tool", level: 4 },
  { _id: "s12", name: "Vercel", category: "tool", level: 4 },
];

export const coreSkills = skills.filter((skill) => skill.category === "core");
export const toolSkills = skills.filter((skill) => skill.category === "tool");
