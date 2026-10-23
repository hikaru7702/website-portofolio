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
  - React Hook Form + Zod untuk validasi,
  - membuka draft email berisi nama, email, subjek, anggaran, dan pesan,
  - fallback tautan email langsung,
  - cocok untuk hosting statis seperti GitHub Pages.
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
    schemas/contact.ts        # skema Zod form
    site.ts                   # site URL, base path, helper aset
    utils/                    # cn, date
    events.ts                 # cross-filter event
public/
  sw.js                       # service worker
  .nojekyll                   # agar aset _next disajikan GitHub Pages
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

Salin `.env.example` menjadi `.env.local` untuk pengembangan lokal:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Untuk build GitHub Pages:

```env
NEXT_PUBLIC_SITE_URL=https://hikaru7702.github.io/website-portofolio
NEXT_PUBLIC_BASE_PATH=/website-portofolio
```

- `NEXT_PUBLIC_SITE_URL` dipakai untuk metadata, sitemap, robots, dan JSON-LD.
- `NEXT_PUBLIC_BASE_PATH` harus sama dengan nama repo saat deploy ke project
  pages (`/<nama-repo>`).

## Catatan keamanan

- Form kontak tidak mengirim data ke server; browser membuka aplikasi email
  pengguna melalui `mailto:`.
- Tidak ada API backend, rate limit, atau penyimpanan pesan di situs statis.
- Header keamanan `next.config.js` hanya berlaku saat aplikasi dijalankan dengan
  server Next.js; GitHub Pages memakai header dari GitHub.
- Jangan commit token deployment ke repository.

## Verifikasi

```bash
npm run typecheck
npm run lint
npm run build
```

## Deployment

### GitHub Pages

Situs production: **https://hikaru7702.github.io/website-portofolio/**

Build statis:

```powershell
$env:GITHUB_PAGES="true"
$env:NEXT_PUBLIC_BASE_PATH="/website-portofolio"
$env:NEXT_PUBLIC_SITE_URL="https://hikaru7702.github.io/website-portofolio"
npm run build
```

Hasil build ada di `out/`. Folder tersebut di-push ke branch `gh-pages`, lalu
GitHub Pages disetel ke branch tersebut. File `public/.nojekyll` memastikan aset
`_next` tidak diabaikan Jekyll.

Untuk deploy ulang, ulangi build dengan environment di atas lalu push isi `out/`
ke branch `gh-pages`.

### Server Next.js

`npm run build && npm start` tetap bisa dipakai untuk hosting Node/container.
Form kontak tetap memakai `mailto:` karena route API sudah dihapus agar build
statis kompatibel dengan GitHub Pages.

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
