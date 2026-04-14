/// <reference types="astro/client" />

declare namespace NodeJS {
  interface ProcessEnv {
    API_BACKEND_URL: string;
    API_SECRET_KEY: string;
  }
}
