import SiteImage from "./SiteImage.jsx";
import { MapPin, LocateFixed, PencilLine, CheckCircle2, ArrowRight, LoaderCircle } from "lucide-react";
import "./Services.css";
import ServiceFareEstimate from "./ServiceFareEstimate.jsx";
import DriverFareEstimate from "./DriverFareEstimate.jsx";
import { siteFetch } from "../utils/siteFetch.js";
import DriverPlans from "./DriverPlans.jsx";
import { driverPricing } from "../shared/driverPricing.js";
import { PageText } from "./PageCopy.jsx";
import { contentOf } from "../shared/serviceContent.js";
import { useLiveEffect } from "./LiveSite";
import { usePageSeo } from "./Seo.jsx";
import { serviceSeoPages } from "./Seo.jsx";
import { servicePath } from "../utils/serviceRoutes.js";
import { assetUrl } from "../utils/assets.js";
import CabPlans from "./CabPlans.jsx";
import {
  readBookingDraft,
  clearBookingDraft,
} from "../utils/bookingDraft.js";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import useCurrentLocation from "./usePickupCoordinates";
import { API_BASE } from "../utils/api.js";
import { showBookingSuccess } from "./BookingSuccess.jsx";
import { toast } from "sonner";
import {
  addressFields,
  addressFormValues,
  pickupPayload as buildPickupPayload,
} from "../utils/location.js";
import {
  calculateDriverOnlyFare,
  calculateDistanceFare,
  calculateFixedFare,
  calculateMonthlyFare,
  calculateTemporaryDriverFare,
} from "../utils/fare.js";

const manualFields = addressFields.filter(([, name]) =>
  ["city", "district", "state", "pincode"].includes(name),
);
const pickupPayload = (form, source, coordinates, timestamp) => {
  const address =
    source === "current"
      ? `Latitude: ${coordinates?.latitude}, Longitude: ${coordinates?.longitude}`
      : [form.city, form.district, form.state, form.pincode]
          .filter(Boolean)
          .join(", ");
  return {
    address,
    // Reverse geocoding may be unavailable on a customer's phone.  Keep the
    // GPS-coordinate address in every required pickup field in that case.
    ...buildPickupPayload({ ...form, address: form.address || address }, source, coordinates, timestamp),
  };
};

const defaultServices = [
  {
    slug: "driver-only",
    name: "Driver Only",
    price: "₹65/hr; ₹60/hr for 24 hours",
    eyebrow: "YOUR CAR, OUR EXPERT DRIVER",
    detail:
      "A trained, verified chauffeur drives your own car safely and professionally.",
    features: [
      "Background-verified driver",
      "Live trip location updates",
      "Hourly, daily, and weekly options",
    ],
    image:
      "https://images.unsplash.com/photo-1551830820-330a71b99659?auto=format&fit=crop&w=1200&q=85",
  },
  {
    slug: "car-driver",
    name: "Cab (Car + Driver)",
    price: "SUV ₹18/km; Hatchback ₹14/km; Haravan Traveller ₹35/km",
    pricingType: "distance",
    vehicleRates: { suv: 12, hatchback: 11, traveller: 35 },
    eyebrow: "PREMIUM CAR WITH PROFESSIONAL CHAUFFEUR",
    detail:
      "Travel in comfort with a clean premium car and an experienced driver for work, airport transfers, and special occasions.",
    features: [
      "Executive sedan and SUV choices",
      "Professional uniformed driver",
      "Clean, sanitised vehicle and live tracking",
    ],
    image:
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=85",
  },
  {
    slug: "permanent-driver",
    name: "Permanent Driver",
    price: "₹15,000–₹22,000/month",
    pricingType: "monthly",
    monthlyRates: { sixToEight: 15000, eightToTen: 18000, tenToTwelve: 22000 },
    eyebrow: "YOUR DEDICATED MONTHLY CHAUFFEUR",
    detail:
      "A reliable dedicated driver for daily family travel, office commutes, and a consistent driving routine.",
    features: [
      "Dedicated driver matching",
      "Backup-driver support",
      "Personalised monthly schedule",
    ],
    image:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=85",
  },
];
const plans = [
  ["6–8 Hours / Day", "4 days/month", "₹13,000 – ₹15,000/month"],
  ["8–10 Hours / Day", "4 days/month", "₹15,000 – ₹18,000/month"],
  ["10–12 Hours / Day", "4 days/month", "₹18,000 – ₹22,000/month"],
];

const jaipurTour = {
  slug: "jaipur-tour",
  name: "Jaipur Tour",
  price: "Plans from ₹2,999",
  pricingType: "fixed",
  eyebrow: "EXPLORE THE PINK CITY",
  detail:
    "Book a comfortable private Jaipur sightseeing tour for one day or two days with a professional driver.",
  features: [
    "Flexible 1-day and 2-day plans",
    "Choose your preferred places",
    "Private car and professional driver",
  ],
  image:
    "https://images.unsplash.com/photo-1599661046827-dacde6976540?auto=format&fit=crop&w=1200&q=85",
  tourPlans: [
    {
      days: 1,
      price: "₹2,999",
      places: [
        "Amber Fort",
        "Jal Mahal",
        "Hawa Mahal",
        "City Palace",
        "Jantar Mantar",
      ],
    },
    {
      days: 2,
      price: "₹3,499",
      places: [
        "Amber Fort",
        "Jal Mahal",
        "Hawa Mahal",
        "City Palace",
        "Jantar Mantar",
        "Nahargarh Fort",
        "Jaigarh Fort",
        "Albert Hall Museum",
      ],
    },
  ],
};
const serviceSeoTitles = {
  "driver-only": "Driver on Rent in Jaipur | Driver Only Service",
  "car-driver": "Chauffeur Driven Car Rental in Jaipur | ChalakGo",
  "jaipur-tour": "Jaipur Sightseeing Tour by Private Car & Driver",
  "permanent-driver": "Monthly Driver Service in Jaipur | Permanent Chauffeur",
};

