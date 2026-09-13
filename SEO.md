# Page metadata

The customer app uses `react-helmet-async` 3 with React 19. `SeoProvider` in
`src/components/Seo.jsx` owns one Helmet instance so nested pages do not create
duplicate metadata. It provides route titles, descriptions, canonical URLs,
Open Graph and Twitter tags. Canonicals use https://chalakgo.com and exclude
query strings and fragments.

Use `usePageSeo({ title, description, image, type, noindex })` in a page to
override its defaults. Blog articles and service pages use their loaded content.
CMS pages use `seoTitle` and `seoDescription`, falling back to title/excerpt.
Overrides clear when the component unmounts. Login, unavailable and unknown
pages use noindex; the separate admin app also uses Helmet with noindex.

Run `node scripts/check-seo.mjs` for route metadata render checks, and
`npm run build` in both frontend and admin before deployment. Deploy both dist
folders to their respective sites. Browser navigation checks require a browser
connection; they were not available in this workspace session.

This is client-rendered metadata. Helmet alone does not prerender the site's
HTML. Crawlers that do not execute JavaScript may not receive dynamic social
previews; SSR or prerendering is a separate deployment enhancement. The unknown
route displays a not-found page, but HTTP status codes remain controlled by
the hosting server.
