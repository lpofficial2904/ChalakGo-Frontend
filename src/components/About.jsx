import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const values = [
  [
    'Verified by design',
    'Every driver goes through identity, driving history, and background verification before joining our network.',
  ],
  [
    'Reliability at scale',
    'Smart matching and live trip visibility help deliver dependable service when your schedule matters.',
  ],
  [
    'Human support, always',
    'Our India-based support team is available to help with bookings, changes, and special requests.',
  ],
]
export default function About() {
  return
  ;<main className="min-h-screen bg-[#f7f9fc] text-[#101a31]">
    <section className="overflow-hidden bg-[#0b1c38] px-5 py-20 text-white sm:py-28">
      <div className="mx-auto grid max-w-[1240px] gap-12 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
        <motion.div initial={{ opacity: 0, x: -28 }} animate={{ opacity: 1, x: 0 }}>
          <p className="font-bold text-blue-300">ABOUT CHALAKGO</p>
          <h1 className="mt-4 text-5xl font-extrabold leading-tight sm:text-6xl">
            Professional driving, built around people.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            We make it easier to move with confidence. ChalakGo connects individuals, families, and
            organisations to verified professional drivers for their own cars and premium mobility
            needs across India.
          </p>
          <Link
            to="/services"
            className="mt-8 inline-block rounded-xl bg-blue-600 px-6 py-3 font-bold text-white"
          >
            Explore our services
          </Link>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.12 }}
          className="grid grid-cols-2 gap-4"
        >
          <Stat value="✅" label="Verified Professional Drivers" />
          <Stat value="🛡️" label="Safety-Focused Service" />
          <Stat value="📞 24/7" label="Booking Support" />
          <Stat value="🚘" label="Drivers for Your Own Car" />
        </motion.div>
      </div>
    </section>
    <section className="mx-auto max-w-[1240px] px-5 py-20 sm:py-28">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-2xl"
      >
        <p className="font-bold text-blue-600">WHY WE EXIST</p>
        <h2 className="mt-3 text-4xl font-extrabold">
          A safer, more effortless way to get where you need to go.
        </h2>
        <p className="mt-5 text-lg leading-7 text-slate-600">
          From one-off evening rides to a dedicated monthly chauffeur, our service is designed for
          trust, comfort, and complete control.
        </p>
      </motion.div>
      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        {values.map(([title, body], i) => (
          <motion.article
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            key={title}
            className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
          >
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-blue-50 text-xl text-blue-600">
              ✦
            </div>
            <h3 className="mt-6 text-2xl font-extrabold">{title}</h3>
            <p className="mt-3 leading-7 text-slate-500">{body}</p>
          </motion.article>
        ))}
      </div>
    </section>
  </main>
}
function Stat({ value, label }) {
  return (
    <div className="rounded-2xl border border-blue-400/20 bg-white/5 p-5 backdrop-blur">
      <p className="text-3xl font-extrabold text-blue-300">{value}</p>
      <p className="mt-2 text-sm text-slate-300">{label}</p>
    </div>
  )
}
