import { z } from "zod";

export const contactSubjects = ["job", "collab", "freelance", "other"] as const;

export type ContactSubject = (typeof contactSubjects)[number];

export const contactSubjectLabels: Record<ContactSubject, string> = {
  job: "Lowongan Kerja",
  collab: "Kolaborasi",
  freelance: "Freelance",
  other: "Lainnya",
};

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Nama minimal 2 karakter")
    .max(80, "Nama maksimal 80 karakter"),
  email: z
    .string()
    .trim()
    .min(1, "Email wajib diisi")
    .email("Format email tidak valid")
    .max(160, "Email terlalu panjang"),
  subject: z.enum(contactSubjects, {
    errorMap: () => ({ message: "Pilih subjek pesan" }),
  }),
  budget: z
    .string()
    .trim()
    .max(80, "Anggaran maksimal 80 karakter")
    .optional()
    .or(z.literal("")),
  message: z
    .string()
    .trim()
    .min(20, "Pesan minimal 20 karakter")
    .max(2000, "Pesan maksimal 2000 karakter"),
  consent: z.boolean().refine((value) => value === true, {
    message: "Anda harus menyetujui kebijakan privasi",
  }),
  honeypot: z.string().max(200).optional(),
  startedAt: z.number().int().nonnegative().optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type ContactFormValues = z.input<typeof contactSchema>;
