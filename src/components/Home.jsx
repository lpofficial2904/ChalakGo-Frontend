import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle2, Clock3, MapPin, ShieldCheck, Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import { API_BASE } from '../utils/api.js'

const fallbackServices = [
  {
    slug: 'driver-only',
    name: 'Driver Only',
    price: 'From ₹65/hr',
    detail: 'A trained professional to drive your own car.',
    image:
      'https://images.unsplash.com/photo-1551830820-330a71b99659?auto=format&fit=crop&w=900&q=85',
  },
  {
    slug: 'car-driver',
    name: 'Cab + Driver',
    price: 'From ₹14/km',
    detail: 'A clean car with a trusted driver for every journey.',
    image:
      'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=900&q=85',
  },
  {
    slug: 'permanent-driver',
    name: 'Permanent Driver',
    price: 'Monthly plans',
    detail: 'A dependable driver matched to your daily routine.',
    image:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=85',
  },
]
const fallbackHero =
  'https://images.unsplash.com/photo-1598894000396-66c3f7212b6f?auto=format&fit=crop&w=1400&q=90'
const reveal = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
}

export default function Home() {
  const [services, setServices] = useState(fallbackServices)
  const [heroImage, setHeroImage] = useState(fallbackHero)
  useEffect(() => {
    fetch(`${API_BASE}/api/services`)
      .then((response) => (response.ok ? response.json() : []))
      .then((items) => {
        if (Array.isArray(items) && items.length) setServices(items)
      })
      .catch(() => {})
    fetch(`${API_BASE}/api/settings`)
      .then((response) => (response.ok ? response.json() : null))
      .then((settings) => {
        if (settings?.heroImage) setHeroImage(settings.heroImage)
      })
      .catch(() => {})
  }, [])

  return (
    <main className="overflow-hidden bg-[#f6f9ff] text-[#10213f]">
      <section className="relative isolate bg-[#071a37] px-5 pb-16 pt-14 text-white sm:pb-24 sm:pt-20">
        <div aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -left-28 -top-20 h-80 w-80 rounded-full bg-blue-500/25 blur-3xl" />
          <div className="absolute -bottom-32 right-0 h-96 w-96 rounded-full bg-cyan-400/15 blur-3xl" />
          <div className="absolute inset-0 opacity-[.06] [background-image:linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] [background-size:38px_38px]" />
        </div>
        <div className="mx-auto grid max-w-[1280px] gap-12 lg:grid-cols-[1.04fr_.96fr] lg:items-center">
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="inline-flex items-center gap-2 rounded-full border border-blue-300/25 bg-white/10 px-4 py-2 text-xs font-extrabold tracking-[.14em] text-blue-100">
              <ShieldCheck size={15} className="text-cyan-300" /> VERIFIED PROFESSIONAL DRIVERS
            </p>
            <h1 className="mt-7 max-w-3xl text-5xl font-extrabold leading-[1.03] tracking-tight sm:text-6xl xl:text-7xl">
              Your car. Our driver.<span className="block text-blue-300">Total peace of mind.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
              Professional, background-checked drivers for everyday travel, special occasions and
              business journeys—whenever you need one.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                to="/services"
                className="inline-flex items-center gap-2 rounded-xl bg-blue-500 px-6 py-4 font-extrabold text-white shadow-lg shadow-blue-950/30 transition hover:-translate-y-0.5 hover:bg-blue-400"
              >
                Book a driver <ArrowRight size={18} />
              </Link>
              <Link
                to="/pricing"
                className="rounded-xl border border-white/20 bg-white/5 px-6 py-4 font-extrabold text-white transition hover:bg-white/10"
              >
                View pricing
              </Link>
            </div>
            <div className="mt-11 grid max-w-xl grid-cols-3 gap-3 border-t border-white/10 pt-7">
              <Trust value="50K+" label="Trips completed" />
              <Trust value="4.9/5" label="Customer rating" />
              <Trust value="24/7" label="Booking support" />
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.94, x: 24 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="relative"
          >
            <div className="absolute -inset-4 rounded-[34px] bg-blue-400/15 blur-2xl" />
            <div className="relative overflow-hidden rounded-[30px] border border-white/15 shadow-2xl shadow-black/30">
              <img
                src={heroImage}
                alt="ChalakGo professional driver service"
                className="h-[380px] w-full object-cover sm:h-[510px]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#06142d]/75 via-transparent to-transparent" />
              <motion.div
                animate={{ y: [0, -7, 0] }}
                transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/20 bg-[#071a37]/75 p-4 backdrop-blur-md"
              >
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-cyan-300 text-[#06142d]">
                    <MapPin size={20} />
                  </span>
                  <div>
                    <p className="font-extrabold">Trusted on every route</p>
                    <p className="mt-0.5 text-xs text-blue-100">
                      Live updates from pickup to drop-off
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
      <ServicesPreview services={services} />
      <WhyChalakGo />
      <ContactPreview />
    </main>
  )
}

function Trust({ value, label }) {
  return (
    <div>
      <p className="text-xl font-extrabold text-white sm:text-2xl">{value}</p>
      <p className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-blue-200">
        {label}
      </p>
    </div>
  )
}

function ServicesPreview({ services }) {
  return (
    <section className="px-5 py-20 sm:py-28">
      <div className="mx-auto max-w-[1280px]">
        <motion.div {...reveal} className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-sm font-extrabold tracking-[.14em] text-blue-600">
              CHOOSE YOUR SERVICE
            </p>
            <h2 className="mt-3 max-w-xl text-4xl font-extrabold tracking-tight sm:text-5xl">
              Every journey deserves the right driver.
            </h2>
          </div>
          <Link
            to="/services"
            className="inline-flex items-center gap-2 font-extrabold text-blue-600"
          >
            Explore all services <ArrowRight size={18} />
          </Link>
        </motion.div>
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {services.slice(0, 3).map((service, index) => (
            <motion.article
              {...reveal}
              transition={{ delay: index * 0.1 }}
              key={service.slug}
              className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_12px_35px_rgba(25,54,96,.08)] transition hover:-translate-y-2 hover:shadow-[0_20px_45px_rgba(25,54,96,.14)]"
            >
              <div className="relative overflow-hidden">
                <img
                  src={service.image}
                  alt={service.name}
                  className="h-52 w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#061a39]/70 via-transparent to-transparent" />
                <p className="absolute bottom-4 left-5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-extrabold text-blue-700">
                  {service.price || 'Flexible pricing'}
                </p>
              </div>
              <div className="p-7">
                <h3 className="text-2xl font-extrabold">{service.name}</h3>
                <p className="mt-3 min-h-12 text-sm leading-6 text-slate-500">{service.detail}</p>
                <Link
                  to={`/services/${service.slug}`}
                  className="mt-6 inline-flex items-center gap-2 font-extrabold text-blue-600"
                >
                  View details <ArrowRight size={17} />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}

function WhyChalakGo() {
  const points = [
    [
      ShieldCheck,
      'Verified drivers',
      'Every driver is identity-checked and professionally vetted.',
    ],
    [Clock3, 'Book on your time', 'From a few hours to a dedicated monthly driver.'],
    [Star, 'Service you can trust', 'Clear communication and support throughout your ride.'],
  ]
  return (
    <section className="bg-white px-5 py-20 sm:py-28">
      <div className="mx-auto grid max-w-[1280px] gap-12 lg:grid-cols-[.8fr_1.2fr] lg:items-center">
        <motion.div {...reveal}>
          <p className="text-sm font-extrabold tracking-[.14em] text-blue-600">WHY CHALAKGO</p>
          <h2 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">
            Comfort is better when trust comes first.
          </h2>
          <p className="mt-5 max-w-lg text-lg leading-8 text-slate-500">
            We bring dependable drivers, transparent service and thoughtful support together in one
            simple booking experience.
          </p>
          <Link
            to="/about"
            className="mt-7 inline-flex items-center gap-2 font-extrabold text-blue-600"
          >
            Meet ChalakGo <ArrowRight size={18} />
          </Link>
        </motion.div>
        <div className="grid gap-4 sm:grid-cols-3">
          {points.map(([Icon, title, text], index) => (
            <motion.article
              {...reveal}
              transition={{ delay: index * 0.1 }}
              key={title}
              className="rounded-2xl border border-slate-200 bg-[#f8faff] p-6"
            >
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-200">
                <Icon size={22} />
              </span>
              <h3 className="mt-6 text-lg font-extrabold">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">{text}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}

function ContactPreview() {
  return (
    <section className="bg-[#eaf2ff] px-5 py-20 sm:py-24">
      <motion.div
        {...reveal}
        className="relative mx-auto max-w-[1120px] overflow-hidden rounded-[32px] bg-[#081a38] px-7 py-12 text-center text-white shadow-2xl shadow-blue-950/20 sm:px-16 sm:py-16"
      >
        <div
          aria-hidden="true"
          className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-blue-500/25 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-cyan-400/15 blur-3xl"
        />
        <div className="relative">
          <p className="inline-flex items-center gap-2 text-sm font-extrabold tracking-[.13em] text-blue-200">
            <CheckCircle2 size={17} /> HELP IS ALWAYS CLOSE
          </p>
          <h2 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
            Need help choosing a service?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-7 text-slate-300">
            Talk to our team for the right driver, timing and plan for your journey.
          </p>
          <Link
            to="/contact"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-4 font-extrabold text-blue-700 transition hover:-translate-y-0.5"
          >
            Talk to ChalakGo <ArrowRight size={18} />
          </Link>
        </div>
      </motion.div>
    </section>
  )
}
