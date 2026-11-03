import { LiveSite, PageStatusGate } from "./components/LiveSite.jsx";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";
import "./index.css";
import App from "./App.jsx";
import { Toaster } from "sonner";
import { HelmetProvider } from "react-helmet-async";
import { SeoProvider } from "./components/Seo.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";

function GoogleAdsPageView() {
  const { pathname, search } = useLocation();
  const previousPage = useRef("");
  const pagePath = pathname + search;

  useEffect(() => {
    if (previousPage.current === pagePath) return;
    previousPage.current = pagePath;
    if (typeof window.gtag === "function") {
      window.gtag("event", "page_view", {
        page_path: pagePath,
        page_location: window.location.href,
      });
    }
  }, [pagePath]);

  return null;
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <GoogleAdsPageView />
      <ScrollToTop />
      <HelmetProvider>
      <SeoProvider>
      <LiveSite>
        <PageStatusGate>
          <App />
        </PageStatusGate>
      </LiveSite>
      <Toaster position="top-center" richColors closeButton />
      </SeoProvider>
      </HelmetProvider>
    </BrowserRouter>
  </StrictMode>,
);
