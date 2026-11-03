import test from 'node:test';
import assert from 'node:assert/strict';
import { blogTextParts, safeBlogHref } from './blogLinks.js';

test('editor links support crawlable local and HTTPS URLs, rejecting unsafe protocols', () => {
  for (const value of ['javascript:alert(1)', 'data:text/html,test', '//evil.example', '/\\evil.example', 'https://user:pass@example.com', '/\n/evil.example']) assert.equal(safeBlogHref(value), null);
  assert.equal(safeBlogHref('/driver-on-demand-jaipur'), '/driver-on-demand-jaipur');
  assert.equal(safeBlogHref('https://www.tourism.rajasthan.gov.in/jaipur.html'), 'https://www.tourism.rajasthan.gov.in/jaipur.html');
  assert.deepEqual(blogTextParts('Hire a [personal driver](/driver-on-demand-jaipur) today.'), [{ text: 'Hire a ' }, { text: 'personal driver', href: '/driver-on-demand-jaipur' }, { text: ' today.' }]);
  assert.ok(blogTextParts('[bad](javascript:alert)').every(part => !part.href));
});
