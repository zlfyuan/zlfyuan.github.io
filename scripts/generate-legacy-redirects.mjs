#!/usr/bin/env node
/**
 * generate-legacy-redirects.mjs — write static HTML redirect files for the
 * old Hexo URL pattern so external links continue to work.
 *
 * For each post in `src/content/blog/zh-cn/`, generate:
 *   public/<old-path>/index.html  →  <meta http-equiv="refresh"> to /zh-CN/...
 *
 * Run AFTER `astro build` so we don't conflict with the live blog routes.
 *
 * Usage:
 *   node scripts/generate-legacy-redirects.mjs
 *   node scripts/generate-legacy-redirects.mjs --content <dir> --out <dir>
 */
import { readdirSync, readFileSync, statSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, resolve, basename } from 'node:path';

const args = process.argv.slice(2);
function arg(name, fallback) {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : fallback;
}

const CONTENT = resolve(arg('--content', 'src/content/blog'));
const OUT = resolve(arg('--out', 'dist'));

function* walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) yield* walk(full);
    else if (entry.endsWith('.md')) yield full;
  }
}

function readFrontmatter(content) {
  const m = content.match(/^---\n([\s\S]*?)\n---\n/);
  return m ? m[1] : '';
}

function field(fm, key) {
  const re = new RegExp(`^${key}:\\s*(.+)$`, 'm');
  const m = fm.match(re);
  if (!m) return null;
  return m[1].trim().replace(/^["']|["']$/g, '');
}

let count = 0;
for (const file of walk(CONTENT)) {
  const content = readFileSync(file, 'utf-8');
  const fm = readFrontmatter(content);
  if (!fm) continue;
  const dateStr = field(fm, 'date');
  const originalSlug = field(fm, 'originalSlug') ?? basename(file, '.md');
  const lang = field(fm, 'lang') ?? 'zh-CN';
  const draft = field(fm, 'draft') === 'true';
  if (draft) continue;
  if (!dateStr) continue;

  const d = new Date(dateStr);
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');

  // Old site URL (no locale prefix)
  const oldPath = `/${y}/${m}/${day}/${originalSlug}/`;
  // New site URL (with /zh-CN/ prefix)
  const newPath = `/${lang}/blog/${y}/${m}/${day}/${originalSlug}/`;

  const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta http-equiv="refresh" content="0;url=${newPath}">
<link rel="canonical" href="${newPath}">
<meta name="robots" content="noindex">
<title>Redirecting…</title>
<style>body{font-family:system-ui,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;color:#555}a{color:#0070f3}</style>
</head>
<body>
<p>Redirecting to <a href="${newPath}">${newPath}</a>…</p>
<script>window.location.replace('${newPath}');</script>
</body>
</html>
`;

  const outFile = join(OUT, oldPath, 'index.html');
  mkdirSync(join(OUT, oldPath), { recursive: true });
  writeFileSync(outFile, html, 'utf-8');
  count++;
  console.log(`  ✓ ${oldPath} → ${newPath}`);
}

console.log(`\nDone: ${count} legacy redirect files written to ${OUT}`);
