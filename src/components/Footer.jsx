import { useLiveEffect } from "./LiveSite";
import { assetUrl } from "../utils/assets.js";
import { useEffect, useState } from "react";
import { SiteLink as Link, SiteNavLink as NavLink } from "./LiveSite";
import { Clock3, Mail, MapPin, Phone } from "lucide-react";
import { API_BASE } from "../utils/api.js";

const defaults = {
  siteName: "ChalakGo",
  logo: "",
  footerLogo: "",
  phone: "+91 98765 43210",
  email: "support@chalakgo.in",
  address: "",
  facebook: "",
  instagram: "",
  whatsapp: "",
  whatsappNumber: "",
  linkedin: "",
  youtube: "",
};
const fallbackServices = [
  { slug: "driver-only", name: "Driver Only" },
  { slug: "car-driver", name: "Car + Driver" },
  { slug: "permanent-driver", name: "Permanent Driver" },
];
const socialNetworks = [
  ["Facebook", "facebook"],
  ["Instagram", "instagram"],
  ["WhatsApp", "whatsapp"],
  ["LinkedIn", "linkedin"],
  ["YouTube", "youtube"],
];

export default function Footer() {
  const [settings, setSettings] = useState(defaults);
  const [services, setServices] = useState(fallbackServices);
  useLiveEffect(() => {
    fetch(`${API_BASE}/api/settings`)
      .then((response) => (response.ok ? response.json() : null))
      .then(
        (data) =>
          data && setSettings((value) => ({ ...defaults, ...value, ...data })),
      )
      .catch(() => {});
  }, []);
  useLiveEffect(() => {
    fetch(`${API_BASE}/api/services`)
      .then((response) => (response.ok ? response.json() : null))
      .then((items) => {
        if (Array.isArray(items)) setServices(items);
      })
      .catch(() => {});
  }, []);
  const phone = settings.phone || defaults.phone;
  const whatsappNumber = (settings.whatsappNumber || phone).replace(/\D/g, "");
  const socialLinks = socialNetworks.map(([name, key]) => [
    name,
    key,
    settings[key] ||
      (key === "whatsapp"
        ? `https://wa.me/${whatsappNumber}`
        : `https://${key}.com`),
  ]);
  const whatsappLink = settings.whatsappNumber
    ? `https://wa.me/${whatsappNumber}`
    : settings.whatsapp || `https://wa.me/${whatsappNumber}`;

  return (
    <footer className="overflow-hidden bg-[#071226] text-slate-300">
      <div className="mx-auto max-w-[1280px] px-5 py-14 sm:py-16 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          <div>
            {settings.footerLogo || settings.logo ? (
              <img
                src={assetUrl(settings.footerLogo || settings.logo)}
                alt={settings.siteName}
                className="h-12 max-w-xs object-contain object-left"
              />
            ) : (
              <p className="text-3xl font-extrabold tracking-tight text-white">
                {settings.siteName}
              </p>
            )}
            <p className="mt-5 max-w-[16rem] text-sm leading-7 text-slate-400">
              Professional driver services for daily travel, business journeys
              and every special occasion.
            </p>
            {socialLinks.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {socialLinks.slice(0, 3).map(([name, key, href]) => (
                  <a
                    key={key}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={name}
                    className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition hover:-translate-y-1 hover:border-blue-400 hover:bg-blue-600 hover:text-white"
                  >
                    <SocialIcon name={name} />
                  </a>
                ))}
              </div>
            )}
          </div>
          <FooterColumn
            title="Quick Links"
            links={[
              ["Home", "/"],
              ["About us", "/about"],
              ["Services", "/services"],
              ["Pricing", "/pricing"],
              ["Blog", "/blog"],
              ["Contact", "/contact"],
            ]}
          />
          <FooterColumn
            title="Our Services"
            links={services.map((service) => [
              service.name,
              `/services/${service.slug}`,
            ])}
            empty="New services will appear here."
          />
          <div>
            <h2 className="text-sm font-extrabold uppercase tracking-[.16em] text-white">
              Contact Us
            </h2>
            <div className="mt-5 grid gap-5 text-sm">
              <ContactItem
                icon={<Phone size={18} />}
                title="Phone"
                text={phone}
                href={`tel:${phone.replace(/\s/g, "")}`}
              />
              <ContactItem
                icon={<Mail size={18} />}
                title="Email"
                text={settings.email}
                href={`mailto:${settings.email}`}
              />
              {settings.address && (
                <ContactItem
                  icon={<MapPin size={18} />}
                  title="Address"
                  text={settings.address}
                />
              )}
              <ContactItem
                icon={<Clock3 size={18} />}
                title="Working hours"
                text="24/7 booking assistance"
              />
            </div>
          </div>
        </div>
        <div className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-6 text-center text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <span>
            &copy; {new Date().getFullYear()} {settings.siteName}. All rights
            reserved.
          </span>
          <span>
            Verified drivers <i className="px-1 text-blue-300">&bull;</i> Live
            location <i className="px-1 text-blue-300">&bull;</i> India-wide
            service
          </span>
        </div>
      </div>
      <div className="floating-contact-actions fixed bottom-5 right-5 z-50 flex flex-col gap-3 sm:bottom-7 sm:right-7">
        <a
          href={`tel:${phone.replace(/\D/g, "")}`}
          aria-label={`Call ${settings.siteName || "ChalakGo"}`}
          className="grid h-14 w-14 place-items-center rounded-full bg-blue-600 text-white shadow-[0_10px_28px_rgba(20,99,232,.35)] transition hover:-translate-y-1 hover:bg-blue-700"
        >
          <Phone size={23} />
        </a>
        <a
          href={whatsappLink}
          target="_blank"
          rel="noreferrer"
          aria-label={`WhatsApp ${settings.siteName || "ChalakGo"}`}
          className="grid h-14 w-14 place-items-center rounded-full bg-[#20b96b] text-white shadow-[0_10px_28px_rgba(32,185,107,.35)] transition hover:-translate-y-1 hover:bg-[#159957]"
        >
          <SocialIcon name="WhatsApp" />
        </a>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links, empty }) {
  return (
    <div>
      <h2 className="text-sm font-extrabold uppercase tracking-[.16em] text-white">
        {title}
      </h2>
      <div className="mt-5 grid gap-3.5 text-sm">
        {links.map(([label, path]) => (
          <Link
            key={path}
            className="flex w-fit items-center gap-2 transition hover:translate-x-1 hover:text-blue-300"
            to={path}
          >
            <span className="text-blue-300">&rarr;</span>
            {label}
          </Link>
        ))}
        {!links.length && <p className="text-slate-500">{empty}</p>}
      </div>
    </div>
  );
}
function ContactItem({ icon, title, text, href }) {
  const content = (
    <>
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-blue-500/10 text-blue-300">
        {icon}
      </span>
      <span>
        <b className="block text-slate-100">{title}</b>
        <span className="mt-1 block leading-5 text-slate-400">{text}</span>
      </span>
    </>
  );
  return href ? (
    <a
      href={href}
      className="flex items-start gap-3 transition hover:text-white"
    >
      {content}
    </a>
  ) : (
    <div className="flex items-start gap-3">{content}</div>
  );
}
function SocialIcon({ name }) {
  if (name === "Facebook")
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-5 w-5 fill-current"
      >
        <path d="M13.8 21v-8h2.7l.4-3.1h-3.1v-2c0-.9.3-1.5 1.6-1.5H17V3.6c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.4H8.2V13h2.6v8h3Z" />
      </svg>
    );
  if (name === "Instagram")
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-5 w-5 fill-none stroke-current stroke-[2]"
      >
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle
          cx="17.4"
          cy="6.7"
          r=".8"
          className="fill-current stroke-none"
        />
      </svg>
    );
  if (name === "WhatsApp")
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-5 w-5 fill-current"
      >
        <path d="M20.5 3.5A11.5 11.5 0 0 0 2.7 17.3L1.5 22.5l5.3-1.2A11.5 11.5 0 1 0 20.5 3.5ZM12 20.1a8 8 0 0 1-4.1-1.1l-.3-.2-3.1.7.7-3-.2-.3A8.1 8.1 0 1 1 12 20.1Zm4.4-6c-.2-.1-1.4-.7-1.6-.7s-.4-.1-.5.1-.6.7-.7.8-.3.2-.5.1a6.6 6.6 0 0 1-1.9-1.2 7.1 7.1 0 0 1-1.3-1.7c-.1-.2 0-.3.1-.4l.4-.5.2-.4c.1-.2 0-.3 0-.4L10 8.2c-.1-.3-.3-.3-.5-.3h-.4c-.2 0-.4.1-.6.3s-.8.8-.8 2 .9 2.3 1.1 2.6a9.3 9.3 0 0 0 3.5 3.1c.5.2.9.4 1.2.5.5.2 1 .2 1.3.1.4-.1 1.4-.6 1.6-1.1s.2-1 .1-1.1-.2-.1-.4-.2Z" />
      </svg>
    );
  if (name === "LinkedIn")
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-5 w-5 fill-current"
      >
        <path d="M5.1 8.2A1.9 1.9 0 1 0 5.1 4.4a1.9 1.9 0 0 0 0 3.8ZM3.5 9.7h3.2V20H3.5V9.7Zm5.2 0h3.1v1.4h.1c.4-.8 1.5-1.8 3.2-1.8 3.4 0 4 2.2 4 5.2V20h-3.2v-4.9c0-1.2 0-2.7-1.7-2.7s-2 1.3-2 2.6V20H8.8V9.7Z" />
      </svg>
    );
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5 fill-current"
    >
      <path d="M21.6 7.2a3 3 0 0 0-2.1-2.1C17.6 4.6 12 4.6 12 4.6s-5.6 0-7.5.5A3 3 0 0 0 2.4 7.2C1.9 9.1 1.9 12 1.9 12s0 2.9.5 4.8a3 3 0 0 0 2.1 2.1c1.9.5 7.5.5 7.5.5s5.6 0 7.5-.5a3 3 0 0 0 2.1-2.1c.5-1.9.5-4.8.5-4.8s0-2.9-.5-4.8ZM10 15.4V8.6l5.7 3.4-5.7 3.4Z" />
    </svg>
  );
}
