# Portfolio PWA

Portofolio interaktif single-page yang dibangun dengan **Next.js 15 App Router**, **TypeScript**, **Tailwind CSS**, dan **PWA**. Proyek ini merupakan implementasi dari blueprint `Personal Interactive Portfolio (PWA)`.

> Identitas, email, tautan sosial, dan data proyek di repo ini masih berupa contoh. Ganti melalui `src/lib/data/` sebelum dipublikasikan.

## Fitur

- **Hero interaktif** dengan status ketersediaan, statistik, tech stack, dan kartu profil.
- **Showcase proyek** dengan:
  - filter kategori multi-select,
  - pencarian dengan debounce 200 ms,
  - sorting (terbaru, terlama, judul),
  - sinkronisasi filter ke URL (shareable),
  - empty state + reset filter,
  - modal detail yang aksesibel (focus trap, Escape, klik backdrop, scroll lock),
  - halaman detail proyek dengan SSG dan metadata sendiri.
- **Skills**:
  - radar chart SVG custom yang responsif,
  - progress bar dengan atribut ARIA,
  - cross-filter ke showcase (klik skill → filter karya),
  - tabel alternatif untuk pembaca layar.
- **Experience timeline**:
  - filter Semua / Pekerjaan / Pendidikan,
  - layout zig-zag desktop dan single-column mobile,
  - elemen `<time>` semantik,
  - animasi reveal yang menghormati `prefers-reduced-motion`.
- **Form kontak**:
  - React Hook Form + Zod (validasi klien dan server),
  - honeypot, rate limit 5 pesan/jam, deteksi pengisian terlalu cepat,
  - status sukses dengan nomor tiket dan fallback email,
  - integrasi email Resend opsional.
- **PWA**:
  - manifest lengkap + ikon 192/512/maskable/apple,
  - service worker dengan strategi cache per jenis aset,
  - halaman offline,
  - prompt install kustom (muncul setelah 12 detik; penolakan diingat 7 hari),
  - notifikasi versi baru dan banner status offline.
- **Tema**:
  - dark/light mode dengan CSS variables,
  - anti-FOUC script,
  - menghormati `prefers-color-scheme`,
  - toggle tersimpan di `localStorage`.
- **Aksesibilitas & SEO**:
  - skip link, landmark, label form, `aria-live`, focus ring,
  - metadata, Open Graph, Twitter Card, JSON-LD Person/CreativeWork,
  - sitemap, robots, canonical URL,
  - halaman 404 dan offline.
- **Halaman CV** siap cetak (`/cv`) dengan tombol Cetak / Simpan PDF.

## Menjalankan proyek

```bash
npm install
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

Build produksi:

```bash
npm run build
npm start
```

Hentikan `npm run dev` sebelum build agar isi `.next` tidak tertimpa oleh dev
server. Jika ingin tetap menjalankan dev server sambil menguji build produksi,
gunakan direktori build terpisah:

```powershell
$env:NEXT_DIST_DIR=".next-prod"
npm run build
npm start
```

Service worker hanya didaftarkan pada build produksi. Untuk menguji PWA:

```bash
npm run build
npm start
```

Lalu buka DevTools → Application → Service Workers / Manifest.

## Struktur proyek

```text
src/
  app/
    page.tsx                  # komposisi halaman utama (server component)
    layout.tsx                # metadata, font, theme script, provider
    works/[slug]/page.tsx     # detail proyek (SSG)
    cv/page.tsx               # CV siap cetak
    offline/page.tsx          # fallback offline
    api/contact/route.ts      # BFF form kontak
    api/cv/route.ts           # redirect ke /cv
    manifest.ts, robots.ts, sitemap.ts, icon.svg, favicon.ico
  components/
    layout/                   # Navigation, Footer
    sections/                 # Hero, Showcase, Skills, Experience, Contact
    projects/                 # ProjectCard, ProjectModal
    skills/                   # RadarChart, Timeline
    theme/                    # ThemeProvider, ThemeToggle
    pwa/                      # Service worker + install prompt
    ui/                       # Button, Badge, SectionHeading, SocialLinks
  lib/
    data/                     # profile, projects, skills, experiences
    schemas/contact.ts        # skema Zod bersama
    utils/                    # cn, date
    events.ts                 # cross-filter event
