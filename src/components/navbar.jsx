import SiteImage from "./SiteImage.jsx";
import { siteFetch } from "../utils/siteFetch.js";
import { useLiveEffect } from "./LiveSite";
import { assetUrl } from "../utils/assets.js";
import { useEffect, useState } from "react";
import { SiteLink as Link, SiteNavLink as NavLink } from "./LiveSite";
import defaultLogo from "../assets/chalakgo-logo.webp";
import { API_BASE } from "../utils/api.js";
import { servicePath } from "../utils/serviceRoutes.js";

const menuLinks = [
  ["Home", "/"],
  ["About", "/about"],
  ["Pricing", "/pricing"],
  ["Blog", "/blog"],
  ["Contact", "/contact"],
];
const desktopLink = ({ isActive }) =>
  `nav-link ${isActive ? "text-blue-600" : ""}`;
const fallbackServices = [
  { slug: "driver-only", name: "Driver Only" },
  { slug: "car-driver", name: "Car + Driver" },
  { slug: "permanent-driver", name: "Permanent Driver" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [services, setServices] = useState(fallbackServices);
  const [pages, setPages] = useState([]);
  const [brand, setBrand] = useState({
    siteName: "ChalakGo",
    logo: "",
    navbarLogo: "",
    mainFavicon: "",
  });
  const navbarPages = pages.filter(page => page.slug !== "terms-and-conditions");

  // Published admin services are the source of truth for this menu.
  useLiveEffect(() => {
    siteFetch(`${API_BASE}/api/services`)
      .then((r) => (r.ok ? r.json() : null))
      .then((items) => {
        if (Array.isArray(items)) setServices(items);
      })
      .catch(() => {});
  }, []);
  useLiveEffect(() => {
    siteFetch(`${API_BASE}/api/pages`)
      .then((r) => (r.ok ? r.json() : null))
      .then((items) => {
        if (Array.isArray(items)) setPages(items);
      })
      .catch(() => {});
  }, []);
  useLiveEffect(() => {
    siteFetch(`${API_BASE}/api/settings`)
      .then((r) => (r.ok ? r.json() : null))
      .then((x) => x && setBrand((v) => ({ ...v, ...x })))
      .catch(() => {});
  }, []);
  useEffect(() => {
    document.body.classList.toggle("mobile-nav-open", open);
    return () => document.body.classList.remove("mobile-nav-open");
  }, [open]);

  const close = () => {
    setOpen(false);
  };
  const serviceLinks = (className) =>
    [...services].sort((a, b) => Number(b.slug === "driver-only") - Number(a.slug === "driver-only")).map((service) => (
      <Link
        key={service.slug}
        to={servicePath(service.slug)}
        onClick={close}
        className={className}
      >
        {service.name}
      </Link>
    ));

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white text-[#10213f] shadow-sm">
      <nav className="mx-auto flex h-[72px] max-w-[1380px] items-center justify-between px-4 lg:px-12">
        <Link to="/" onClick={close} className="flex items-center">
          <SiteImage priority sizes="160px"
            src={assetUrl(brand.navbarLogo) || assetUrl(brand.logo) || defaultLogo}
            onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = defaultLogo; }}
            alt={brand.siteName}
            className="h-10 w-auto sm:h-11"
          />
        </Link>
        <div className="hidden items-center gap-7 text-sm font-semibold text-slate-600 md:flex">
          <NavLink to="/" end className={desktopLink}>
            Home
          </NavLink>
          <NavLink to="/about" className={desktopLink}>
            About
          </NavLink>
          <div className="group relative">
            <Link
              to="/services"
              className="flex items-center gap-1 py-6 hover:text-blue-600"
              aria-haspopup="true"
            >
              Services{" "}
              <span aria-hidden="true" className="text-xs">
                ⌄
              </span>
            </Link>
            <div className="invisible absolute left-1/2 top-full w-56 -translate-x-1/2 rounded-xl border border-slate-200 bg-white p-2 opacity-0 shadow-xl transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
              <Link
                to="/services"
                className="block rounded-lg px-3 py-2 text-xs font-bold uppercase tracking-wide text-blue-600 hover:bg-blue-50"
              >
                All services
              </Link>
              {serviceLinks(
                "block rounded-lg px-3 py-2.5 hover:bg-blue-50 hover:text-blue-600",
              )}
            </div>
          </div>
          <NavLink to="/pricing" className={desktopLink}>
            Pricing
          </NavLink>
          <NavLink to="/blog" className={desktopLink}>
            Blog
          </NavLink>
          {navbarPages.map((page) => (
            <NavLink
              key={page.slug}
              to={`/p/${page.slug}`}
              className={desktopLink}
            >
              {page.navigationLabel || page.title}
            </NavLink>
          ))}
          <NavLink to="/contact" className={desktopLink}>
            Contact
          </NavLink>
        </div>
        <div className="hidden items-center gap-2 sm:flex">
          <Link
            to="/services"
            className="rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white"
          >
            Book Now
          </Link>
        </div>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          className="mobile-menu-button grid h-11 w-11 place-items-center rounded-xl border border-slate-200 text-2xl font-bold"
        >
          {open ? "×" : "☰"}
        </button>
      </nav>
      {open && (
        <div
          id="mobile-menu"
          className="mobile-drawer fixed z-[100] bg-white md:hidden"
        >
          <div className="mobile-drawer-heading">Menu</div>
          <div className="mobile-drawer-links">
            {menuLinks.slice(0, 2).map(([name, path]) => (
              <Link
                key={name}
                to={path}
                onClick={close}
                className="rounded-xl px-4 py-4 text-lg font-bold hover:bg-blue-50"
              >
                {name}
              </Link>
            ))}
            <Link
              to="/services"
              onClick={close}
              className="rounded-xl px-4 py-4 text-lg font-bold hover:bg-blue-50"
            >
              Services
            </Link>
            <div className="grid gap-1 border-l-2 border-blue-200 pl-3">
              {serviceLinks(
                "rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-600 hover:bg-blue-50",
              )}
            </div>
            {menuLinks.slice(2).map(([name, path]) => (
              <Link
                key={name}
                to={path}
                onClick={close}
                className="rounded-xl px-4 py-4 text-lg font-bold hover:bg-blue-50"
              >
                {name}
              </Link>
            ))}
            {navbarPages.map((page) => (
              <Link
                key={page.slug}
                to={`/p/${page.slug}`}
                onClick={close}
                className="rounded-xl px-4 py-4 text-lg font-bold hover:bg-blue-50"
              >
                {page.navigationLabel || page.title}
              </Link>
            ))}
          </div>
          <div className="mobile-drawer-actions">
            <Link
              to="/services"
              onClick={close}
              className="mobile-book-button rounded-xl bg-blue-600 text-center font-bold text-white"
            >
              Book Now
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
