/**
 * robots.txt — allow all crawlers, point to sitemap
 */
import type { APIContext } from 'astro';
import { site } from '~/data/site';

export function GET(context: APIContext) {
  const sitemap = new URL('/sitemap-index.xml', context.site ?? site.url).toString();
  return new Response(
    `User-agent: *\nAllow: /\n\nSitemap: ${sitemap}\n`,
    { headers: { 'Content-Type': 'text/plain' } }
  );
}
