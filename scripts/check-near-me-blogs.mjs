import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { JSDOM } from 'jsdom';

const base = process.env.BLOG_CHECK_ORIGIN || 'http://localhost:5500';
const seeds = JSON.parse(await readFile(new URL('../../backend/content/nearMeBlogs.json', import.meta.url), 'utf8'));
const routes = await readFile(new URL('../src/App.jsx', import.meta.url), 'utf8');
const posts = await fetch(base + '/api/blogs').then(response => response.json());
assert.deepEqual(new Set(posts.slice(0, 3).map(post => post.slug)), new Set(seeds.map(post => post.slug)));
const document = new JSDOM(await fetch(base + '/blog').then(response => response.text())).window.document;
const featured = document.querySelector('.journal-feature');
assert.ok(featured);
const topMarkup = featured.outerHTML + [...document.querySelectorAll('.journal-card')].slice(0, 2).map(card => card.outerHTML).join('');
const sitemap = await fetch(base + '/sitemap.xml').then(response => response.text());
for (const seed of seeds) {
  assert.ok(topMarkup.includes('/blog/' + seed.slug), 'Top placement: ' + seed.slug);
  const post = posts.find(article => article.slug === seed.slug);
  assert.ok(post.isFeatured && post.isPublished && !post.noindex);
  assert.equal(post.content, seed.content);
  assert.equal(post.faqs.length, 4);
  assert.ok(post.seoKeywords.includes(post.primaryKeyword));
  assert.ok(post.content.toLowerCase().includes(post.primaryKeyword.toLowerCase()));
  assert.ok(sitemap.includes('https://chalakgo.com/blog/' + seed.slug));
  const response = await fetch(base + '/blog/' + seed.slug);
  assert.equal(response.status, 200);
  const page = new JSDOM(await response.text()).window.document;
  assert.equal(page.querySelector('h1').textContent, seed.title);
  assert.ok(page.querySelector('.journal-prose').textContent.length > 2500);
  for (const [, target] of seed.content.matchAll(/\]\((\/[^)]+)\)/g)) {
    if (target.startsWith('/blog/')) assert.ok(posts.some(article => '/blog/' + article.slug === target), target);
    else assert.ok(routes.includes('"' + target + '"'), 'Frontend route: ' + target);
  }
}
console.log(`PASS: ${seeds.length} new articles lead the listing; stored content, FAQs, keywords, service/article targets, public HTML and sitemap verified.`);
