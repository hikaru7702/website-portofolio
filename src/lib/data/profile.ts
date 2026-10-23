export type SocialIcon = "github" | "linkedin" | "instagram" | "mail";

export interface SocialLink {
  label: string;
  href: string;
  icon: SocialIcon;
}

/**
 * Semua data identitas ada di file ini agar mudah dipersonalisasi.
 * Ganti nama, email, sosial media, dan lokasi sesuai data Anda.
 */
export const profile = {
  name: "Kaffah",
  initials: "K",
  role: "Web Developer",
  headline: "Membangun web yang cepat, aksesibel, dan berkarakter.",
  tagline:
    "Saya merancang dan membangun antarmuka digital yang rapi, responsif, dan nyaman digunakan — dari ide, prototipe, sampai produksi.",
  bio: [
    "Saya adalah web developer yang berfokus pada ekosistem React dan Next.js. Saya senang mengubah masalah yang rumit menjadi antarmuka sederhana yang terasa natural bagi pengguna.",
    "Selain menulis kode, saya juga menikmati eksplorasi desain antarmuka, aksesibilitas, dan performa web. Saya percaya detail kecil — seperti transisi, kontras warna, dan kecepatan muat — adalah bagian penting dari sebuah produk.",
  ],
  location: "Indonesia",
  email: "hello@example.com",
  phone: "+62 812-3456-7890",
  phoneHref: "+6281234567890",
  availability: "Terbuka untuk freelance & kolaborasi",
  responseTime: "Biasanya membalas dalam 24 jam",
  yearsOfExperience: 3,
  siteName: "Kaffah — Portfolio",
  socials: [
    { label: "GitHub", href: "https://github.com", icon: "github" },
    { label: "LinkedIn", href: "https://www.linkedin.com", icon: "linkedin" },
    { label: "Instagram", href: "https://www.instagram.com", icon: "instagram" },
    { label: "Email", href: "mailto:hello@example.com", icon: "mail" },
  ] satisfies SocialLink[],
} as const;

export type Profile = typeof profile;
