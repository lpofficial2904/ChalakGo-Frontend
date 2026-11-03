import { createServer } from 'vite';
import react from '@vitejs/plugin-react';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { JSDOM } from 'jsdom';
import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';

const server = await createServer({ root: fileURLToPath(new URL('..', import.meta.url)), configFile: false, plugins: [react()], server: { middlewareMode: true }, appType: 'custom' });
try {
  const { BlogList, BlogPost } = await server.ssrLoadModule('/src/components/Blog.jsx');
  const posts = JSON.parse(await readFile(new URL('../../backend/content/jaipurBlogs.json', import.meta.url), 'utf8')).map((post, i) => ({ ...post, _id: String(i), publishedAt: '2026-11-03T10:00:00Z' }));
  const wrap = child => React.createElement(MemoryRouter, null, child);
  const html = renderToStaticMarkup(wrap(React.createElement(BlogList, { posts, loading: false })));
  const listing = new JSDOM(html).window.document;
  assert.equal(listing.querySelectorAll('h1').length, 1);
  assert.equal(listing.querySelectorAll('.journal-feature').length, 1);
  assert.equal(listing.querySelectorAll('.journal-card').length, 9);
  assert.ok(listing.querySelector('.journal-feature img').src.includes('blog-jaipur-v1.webp'));
  const custom = renderToStaticMarkup(wrap(React.createElement(BlogPost, { post: { ...posts[0], coverImage: '/uploads/admin-custom.webp' } })));
  const article = new JSDOM(custom).window.document;
  assert.ok(article.querySelector('.journal-article-cover img').src.includes('admin-custom.webp'));
  assert.equal(article.querySelectorAll('h1').length, 1);
  assert.ok(article.querySelector('.journal-prose a[href="/driver-on-demand-jaipur"]'));
  assert.ok(!article.querySelector('.journal-prose').textContent.includes('](/driver-on-demand-jaipur)'));
  const { BlogText } = await server.ssrLoadModule('/src/components/Blog.jsx');
  const unsafe = renderToStaticMarkup(wrap(React.createElement(BlogText, null, '<script>alert(1)</script> [bad](javascript:alert)')));
  assert.ok(!unsafe.includes('<script>'));
  assert.ok(!unsafe.includes('href='));
  for (const anchor of article.querySelectorAll('.journal-contents nav a')) assert.ok(article.querySelector(anchor.getAttribute('href')));
  assert.equal(article.querySelectorAll('.journal-prose-section').length, posts[0].content.split(/\n\s*\n/).filter(block => block.startsWith('## ')).length);
  const rich = new JSDOM(renderToStaticMarkup(wrap(React.createElement(BlogPost, {
    post: { ...posts[0], content: '## Plan your pickup\n\n- Exact address\n- Preferred time\n\n> Confirm your route before departure.' },
    relatedPosts: posts,
  })))).window.document;
  assert.equal(rich.querySelectorAll('.journal-prose-section li').length, 2);
  assert.equal(rich.querySelectorAll('.journal-prose-section blockquote').length, 1);
  assert.equal(rich.querySelectorAll('.journal-related .journal-card').length, 3);
  assert.ok(!rich.querySelector(`.journal-related a[href="/blog/${posts[0].slug}"]`));
  const dom = new JSDOM('<div id="root"></div>', { url: 'http://localhost/blog' });
  globalThis.window = dom.window;
  globalThis.document = dom.window.document;
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  const root = createRoot(document.getElementById('root'));
  await act(async () => root.render(wrap(React.createElement(BlogList, { posts, loading: false }))));
  const button = label => [...document.querySelectorAll('.journal-filters button')].find(element => element.textContent === label);
  await act(async () => button('Tours & travel').click());
  assert.equal(button('Tours & travel').getAttribute('aria-pressed'), 'true');
  assert.equal(document.querySelectorAll('.journal-card').length, 2);
  assert.equal(document.querySelectorAll('.journal-feature').length, 0);
  await act(async () => button('Local guides').click());
  assert.equal(document.querySelectorAll('.journal-card').length, 5);
  await act(async () => root.unmount());
  dom.window.close();
  console.log('PASS: featured guide, 9 cards, topic filters, article anchors, one H1 and admin cover override.');
} finally {
  await server.close();
}
