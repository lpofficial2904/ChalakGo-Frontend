import { createContext, useContext, useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { API_BASE } from "../utils/api.js";
import { UnavailableSeo } from "./Seo.jsx";
const Context = createContext({ revision: "", statuses: [] });
export function LiveSite({ children }) {
  const [revision, setRevision] = useState("");
  const [statuses, setStatuses] = useState([]);
  useEffect(() => {
    const events = new EventSource(`${API_BASE}/api/events`);
    events.onmessage = (event) => {
      try {
        setRevision(JSON.parse(event.data).revision);
      } catch {
        /* Ignore malformed events. */
      }
    };
    return () => events.close();
  }, []);
  useEffect(() => {
    const controller = new AbortController();
    fetch(`${API_BASE}/api/page-status`, {
      signal: controller.signal,
      cache: "no-store",
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (Array.isArray(data)) setStatuses(data);
      })
      .catch(() => {});
    return () => controller.abort();
  }, [revision]);
  return (
    <Context.Provider value={{ revision, statuses }}>
      {children}
    </Context.Provider>
  );
}
export function useLiveEffect(effect, dependencies = []) {
  const { revision } = useContext(Context);
  useEffect(effect, [...dependencies, revision]);
}
function isInactive(path, statuses) {
  const slug = path.split(/[?#]/)[0].split("/").filter(Boolean);
  const name = slug[0] === "p" ? slug[1] : slug[0] || "home";
  return statuses.some(
    (page) => page.slug === name && page.isPublished === false,
  );
}
export function SiteLink(props) {
  const { statuses } = useContext(Context);
  if (typeof props.to === "string" && isInactive(props.to, statuses))
    return null;
  return <Link {...props} />;
}
export function SiteNavLink(props) {
  const { statuses } = useContext(Context);
  if (typeof props.to === "string" && isInactive(props.to, statuses))
    return null;
  return <NavLink {...props} />;
}
export function PageStatusGate({ children }) {
  const { statuses } = useContext(Context);
  const { pathname } = useLocation();
  return isInactive(pathname, statuses) ? (
    <main className="min-h-screen bg-slate-50 px-5 py-24 text-center text-slate-700">
      <UnavailableSeo />
      <h1 className="text-3xl font-bold">This page is currently unavailable</h1>
      <p className="mt-4">Please explore our other services.</p>
      <SiteLink to="/services" className="mt-6 inline-block text-blue-600">
        View services
      </SiteLink>
    </main>
  ) : (
    children
  );
}
