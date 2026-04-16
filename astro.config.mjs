// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import "dotenv/config";

// https://astro.build/config
export default defineConfig({
  site: process.env.PUBLIC_SITE_URL',
  output: 'server',

  adapter: node({
    mode: 'standalone',
  }),

  integrations: [react(), sitemap()],

  vite: {
    plugins: [tailwindcss()],
  },
});