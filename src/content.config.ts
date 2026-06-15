/**
 * Content Collections — blog, projects, pages
 *
 * File layout:
 *   src/content/blog/zh-cn/<slug>.md
 *   src/content/blog/en/<slug>.md       (future)
 *   src/content/projects/<slug>.md
 *   src/content/pages/{about,guestbook}.md
 */
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const LOCALES = ['zh-CN', 'en'] as const;

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      date: z.coerce.date(),
      lang: z.enum(LOCALES).default('zh-CN'),
      description: z.string().optional(),
      tags: z.array(z.string()).default([]),
      // originalSlug preserves the Chinese slug from the old Hexo URL so we can
      // keep compatibility (e.g. /2020/03/09/swift面试题/).
      originalSlug: z.string().optional(),
      // cover image (relative to blog post file, optional)
      cover: image().optional(),
      draft: z.boolean().default(false),
      updated: z.coerce.date().optional(),
    }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    lang: z.enum(LOCALES).default('zh-CN'),
    tech: z.array(z.string()).default([]),
    repo: z.string().url().optional(),
    demo: z.string().url().optional(),
    featured: z.boolean().default(false),
    order: z.number().default(0),
  }),
});

const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    lang: z.enum(LOCALES).default('zh-CN'),
    updated: z.coerce.date().optional(),
  }),
});

export const collections = { blog, projects, pages };
