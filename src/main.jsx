import { LiveSite, PageStatusGate } from "./components/LiveSite.jsx";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { Toaster } from "sonner";
import { HelmetProvider } from "react-helmet-async";
import { SeoProvider } from "./components/Seo.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HashRouter>
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
    </HashRouter>
  </StrictMode>,
);