export default function Services() {
  const { service: routeSlug } = useParams();
  const { pathname } = useLocation();
  const pagePath = pathname.replace(/\/+$/, "") || "/";
  const pageConfig = serviceSeoPages[pagePath];
  const slug = pageConfig?.slug || routeSlug;
  const [services, setServices] = useState([...defaultServices, jaipurTour]);
  const [servicesLoaded, setServicesLoaded] = useState(false);
  // Published services saved from Admin render here automatically.
  useLiveEffect(() => {
    siteFetch(`${API_BASE}/api/services`)
      .then((r) => (r.ok ? r.json() : null))
      .then((items) => {
        if (Array.isArray(items)) setServices(items);
        setServicesLoaded(true);
      })
      .catch(() => setServicesLoaded(true));
  }, []);
  const selected = services.find((item) => item.slug === slug);
  const seoTitle = pageConfig?.title || (selected ? serviceSeoTitles[selected.slug] || `${selected.name} in Jaipur` : undefined);
  usePageSeo({ title: seoTitle || (routeSlug && !selected ? "Service Not Found" : undefined), description: pageConfig?.description, image: selected?.image ? assetUrl(selected.image) : undefined, noindex: Boolean(routeSlug && !selected) });
  if (routeSlug && !selected) {
    return servicesLoaded ? <ServiceNotFound /> : <main className="px-5 py-24 text-center text-slate-600" role="status">Loading service...</main>;
  }
  return selected ? (
    <ServiceDetails service={selected} pageConfig={pageConfig} />
  ) : (
    <ServiceList services={services} />
  );
}

function ServiceNotFound() {
  return (
    <main className="min-h-[50vh] px-5 py-24 text-center text-[#10213f]">
      <h1 className="text-4xl font-extrabold">Service not found</h1>
      <p className="mt-4 text-slate-600">This service is unavailable. Browse the current ChalakGo services.</p>
      <Link to="/services" className="mt-7 inline-flex rounded-xl bg-blue-600 px-5 py-3 font-bold text-white">View services</Link>
    </main>
  );
}

function ServiceList({ services }) {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen overflow-hidden bg-[#f6f9ff] px-5 py-12 text-[#10213f] sm:py-16">
      <section className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-[32px] bg-[#081a38] px-7 py-14 text-center text-white shadow-2xl shadow-blue-950/15 sm:px-14 sm:py-18"
        >
          <div
            aria-hidden="true"
            className="absolute -left-20 -top-24 h-64 w-64 rounded-full bg-blue-500/25 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="absolute -bottom-24 -right-12 h-64 w-64 rounded-full bg-cyan-400/20 blur-3xl"
          />
          <div className="relative">
            <p className="text-xs font-extrabold tracking-[.16em] text-blue-200"><PageText id="text_1">
              CHALAKGO SERVICES
            </PageText></p>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl"><PageText id="text_2">
              The right driver for every journey.
            </PageText></h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg leading-7 text-slate-300"><PageText id="text_3">
              Flexible service options, professional standards and transparent
              pricing—designed around the way you travel.
            </PageText></p>
          </div>
        </motion.div>
        <div className="mx-auto -mt-5 grid max-w-[1120px] gap-6 md:grid-cols-2 xl:grid-cols-3">
          {[...services].sort((a, b) => Number(b.slug === "driver-only") - Number(a.slug === "driver-only")).map((item, index) => (
            <motion.article
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -8 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              key={item.slug}
              className="group cursor-pointer overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_14px_40px_rgba(25,54,96,.10)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-300"
              role="link"
              tabIndex={0}
              aria-label={`Explore ${item.name} service`}
              onClick={() => navigate(servicePath(item.slug))}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  navigate(servicePath(item.slug));
                }
              }}
            >
              <div className="relative">
                <SiteImage
                  src={assetUrl(item.image)}
                  alt={item.name}
                  className="aspect-square w-full bg-slate-100 object-contain"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#071a37]/75 via-transparent to-transparent" />
                {item.slug !== "car-driver" && (
                  <p className="absolute bottom-4 left-5 rounded-full bg-white/95 px-3 py-1.5 text-sm font-extrabold text-blue-700">
                    {item.price || "Custom pricing"}
                  </p>
                )}
              </div>
              <div className="flex min-h-[270px] flex-col p-7">
                <p className="text-[11px] font-extrabold tracking-[.12em] text-blue-600">
                  {item.eyebrow || "PROFESSIONAL SERVICE"}
                </p>
                <h2 className="mt-3 text-2xl font-extrabold tracking-tight">
                  {item.name}
                </h2>
                <p className="mt-3 text-sm leading-6 text-slate-500">
                  {item.detail}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {(item.features || []).slice(0, 2).map((feature) => (
                    <span
                      key={feature}
                      className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700"
                    >
                      ✓ {feature}
                    </span>
                  ))}
                </div>
                <Link
                  to={servicePath(item.slug)}
                  onClick={(event) => event.stopPropagation()}
                  className="mt-auto inline-flex w-fit items-center gap-2 rounded-full bg-blue-600 px-4 py-2.5 pt-2.5 text-sm font-extrabold text-white shadow-md shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
                >
                  Explore service &amp; book →
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </section>
    </main>
  );
}
function ServiceDetails({ service, pageConfig }) {
  if (service.slug === "jaipur-tour") return <JaipurTour service={service} pageConfig={pageConfig} />;
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_right,_#dbeafe,_transparent_32rem),#f7f9fc] px-5 py-10 text-[#101a31] sm:py-14">
      <section className="mx-auto max-w-6xl">
        <Link to="/services" className="text-sm font-bold text-blue-600">
          ← All services
        </Link>
        <div className="service-detail-hero relative mt-6 overflow-hidden rounded-[32px] bg-[#071a36] text-white shadow-2xl">
          <div className="service-detail-media">
          <SiteImage priority
            src={assetUrl(service.image)}
            alt={pageConfig?.h1 || service.name}
            onError={(event) => {
              event.currentTarget.src = "https://images.unsplash.com/photo-1599661046827-dacde6976540?auto=format&fit=crop&w=1400&q=85";
            }}
            className="service-detail-image"
          />
          </div>
          <div className="min-w-0 self-center p-6 sm:p-9">
            <p className="text-sm font-bold text-blue-300">{service.eyebrow}</p>
            <h1 className="mt-3 text-4xl font-extrabold">{pageConfig?.h1 || service.name}</h1>
            {pageConfig?.supportingHeading && <h2 className="mt-3 text-lg font-bold text-blue-200">{pageConfig.supportingHeading}</h2>}
            <p className="mt-4 text-lg leading-7 text-slate-300">
              {service.detail}
            </p>
            <ul className="mt-7 space-y-3">
              {(service.features || []).map((item) => (
                <li key={item} className="text-sm text-slate-200">
                  ✓ {item}
                </li>
              ))}
            </ul>
            {service.slug !== "car-driver" && (service.slug === "driver-only" || service.price) ? (
              <p className="mt-8 text-3xl font-extrabold">{service.slug === "driver-only" ? `Plans from ₹${Math.min(...driverPricing(service.driverPricing).plans.map(plan => plan.price)).toLocaleString("en-IN")}` : service.price}</p>
            ) : null}
          </div>
        </div>
        <BookingForm service={service} />
        {pageConfig && <ServiceSeoContent pageConfig={pageConfig} />}
      </section>
    </main>
  );
}