public/
  sw.js                       # service worker
  icons/                      # ikon PWA
  images/projects/            # cover proyek (aset lokal)
  og-image.png
scripts/
  generate-icons.ps1          # generator ikon, favicon, + OG image
  generate-covers.ps1         # generator cover proyek
```

## Personalisasi

Semua konten utama dipisahkan dari UI:

1. **Identitas** → `src/lib/data/profile.ts`
   Ganti nama, email, telepon, lokasi, sosial media, dan statistik.
2. **Proyek** → `src/lib/data/projects.ts`
   Setiap proyek memiliki `title`, `slug`, `category`, `tags`, `cover`,
   `summary`, `body`, `highlights`, `role`, `duration`, `year`, dan `featured`.
   Cover default memakai aset lokal di `public/images/projects/`.
3. **Skills** → `src/lib/data/skills.ts`
4. **Pengalaman** → `src/lib/data/experiences.ts`
5. **Warna & tema** → variabel CSS di `src/app/globals.css`.
6. **Ikon, favicon & OG image** → jalankan ulang:
   ```powershell
   powershell -ExecutionPolicy Bypass -File scripts\generate-icons.ps1
   ```
   atau ganti file di `public/icons/`, `src/app/favicon.ico`, dan
   `public/og-image.png`.
7. **Cover proyek** → ganti file di `public/images/projects/` atau jalankan:
   ```powershell
   powershell -ExecutionPolicy Bypass -File scripts\generate-covers.ps1
   ```

## Environment variables

Salin `.env.example` menjadi `.env.local`:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
RESEND_API_KEY=
CONTACT_TO_EMAIL=hello@example.com
CONTACT_FROM_EMAIL=Portfolio <onboarding@resend.dev>
```

- `NEXT_PUBLIC_SITE_URL` dipakai untuk metadata, sitemap, dan robots.
- Email notifikasi bersifat opsional. Tanpa `RESEND_API_KEY`, pesan tetap
  divalidasi dan dicatat di log server, lalu form mengembalikan nomor tiket.

## Catatan keamanan

- Validasi Zod dilakukan di klien **dan** server.
- Rate limit in-memory (5 pesan/jam/IP) cocok untuk single instance. Untuk
  deployment multi-instance, gunakan Redis/Upstash.
- IP di-hash sebelum dicatat.
- Honeypot dan minimum fill time membantu mengurangi spam.
- Tambahkan Turnstile/reCAPTCHA jika form mulai menerima spam dalam jumlah besar.
- Header keamanan dasar sudah diatur di `next.config.js` (nosniff, frame,
  referrer, permissions policy).

## Verifikasi

```bash
npm run typecheck
npm run lint
npm run build
```

## Deployment

Proyek kompatibel dengan Vercel/Netlify. Langkah singkat:

1. Set `NEXT_PUBLIC_SITE_URL` ke domain produksi.
2. (Opsional) set kredensial Resend.
3. Deploy, lalu uji manifest, service worker, dan form kontak.
4. Pastikan `sitemap.xml` dan `robots.txt` dapat diakses.

## Scripts

| Perintah | Fungsi |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Build produksi |
| `npm start` | Menjalankan build produksi |
| `npm run lint` | ESLint |
| `npm run typecheck` | Pemeriksaan TypeScript |

Generator aset (PowerShell, Windows):

| Perintah | Fungsi |
| --- | --- |
| `powershell -File scripts\generate-icons.ps1` | Ikon PWA, favicon, OG image |
| `powershell -File scripts\generate-covers.ps1` | Cover proyek lokal |

---

Dibangun dengan Next.js, Tailwind CSS, dan sedikit perhatian pada detail.
