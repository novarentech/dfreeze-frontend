# DFreeze Vet Clinic - High Performance Frontend 🐾

![Astro](https://img.shields.io/badge/Astro-0C0E2B?style=for-the-badge&logo=Astro&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Shadcn UI](https://img.shields.io/badge/Shadcn%20UI-000000?style=for-the-badge&logo=shadcnui&logoColor=white)
![TailwindCSS v4](https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

Official high-performance frontend for **DFreeze Vet Clinic**. Built with **Astro SSR**, this application is engineered for maximum speed, security, and enterprise-grade SEO.

---

## ✨ Cutting-Edge Features

### 📈 1. Enterprise-Grade SEO
Developed with a "Search-First" mindset to ensure maximum visibility on Google:
- **Dynamic SSR Sitemap**: A real-time `sitemap.xml` that automatically maps dynamic article slugs directly from the Strapi CMS.
- **Advanced Structured Data (JSON-LD)**: 
    - `LocalBusiness` for the homepage.
    - `Article` & `BreadcrumbList` for blog posts.
    - `FAQPage` for the Q&A section to gain rich snippets in Search Results.
- **Social Media Optimization**: Enhanced Open Graph (OG) tags specifically tailored for **WhatsApp**, Facebook, and Twitter previews, including optimized image dimensions (1200x630).
- **Performance-Focused Analytics**: Google Analytics 4 (GA4) executed via **Partytown** in a web worker to preserve the main thread performance.

### 🛡️ 2. Security Hardening
Robust protection for a public-facing application:
- **Security Headers Middleware**: Automated injection of `Content-Security-Policy` (CSP), `X-Frame-Options` (SAMEORIGIN), and `X-Content-Type-Options` via Astro middleware.
- **Server-Side Validation**: Zod-powered environment variable validation to prevent misconfiguration in production.
- **Endpoint Protection**: rate-limiting and JSON payload validation for API forms (Bookings/Questions).

### ⚡ 3. Premium UI/UX
- **Island Architecture**: Zero-JS by default, only hydrating interactive components like the `BookingModal`, `QAContainer`, and `FloatingEmergencyButton`.
- **Modern Tech Stack**: Radix UI Primitives, Lucide Icons, and Framer Motion for smooth, premium micro-animations.
- **Responsive Design**: Mobile-first approach using the latest Tailwind CSS v4 features.

---

## 📂 Project Structure

```text
📦 dfreeze-frontend
├── 📂 public/               # Static assets & Metadata (Robots.txt, Favicons, Manifest)
├── 📂 src/
│   ├── 📂 assets/           # Icons, Images, and Global Styles
│   ├── 📂 components/       # UI Components (Sections, SEO, Layout)
│   ├── 📂 config/           # Environment and Server configurations
│   ├── 📂 layouts/          # Main Astro layouts
│   ├── 📂 lib/              # API Fetchers (Strapi) and Utilities
│   ├── 📂 pages/            # SSR Routes and API Endpoints
│   ├── 📂 types/            # Centralized TypeScript types
│   └── 📄 middleware.ts     # Security Headers & Global Middlewares
├── 📄 astro.config.mjs      # Astro configuration (Node SSR)
└── 📄 Dockerfile            # Production-ready Docker container
```

---

## 🛠️ Getting Started

### Prerequisites
- **Node.js**: v22+
- **Strapi CMS**: Configured and reachable.

### Initial Setup
1. **Clone & Install**:
   ```bash
   npm install
   ```
2. **Environment Variables**:
   ```bash
   cp .env.example .env
   ```
   Fill in your `API_BACKEND_URL` and `API_SECRET_KEY`.

3. **Development Mode**:
   ```bash
   npm run dev
   ```

4. **Production Build**:
   ```bash
   npm run build
   node dist/server/entry.mjs
   ```

---

## 🚀 Post-Deployment SEO Checklist
To ensure the SEO logic performs as expected, remember to:
1. Register the domain on **Google Search Console**.
2. Submit the sitemap: `https://yourdomain.com/sitemap.xml`.
3. Verify the **FAQ Rich Results** using the Google Rich Results Test tool.
4. Optimize the `og-image.jpg` in the `public/` folder for general site sharing.

---
_Developed with ❤️ by the Novaren Tech Team._