function JaipurTour({ service, pageConfig }) {
  const content = contentOf(service);
  const fallbackPlans = [
    {
      days: 1,
      price: "₹2,999",
      places: [
        "Amber Fort",
        "Jal Mahal",
        "Hawa Mahal",
        "City Palace",
        "Jantar Mantar",
      ],
    },
    {
      days: 2,
      price: "₹3,499",
      places: [
        "Amber Fort",
        "Jal Mahal",
        "Hawa Mahal",
        "City Palace",
        "Jantar Mantar",
        "Nahargarh Fort",
        "Jaigarh Fort",
        "Albert Hall Museum",
      ],
    },
  ];
  const plans = service.tourPlans?.length ? service.tourPlans : fallbackPlans;
  const [selected, setSelected] = useState(() => {
    const days = readBookingDraft(service.slug)?.planDays;
    const index = plans.findIndex((plan) => plan.days === days);
    return index < 0 ? null : index;
  });
  const [collapsed, setCollapsed] = useState(selected !== null);
  const [showDetails, setShowDetails] = useState(false);
  const active = selected === null ? null : plans[selected];
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_right,_#dbeafe,_transparent_32rem),#f7f9fc] px-5 py-10 text-[#101a31] sm:py-14">
      <section className="mx-auto max-w-6xl">
        <Link to="/services" className="text-sm font-bold text-blue-600">
          ← All services
        </Link>
        <div className="service-detail-hero mt-6 overflow-hidden rounded-3xl bg-[#0b1c38] text-white shadow-xl">
          <div className="service-detail-media">
          <SiteImage priority
            src={assetUrl(service.image)}
            alt={pageConfig?.h1 || "Jaipur sightseeing tour by car"}
            onError={(event) => {
              event.currentTarget.src = "https://images.unsplash.com/photo-1599661046827-dacde6976540?auto=format&fit=crop&w=1400&q=85";
            }}
            className="service-detail-image"
          />
          </div>
          <div className="relative min-w-0 self-center p-6 sm:p-9">
            <div className="absolute right-0 top-0 h-40 w-40 rounded-full border-[28px] border-blue-400/15" />
            <p className="relative text-xs font-extrabold tracking-[.2em] text-cyan-300">
              PRIVATE SIGHTSEEING · JAIPUR
            </p>
            <h1 className="relative mt-3 text-4xl font-extrabold sm:text-5xl">{pageConfig?.h1 || service.name}</h1>
            {pageConfig?.supportingHeading && <h2 className="relative mt-3 text-lg font-bold text-blue-200">{pageConfig.supportingHeading}</h2>}
            <p className="relative mt-5 text-base leading-7 text-slate-300">
              Your private car, professional driver and a thoughtfully planned Pink City itinerary — all in one effortless day out.
            </p>
            <ul className="relative mt-7 space-y-3">{(service.features || []).map(feature => <li key={feature}>{feature}</li>)}</ul>
            <p className="relative mt-5 text-2xl font-bold">{service.price}</p>
          </div>
        </div>
        <div className="mt-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-extrabold tracking-[.16em] text-blue-600">{content.plansEyebrow}</p>
            <h2 className="mt-2 text-3xl font-extrabold">{content.plansTitle}</h2>
          </div>
          {collapsed && <button type="button" onClick={() => { setCollapsed(false); setSelected(null); setShowDetails(false); }} className="text-sm font-bold text-blue-700">Change plan</button>}
          <p className="max-w-sm text-sm leading-6 text-slate-500">{content.plansDescription}</p>
        </div>
        <div className="mt-7 grid gap-6 md:grid-cols-2">
          {plans.map((plan, index) => (
            <article
              key={plan.days}
              className={`${selected === index || !collapsed ? "block" : "hidden sm:block"} group relative overflow-hidden rounded-3xl border bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-xl sm:p-7 ${selected === index ? "border-blue-600 ring-4 ring-blue-100" : "border-slate-200 hover:border-blue-400"}`}
            >
              <div className="flex items-center justify-between"><p className="font-bold text-blue-600">JAIPUR SIGHTSEEING</p><span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-extrabold text-blue-700">{plan.days} DAY</span></div>
              <h2 className="mt-2 text-3xl font-extrabold">
                {plan.title || `${plan.days} Day Tour`}
              </h2>
              {plan.description && (
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {plan.description}
                </p>
              )}
              <p className="mt-5 text-3xl font-extrabold">{plan.price}</p>
              <p className="mt-4 text-sm text-slate-600">
                {plan.places?.length || 0} places included
              </p>
              <div className="mt-5 flex flex-wrap gap-2 sm:mt-7">
                <button type="button" onClick={() => { setSelected(index); setCollapsed(true); setShowDetails(false); }} className={`rounded-full px-4 py-2 text-sm font-bold ${selected === index ? "bg-blue-600 text-white" : "bg-blue-50 text-blue-700 hover:bg-blue-100"}`}>{selected === index ? "Selected" : "Select plan"}</button>
                <button type="button" onClick={() => { setSelected(index); setCollapsed(true); setShowDetails(true); }} className="rounded-full border border-blue-200 px-4 py-2 text-sm font-bold text-blue-700 hover:bg-blue-50">View more</button>
              </div>
            </article>
          ))}
        </div>
        {active && showDetails && (
          <section className="mt-8 rounded-3xl border border-blue-100 bg-white p-7 shadow-sm sm:p-10">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-bold text-blue-600">
                  {active.days} DAY JAIPUR TOUR
                </p>
                <h2 className="mt-2 text-3xl font-extrabold">
                  {active.title || "Places & price details"}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setShowDetails(false)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-bold"
              >
                Close
              </button>
            </div>
            {active.image && (
              <SiteImage
                src={assetUrl(active.image)}
                alt={active.title || `${active.days}-day Jaipur Tour`}
                className="mt-7 h-64 w-full rounded-2xl bg-slate-100 object-contain"
              />
            )}
            {active.description && (
              <p className="mt-5 text-base leading-7 text-slate-600">
                {active.description}
              </p>
            )}
            <p className="mt-5 text-2xl font-extrabold">{active.price}</p>
            <h3 className="mt-7 font-bold">Places included</h3>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {active.places?.map((place) => (
                <div
                  key={place}
                  className="rounded-xl bg-blue-50 px-4 py-3 font-medium"
                >
                  ✓ {place}
                </div>
              ))}
            </div>
            <p className="mt-7 text-sm leading-6 text-slate-600">
              {content.itineraryNote}
            </p>
          </section>
        )}
        <TourBookingForm service={service} plan={active} />
        <AdditionalContent service={service} />
        {pageConfig && <ServiceSeoContent pageConfig={pageConfig} />}
      </section>
    </main>
  );
}

