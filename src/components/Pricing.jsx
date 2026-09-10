import { useLiveEffect } from "./LiveSite";
import { useEffect, useState } from "react";
import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { API_BASE } from "../utils/api.js";
import CabPricing from "./CabPricing";

const fallbackServices = [
  {
    slug: "driver-only",
    name: "Driver Only",
    price: "₹65/hr; ₹60/hr for 24 hours",
    detail: "A trained, verified chauffeur for your own car.",
  },
  {
    slug: "car-driver",
    name: "Cab (Car + Driver)",
    price: "SUV ₹18/km; Hatchback ₹14/km; Haravan Traveller ₹35/km",
    pricingType: "distance",
    vehicleRates: { suv: 12, hatchback: 11, traveller: 35 },
    detail: "Car and professional driver for every trip.",
  },
  {
    slug: "permanent-driver",
    name: "Permanent Driver",
    price: "₹15,000–₹22,000/month",
    pricingType: "monthly",
    monthlyRates: { sixToEight: 15000, eightToTen: 18000, tenToTwelve: 22000 },
    detail: "A dedicated driver for your daily routine.",
  },
  {
    slug: "jaipur-tour",
    name: "Jaipur Tour",
    price: "Plans from ₹2,999",
    pricingType: "fixed",
    tourPlans: [
      { days: 1, price: "₹2,999" },
      { days: 2, price: "₹3,499" },
    ],
    detail: "Private sightseeing with a professional driver.",
  },
];

/*function pricingLines(service) {
  if (service.pricingType === 'distance' && service.vehicleRates)
    return [
      service.vehicleRates.suv && `SUV · ₹${service.vehicleRates.suv}/km`,
      service.vehicleRates.hatchback && `Hatchback · ₹${service.vehicleRates.hatchback}/km`,
      service.vehicleRates.traveller && `Haravan Traveller · ₹${service.vehicleRates.traveller}/km`,
    ].filter(Boolean)
  if (service.pricingType === 'monthly' && service.monthlyRates)
    return [
      service.monthlyRates.sixToEight &&
        `6–8 hours · ₹${Number(service.monthlyRates.sixToEight).toLocaleString('en-IN')}/month`,
      service.monthlyRates.eightToTen &&
        `8–10 hours · ₹${Number(service.monthlyRates.eightToTen).toLocaleString('en-IN')}/month`,
      service.monthlyRates.tenToTwelve &&
        `10–12 hours · ₹${Number(service.monthlyRates.tenToTwelve).toLocaleString('en-IN')}/month`,
    ].filter(Boolean)
  if (service.pricingType === 'fixed' && service.tourPlans?.length)
    return service.tourPlans.map((plan) => `${plan.days}-day plan · ${plan.price}`)
  return service.price
    ? service.price
        .split(';')
        .map((item) => item.trim())
        .filter(Boolean)
    : []
}*/

export default function Pricing() {
  const [services, setServices] = useState(fallbackServices);
  useLiveEffect(() => {
    fetch(`${API_BASE}/api/services`)
      .then((response) => (response.ok ? response.json() : []))
      .then((items) => {
        if (Array.isArray(items) && items.length) setServices(items);
      })
      .catch(() => {});
  }, []);

  return (
    <main className="min-h-screen overflow-hidden bg-[#f6f9ff] px-5 py-10 text-[#10213f] sm:py-16">
      <section className="mx-auto max-w-6xl">
        <div className="relative overflow-hidden rounded-[32px] bg-[#091b38] px-7 py-12 text-center text-white shadow-2xl shadow-blue-950/15 sm:px-14 sm:py-16">
          <div
            aria-hidden="true"
            className="absolute -left-20 -top-24 h-64 w-64 rounded-full bg-blue-500/25 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="absolute -bottom-24 -right-12 h-64 w-64 rounded-full bg-cyan-400/20 blur-3xl"
          />
          <div className="relative">
            <p className="inline-flex items-center gap-2 rounded-full border border-blue-300/30 bg-white/10 px-4 py-2 text-xs font-bold tracking-[.14em] text-blue-100">
              <Sparkles size={14} /> TRANSPARENT SERVICE CHARGES
            </p>
            <h1 className="mt-5 text-4xl font-extrabold tracking-tight sm:text-5xl">
              Simple prices.
            </h1>
            <div className="mx-auto mt-7 flex w-fit items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-blue-100">
              <ShieldCheck size={17} className="text-cyan-300" /> Professional
              drivers · Clear rates · Trusted support
            </div>
          </div>
        </div>
        <div className="relative z-10 mx-auto -mt-5 grid max-w-[1160px] gap-5 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service, index) => {
            const accent =
              index % 3 === 0
                ? "from-blue-600 to-indigo-700"
                : index % 3 === 1
                  ? "from-cyan-500 to-blue-600"
                  : "from-violet-600 to-indigo-700";
            return (
              <article
                key={service.slug}
                className="group flex min-h-[390px] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_14px_40px_rgba(30,55,95,.10)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_48px_rgba(30,55,95,.16)]"
              >
                <div className={`h-2 bg-gradient-to-r ${accent}`} />
                <div className="flex flex-1 flex-col p-7">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[11px] font-extrabold tracking-[.11em] text-blue-600">
                        {service.eyebrow || "CHALAKGO SERVICE"}
                      </p>
                      <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-[#0b2145]">
                        {service.name}
                      </h2>
                    </div>
                    <span
                      className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${accent} text-white shadow-lg`}
                    >
                      <Sparkles size={19} />
                    </span>
                  </div>
                  {service.detail && (
                    <p className="mt-4 min-h-12 text-sm leading-6 text-slate-500">
                      {service.detail}
                    </p>
                  )}
                  <CabPricing service={service} />
                  <Link
                    to={`/services/${service.slug}`}
                    className="mt-auto inline-flex items-center justify-between border-t border-slate-100 pt-6 text-sm font-extrabold text-blue-600 transition group-hover:text-blue-800"
                  >
                    View details &amp; book <ArrowRight size={18} />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
        <p className="mt-10 text-center text-sm leading-6 text-slate-500">
          Taxes, tolls, parking and special requirements may be charged
          separately where applicable.
        </p>
      </section>
    </main>
  );
}
