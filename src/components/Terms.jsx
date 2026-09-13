import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, ChevronRight, FileText, ShieldCheck, CalendarDays } from "lucide-react";
import fallbackContent from "../content/terms.txt?raw";
import "./terms.css";

const breaks = [
  ["For customers looking to hire a permanent driver", "Permanent driver hiring"],
  ["For short-term or temporary driver hiring", "Temporary driver services"],
  ["For cab bookings", "Cab bookings & trip expenses"],
  ["Service prices may vary", "Pricing & booking confirmation"],
  ["Customers should inform ChalakGo", "Cancellations & changes"],
  ["Customers are expected to treat drivers", "Customer responsibilities"],
  ["Food support for the driver", "Driver meals & allowances"],
  ["All driver and cab bookings are subject", "Availability & service standards"],
  ["Customers are responsible for their personal belongings during", "Personal belongings"],
  ["ChalakGo will make reasonable efforts to provide reliable", "Service limitations"],
  ["Applicable taxes", "Taxes & additional charges"],
  ["ChalakGo reserves the right to update", "Updates & acceptance"],
  ["For booking assistance, driver replacement requests", "Contact & assistance"],
];
export function parseTerms(content) {
  const lines = content.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
  const date = lines.find(line => /^Last Updated:/i.test(line));
  const explicit = lines.some(line => /^##\s+/.test(line));
  const sections = [];
  let current = { title: "Overview", lines: [] };
  for (const line of lines) {
    if (line === date) continue;
    const heading = /^##\s+/.test(line) ? line.replace(/^##\s+/, "") : (!explicit && breaks.find(([prefix]) => line.startsWith(prefix))?.[1]);
    if (heading) {
      if (current.lines.length) sections.push(current);
      current = { title: heading, lines: [] };
      if (/^##\s+/.test(line)) continue;
    }
    current.lines.push(line);
  }
  if (current.lines.length) sections.push(current);
  return { date: date?.replace(/^Last Updated:\s*/i, ""), sections };
}
export default function Terms({ page }) {
  const { date, sections } = parseTerms(page?.content ?? fallbackContent);
  const [active, setActive] = useState(0);
  const jump = index => {
    setActive(index);
    const heading = document.getElementById(`terms-section-${index}`);
    heading?.scrollIntoView({ behavior: window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
    heading?.focus({ preventScroll: true });
  };
  return <main className="terms-page">
    <section className="terms-hero"><div className="terms-shell">
      <nav aria-label="Breadcrumb" className="terms-breadcrumb"><Link to="/">Home</Link><ChevronRight size={14} /><span>Terms & Conditions</span></nav>
      <div className="terms-hero-row"><div>
        <span className="terms-eyebrow">THE DETAILS THAT MATTER</span>
        <h1>{page?.heroTitle || page?.title || "Terms & Conditions"}</h1>
        <p>{page?.excerpt || "A little clarity goes a long way. Everything you need to know about booking and travelling with ChalakGo, in one place."}</p>
        <div className="terms-meta">{date && <span><CalendarDays size={16} /> Last updated: {date}</span>}<span><FileText size={16} /> Service terms</span></div>
      </div><div className="terms-hero-icon" aria-hidden="true"><ShieldCheck size={64} strokeWidth={1.2} /></div></div>
    </div></section>
    <div className="terms-shell terms-grid"><aside className="terms-sidebar">
      <div className="terms-nav-card"><span className="terms-small">IN THIS DOCUMENT</span><nav aria-label="Terms sections">{sections.map((section, index) => <button key={index} type="button" onClick={() => jump(index)} aria-current={active === index ? "location" : undefined}><span>{String(index + 1).padStart(2, "0")}</span>{section.title}<ChevronRight size={13} /></button>)}</nav></div>
      <div className="terms-help"><ShieldCheck size={23} /><h2>Need a little clarity?</h2><p>Our team can help with questions about your booking or these terms.</p><Link to="/contact">Talk to our team <ArrowUpRight size={17} /></Link></div>
    </aside><article className="terms-document">
      <div className="terms-document-label"><FileText size={17} /><span>CHALAKGO / SERVICE AGREEMENT</span></div>
      {sections.map((section, index) => <section className="terms-section" key={index}><div className="terms-section-heading"><span>{String(index + 1).padStart(2, "0")}</span><h2 id={`terms-section-${index}`} tabIndex={-1}>{section.title}</h2></div><div className="terms-copy">{section.lines.map((line, i) => <p className={/^-\s+/.test(line) ? "terms-bullet" : undefined} key={i}>{line}</p>)}</div></section>)}
      <div className="terms-end"><ShieldCheck size={20} /><span>Thank you for choosing ChalakGo.</span><button type="button" onClick={() => jump(0)}>Back to top ↑</button></div>
    </article></div>
  </main>;
}
