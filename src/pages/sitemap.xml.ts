import type { APIRoute } from 'astro';
import { getArticles } from '../lib/api/articles';
import type { Article } from '../types/article';

export const GET: APIRoute = async ({ site }) => {
  const articles: Article[] = await getArticles();
  
  // Ambil URL utama dari asto.config.mjs
  const siteUrl = site ? new URL(site).origin : 'https://dfreeze.novarentech.com';

  const defaultPages = [
    '', // Beranda
    '/artikel' // Daftar Artikel
  ];

  const urlElements = defaultPages.map((page) => {
    return `
  <url>
    <loc>${siteUrl}${page}</loc>
    <changefreq>daily</changefreq>
    <priority>${page === '' ? '1.0' : '0.8'}</priority>
  </url>`;
  });

  const articleElements = articles.map((article) => {
    // Gunakan updatedAt, fallback ke publishedAt atau createdAt
    const date = article.updatedAt || article.publishedAt || article.createdAt;
    
    return `
  <url>
    <loc>${siteUrl}/artikel/${article.documentId}</loc>
    <lastmod>${new Date(date).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`;
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urlElements.join('')}
${articleElements.join('')}
</urlset>`;

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
    }
  });
};