function ServiceSeoContent({ pageConfig }) {
  return (
    <section className="mt-10 space-y-7 rounded-3xl border border-slate-200 bg-white p-6 sm:p-9">
      <p className="max-w-4xl text-base leading-7 text-slate-600">{pageConfig.intro}</p>
      {pageConfig.sections.map(([heading, body]) => (
        <section key={heading}>
          <h2 className="text-2xl font-extrabold">{heading}</h2>
          <p className="mt-3 max-w-4xl leading-7 text-slate-600">{body}</p>
        </section>
      ))}
      <nav aria-label="Related services" className="border-t border-slate-200 pt-6">
        <h2 className="text-xl font-extrabold">Explore related ChalakGo services</h2>
        <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-3">
          {pageConfig.related.map((path) => {
            const related = serviceSeoPages[path];
            return <li key={path}><Link className="font-semibold text-blue-700 underline-offset-4 hover:underline" to={path}>{related.serviceName}</Link></li>;
          })}
        </ul>
      </nav>
      <section>
        <h2 className="text-2xl font-extrabold">Frequently asked questions</h2>
        <div className="mt-4 divide-y divide-slate-200">
          {pageConfig.faqs.map(([question, answer]) => (
            <details key={question} className="py-4">
              <summary className="cursor-pointer font-bold text-[#10213f]">{question}</summary>
              <p className="mt-3 leading-7 text-slate-600">{answer}</p>
            </details>
          ))}
        </div>
      </section>
    </section>
  );
}

