import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { MessageCircle, ShieldCheck, Star } from 'lucide-react'
import PageLayout from './PageLayout'
import { API_BASE } from '../utils/api.js'

const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15 },
}

export default function Reviews() {
  const [reviews, setReviews] = useState([])
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetch(`${API_BASE}/api/reviews`)
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((items) =>
        setReviews([...new Map(items.map((review) => [String(review._id), review])).values()])
      )
      .catch(() => setMessage('Customer stories will appear here once they are published.'))
  }, [])

  return (
    <PageLayout>
      <main className="min-h-screen overflow-hidden bg-[#f7f9fc] text-[#10213f]">
        <section className="relative isolate overflow-hidden bg-[#081a38] px-5 py-20 text-white sm:py-28">
          <div
            aria-hidden="true"
            className="absolute -left-24 -top-20 h-80 w-80 rounded-full bg-blue-500/25 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="absolute -bottom-28 right-0 h-96 w-96 rounded-full bg-cyan-400/15 blur-3xl"
          />
          <motion.div {...reveal} className="relative mx-auto max-w-3xl text-center">
            <p className="inline-flex items-center gap-2 rounded-full border border-blue-300/25 bg-white/10 px-4 py-2 text-xs font-extrabold tracking-[.14em] text-blue-100">
              <MessageCircle size={15} className="text-cyan-300" /> CUSTOMER STORIES
            </p>
            <h1 className="mt-6 text-5xl font-extrabold tracking-tight sm:text-6xl">
              Trusted by people who <span className="text-blue-300">value every journey.</span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-300">
              Real experiences from customers who choose ChalakGo for dependable, professional
              driving support.
            </p>
          </motion.div>
        </section>
        <section className="relative mx-auto max-w-[1180px] px-5 pb-20 sm:pb-28">
          <div className="relative z-10 mx-auto -mt-8 grid max-w-4xl gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_18px_48px_rgba(25,54,96,.12)] sm:grid-cols-3 sm:p-6">
            <Trust value="4.9/5" label="Average customer rating" />
            <Trust value="Verified" label="Published customer reviews" />
            <Trust value="24/7" label="Booking support" />
          </div>
          {message && (
            <p className="mt-14 rounded-2xl border border-blue-100 bg-blue-50 p-6 text-center text-slate-600">
              {message}
            </p>
          )}
          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {reviews.map((review, index) => (
              <ReviewCard key={review._id} review={review} index={index} />
            ))}
          </div>
          {!message && !reviews.length && (
            <p className="mt-14 rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500">
              No reviews have been published yet.
            </p>
          )}
          <motion.div
            {...reveal}
            className="mt-14 flex flex-wrap items-center justify-center gap-3 text-sm font-semibold text-slate-600"
          >
            <ShieldCheck size={19} className="text-emerald-600" /> Reviews are managed and published
            by ChalakGo.
          </motion.div>
        </section>
      </main>
    </PageLayout>
  )
}

function Trust({ value, label }) {
  return (
    <div className="text-center">
      <p className="text-xl font-extrabold text-[#10213f]">{value}</p>
      <p className="mt-1 text-xs font-semibold text-slate-500">{label}</p>
    </div>
  )
}

function ReviewCard({ review, index }) {
  const rating = Math.min(5, Math.max(1, Number(review.rating) || 5))
  const initial = review.customerName?.trim()?.charAt(0)?.toUpperCase() || 'C'
  return (
    <motion.article
      {...reveal}
      transition={{ delay: index * 0.06 }}
      className="relative flex min-h-[280px] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white p-7 shadow-[0_12px_35px_rgba(25,54,96,.08)]"
    >
      <MessageCircle aria-hidden="true" className="absolute right-6 top-6 h-14 w-14 text-blue-50" />
      <div className="relative flex gap-1 text-amber-400">
        {Array.from({ length: 5 }, (_, star) => (
          <Star key={star} size={17} fill={star < rating ? 'currentColor' : 'none'} />
        ))}
      </div>
      <p className="relative mt-6 flex-1 text-[15px] leading-7 text-slate-600">
        “{review.message}”
      </p>
      <div className="relative mt-7 flex items-center gap-3 border-t border-slate-100 pt-5">
        <div className="grid h-11 w-11 place-items-center overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 font-extrabold text-white">
          {review.avatar ? (
            <img
              src={review.avatar}
              alt={review.customerName}
              className="h-full w-full object-cover"
            />
          ) : (
            initial
          )}
        </div>
        <div className="min-w-0">
          <h2 className="truncate font-extrabold text-[#10213f]">{review.customerName}</h2>
          <p className="mt-0.5 truncate text-xs text-slate-500">
            {[review.designation, review.company].filter(Boolean).join(' · ') ||
              'ChalakGo customer'}
          </p>
        </div>
      </div>
    </motion.article>
  )
}
