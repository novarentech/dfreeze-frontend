/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_API_BACKEND_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare namespace NodeJS {
  interface ProcessEnv {
    PUBLIC_API_BACKEND_URL: string;
    API_SECRET_KEY: string;
  }
}