function TourBookingForm({ service, plan }) {
  let tourFare = null;
  let tourFareError = "";
  if (plan) {
    try { tourFare = calculateFixedFare({ tourPlanPrice: plan.price }); }
    catch (error) { tourFareError = error.message; }
  }
  const { hash } = useLocation();
  useEffect(() => {
    if (hash !== "#booking") return;
    const timer = setTimeout(
      () =>
        document.getElementById("booking")?.scrollIntoView({ block: "start" }),
      100,
    );
    return () => clearTimeout(timer);
  }, [hash]);
  const draft = useRef(readBookingDraft(service.slug)).current;
  const { coordinates, timestamp, loading, error, fetchLocation } =
    useCurrentLocation(draft);
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    ...draft?.form,
  });
  const [locationMode, setLocationMode] = useState(
    draft?.locationMode || "manual",
  );
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);
  const update = (event) =>
    setForm((old) => ({
      ...old,
      [event.target.name]:
        event.target.name === "phone"
          ? event.target.value.replace(/\D/g, "").slice(0, 10)
          : event.target.value,
    }));
  const useCurrent = async () => {
    setLocationMode("current");
    const result = await fetchLocation();
    if (result.coordinates)
      setForm((old) => ({
        ...old,
        ...addressFormValues(result.details),
      }));
  };
  const submit = async (event) => {
    event.preventDefault();
    if (!plan) return setStatus("Select a 1-day or 2-day tour plan first.");
    if (!tourFare) return setStatus(tourFareError);
    if (loading)
      return setStatus("Please wait for location detection to finish.");
    if (!/^[6-9][0-9]{9}$/.test(form.phone))
      return setStatus("Enter a valid 10-digit Indian mobile number.");
    if (locationMode === "current" && !coordinates)
      return setStatus("Fetch your current pickup location first.");
    setSaving(true);
    setStatus("");
    try {

      const response = await fetch(`${API_BASE}/api/bookings`, {
        method: "POST",
        credentials: "omit",
        headers: { "Content-Type": "application/json" },

        body: JSON.stringify({
          ...form,
          email: undefined,
          service: service.name,
          carType: "Tour vehicle",
          duration: `${plan.days} day tour`,
          tourPlanDays: plan.days,
          totalFare: tourFare.totalFare,
          ...pickupPayload(form, locationMode, coordinates, timestamp),
        }),
      });
      const data = await response.json();
      if (!response.ok) throw Error(data.message || data.error);
      clearBookingDraft();
      showBookingSuccess(data.booking, service.name);
      setStatus(
        `Booking ID: ${data.booking?.bookingId || "Saved successfully"}`,
      );
    } catch (requestError) {
      setStatus(requestError.message || "Unable to save booking.");
      toast.error(requestError.message || "Unable to save booking.");
    } finally {
      setSaving(false);
    }
  };
  if (!plan) return null;
  return (
    <form
      id="booking"
      onSubmit={submit}
      className="col-span-full mt-6 rounded-3xl bg-white p-7 shadow-xl sm:p-10"
    >
      <p className="font-bold text-blue-600">BOOK JAIPUR TOUR</p>
      <h2 className="mt-2 text-3xl font-extrabold">
        Share your details to reserve this plan.
      </h2>
      <p className="mt-2 text-slate-500">
        Selected plan:{" "}
        {plan ? `${plan.days} day tour · ${plan.price}` : "Choose a plan above"}
      </p>
      <div className="mt-7 grid gap-5 sm:grid-cols-2">
        <label className="text-sm font-bold">
          Full name
          <input
            className="input"
            name="fullName"
            value={form.fullName}
            onChange={update}
            required
          />
        </label>
        <label className="text-sm font-bold">
          Mobile number
          <input
            className="input"
            name="phone"
            value={form.phone}
            onChange={update}
            required
            inputMode="numeric"
            maxLength="10"
          />
        </label>
        {locationMode === "manual" &&
          manualFields.map(([title, name]) => (
            <label key={name} className="text-sm font-bold">
              {title}
              <input
                className="input"
                name={name}
                value={form[name] || ""}
                onChange={update}
                required
                {...(name === "pincode"
                  ? {
                      inputMode: "numeric",
                      pattern: "[1-9][0-9]{5}",
                      maxLength: 6,
                    }
                  : {})}
              />
            </label>
          ))}
      </div>
      <div className="mt-5"><ServiceFareEstimate kind="fixed" selected={plan.title || `${plan.days}-day Jaipur Tour`} days={plan.days} fare={tourFare} error={tourFareError} /></div>
      <div className="pickup-panel mt-5">
        <div className="flex items-center gap-3">
          <span className="pickup-icon"><MapPin size={21} aria-hidden="true" /></span>
          <div><h3 className="font-extrabold">Pickup location</h3><p className="mt-1 text-sm text-slate-500">Choose GPS or enter an address.</p></div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2 sm:mt-5 sm:gap-3">
          <button type="button" aria-pressed={locationMode === "current"} onClick={useCurrent} disabled={loading} className={`pickup-mode ${locationMode === "current" ? "pickup-mode-active" : ""}`}>
            <LocateFixed size={18} aria-hidden="true" />{loading ? "Detecting..." : "Use current location"}
          </button>
          <button type="button" aria-pressed={locationMode === "manual"} onClick={() => setLocationMode("manual")} className={`pickup-mode ${locationMode === "manual" ? "pickup-mode-active" : ""}`}>
            <PencilLine size={17} aria-hidden="true" />Enter manually
          </button>
        </div>
        <p role="status" aria-live="polite" className="mt-3 text-sm text-slate-600">
          {locationMode === "current" ? loading ? "Finding your pickup point" : error || (coordinates ? "Location set. Tap above to refresh." : "Tap above to detect your location.") : "Enter your pickup address in the form."}
        </p>
      </div>
      <button
        disabled={saving || loading}
        className="mt-7 w-full rounded-xl bg-blue-600 py-4 font-bold text-white disabled:opacity-60"
      >
        {saving
          ? "Saving booking..."
          : `Book ${plan ? `${plan.days}-day tour` : "tour"}`}
      </button>
      {status && (
        <p className="mt-4 text-center font-medium text-blue-700">{status}</p>
      )}
    </form>
  );
}

