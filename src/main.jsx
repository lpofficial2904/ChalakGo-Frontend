import { LiveSite, PageStatusGate } from "./components/LiveSite.jsx";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { Toaster } from "sonner";
import { HelmetProvider } from "react-helmet-async";
import { SeoProvider } from "./components/Seo.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
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
