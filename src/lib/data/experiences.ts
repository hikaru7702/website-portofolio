export interface Experience {
  _id: string;
  type: "work" | "education";
  role: string;
  org: string;
  orgUrl?: string;
  location: string;
  start: string;
  end: string | null;
  highlights: string[];
  skills: string[];
}

export const experiences: Experience[] = [
  {
    _id: "e1",
    type: "work",
    role: "Frontend Developer",
    org: "Studio Digital Nusantara",
    orgUrl: "https://example.com",
    location: "Remote",
    start: "2024-02",
    end: null,
    highlights: [
      "Membangun dan memelihara antarmuka produk menggunakan React, Next.js, dan TypeScript.",
      "Meningkatkan performa halaman utama dari 68 menjadi 96 pada Lighthouse.",
      "Berkolaborasi dengan desainer untuk menyusun design system internal.",
    ],
    skills: ["React", "Next.js", "TypeScript", "Tailwind"],
  },
  {
    _id: "e2",
    type: "work",
    role: "Freelance Web Developer",
    org: "Mandiri",
    location: "Indonesia",
    start: "2023-01",
    end: "2024-01",
    highlights: [
      "Mengerjakan landing page, company profile, dan toko online untuk UMKM.",
      "Menangani kebutuhan mulai dari desain antarmuka hingga deployment.",
      "Menyusun dokumentasi dan panduan penggunaan untuk klien.",
    ],
    skills: ["Next.js", "Tailwind", "Figma"],
  },
  {
    _id: "e3",
    type: "education",
    role: "S1 Teknik Informatika",
    org: "Universitas Islam Negeri",
    location: "Indonesia",
    start: "2021-09",
    end: "2025-07",
    highlights: [
      "Fokus pada rekayasa perangkat lunak dan pengembangan web.",
      "Aktif dalam kegiatan organisasi dan proyek kolaborasi antar mahasiswa.",
      "Menyelesaikan tugas akhir bertema Progressive Web App.",
    ],
    skills: ["JavaScript", "React", "UI Design"],
  },
  {
    _id: "e4",
    type: "education",
    role: "Frontend Web Development Bootcamp",
    org: "Dicoding",
    location: "Online",
    start: "2022-06",
    end: "2022-12",
    highlights: [
      "Mempelajari dasar HTML, CSS, JavaScript, dan pengembangan web modern.",
      "Menyelesaikan proyek akhir berupa aplikasi web interaktif.",
    ],
    skills: ["JavaScript", "React", "Git"],
  },
];