function PermanentInfo({ service, selected, onSelect, plansOnly = false, extrasOnly = false }) {
  const [collapsed, setCollapsed] = useState(false);
  const content = contentOf(service);
  const monthlyRates = {
    sixToEight: 15000,
    eightToTen: 18000,
    tenToTwelve: 22000,
    ...service.monthlyRates,
  };
  const plans = [
    [
      "6–8 Hours / Day",
      content.monthlyLeave,
      `₹${monthlyRates.sixToEight.toLocaleString("en-IN")}/month`,
    ],
    [
      "8–10 Hours / Day",
      content.monthlyLeave,
      `₹${monthlyRates.eightToTen.toLocaleString("en-IN")}/month`,
    ],
    [
      "10–12 Hours / Day",
      content.monthlyLeave,
      `₹${monthlyRates.tenToTwelve.toLocaleString("en-IN")}/month`,
    ],
  ];
  return (
    <section className="mt-8 space-y-6">
      {(!plansOnly || extrasOnly) && <div>
        <p className="font-bold text-blue-600">{content.sectionEyebrow}</p>
        <h2 className="mt-2 text-3xl font-extrabold">
          {content.sectionTitle}
        </h2>
        <p className="mt-3 max-w-4xl leading-7 text-slate-600">
          {content.sectionDescription}
        </p>
      </div>}
      {(!plansOnly || extrasOnly) && <div>
        <h2 className="text-2xl font-extrabold">{content.benefitsTitle}</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {(content.benefits || '').split('\n').filter(Boolean).map(line => { const [title, ...body] = line.split('|'); return [title, body.join('|')]; }).map(([title, body]) => (
            <div
              key={title}
              className="rounded-xl border border-slate-200 bg-white p-5"
            >
              <p className="font-bold">✓ {title}</p>
              <p className="mt-1 text-sm text-slate-600">{body}</p>
            </div>
          ))}
        </div>
      </div>}
      {!extrasOnly && <div>
        <div className="flex items-center justify-between gap-3"><h2 className="text-2xl font-extrabold">{content.plansTitle}</h2>{collapsed && <button type="button" onClick={() => setCollapsed(false)} className="text-sm font-bold text-blue-700">Change plan</button>}</div>
        <div className="mt-4 grid gap-3 lg:grid-cols-3">
          {plans.map(([timing, leave, salary]) => (
            <article
              key={timing}
              className={`${selected === timing || !collapsed ? "block" : "hidden sm:block"} rounded-2xl border p-4 shadow-sm sm:p-6 ${selected === timing ? "border-blue-600 bg-blue-50 ring-2 ring-blue-600" : "border-slate-200 bg-white"}`}
            >
              <h3 className="text-xl font-extrabold">{timing}</h3>
              <p className="mt-4 text-sm text-slate-600">
                <b className="text-[#10213f]">Leave:</b> {leave}
              </p>
              <p className="mt-2 text-sm text-slate-600">
                <b className="text-[#10213f]">Salary:</b> {salary}
              </p>
              <button
                type="button"
                aria-label={`Select ${timing}`}
                aria-pressed={selected === timing}
                onClick={() => { onSelect(timing); setCollapsed(true); }}
                className={`mt-5 w-full rounded-lg px-4 py-2.5 text-sm font-semibold ${selected === timing ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-800 hover:bg-blue-100"}`}
              >
                {selected === timing ? "Selected ✓" : "Select Plan →"}
              </button>
            </article>
          ))}
        </div>
      </div>}
      {(!plansOnly || extrasOnly) && <div className="rounded-2xl border border-blue-100 bg-blue-50 p-6">
        <h2 className="text-2xl font-extrabold">
          {content.otherTitle}
        </h2>
        <div className="mt-4 flex flex-wrap gap-x-8 gap-y-3 text-sm font-semibold text-slate-700">
          {(content.otherServices || '').split('\n').filter(Boolean).map((item) => (
            <span key={item}>• {item}</span>
          ))}
        </div>
      </div>}
    </section>
  );
}

