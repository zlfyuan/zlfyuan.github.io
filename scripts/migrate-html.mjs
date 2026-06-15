#!/usr/bin/env node
/**
 * migrate-html.mjs — Convert Hexo maupassant-rendered HTML to Astro markdown
 *
 * Usage:
 *   node scripts/migrate-html.mjs
 *   node scripts/migrate-html.mjs --src <legacy-dir> --out <content-dir>
 *
 * Default:
 *   --src  /tmp/legacy-articles
 *   --out  src/content/blog/zh-cn
 *
 * What it does:
 *   1. Walks <src>/<YYYY>/<MM>/<DD>/<slug>/index.html
 *   2. Extracts <h1 class="post-title"> and <div class="post-meta">
 *   3. Extracts <div class="post-content"> and runs Turndown
 *   4. Applies maupassant-specific rules
 *   5. Writes <out>/<slug>.md with frontmatter
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, basename, resolve } from 'node:path';
import TurndownService from 'turndown';

const args = process.argv.slice(2);
function arg(name, fallback) {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : fallback;
}

const SRC = resolve(arg('--src', '/tmp/legacy-articles'));
const OUT = resolve(arg('--out', 'src/content/blog/zh-cn'));

// ----- Article registry -----
// Map: legacy slug → { tags, date, order }
const ARTICLES = {
  'swift面试题':                              { tags: ['swift', 'ios', 'interview'], order: 1 },
  '常用Git 命令 清单速查':                     { tags: ['git', 'cheatsheet'], order: 2 },
  'Ubuntu + Django + Uwsgi + Nginx 线上部署': { tags: ['ubuntu', 'django', 'nginx', 'deploy'], order: 3 },
  '使用iTerm2终端打开iOS,Mac项目':            { tags: ['iterm2', 'xcode', 'ios', 'mac'], order: 4 },
  '一些杂乱的OC面试题':                         { tags: ['objective-c', 'ios', 'interview'], order: 5 },
  'iOS Android 打包分发插件 fastlane-plugin-notifyworker 适用于企业微信，钉钉': {
    tags: ['fastlane', 'ios', 'android', 'ci'], order: 6,
  },
  'Certbot 配置泛域名':                         { tags: ['certbot', 'https', 'linux'], order: 7 },
  'qaql':                                       { tags: ['privacy', 'agreement'], order: 8 },
};

// ----- Turndown instance -----
const turndown = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  bulletListMarker: '-',
  emDelimiter: '*',
  strongDelimiter: '**',
  linkStyle: 'inlined',
  linkReferenceStyle: 'full',
});

// 1. Preserve external images
turndown.addRule('externalImage', {
  filter: (node) =>
    node.nodeName === 'IMG' && /^https?:\/\//.test(node.getAttribute('src') || ''),
  replacement: (_content, node) => {
    const src = node.getAttribute('src') || '';
    const alt = node.getAttribute('alt') || '';
    return `\n\n![${alt}](${src})\n\n`;
  },
});

// 2. fancybox link wrapping image → unwrap to plain image
turndown.addRule('fancyboxLink', {
  filter: (node) => node.nodeName === 'A' && node.getAttribute('data-fancybox') !== null,
  replacement: (_content, node) => {
    const img = node.querySelector('img');
    if (!img) return '';
    const src = node.getAttribute('data-original') || node.getAttribute('href') || img.getAttribute('src') || '';
    const alt = img.getAttribute('alt') || '';
    return `\n\n![${alt}](${src})\n\n`;
  },
});

// 3. maupassant highlight figure → fenced code block (strip gutter, preserve <br> as newlines)
turndown.addRule('highlightFigure', {
  filter: (node) => node.nodeName === 'FIGURE' && (node.classList?.contains('highlight') || false),
  replacement: (_content, node) => {
    const codeTd = node.querySelector('td.code');
    const figcaption = node.querySelector('figcaption');
    const langClass = Array.from(node.classList || []).find((c) => c !== 'highlight') || '';
    const lang = langClass || '';
    // textContent collapses <br>, so serialize <pre> innerHTML first then translate <br> → \n
    let code = '';
    if (codeTd) {
      const pre = codeTd.querySelector('pre');
      code = pre ? pre.innerHTML : codeTd.innerHTML;
    } else if (figcaption) {
      code = figcaption.innerHTML;
    }
    // <br> → newline, then strip all other tags
    code = code
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<[^>]+>/g, '')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&#x?\w+;/g, '')
      .replace(/^\n+|\n+$/g, '');
    return `\n\n\`\`\`${lang}\n${code}\n\`\`\`\n\n`;
  },
});

// 4. Drop junk footer links (mailto, copyright, "侵权即删" with bare email)
turndown.addRule('dropJunk', {
  filter: (node) => {
    if (node.nodeName !== 'A') return false;
    const href = node.getAttribute('href') || '';
    const text = node.textContent || '';
    if (/^mailto:/.test(href)) return true;
    if (/^[\d]+@[\w.]+/.test(href)) return true; // bare email
    if (text.match(/侵权|联系/)) return true;
    return false;
  },
  replacement: () => '',
});

// 5. Inline code: ensure backticks
turndown.addRule('inlineCode', {
  filter: (node) =>
    node.nodeName === 'CODE' &&
    node.parentNode?.nodeName !== 'PRE' &&
    !node.closest('figure'),
  replacement: (content) => `\`${content}\``,
});

// 6. Preserve br tags as line breaks
turndown.addRule('lineBreak', {
  filter: 'br',
  replacement: () => '  \n',
});

// 7. Rewrite internal blog links to new URL structure
//    /2020/06/16/常用Git%20.../  →  /zh-CN/blog/2020/06/16/常用Git%20.../
turndown.addRule('rewriteInternalLink', {
  filter: (node) => {
    if (node.nodeName !== 'A') return false;
    const href = node.getAttribute('href') || '';
    return /^\/\d{4}\/\d{2}\/\d{2}\//.test(href);
  },
  replacement: (content, node) => {
    const href = node.getAttribute('href') || '';
    const rewritten = `/zh-CN/blog${href}`.replace(/\/+$/, '/');
    return `[${content}](${rewritten})`;
  },
});

// ----- Helpers -----
function findHtmlFiles(dir) {
  const out = [];
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) out.push(...findHtmlFiles(full));
    else if (entry === 'index.html') out.push(full);
  }
  return out;
}

function htmlToMarkdown(html) {
  // Strip <head>...</head>
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  const bodyHtml = bodyMatch ? bodyMatch[1] : html;
  return turndown.turndown(bodyHtml);
}

function extractTitle(html) {
  const m = html.match(/<h1[^>]*class="[^"]*post-title[^"]*"[^>]*>([\s\S]*?)<\/h1>/);
  if (m) return m[1].replace(/<[^>]+>/g, '').trim();
  // Fallback to <title>
  const t = html.match(/<title>([^<]+)<\/title>/);
  if (t) return t[1].split(' | ')[0].trim();
  return 'Untitled';
}

function extractDate(html) {
  // maupassant puts the date in <div class="post-meta">2020-03-09</div>
  const m = html.match(/<div[^>]*class="[^"]*post-meta[^"]*"[^>]*>([\s\S]*?)<\/div>/);
  if (m) {
    const d = m[1].replace(/<[^>]+>/g, '').trim();
    if (/^\d{4}-\d{2}-\d{2}/.test(d)) return d.slice(0, 10);
  }
  return null;
}

function extractContent(html) {
  // post-content div holds the article body
  const m = html.match(/<div[^>]*class="[^"]*post-content[^"]*"[^>]*>([\s\S]*?)<\/div>\s*<\/div>/);
  if (m) return m[1];
  // Fallback: find the largest <article>...</article>
  const a = html.match(/<article[^>]*>([\s\S]*?)<\/article>/);
  if (a) return a[1];
  return '';
}

function dateFromPath(filePath) {
  // e.g. /tmp/legacy-articles/2020/03/09/swift面试题/index.html
  const m = filePath.match(/(\d{4})\/(\d{2})\/(\d{2})\//);
  if (m) return `${m[1]}-${m[2]}-${m[3]}`;
  return null;
}

function slugFromPath(filePath) {
  // dirname is the slug, e.g. .../swift面试题/index.html
  return basename(dirname(filePath));
}

function buildFrontmatter({ title, date, lang, tags, originalSlug, draft = false, order = 0 }) {
  return [
    '---',
    `title: ${JSON.stringify(title)}`,
    `date: ${date}`,
    `lang: ${lang}`,
    `originalSlug: ${JSON.stringify(originalSlug)}`,
    `tags: [${tags.map((t) => JSON.stringify(t)).join(', ')}]`,
    `order: ${order}`,
    `draft: ${draft}`,
    '---',
    '',
  ].join('\n');
}

// ----- Main -----
const htmlFiles = findHtmlFiles(SRC);
console.log(`Found ${htmlFiles.length} HTML files in ${SRC}`);

if (!existsSync(OUT)) mkdirSync(OUT, { recursive: true });

let converted = 0;
for (const file of htmlFiles) {
  const slug = slugFromPath(file);
  const meta = ARTICLES[slug] || { tags: [], order: 99 };
  const html = readFileSync(file, 'utf-8');

  const title = extractTitle(html);
  const date = extractDate(html) || dateFromPath(file);
  const bodyHtml = extractContent(html);
  const body = htmlToMarkdown(bodyHtml);

  const fm = buildFrontmatter({
    title,
    date: date || '2020-01-01',
    lang: 'zh-CN',
    tags: meta.tags,
    originalSlug: slug,
    order: meta.order,
  });

  const md = fm + body.trim() + '\n';
  const outFile = join(OUT, `${slug}.md`);
  writeFileSync(outFile, md, 'utf-8');
  console.log(`  ✓ ${slug}.md (${date || '?'}) [${meta.tags.join(', ')}]`);
  converted++;
}

// Also copy SwiftUI-Mapkit.md (the surviving source)
const draftSrc = join(SRC, 'SwiftUI-Mapkit.md');
if (existsSync(draftSrc)) {
  const dst = join(OUT, 'SwiftUI-Mapkit.md');
  let content = readFileSync(draftSrc, 'utf-8');
  // Inject missing frontmatter fields
  if (!content.startsWith('---')) {
    content = '---\n' + content;
  }
  // Parse frontmatter and add originalSlug/tags/lang/order if missing
  const fmMatch = content.match(/^---\n([\s\S]*?)\n---\n/);
  if (fmMatch) {
    const fm = fmMatch[1];
    const additions = [];
    if (!/^lang:/m.test(fm)) additions.push('lang: zh-CN');
    if (!/^tags:/m.test(fm)) additions.push('tags: [swiftui, ios, mapkit]');
    if (!/^originalSlug:/m.test(fm)) additions.push('originalSlug: SwiftUI-Mapkit');
    if (!/^order:/m.test(fm)) additions.push('order: 9');
    if (!/^draft:/m.test(fm)) additions.push('draft: true');
    const newFm = fm + (additions.length ? '\n' + additions.join('\n') : '');
    content = `---\n${newFm}\n---\n` + content.slice(fmMatch[0].length);
  }
  writeFileSync(dst, content, 'utf-8');
  console.log(`  ✓ SwiftUI-Mapkit.md (draft)`);
  converted++;
}

console.log(`\nDone: ${converted} files written to ${OUT}`);
