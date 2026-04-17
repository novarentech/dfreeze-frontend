# Astro Template 🚀

![Astro](https://img.shields.io/badge/Astro-0C0E2B?style=for-the-badge&logo=Astro&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Shadcn UI](https://img.shields.io/badge/Shadcn%20UI-000000?style=for-the-badge&logo=shadcnui&logoColor=white)
![TailwindCSS v4](https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)

An *Enterprise-grade* architecture template based on **Astro SSR (Server-Side Rendering)** developed specifically to handle production scale (Production-Ready). This template wraps a robust *Environment Requirement* validation layer, strong *Endpoint* security system, and Search Engine Optimization (SEO) metrics that exceed standard web engineering frameworks.

Highly recommended for you to *clone* as the foundational base for your next corporate project or high-level portfolio.

---

## ✨ Features & Architectural Advantages

### 🛡️ 1. Extreme Security & Validation Layer
Security is always a vulnerable point in frontend applications hitting public APIs. This repository has addressed it:
- **Type-Safe Environment Variables**: Using `Zod` in `src/config/env.server.ts`. Astro will intentionally crash (*Fail-Fast*) during the build if the `.env` configuration is incomplete or the API URL is malformed. This will save your project from secret data leaks due to misconfiguration in *production*.
- **Endpoint Payload Validator**: Form integrations (like Booking) are secured at the API level (`src/pages/api/`). Hacker scripts (*Malicious JSON*) will automatically be rejected (*Bad Request 400*) if the input JSON format type does not match the Static schema `z.object({...})`.
- **In-Memory Rate Limiter**: Public APIs are protected by *IP Rate Limiting* logic (e.g., *Max 3 requests / 60 seconds*). This prevents your backend Strapi database from crashing due to being blasted by thousands of bot DDoS attacks from forms on the frontend.

### 📈 2. Advanced Technical SEO
- **Dynamic Real-time XML Sitemap (`sitemap.xml.ts`)**: No more static sitemap packages. The Server-based (SSR) rendered sitemap maps all dynamic routes (e.g., `[slug].astro`) that directly hit the CMS API in *real-time*! Simply publish an article on the Backend, and the Astro Sitemap gets updated automatically when extracted by Google Bot!
- **Enterprise JSON-LD**: A Google Standard formatted `<script type="application/ld+json">` is injected dynamically on every page via the `<SEO />` component props. Google truly recognizes the `LocalBusiness` entity on the Homepage and `Article/NewsArticle` entities on the blog.
- **Open Graph & Canonical Defense**: Ensures *Duplicate Content Penalty* does not occur through built-in `<link rel="canonical">` synchronization if the URL is ambiguously accessed via spam parameters.
- **Zero-Latency Analytics (Partytown)**: The heavy Google Analytics 4 (GA4) script is safely executed within the built-in *Web Worker* domain (`@astrojs/partytown`), keeping the main-thread 100% fast and unblocked, complete with an automatic interaction blocker sensor when the website is opened in a local *development* host (`isProd`).

### ⚡ 3. Clean UI & Component Architecture
- **Island Architecture**: Main concept: Passive pages (Articles, Landing Pages) are consumed extremely fast as plain static HTML, while smart, stateful, and reactive functionalities (like `BookingModal.tsx`) use React DOM modules (`client:load`).
- **Tailwind v4 & Shadcn UI**: Supports the aesthetic composition of the interface with high efficiency, complete with Radix UI Primitive interactivity capabilities.
- **Absolute Path Aliases (`@/*`)**: Supports module resolution via `tsconfig.json` paths so that the application reference tree is not cluttered with complex imports like `../../../../lib`.

### 🐳 4. DevOps-Ready Infrastructure
- **Non-Root Docker Execution**: The `Dockerfile` configuration is not executed with standard OS *root* accounts. Instead, commands are delegated to the `USER app` escalation, providing extreme-level perimeter isolation in case the web is somehow compromised. (Astro is placed in a `node standalone` env).
- **GitHub Workflow CI/CD (`deploy.yml`)**: An integration pipeline cycle process that supports injecting *GitHub Secrets* directly into a temporary `.env` before being *built* by the container.

---

## 📂 Directory Tree Structure

A neat and *scalable* structural approach:

```text
📦 project-root
├── 📂 public/                   # Assets served directly by web workers (robots.txt, /img)
├── 📂 src/
│   ├── 📂 components/           # Reusable UI Components (Shadcn, <SEO/>, and .tsx)
│   ├── 📂 config/               # Single-Source of Truth for Environment Variables & Zod Setup
│   ├── 📂 layouts/              # Main Layout Templates (along with global SEO Injector <head>)
│   ├── 📂 lib/                  # Third-party module libraries, Strapi API fetchers, and Caching
│   ├── 📂 pages/                # File Based Route (Astro Endpoint .ts & Page Sequences .astro)
│   ├── 📂 styles/               # Global CSS & Tailwind configs
│   └── 📂 types/                # Centralization of TypeScript Type System (Content Data Interfaces)
├── 📄 .env.example              # Configuration template reference for new dev teams
├── 📄 Dockerfile                # Container Image Blueprint (Alpine Base)
├── 📄 astro.config.mjs          # Astro configuration for Node Server target (Standalone)
├── 📄 components.json           # Shadcn CLI Registry
└── 📄 tsconfig.json             # Engine Pathing Typescript Setup (*Alias resolution*)
```

---

## 🛠️ Installation Guide & Advanced Development (Getting Started)

### Prerequisites
- [Node.js](https://nodejs.org/) v20+ or higher
- [Docker](https://www.docker.com/) Installed (If testing local server replicas)

### Initial Steps
1. **Clone this repository** as a skeleton/template for new projects.
2. Prepare the environment configuration file. This project will refuse to work *(Crash/Error)* if mandatory Env variables are not filled.
   ```bash
   cp .env.example .env
   ```
3. Open the `.env` file and provide accurate *Backend API Path* configurations. (E.g., `API_BACKEND_URL`).
4. Install all package modules:
   ```bash
   npm install
   ```
5. Installation of Additional Components (Optional):
   This application is prepared with the Shadcn UI _registry_. If you want to design new forms or dialogs, use its execution command:
   ```bash
   npx shadcn@latest add <component-name>
   ```
6. Start the local Astro Server:
   ```bash
   npm run dev
   ```

### Template Migration Flow (When Reusing for Other Projects)
To avoid setup errors in a new client's project environment, always follow these 3 Overhaul Pillars:
1. **Modify Types**: Restructure the `Article` Payload interface in `src/types/*.ts` adapting to the new client's Headless CMS JSON response.
2. **Change JSON-LD Business Information**: Visit `src/pages/index.astro`, then replace the "LocalBusiness" company name, "Telephone", and "Address" in the JSON-LD Schema block.
3. **Environment Rule Registration**: If the new CMS requires a different token (Example: `BEARER_TOKEN`), promptly declare it inside the `src/config/env.server.ts` file as a `z.string()` type instruction sequence.

---

## 🚀 Deployment Strategy

### Local Standalone Node.js (Production Build Tester)
If you want to experience the real performance before putting it into a container:
```bash
npm run build
# This will create /dist/server/ and /dist/client/ folders
# Run the built local host with:
node dist/server/entry.mjs
```

### via VPS / Docker Container
The configured application is highly compatible with Linux servers (*Dockerized*):
```bash
docker build -t astro-enterprise-app .
docker run -d -p 4321:4321 \
  -e PUBLIC_SITE_URL=https://new-domain-name.com \
  -e API_BACKEND_URL=https://target-cms.com \
  --name web_frontend astro-enterprise-app
```
*(It is recommended to place an Nginx Reverse Proxy in front of that `4321` Port while attaching an SSL certificate)*.

---
_Developed with maximum effectiveness. Feel free to use it as the foundational reference in every SSR project of your dreams._ ✨