function BookingForm({ service }) {
  const { hash } = useLocation();
  useEffect(() => {
    if (hash !== "#booking") return;
    const timer = setTimeout(
      () =>
        document.getElementById("booking")?.scrollIntoView({ block: "start" }),
      100,
    );
    return () => clearTimeout(timer);
  }, [hash]);
  const draft = useRef(readBookingDraft(service.slug)).current;
  const {
    coordinates,
    timestamp,
    loading,
    error,
    acquisitionStatus,
    fetchLocation,
    fetchInitialLocation,
  } = useCurrentLocation(draft);
  const locationRequest = useRef(0);
  const permanent = service.slug === "permanent-driver";
  const distanceBased =
    service.pricingType === "distance" || service.slug === "car-driver";
  const monthlyBased = service.pricingType === "monthly" || permanent;
  const carTypeOptions = distanceBased
    ? [
        "SUV (5 seater)",
        "SUV (7 seater)",
        "Hatchback (5 seater)",
        "Haravan Traveller",
      ]
    : ["Sedan / SUV", "Hatchback"];
  const driverOnly = service.slug === "driver-only" || service.name === "Driver Only";
  const pricing = driverPricing(service.driverPricing);
  const temporary = driverOnly ||
    !permanent &&
    !distanceBased &&
    !monthlyBased &&
    /(?:\/|per\s+)(?:hr|hour|hours?|day|days?)\b/i.test(service.price || "");
  const [locationMode, setLocationMode] = useState(
    draft?.locationMode || "current",
  );
  const manualAddress = useRef(addressFormValues(null));
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const submitPending = useRef(false);
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    address: "",
    area: "",
    pincode: "",
    city: "",
    state: "",
    mainRoad: "",
    carType: distanceBased ? "SUV (5 seater)" : "Sedan / SUV",
    distanceKm: "",
    driverPackage: "4",
    nightCharge: false,
    duration: permanent ? "6–8 Hours / Day" : "8 Hours",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    ...draft?.form,
  });

  useEffect(() => {
    if (draft) return;
    let cancelled = false;
    const request = locationRequest.current;
    void fetchInitialLocation().then((result) => {
      if (
        !cancelled &&
        request === locationRequest.current &&
        result.coordinates
      ) {
        setForm((old) => ({ ...old, ...addressFormValues(result.details) }));
      }
    });
    return () => {
      cancelled = true;
    };
  }, [fetchInitialLocation, draft]);

  let fare = null;
  let fareError = "";
  if (distanceBased) {
    try {
      fare = calculateDistanceFare({
        ...form,
        vehicleRates: service.vehicleRates || { suv: 12, hatchback: 11 },
      });
    } catch (error) {
      fareError = error.message;
    }
  } else if (monthlyBased) {
    try {
      fare = calculateMonthlyFare({
        duration: form.duration,
        monthlyRates: service.monthlyRates || {
          sixToEight: 15000,
          eightToTen: 18000,
          tenToTwelve: 22000,
        },
      });
    } catch (error) {
      fareError = error.message;
    }
  } else if (temporary) {
    try {
      fare = driverOnly ? calculateDriverOnlyFare({ ...form, driverPricing: pricing, nightCharge: false }) : calculateTemporaryDriverFare({ ...form, price: service.price });
    } catch (error) {
      fareError = error.message;
    }
  }

  const update = (event) =>
    setForm((old) => ({
      ...old,
      [event.target.name]:
        event.target.name === "phone"
          ? event.target.value.replace(/\D/g, "").slice(0, 10)
          : event.target.value,
    }));
  const field = (title, name, type = "text", extra = {}) => (
    <label key={name} className="text-sm font-bold">
      {title}
      <input
        className="input"
        name={name}
        type={type}
        value={form[name] || ""}
        onChange={update}
        {...extra}
      />
    </label>
  );

  const submit = async (event) => {
    event.preventDefault();
    if (submitPending.current) return;
    if (loading && locationMode === "current")
      return setStatus("Please wait for location detection to finish.");
    if ((temporary || distanceBased || monthlyBased) && !fare)
      return setStatus(fareError);
    if (!/^[6-9][0-9]{9}$/.test(form.phone))
      return setStatus("Enter a valid 10-digit Indian mobile number.");

    const pickupCoordinates =
      locationMode === "current"
        ? coordinates
        : undefined;
    const pickupTimestamp =
      locationMode === "current"
        ? timestamp
        : undefined;

    if (
      locationMode === "current" &&
      (!pickupCoordinates ||
        !Number.isFinite(pickupCoordinates.latitude) ||
        !Number.isFinite(pickupCoordinates.longitude))
    ) {
      return setStatus(
        "Fetch your current pickup location before submitting.",
      );
    }

    const payload = {
      ...form,
      email: undefined,
      service: service.name,
      ...(temporary || distanceBased || monthlyBased
        ? {
            duration: distanceBased
              ? `${fare.distanceKm} km`
              : monthlyBased
                ? form.duration
                : fare.duration,
            ...(temporary ? { durationMinutes: fare.durationMinutes } : {}),
            distanceKm: distanceBased ? fare.distanceKm : undefined,
            totalFare: fare.totalFare,
          }
        : {}),
      ...pickupPayload(form, locationMode, pickupCoordinates, pickupTimestamp),
    };

    submitPending.current = true;
    setSubmitting(true);
    setStatus("");
    const toastId = toast.loading("Saving your booking...");
    try {

      const response = await fetch(`${API_BASE}/api/bookings`, {
        method: "POST",
        credentials: "omit",
        headers: { "Content-Type": "application/json" },

        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(
          data.error ? `${data.message}: ${data.error}` : data.message,
        );
      clearBookingDraft();
      showBookingSuccess(data.booking, service.name, toastId);
      setStatus(
        data.booking?.bookingId
          ? `Booking ID: ${data.booking.bookingId}`
          : "Booking request saved successfully.",
      );
    } catch (requestError) {
      const message =
        requestError.message ||
        "Could not reach the booking server. Start the backend first.";
      toast.error("Unable to save booking", {
        id: toastId,
        description: message,
      });
      setStatus(message);
    } finally {
      submitPending.current = false;
      setSubmitting(false);
    }
  };

  const chooseMode = async (mode) => {
    const request = ++locationRequest.current;
    if (mode !== locationMode) {
      if (locationMode === "manual")
        manualAddress.current = {
          ...Object.fromEntries(
            addressFields.map(([, name]) => [name, form[name] || ""]),
          ),
          address: form.address,
        };
      setForm((old) => ({
        ...old,
        ...(mode === "manual"
          ? manualAddress.current
          : addressFormValues(null)),
      }));
    }
    setLocationMode(mode);
    setStatus("");
    if (mode !== "current") return;
    const result = await fetchLocation();
    if (request !== locationRequest.current) return;
    if (result.coordinates)
      setForm((old) => ({ ...old, ...addressFormValues(result.details) }));
  };

  const showAddressForm = locationMode === "manual";
  const locationFields = manualFields;
  const distanceControls = distanceBased
    ? field("Trip distance (km)", "distanceKm", "number", {
        min: 1,
        step: "0.1",
        required: true,
      })
    : null;
  let distancePreview = null;
  if (distanceBased && !form.distanceKm) {
    try { distancePreview = calculateDistanceFare({ carType: form.carType, distanceKm: 1, vehicleRates: service.vehicleRates }); } catch { /* A valid vehicle is required. */ }
  }
  const distanceEstimate = distanceBased && <ServiceFareEstimate kind="distance" selected={form.carType} fare={fare} preview={distancePreview} error={form.distanceKm ? fareError : ""} />;
  const monthlyEstimate = monthlyBased && <ServiceFareEstimate kind="monthly" selected={form.duration} duration={form.duration} fare={fare} error={fareError} />;
  const schedules = (
    <>
      {field("Start date & time", "startDateTime", "datetime-local", {
        required: true,
      })}
      {field("End date & time", "endDateTime", "datetime-local", {
        required: true,
        min: form.startDateTime || undefined,
      })}
      {distanceControls}
      {distanceEstimate}
      {monthlyEstimate}
    </>
  );
  const temporaryEstimate = driverOnly ? (
    <DriverFareEstimate pricing={pricing} selected={form.driverPackage} fare={fare} error={fareError} hasSchedule={Boolean(form.startDateTime || form.endDateTime)} />
  ) : temporary && <ServiceFareEstimate kind="hourly" selected={service.name} fare={fare} error={fareError} />;
  return (
    <>
    {driverOnly && <DriverPlans pricing={pricing} selected={form.driverPackage} onSelect={(driverPackage) => setForm((old) => ({ ...old, driverPackage }))} />}
    {distanceBased && <CabPlans service={service} selected={form.carType} onSelect={(carType) => setForm((old) => ({ ...old, carType }))} />}
    {permanent && <PermanentInfo service={service} selected={form.duration} onSelect={(duration) => setForm((old) => ({ ...old, duration }))} plansOnly />}
    <motion.form
      id="booking"
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onSubmit={submit}
      className="mt-8 rounded-3xl bg-white p-7 shadow-xl sm:p-10"
    >
      <p className="font-bold text-blue-600">
        BOOK {service.name.toUpperCase()}
      </p>
      <h2 className="mt-2 text-3xl font-extrabold">
        {permanent ? "Share your driver schedule." : "Share your trip details."}
      </h2>
      <p className="mt-2 text-slate-500">
        Choose the service dates and daily timings, then use live GPS or enter
        the pickup address.
      </p>
      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        {field("Full name", "fullName", "text", { required: true })}
        {field("Mobile number", "phone", "tel", {
          required: true,
          inputMode: "numeric",
          maxLength: 10,
        })}
        {!driverOnly && !permanent && <label className="text-sm font-bold">
          Car type
          <select
            className="input"
            name="carType"
            value={form.carType}
            onChange={update}
          >
            {carTypeOptions.map((type) => (
              <option key={type}>{type}</option>
            ))}
          </select>
        </label>}
        {distanceBased || permanent ? null : permanent ? (
          <label className="text-sm font-bold">
            Daily working hours
            <select
              className="input"
              name="duration"
              value={form.duration}
              onChange={update}
            >
              <option>6–8 Hours / Day</option>
              <option>8–10 Hours / Day</option>
              <option>10–12 Hours / Day</option>
            </select>
          </label>
        ) : temporary ? (driverOnly ? null :
          <div className="text-sm font-bold">
            Duration
            <p className="mt-2">
              {fare?.duration || "Select start and end date/time"}
            </p>
          </div>
        ) : (
          <label className="text-sm font-bold">
            Duration
            <select
              className="input"
              name="duration"
              value={form.duration}
              onChange={update}
            >
              <option>6 Hours</option>
              <option>8 Hours</option>
              <option>12 Hours</option>
              <option>Weekly</option>
              <option>Monthly</option>
            </select>
          </label>
        )}
        {schedules}
        {temporaryEstimate}
        <div className="pickup-panel sm:col-span-2">
          <div className="flex items-center gap-3">
            <span className="pickup-icon"><MapPin size={23} aria-hidden="true" /></span>
            <div><h3 className="text-base font-extrabold">Pickup location</h3><p className="mt-0.5 text-xs text-slate-500">GPS or a manual address</p></div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 sm:mt-5 sm:gap-3">
            <button
              type="button"
              aria-pressed={locationMode === "current"}
              disabled={loading}
              onClick={() => chooseMode("current")}
              className={`pickup-mode ${locationMode === "current" ? "pickup-mode-active" : ""}`}
            >
              <LocateFixed size={19} aria-hidden="true" />
              {loading ? "Detecting…" : "Use current location"}
            </button>
            <button
              type="button"
              aria-pressed={locationMode === "manual"}
              onClick={() => chooseMode("manual")}
              className={`pickup-mode ${locationMode === "manual" ? "pickup-mode-active" : ""}`}
            >
              <PencilLine size={18} aria-hidden="true" />
              Enter manually
            </button>
          </div>
          {locationMode === "current" && <p className="mt-3 text-xs text-slate-600" role="status" aria-live="polite">{loading ? acquisitionStatus : error || (coordinates ? "Location set. Tap above to refresh." : "Tap above to detect your location.")}</p>}
        </div>
        {showAddressForm && (
          <>
            <h3 className="font-bold sm:col-span-2">
              {locationMode === "manual"
                ? "Enter pickup address manually"
                : "Update current pickup address"}
            </h3>
            {locationFields.map(([title, name]) =>
              field(title, name, "text", {
                disabled: loading && locationMode === "current",
                required:
                  locationMode === "manual" &&
                  (name === "city" || name === "state"),
                ...(name === "pincode"
                  ? {
                      inputMode: "numeric",
                      pattern: "[1-9][0-9]{5}",
                      maxLength: 6,
                    }
                  : {}),
              }),
            )}
          </>
        )}
      </div>
      <button
        disabled={submitting || (loading && locationMode === "current")}
        className="booking-submit"
      >
        {submitting && <LoaderCircle size={19} className="animate-spin" aria-hidden="true" />}
        {submitting ? "Saving booking..." : "Submit Booking Request"}
        {!submitting && <ArrowRight size={19} aria-hidden="true" />}
      </button>
      {status && (
        <p role="status" className="mt-4 rounded-xl bg-slate-50 px-4 py-3 text-center text-sm leading-6 text-slate-600">{status}</p>
      )}
    </motion.form>
    {permanent && <PermanentInfo service={service} selected={form.duration} onSelect={() => {}} extrasOnly />}
    <AdditionalContent service={service} />
    </>
  );
}

function AdditionalContent({ service }) { return service.content ? <section className="mt-10 whitespace-pre-wrap rounded-2xl border border-slate-200 bg-white p-7 leading-7 text-slate-700">{service.content}</section> : null; }
