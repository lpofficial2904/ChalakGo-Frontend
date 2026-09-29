import { siteFetch } from "./utils/siteFetch.js";
import { PageCopyContext } from "./components/PageCopy.jsx";
import { useLiveEffect } from "./components/LiveSite";
import { lazy, Suspense, useEffect, useState } from "react";
import { Navigate, Route, Routes, useParams } from "react-router-dom";
const About = lazy(() => import("./components/About.jsx"));
const Blog = lazy(() => import("./components/Blog.jsx"));
const Contact = lazy(() => import("./components/Contact.jsx"));
const Faqs = lazy(() => import("./components/Faqs.jsx"));
const Fleet = lazy(() => import("./components/Fleet.jsx"));
import Home from "./components/Home";
const HowItWorks = lazy(() => import("./components/HowItWorks.jsx"));
const Login = lazy(() => import("./components/Login.jsx"));
const ManagedPage = lazy(() => import("./components/ManagedPage.jsx"));
const Pricing = lazy(() => import("./components/Pricing.jsx"));
const Reviews = lazy(() => import("./components/Reviews.jsx"));
const Services = lazy(() => import("./components/Services.jsx"));
import SiteLayout from "./components/SiteLayout";
import { API_BASE } from "./utils/api.js";
import { usePageSeo } from "./components/Seo.jsx";
import { legacyServicePaths } from "./utils/serviceRoutes.js";
const Terms = lazy(() => import("./components/Terms.jsx"));

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
  usePageSeo({ title: slug === "home" ? undefined : metadata?.seoTitle || (!metadata?.statusOnly && metadata?.title), description: slug === "home" ? undefined : metadata?.seoDescription || metadata?.excerpt });
  useLiveEffect(() => {
    const controller = new AbortController();
    // Built-in pages work without a published CMS override. Look up optional
    // content in the collection instead of requesting a missing page resource.
    siteFetch(`${API_BASE}/api/pages`, { signal: controller.signal })
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
  if (slug === "reviews" && (!page || page.statusOnly || page.preserveLayout)) return <PageCopyContext.Provider value={metadata?.copy || {}}><Page /></PageCopyContext.Provider>;
  if (slug === "terms-and-conditions")
    return <PublicPage showFooterReviews={false}><Terms page={metadata?.statusOnly ? null : metadata} /></PublicPage>;
  if (!page || page.statusOnly || page.preserveLayout)
    return (
      <PublicPage showFooterReviews={showFooterReviews}>
        <PageCopyContext.Provider value={metadata?.copy || {}}><Page /></PageCopyContext.Provider>
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

function LegacyServiceRoute() {
  const { service } = useParams();
  const destination = legacyServicePaths[`/services/${service}`];
  return destination ? <Navigate replace to={destination} /> : <Services />;
}

export default function App() {
  return (
    <Suspense fallback={<main className="px-5 py-24 text-center text-slate-600" role="status">Loading page...</main>}>
    <Routes>
      {editableRoute("/", "home", Home)}
      {editableRoute("/about", "about", About)}
      {editableRoute("/contact", "contact", Contact)}
      {editableRoute("/terms-and-conditions", "terms-and-conditions", Terms, { showFooterReviews: false })}
      {publicRoute("/login", Login, { showFooterReviews: false })}
      {editableRoute("/pricing", "pricing", Pricing)}
      {editableRoute("/services", "services", Services)}
      {publicRoute("/chauffeur-service-jaipur", Services)}
      {publicRoute("/cab-car-driver-jaipur", Services)}
      {publicRoute("/driver-on-demand-jaipur", Services)}
      {publicRoute("/jaipur-tour-by-car", Services)}
      {publicRoute("/permanent-driver-jaipur", Services)}
      <Route path="/services/:service" element={<PublicPage><LegacyServiceRoute /></PublicPage>} />
      {editableRoute("/blog", "blog", Blog)}
      {publicRoute("/blog/:slug", Blog)}
      {publicRoute("/p/:slug", ManagedPage)}

      {editableRoute("/how-it-works", "how-it-works", HowItWorks, {
        showFooterReviews: false,
      })}
      {editableRoute("/fleet", "fleet", Fleet, { showFooterReviews: false })}
      {editableRoute("/reviews", "reviews", Reviews)}
      {editableRoute("/faqs", "faqs", Faqs, { showFooterReviews: false })}
      {publicRoute("*", () => <main className="px-5 py-24 text-center"><h1 className="text-4xl font-bold">Page not found</h1><a href="/">Return home</a></main>)}
    </Routes>
    </Suspense>
  );
}
