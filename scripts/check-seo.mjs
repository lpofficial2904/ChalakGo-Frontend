import { createServer } from "vite";
import react from "@vitejs/plugin-react";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import assert from "node:assert/strict";
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
  const paths = ["/", "/about", "/contact", "/pricing", "/services", "/blog", "/how-it-works", "/fleet", "/reviews", "/faqs", "/login", "/missing"];
  for (const path of paths) {
    const html = renderToStaticMarkup(React.createElement(MemoryRouter, {
      initialEntries: [path + "?utm_source=test#section"],
    }, React.createElement(SeoProvider)));
    assert.equal((html.match(/<title>/g) || []).length, 1, path);
    assert.equal((html.match(/name="description"/g) || []).length, 1, path);
    assert.ok(html.includes(`href="https://chalakgo.com${path}"`), path);
    assert.ok(html.includes('property="og:title"'), path);
    assert.ok(html.includes('name="twitter:card"'), path);
    const robots = ["/login", "/missing"].includes(path) ? "noindex, nofollow" : "index, follow";
    assert.ok(html.includes(`content="${robots}"`), path);
  }
  console.log("PASS: 12 routes, unique metadata, clean canonicals, social tags and noindex.");
} finally {
  await server.close();
}
