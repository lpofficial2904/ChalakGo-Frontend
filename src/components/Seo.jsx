import { createContext, useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import logo from "../assets/Chalakgo logo.png";

const Context = createContext(null);
const pages = {
  "/": ["Professional Driver Booking", "Book professional drivers with ChalakGo for daily travel, outstation journeys, special occasions and business trips."],
  "/about": ["About Us", "Learn about ChalakGo and our professional driver services for safe, comfortable journeys."],
  "/contact": ["Contact Us", "Contact ChalakGo for driver bookings, service enquiries and booking support."],
  "/pricing": ["Driver Service Pricing", "Explore ChalakGo driver service pricing and choose a plan for your travel needs."],
  "/services": ["Our Driver Services", "Explore driver-only bookings, car and driver services, permanent drivers and Jaipur tours."],
  "/blog": ["Travel & Driver Service Blog", "Read travel tips, driver service guides and updates from ChalakGo."],
  "/how-it-works": ["How Driver Booking Works", "Learn how to choose a ChalakGo service, book a driver and prepare for your journey."],
  "/fleet": ["Our Fleet", "Explore vehicle options for comfortable travel with ChalakGo."],
  "/reviews": ["Customer Reviews", "Read customer experiences and reviews of ChalakGo driver services."],
  "/faqs": ["Frequently Asked Questions", "Find answers about ChalakGo driver bookings, pricing, services and travel."],
  "/login": ["Customer Login", "Log in to ChalakGo to book a driver and manage your bookings."],
};

// One Helmet instance prevents competing metadata tags in React 19.
export function SeoProvider({ children }) {
  const { pathname } = useLocation();
  const path = pathname.replace(/\/+$/, "") || "/";
  const [override, setOverride] = useState(null);
  const dynamic = /^\/(blog|services|p)\/[^/]+$/.test(path);
  const fallback = pages[path] || [dynamic ? "ChalakGo" : "Page Not Found", pages["/"][1]];
  const data = override?.pathname === pathname ? override : {};
  const name = data.title || fallback[0];
  const title = name.includes("ChalakGo") ? name : `${name} | ChalakGo`;
  const description = (data.description || fallback[1]).replace(/\s+/g, " ").trim().slice(0, 180);
  const canonical = `https://chalakgo.com${path === "/" ? "/" : path}`;
  const image = new URL(data.image || logo, "https://chalakgo.com").href;
  const noindex = data.noindex || path === "/login" || (!pages[path] && !dynamic);
  return (
    <Context.Provider value={setOverride}>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="robots" content={noindex ? "noindex, nofollow" : "index, follow"} />
        <link rel="canonical" href={canonical} />
        <meta property="og:site_name" content="ChalakGo" />
        <meta property="og:locale" content="en_IN" />
        <meta property="og:type" content={data.type || "website"} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonical} />
        <meta property="og:image" content={image} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={image} />
      </Helmet>
      {children}
    </Context.Provider>
  );
}

export function usePageSeo({ title, description, image, type, noindex } = {}) {
  const setOverride = useContext(Context);
  const { pathname } = useLocation();
  useEffect(() => {
    const value = { pathname, title, description, image, type, noindex };
    setOverride(value);
    return () => setOverride((current) => current === value ? null : current);
  }, [setOverride, pathname, title, description, image, type, noindex]);
}

export function UnavailableSeo() {
  usePageSeo({ title: "Page Unavailable", noindex: true });
  return null;
}
