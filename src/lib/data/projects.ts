export const projectCategories = [
  { id: "web", label: "Web App" },
  { id: "mobile", label: "Mobile" },
  { id: "uiux", label: "UI/UX" },
] as const;

export type ProjectCategory = (typeof projectCategories)[number]["id"];

export interface Project {
  _id: string;
  title: string;
  slug: string;
  category: ProjectCategory[];
  tags: string[];
  cover: string;
  coverAlt: string;
  summary: string;
  body: string;
  highlights: string[];
  role: string;
  duration: string;
  externalUrl?: string;
  repoUrl?: string;
  year: number;
  featured: boolean;
}

export const projects: Project[] = [
  {
    _id: "p1",
    title: "E-Commerce Platform",
    slug: "ecommerce-platform",
    category: ["web"],
    tags: ["Next.js", "TypeScript", "Tailwind", "Stripe", "PostgreSQL"],
    cover: "/images/projects/ecommerce-platform.png",
    coverAlt:
      "Pratinjau antarmuka toko online dengan banner promo dan kartu produk",
    summary:
      "Platform jual beli online dengan integrasi pembayaran, katalog produk, dan manajemen inventori.",
    body: `Platform e-commerce yang memungkinkan pengguna menelusuri katalog, menyimpan produk favorit, dan menyelesaikan checkout melalui Stripe. Dashboard admin menyediakan pengelolaan produk, pesanan, dan stok secara real-time.

Tantangan utamanya adalah menjaga pengalaman belanja tetap cepat meskipun katalog terus bertambah. Saya menerapkan server components, pencarian bertahap, dan optimasi gambar untuk menekan waktu muat halaman katalog.`,
    highlights: [
      "Alur checkout 3 langkah dengan validasi stok otomatis",
      "Dashboard admin untuk produk, pesanan, dan laporan penjualan",
      "Skor Lighthouse performa 95+ pada halaman katalog",
    ],
    role: "Full-stack Developer",
    duration: "6 minggu",
    externalUrl: "https://example.com",
    repoUrl: "https://github.com",
    year: 2025,
    featured: true,
  },
  {
    _id: "p2",
    title: "Task Management App",
    slug: "task-management-app",
    category: ["web"],
    tags: ["React", "TypeScript", "Firebase"],
    cover: "/images/projects/task-management-app.png",
    coverAlt:
      "Pratinjau papan kanban untuk manajemen tugas kolaboratif",
    summary:
      "Aplikasi manajemen tugas kolaboratif dengan pembaruan real-time dan tampilan papan kanban.",
    body: `Aplikasi to-do list untuk tim yang memungkinkan pengguna membuat proyek, menugaskan anggota, dan melacak progres melalui papan kanban. Sinkronisasi real-time dibangun di atas Firebase sehingga perubahan langsung terlihat oleh seluruh anggota tim.

Saya fokus pada pengalaman drag-and-drop yang mulus, notifikasi aktivitas, serta struktur data yang tetap rapi ketika jumlah tugas bertambah.`,
    highlights: [
      "Papan kanban dengan drag-and-drop dan sinkronisasi real-time",
      "Role anggota tim: owner, editor, dan viewer",
      "Notifikasi aktivitas dan riwayat perubahan tugas",
    ],
    role: "Frontend Developer",
    duration: "4 minggu",
    repoUrl: "https://github.com",
    year: 2024,
    featured: false,
  },
  {
    _id: "p3",
    title: "Portfolio Personal",
    slug: "portfolio-personal",
    category: ["web", "uiux"],
    tags: ["Next.js", "Tailwind", "PWA", "TypeScript"],
    cover: "/images/projects/portfolio-personal.png",
    coverAlt:
      "Pratinjau halaman portofolio personal dengan kartu profil dan cuplikan kode",
    summary:
      "Website portofolio interaktif dengan dukungan PWA, mode gelap, dan pengalaman offline.",
    body: `Portofolio pribadi yang dibangun dengan Next.js App Router dan Tailwind CSS. Proyek ini menjadi ruang eksperimen untuk tema, tipografi, animasi, dan pola interaksi yang tetap ringan.

Seluruh halaman dapat diakses secara offline setelah kunjungan pertama melalui service worker. Form kontak memakai validasi klien dan membuka draft email yang sudah terisi.`,
    highlights: [
      "PWA dengan strategi caching per jenis aset",
      "Mode gelap tanpa flicker dan menghormati prefers-color-scheme",
      "Modal proyek aksesibel dengan focus trap dan deep-link",
    ],
    role: "Designer & Developer",
    duration: "3 minggu",
    repoUrl: "https://github.com",
    year: 2025,
    featured: true,
  },
  {
    _id: "p4",
    title: "Dashboard Analitik Sekolah",
    slug: "dashboard-analitik-sekolah",
    category: ["web"],
    tags: ["Next.js", "Recharts", "Prisma", "PostgreSQL"],
    cover: "/images/projects/dashboard-analitik-sekolah.png",
    coverAlt:
      "Pratinjau dashboard analitik dengan kartu statistik dan grafik",
    summary:
      "Dashboard pemantauan data akademik dengan visualisasi interaktif dan ekspor laporan.",
    body: `Dashboard untuk memantau data kehadiran, nilai, dan aktivitas siswa. Data dari beberapa sumber disatukan ke dalam satu model Prisma, lalu divisualisasikan dalam grafik yang mudah dibaca oleh guru dan staf sekolah.

Fokus pengerjaan ada pada performa query, filter periode yang fleksibel, dan aksesibilitas grafik untuk pengguna keyboard.`,
    highlights: [
      "Filter periode, kelas, dan mata pelajaran yang saling terhubung",
      "Ekspor laporan ke CSV dan PDF",
      "Visualisasi responsif dengan tabel alternatif untuk pembaca layar",
    ],
    role: "Full-stack Developer",
    duration: "5 minggu",
    year: 2024,
    featured: false,
  },
  {
    _id: "p5",
    title: "Catatan Kuliah",
    slug: "catatan-kuliah",
    category: ["mobile"],
    tags: ["React Native", "Expo", "SQLite"],
    cover: "/images/projects/catatan-kuliah.png",
    coverAlt:
      "Pratinjau aplikasi catatan mobile dengan daftar catatan dan navigasi bawah",
    summary:
      "Aplikasi catatan mobile untuk mahasiswa dengan pencarian cepat dan penyimpanan offline.",
    body: `Aplikasi mobile untuk mencatat materi kuliah, membuat daftar tugas, dan menyimpan ringkasan. Data disimpan secara lokal menggunakan SQLite sehingga tetap dapat diakses tanpa koneksi internet.

Saya merancang navigasi yang sederhana, mode fokus saat menulis, serta pencarian instan di seluruh catatan.`,
    highlights: [
      "Penyimpanan offline dengan SQLite dan sinkronisasi opsional",
      "Pencarian instan di seluruh judul dan isi catatan",
      "Mode fokus dan dukungan mode gelap",
    ],
    role: "Mobile Developer",
    duration: "4 minggu",
    year: 2024,
    featured: false,
  },
  {
    _id: "p6",
    title: "Nusa UI Design System",
    slug: "nusa-ui-design-system",
    category: ["uiux", "web"],
    tags: ["Figma", "Storybook", "React", "Tailwind"],
    cover: "/images/projects/nusa-ui-design-system.png",
    coverAlt:
      "Pratinjau design system dengan palet warna, tipografi, dan komponen antarmuka",
    summary:
      "Design system dengan token warna, komponen aksesibel, dan dokumentasi yang mudah dipakai tim.",
    body: `Design system internal untuk menyatukan tampilan produk. Proyek ini mencakup token warna dan tipografi, komponen dasar, pedoman penulisan, hingga dokumentasi interaktif di Storybook.

Setiap komponen diuji dengan keyboard dan pembaca layar, lalu didokumentasikan bersama contoh penggunaan yang siap disalin ke proyek.`,
    highlights: [
      "30+ komponen React dengan dokumentasi Storybook",
      "Token warna dan tipografi yang konsisten lintas produk",
      "Checklist aksesibilitas untuk setiap komponen",
    ],
    role: "UI Engineer",
    duration: "8 minggu",
    year: 2023,
    featured: false,
  },
];

export const projectCategoryMap = new Map(
  projectCategories.map((category) => [category.id, category.label])
);

export function getProjectBySlug(slug: string) {
  return projects.find((project) => project.slug === slug);
}
