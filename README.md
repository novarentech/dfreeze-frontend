# Astro Enterprise Template 🚀 (ex-DFreeze Frontend)

![Astro](https://img.shields.io/badge/Astro-0C0E2B?style=for-the-badge&logo=Astro&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Shadcn UI](https://img.shields.io/badge/Shadcn%20UI-000000?style=for-the-badge&logo=shadcnui&logoColor=white)
![TailwindCSS v4](https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)

Template arsitektur kelas *Enterprise* berbasis **Astro SSR (Server-Side Rendering)** yang dikembangkan spesifik untuk menangani skala produksi (Production-Ready). Template ini membungkus lapisan validasi *Environment Requirement*, sistem keamanan *Endpoint* tangguh, dan metrik optimasi Mesin Pencari (SEO) yang telah melampaui kerangka rekayasa web standar. 

Sangat direkomendasikan untuk Anda *clone* menjadi basis pondasi proyek korporat atau portofolio tingkat tinggi selanjutnya.

---

## ✨ Fitur & Keunggulan Arsitektur

### 🛡️ 1. Extreme Security & Validation Layer
Keamanan selalu menjadi celah rawan pada aplikasi frontend yang menembak API publik. Repositori ini telah mengatasinya:
- **Type-Safe Environment Variables**: Menggunakan `Zod` di `src/config/env.server.ts`. Astro akan mogok secara sadar (*Fail-Fast*) sewaktu build jika kofigurasi `.env` tidak lengkap atau URL API cacat. Hal ini akan menyelamatkan proyek dari kebocoran data rahasia karena salah konfigurasi di *production*.
- **Endpoint Payload Validator**: Integrasi Form (seperti Booking) diamankan di level API (`src/pages/api/`). Skrip peretas (*Malicious JSON*) akan otomatis ditolak (*Bad Request 400*) jika format tipe isian JSON tidak sesuai dengan pola Statis `z.object({...})`.
- **In-Memory Rate Limiter**: API Publik dilindungi logika *IP Rate Limiting* (contoh: *Max 3 requests / 60 seconds*). Ini mencegah basis data Strapi backend Anda ambruk karena diledakkan oleh ribuan serangan DDoS bot dari form di frontend.

### 📈 2. Advanced Technical SEO
- **Dynamic Real-time XML Sitemap (`sitemap.xml.ts`)**: Tidak ada paket sitemap statis lagi. Sitemap dirender berbasis Server (SSR) memetakan semua rute dinamis (contoh `[slug].astro`) yang secara *real-time* langsung menembak API CMS! Cukup terbitkan artikel di Backend, dan Sitemap Astro otomatis ter-update saat diekstrak oleh Google Bot!
- **Enterprise JSON-LD**: `<script type="application/ld+json">` yang berformat Google Standard disuntikkan secara dinamis pada tiap halaman melalui props komponen `<SEO />`. Google benar-benar mengenali entitas `LocalBusiness` pada Beranda dan entitas `Article/NewsArticle` pada blog.
- **Open Graph & Canonical Defense**: Memastikan *Penalty Duplicate Content* tidak terjadi melalui sinkronisasi `<link rel="canonical">` bawaan jika URL diakses aneh via parameter spam.

### ⚡ 3. Clean UI & Component Architecture
- **Island Architecture**: Konsep utama: Halaman yang pasif (Artikel, Landing Page) dilahap secara super kilat sebagai HTML statis biasa, sedangkan fungsionalitas cerdas, stateful, dan reaktif (seperti `BookingModal.tsx`) menggunakan modul React DOM (`client:load`).
- **Tailwind v4 & Shadcn UI**: Menunjang penyusunan estetika antarmuka dengan efisiensi tinggi lengkap dengan kapabilitas interaktivitas Radix UI Primitive.
- **Absolute Path Aliases (`@/*`)**: Mendukung resolusi modul via `tsconfig.json` paths agar pohon referensi aplikasi tidak berlumur import rumit seperti `../../../../lib`.

### 🐳 4. Infrastruktur DevOps-Ready
- **Non-Root Docker Execution**: Konfigurasi `Dockerfile` tidak dieksekusi dengan akun OS standar *root*. Sebaliknya, perintah diturunkan ke eskalasi `USER app`, memberi isolasi perimetrik tingkat ekstrim bila seandainya web berhasil dijebol. (Astro ditaruh dalam env `node standalone`).
- **GitHub Workflow CI/CD (`deploy.yml`)**: Proses siklus Pipeline integrasi yang mendukung penyuntikan *GitHub Secrets* langsung menjadi `.env` temporer sebelum di*build* oleh container.

---

## 📂 Pohon Struktur Direktori (Directory Tree)

Pendekatan struktur yang *scalable* dan rapi:

```text
📦 project-root
├── 📂 public/                   # Aset yang langsung di serve web worker (robots.txt, /img)
├── 📂 src/
│   ├── 📂 components/           # Komponen Reusable UI (Shadcn, <SEO/>, dan .tsx)
│   ├── 📂 config/               # Single-Source of Truth untuk Variabel Lingkungan & Zod Setup
│   ├── 📂 layouts/              # Template Tata Letak Utama (berserta global SEO Injector <head>)
│   ├── 📂 lib/                  # Library Modul pihak ketiga, fetchers API Strapi, dan Caching
│   ├── 📂 pages/                # File Based Route (Astro Endpoint .ts & Rangkaian Halaman .astro)
│   ├── 📂 styles/               # Global CSS & Tailwind configs
│   └── 📂 types/                # Sentralisasi Type System TypeScript (Interfaces Data Konten)
├── 📄 .env.example              # Rujukan template konfigurasi untuk tim dev baru
├── 📄 Dockerfile                # Image Container Blueprint (Alpine Base)
├── 📄 astro.config.mjs          # Konfigurasi Astro untuk target Node Server (Standalone)
├── 📄 components.json           # Registry Shadcn CLI
└── 📄 tsconfig.json             # Engine Pathing Typescript Setup (*Alias resolution*)
```

---

## 🛠️ Panduan Instalasi & Pengembangan Lanjut (Getting Started)

### Prasyarat (Prerequisites)
- [Node.js](https://nodejs.org/) v20+ atau yang lebih tinggi
- Instalasi [Docker](https://www.docker.com/) (Jika menguji replika server lokal)

### Langkah Awal
1. **Clone repository ini** sebagai skeleton/template project baru.
2. Siapkan file konfigurasi lingkungan. Proyek ini akan menolak bekerja *(Crash/Error)* jika Env wajib tidak diisi.
   ```bash
   cp .env.example .env
   ```
3. Buka file `.env` dan sediakan konfigurasi *Backend API Path* yang akurat. (Mis: `API_BACKEND_URL`).
4. Install semua modul paket:
   ```bash
   npm install
   ```
5. Pemasangan Komponen Tambahan (Opsional):
   Aplikasi ini dipersiapkan dengan _registry_ Shadcn UI. Jika ingin mendesain form atau dialog yang baru, gunakan perintah eksekusinya:
   ```bash
   npx shadcn@latest add <nama-komponen>
   ```
6. Mulai Server Astro lokal:
   ```bash
   npm run dev
   ```

### Alur Migrasi Template (Saat Reuse untuk Projek Lain)
Demi menghindari kesalahan pada lingkungan klien proyek yang baru, selalu ikuti 3 Pilar Rombakan ini:
1. **Modifikasi Type**: Restrukturisasi interface Payload `Article` pada `src/types/*.ts` menyesuaikan JSON response Headless CMS klien baru.
2. **Ubah Informasi Bisnis JSON-LD**: Kunjungi `src/pages/index.astro`, lalu rombak nama perusahaan "LocalBusiness", "Telephone", dan "Address" pada blok Skema JSON-LD.
3. **Pendaftaran Rule Environment**: Jika CMS baru mewajibkan token berbeda (Contoh: `BEARER_TOKEN`), segera deklarasikan di dalam file `src/config/env.server.ts` sebagai barisan instruksi tipe `z.string()`.

---

## 🚀 Panduan Deployment (Deployment Strategy)

### Standalone Node.js Lokal (Production Build Tester)
Apabila Anda ingin merasakan performa nyata sebelum memasukannya ke kontainer:
```bash
npm run build
# Ini akan membuat folder /dist/server/ dan /dist/client/
# Jalankan host lokal hasil build dengan:
node dist/server/entry.mjs
```

### via VPS / Docker Container
Aplikasi terkonfigurasi sangat kompatibel dengan server Linux (*Dockerized*):
```bash
docker build -t astro-enterprise-app .
docker run -d -p 4321:4321 \
  -e PUBLIC_SITE_URL=https://nama-domain-baru.com \
  -e API_BACKEND_URL=https://target-cms.com \
  --name web_frontend astro-enterprise-app
```
*(Direkomendasikan meletakkan Nginx Reverse Proxy di depan Port `4321` tersebut sambil melampirkan sertifikat SSL)*.

---
_Dikembangkan dengan efektivitas terbaik. Silakan jadikan rujukan dasar di setiap project SSR impian Anda._ ✨
