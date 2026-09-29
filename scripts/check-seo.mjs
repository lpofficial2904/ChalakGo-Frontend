import { createServer } from "vite";
import react from "@vitejs/plugin-react";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { HelmetProvider } from "react-helmet-async";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const server = await createServer({
  root: fileURLToPath(new URL("..", import.meta.url)),
  configFile: false,
  plugins: [react()],
  server: { middlewareMode: true },
  appType: "custom",
});
try {
  const { SeoProvider } = await server.ssrLoadModule("/src/components/Seo.jsx");
  const { default: Services } = await server.ssrLoadModule("/src/components/Services.jsx");
  const { default: Home } = await server.ssrLoadModule("/src/components/Home.jsx");
  const paths = ["/", "/about", "/contact", "/pricing", "/services", "/blog", "/how-it-works", "/fleet", "/reviews", "/faqs", "/terms-and-conditions", "/login", "/missing", "/chauffeur-service-jaipur", "/cab-car-driver-jaipur", "/driver-on-demand-jaipur", "/jaipur-tour-by-car", "/permanent-driver-jaipur"];
  const titles = new Set();
  const descriptions = new Set();
  for (const path of paths) {
    const html = renderToStaticMarkup(React.createElement(MemoryRouter, {
      initialEntries: [path + "?utm_source=test#section"],
    }, React.createElement(SeoProvider)));
    assert.equal((html.match(/<title>/g) || []).length, 1, path);
    assert.equal((html.match(/name="description"/g) || []).length, 1, path);
    assert.ok(html.includes(`href="https://chalakgo.com${path}"`), path);
    assert.ok(html.includes('property="og:title"'), path);
    assert.ok(html.includes('name="twitter:card"'), path);
    const title = html.match(/<title>(.*?)<\/title>/)?.[1];
    const description = html.match(/name="description" content="(.*?)"/)?.[1];
    assert.ok(title && !titles.has(title), `unique title: ${path}`);
    if (!["/login", "/missing"].includes(path)) assert.ok(description && !descriptions.has(description), `unique description: ${path}`);
    titles.add(title);
    if (!["/login", "/missing"].includes(path)) descriptions.add(description);
    const robots = ["/login", "/missing"].includes(path) ? "noindex, nofollow" : "index, follow";
    assert.ok(html.includes(`content="${robots}"`), path);
    if (path.startsWith("/") && ["/chauffeur-service-jaipur", "/cab-car-driver-jaipur", "/driver-on-demand-jaipur", "/jaipur-tour-by-car", "/permanent-driver-jaipur"].includes(path)) {
      assert.ok(html.includes('type="application/ld+json"'), `structured data: ${path}`);
      const jsonLd = html.match(/<script type="application\/ld\+json">(.*?)<\/script>/)?.[1];
      assert.ok(jsonLd, `valid JSON-LD output: ${path}`);
      assert.doesNotThrow(() => JSON.parse(jsonLd), `valid JSON-LD: ${path}`);
    }
  }
  const servicePages = [
    ["/chauffeur-service-jaipur", "Premium Car with Professional Chauffeur in Jaipur", ["/cab-car-driver-jaipur", "/driver-on-demand-jaipur", "/jaipur-tour-by-car"]],
    ["/cab-car-driver-jaipur", "Cab Service in Jaipur — Car + Professional Driver", ["/chauffeur-service-jaipur", "/driver-on-demand-jaipur", "/jaipur-tour-by-car"]],
    ["/driver-on-demand-jaipur", "Your Car, Our Expert Driver", ["/permanent-driver-jaipur", "/chauffeur-service-jaipur", "/cab-car-driver-jaipur"]],
    ["/jaipur-tour-by-car", "Private Jaipur Sightseeing Tour by Car", ["/cab-car-driver-jaipur", "/chauffeur-service-jaipur"]],
    ["/permanent-driver-jaipur", "Your Dedicated Monthly Chauffeur in Jaipur", ["/driver-on-demand-jaipur", "/chauffeur-service-jaipur"]],
  ];
  for (const [path, expectedH1, relatedPaths] of servicePages) {
    const page = renderToStaticMarkup(React.createElement(MemoryRouter, { initialEntries: [path] },
      React.createElement(HelmetProvider, null,
        React.createElement(SeoProvider, null,
          React.createElement(Routes, null, React.createElement(Route, { path, element: React.createElement(Services) })),
        ),
      ),
    ));
    const headings = [...page.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/g)];
    assert.equal(headings.length, 1, `one H1: ${path}`);
    assert.ok(headings[0][1].includes(expectedH1), `correct H1: ${path}`);
    for (const relatedPath of relatedPaths) assert.ok(page.includes(`href="${relatedPath}"`), `related service link ${relatedPath} from ${path}`);
  }
  const homePage = renderToStaticMarkup(React.createElement(MemoryRouter, null, React.createElement(Home)));
  assert.equal((homePage.match(/<h1\b/g) || []).length, 1, "one homepage H1");
  assert.ok(homePage.includes("Premium Car with Professional Chauffeur in Jaipur"), "homepage primary H1");
  for (const [path] of servicePages) assert.ok(homePage.includes(`href="${path}"`), `homepage service link: ${path}`);
  const sitemap = await readFile(new URL("../public/sitemap.xml", import.meta.url), "utf8");
  const robotsFile = await readFile(new URL("../public/robots.txt", import.meta.url), "utf8");
  for (const path of ["/", "/chauffeur-service-jaipur", "/cab-car-driver-jaipur", "/driver-on-demand-jaipur", "/jaipur-tour-by-car", "/permanent-driver-jaipur"]) {
    assert.ok(sitemap.includes(`<loc>https://chalakgo.com${path}</loc>`), `sitemap URL: ${path}`);
  }
  assert.ok(robotsFile.includes("Sitemap: https://chalakgo.com/sitemap.xml"));
  console.log(`PASS: ${paths.length} metadata routes, five one-H1 service pages, internal service links, robots, sitemap and valid JSON-LD.`);
} finally {
  await server.close();
}
