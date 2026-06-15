/**
 * RSS feed — default locale (zh-CN)
 */
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { site } from '~/data/site';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = (await getCollection('blog', ({ data }) => data.lang === 'zh-CN' && !data.draft))
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

  return rss({
    title: site.title,
    description: site.description,
    site: context.site ?? site.url,
    items: posts.map((post) => {
      const d = post.data.date;
      const ymd = `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`;
      const slug = post.data.originalSlug ?? post.id;
      return {
        title: post.data.title,
        pubDate: post.data.date,
        description: post.data.description ?? '',
        link: `/zh-CN/blog/${ymd}/${slug}/`,
        categories: post.data.tags,
      };
    }),
    customData: `<language>zh-CN</language>`,
  });
}
