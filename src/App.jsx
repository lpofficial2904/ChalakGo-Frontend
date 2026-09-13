import { useLiveEffect } from "./components/LiveSite";
import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import About from "./components/About";
import Blog from "./components/Blog";
import Contact from "./components/Contact";
import Faqs from "./components/Faqs";
import Fleet from "./components/Fleet";
import Home from "./components/Home";
import HowItWorks from "./components/HowItWorks";
import Login from "./components/Login";
import ManagedPage from "./components/ManagedPage";
import Pricing from "./components/Pricing";
import Reviews from "./components/Reviews";
import Services from "./components/Services";
import SiteLayout from "./components/SiteLayout";
import { API_BASE } from "./utils/api.js";
import { usePageSeo } from "./components/Seo.jsx";

// Every visitor page shares the same header, navigation, and footer.
function PublicPage({ children, showFooterReviews = true }) {
  return (
    <SiteLayout showFooterReviews={showFooterReviews}>{children}</SiteLayout>
  );
}

function publicRoute(path, Page, options = {}) {
  return (
    <Route
      key={path}
      path={path}
      element={
        <PublicPage {...options}>
          <Page />
        </PublicPage>
      }
    />
  );
}

function editableRoute(path, slug, Page, options = {}) {
  return (
    <Route
      key={path}
      path={path}
      element={<EditablePage slug={slug} Page={Page} {...options} />}
    />
  );
}

function EditablePage({ slug, Page, showFooterReviews = true }) {
  const [page, setPage] = useState(null);
  const metadata = page?.slug === slug ? page : null;
  usePageSeo({ title: metadata?.seoTitle || (!metadata?.statusOnly && metadata?.title), description: metadata?.seoDescription || metadata?.excerpt });
  useLiveEffect(() => {
    const controller = new AbortController();
    // Built-in pages work without a published CMS override. Look up optional
    // content in the collection instead of requesting a missing page resource.
    fetch(`${API_BASE}/api/pages`, { signal: controller.signal })
      .then((response) => (response.ok ? response.json() : null))
      .then((pages) => {
        if (!controller.signal.aborted) {
          setPage(
            Array.isArray(pages)
              ? pages.find((item) => item.slug === slug) || null
              : null,
          );
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) setPage(null);
      });
    return () => controller.abort();
  }, [slug]);
  if (!page || page.statusOnly)
    return (
      <PublicPage showFooterReviews={showFooterReviews}>
        <Page />
      </PublicPage>
    );
  return (
    <PublicPage showFooterReviews={showFooterReviews}>
      <main className="min-h-screen bg-[#f7f9fc] text-[#101a31]">
        <section className="bg-[#0b1c38] px-5 py-20 text-white sm:py-28">
          <div className="mx-auto max-w-4xl">
            <p className="font-bold text-blue-300">
              {page.navigationLabel || "CHALAKGO"}
            </p>
            <h1 className="mt-4 text-5xl font-extrabold leading-tight sm:text-6xl">
              {page.heroTitle || page.title}
            </h1>
            {page.excerpt && (
              <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
                {page.excerpt}
              </p>
            )}
          </div>
        </section>
        <article className="mx-auto max-w-4xl whitespace-pre-wrap px-5 py-16 text-lg leading-8 text-slate-600 sm:py-24">
          {page.content}
        </article>
      </main>
    </PublicPage>
  );
}

export default function App() {
  return (
    <Routes>
      {editableRoute("/", "home", Home)}
      {editableRoute("/about", "about", About)}
      {editableRoute("/contact", "contact", Contact)}
      {publicRoute("/login", Login, { showFooterReviews: false })}
      {editableRoute("/pricing", "pricing", Pricing)}
      {publicRoute("/services", Services)}
      {publicRoute("/services/:service", Services)}
      {publicRoute("/blog", Blog)}
      {publicRoute("/blog/:slug", Blog)}
      {publicRoute("/p/:slug", ManagedPage)}

      {editableRoute("/how-it-works", "how-it-works", HowItWorks, {
        showFooterReviews: false,
      })}
      {editableRoute("/fleet", "fleet", Fleet, { showFooterReviews: false })}
      <Route path="/reviews" element={<Reviews />} />
      {editableRoute("/faqs", "faqs", Faqs, { showFooterReviews: false })}
      {publicRoute("*", () => <main className="px-5 py-24 text-center"><h1 className="text-4xl font-bold">Page not found</h1><a href="/">Return home</a></main>)}
    </Routes>
  );
}
