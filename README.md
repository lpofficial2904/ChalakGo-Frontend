# ChalakGo Frontend

Customer-facing React website for ChalakGo driver services. It is built with Vite, React, Tailwind CSS, and Framer Motion.

## Run locally

```bash
npm install
npm run dev
```

The frontend expects the API at `http://127.0.0.1:5000` in local development. Vite forwards `/api` requests to that address.

## Project map

| Location | Purpose |
| --- | --- |
| `src/App.jsx` | Route definitions |
| `src/components/SiteLayout.jsx` | Shared top bar, navigation, customer-review strip, and footer |
| `src/components` | Page and reusable UI components |
| `src/utils` | Small browser-safe helpers for API calls, booking data, locations, and fare estimates |
| `src/index.css` | Global design tokens, form controls, accessibility, and responsive styles |

## Design rules

- Reuse `SiteLayout` for customer pages so navigation and footer stay consistent.
- Keep page-specific data close to its page; move logic used by more than one page into `src/utils`.
- Use the shared `input` class for form controls.
- Calculate estimates in the browser only for feedback. The backend remains responsible for validating booking prices.

## Production build

```bash
npm run build
```

Pushes to the `main` branch trigger the connected Netlify deployment.
