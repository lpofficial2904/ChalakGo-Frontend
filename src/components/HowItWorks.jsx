import { motion } from 'framer-motion'

const steps = [
  [
    '01',
    'Choose Service',
    'Select Driver Only, Car + Driver, or Permanent Driver on our simple dashboard.',
  ],
  ['02', 'Set Details', 'Pick your schedule, location, and vehicle type with precise parameters.'],
  ['03', 'Get Matched', 'Instantly match with a certified professional driver for your route.'],
  [
    '04',
    'Enjoy Your Ride',
    'Track your ride status, relax in comfort, and experience premium mobility.',
  ],
]
const reveal = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55 },
}

export default function HowItWorks() {
  return (
    <main className="min-h-screen bg-[#090f20] text-white">
      <section className="mx-auto max-w-[1280px] px-6 py-24 sm:py-32">
        <motion.div {...reveal} className="text-center">
          <p className="text-sm font-bold text-blue-500">SIMPLIFIED FLOW</p>
          <h1 className="mt-4 text-4xl font-extrabold sm:text-6xl">Your Chauffeur in Minutes</h1>
          <p className="mt-5 text-lg text-slate-400">
            Our streamlined technology makes elite service intuitive.
          </p>
        </motion.div>
        <div className="mt-20 grid gap-10 md:grid-cols-4">
          {steps.map(([number, title, body], index) => (
            <motion.article
              {...reveal}
              transition={{ delay: index * 0.12, duration: 0.5 }}
              key={number}
              className="relative"
            >
              <div className="mb-7 text-5xl font-extrabold text-blue-500">{number}</div>
              <div className="absolute left-32 right-2 top-6 hidden h-px bg-slate-700 md:block" />
              <h2 className="text-xl font-extrabold">{title}</h2>
              <p className="mt-3 leading-6 text-slate-400">{body}</p>
            </motion.article>
          ))}
        </div>
      </section>
    </main>
  )
}
