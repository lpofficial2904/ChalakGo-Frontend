import {
  ArrowRight,
  ShieldCheck,
  CarFront,
  HeartHandshake,
  MapPin,
  CalendarDays,
  Check,
  Route,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useLiveEffect } from "./LiveSite";
import { API_BASE } from "../utils/api.js";
import { assetUrl } from "../utils/assets.js";
import hero from "../assets/hero.png";

const services = [
  [
    "01",
    "Your car. Your comfort.",
    "Book a professional driver for your own car, for everyday plans or an evening out.",
    "driver-only",
    CarFront,
  ],
  [
    "02",
    "A ride for every plan.",
    "Choose a car with a driver for family travel, work commitments and longer journeys.",
    "car-driver",
    Route,
  ],
  [
    "03",
    "A familiar daily routine.",
    "Explore a dedicated monthly driver for regular commutes and family schedules.",
    "permanent-driver",
    CalendarDays,
  ],
];
const values = [
  [
    ShieldCheck,
    "Confidence in every journey",
    "Professional drivers and thoughtful service, with your comfort at the centre.",
  ],
  [
    HeartHandshake,
    "People before everything",
    "Tell us what your journey needs. We help you find a service that fits your plans.",
  ],
  [
    MapPin,
    "Local roots. More possibilities.",
    "From everyday journeys in Jaipur to exploring the Pink City, we make getting around simpler.",
  ],
];
export default function About() {
  const [heroImage, setHeroImage] = useState(hero);
  useLiveEffect(() => {
    fetch(`${API_BASE}/api/settings`)
      .then((response) => (response.ok ? response.json() : null))
      .then((settings) => {
        if (settings?.aboutHeroImage) setHeroImage(settings.aboutHeroImage);
      })
      .catch(() => {});
  }, []);

  return (
    <main className="overflow-hidden bg-[#f7f9fc] text-[#10213f]">
      <section className="relative bg-[#0b1c38] px-5 pb-16 pt-14 text-white sm:py-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-32 top-0 h-96 w-96 rounded-full bg-blue-500/15 blur-3xl"
        />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.24em] text-cyan-300">
              The people behind the journey
            </p>
            <h1 className="mt-6 text-4xl font-extrabold leading-[1.12] tracking-tight sm:text-6xl">
              More than a drive.
              <br />
              <span className="text-blue-300">Peace of mind.</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-8 text-slate-300">
              Life has enough moving parts. At ChalakGo, we make finding a
              driver one less thing to think about.
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                to="/services"
                className="inline-flex items-center gap-3 rounded-xl bg-blue-600 px-6 py-4 font-bold transition hover:bg-blue-500"
              >
                Find your service <ArrowRight size={18} />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center rounded-xl border border-white/25 px-6 py-4 font-bold transition hover:bg-white/10"
              >
                Talk to us
              </Link>
            </div>
            <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-sm text-blue-100">
              {[
                "Professional drivers",
                "Flexible bookings",
                "Personal support",
              ].map((text) => (
                <span key={text} className="inline-flex items-center gap-2">
                  <Check size={16} className="text-cyan-300" />
                  {text}
                </span>
              ))}
            </div>
          </div>
          <div className="relative rounded-[2rem] border border-white/15 bg-gradient-to-br from-blue-100 to-slate-200 p-5 shadow-2xl sm:p-8">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-[#10213f]">
              <span>ChalakGo</span>
              <span>Jaipur, India</span>
            </div>
            <img
              src={assetUrl(heroImage)}
              alt="ChalakGo driving service"
              className="mt-5 aspect-[4/3] w-full rounded-2xl object-contain"
            />
            <div className="mt-4 flex items-center gap-4 rounded-2xl bg-white p-5 text-[#10213f]">
              <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                <CarFront size={26} />
              </div>
              <div>
                <p className="font-extrabold">Your plans, our drive.</p>
                <p className="mt-1 text-sm text-slate-500">
                  Everyday travel, made more comfortable.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="mx-auto grid max-w-6xl gap-8 px-5 py-16 sm:py-24 lg:grid-cols-[.7fr_1.3fr] lg:gap-20">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.2em] text-blue-600">
            Our purpose
          </p>
          <h2 className="mt-4 text-3xl font-extrabold leading-tight sm:text-4xl">
            Less coordination.
            <br />
            More living.
          </h2>
        </div>
        <div>
          <p className="text-xl leading-9 text-slate-600">
            A commute, a family visit, a special occasion. Every journey matters
            to someone. We connect you with driver services that work around
            your life.
          </p>
          <p className="mt-5 leading-8 text-slate-500">
            Whether you prefer the familiarity of your own car, need a car with
            a driver, or want help with a regular routine, ChalakGo brings the
            options together in one place.
          </p>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-5 pb-16 sm:pb-24">
        <div className="mb-9 flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.2em] text-blue-600">
              Made for the way you move
            </p>
            <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">
              Different plans. The same care.
            </h2>
          </div>
          <Link
            to="/services"
            className="inline-flex items-center gap-2 font-bold text-blue-600"
          >
            All services <ArrowRight size={18} />
          </Link>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {services.map(([number, title, body, slug, Icon]) => (
            <Link
              key={slug}
              to={`/services/${slug}`}
              className="group rounded-3xl border border-slate-200 bg-white p-7 transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl focus-visible:outline-blue-600"
            >
              <div className="flex items-center justify-between">
                <Icon size={30} className="text-blue-600" />
                <span className="text-sm font-bold text-slate-400">
                  {number}
                </span>
              </div>
              <h3 className="mt-10 text-xl font-extrabold">{title}</h3>
              <p className="mt-4 text-sm leading-7 text-slate-500">{body}</p>
              <span className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-blue-600">
                Explore service <ArrowRight size={16} />
              </span>
            </Link>
          ))}
        </div>
      </section>
      <section className="border-y border-blue-100 bg-blue-50/60 px-5 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-bold uppercase tracking-[.2em] text-blue-600">
            What matters to us
          </p>
          <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">
            Good service starts with care.
          </h2>
          <div className="mt-10 grid gap-9 md:grid-cols-3">
            {values.map(([Icon, title, text]) => (
              <article key={title}>
                <div className="inline-flex rounded-2xl bg-white p-4 text-blue-600 shadow-sm">
                  <Icon size={25} />
                </div>
                <h3 className="mt-5 text-lg font-extrabold">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-5 py-16 sm:py-24">
        <div className="flex flex-col justify-between gap-8 rounded-3xl bg-[#0b1c38] p-8 text-white sm:p-12 lg:flex-row lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.2em] text-cyan-300">
              Let's get you moving
            </p>
            <h2 className="mt-4 text-3xl font-extrabold">
              Where will your next journey take you?
            </h2>
            <p className="mt-4 text-slate-300">
              Choose your service. Share your plans. Leave the driving to us.
            </p>
          </div>
          <Link
            to="/services"
            className="inline-flex shrink-0 items-center justify-center gap-3 rounded-xl bg-white px-6 py-4 font-bold text-blue-700 transition hover:bg-blue-50"
          >
            Explore & book <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </main>
  );
}
