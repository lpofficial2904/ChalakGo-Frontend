import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { API_BASE } from '../utils/api.js'

const reviewsPerSlide = 3

export default function FooterReviews() {
  const [reviews, setReviews] = useState([])
  const [slide, setSlide] = useState(0)

  useEffect(() => {
    fetch(`${API_BASE}/api/reviews`)
      .then((response) => (response.ok ? response.json() : []))
      .then(setReviews)
      .catch(() => setReviews([]))
  }, [])

  const uniqueReviews = [...new Map(reviews.map((review) => [String(review._id), review])).values()]
  const slides = useMemo(
    () =>
      Array.from({ length: Math.ceil(uniqueReviews.length / reviewsPerSlide) }, (_, index) =>
        uniqueReviews.slice(index * reviewsPerSlide, index * reviewsPerSlide + reviewsPerSlide)
      ),
    [uniqueReviews]
  )
  useEffect(() => {
    setSlide((current) => Math.min(current, Math.max(0, slides.length - 1)))
  }, [slides.length])
  useEffect(() => {
    if (slides.length < 2) return
    const timer = setInterval(() => setSlide((current) => (current + 1) % slides.length), 5000)
    return () => clearInterval(timer)
  }, [slides.length])

  if (!uniqueReviews.length) return null
  const visibleReviews = slides[slide] || []

  return (
    <section className="bg-[#f5f8fd] px-5 py-12 sm:py-14">
      <div className="mx-auto max-w-[1260px]">
        <div className="text-center">
          <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-bold tracking-wide text-blue-600">
            CLIENT STORIES
          </span>
          <h2 className="mt-3 text-3xl font-extrabold text-[#10213f]">
            Loved by our <span className="text-blue-600">customers</span>
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Real feedback from journeys completed with ChalakGo.
          </p>
        </div>
        <div className="mt-8 overflow-hidden">
          <div className="grid gap-5 md:grid-cols-3">
            {visibleReviews.map((review, index) => {
              const rating = Math.min(5, Math.max(1, Number(review.rating) || 5))
              const initial = review.customerName?.trim()?.charAt(0)?.toUpperCase() || 'C'
              return (
                <motion.article
                  key={`${slide}-${review._id}`}
                  initial={{ opacity: 0, x: 32 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.08 }}
                  className="relative min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_10px_28px_rgba(30,55,95,.08)]"
                >
                  <div
                    aria-hidden="true"
                    className="absolute right-4 top-1 font-serif text-6xl leading-none text-blue-50"
                  >
                    &ldquo;
                  </div>
                  <div className="relative flex items-center justify-between">
                    <div className="flex gap-0.5 text-sm text-amber-400">
                      {Array.from({ length: 5 }, (_, star) => (
                        <span key={star}>{star < rating ? '★' : '☆'}</span>
                      ))}
                    </div>
                    <span className="rounded-full bg-blue-50 px-2 py-1 text-[10px] font-bold text-blue-600">
                      {rating}.0 / 5
                    </span>
                  </div>
                  <p className="relative mt-4 min-h-[72px] text-sm leading-6 text-slate-600">
                    {review.message}
                  </p>
                  <div className="relative mt-5 flex items-center gap-3 border-t border-slate-100 pt-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 text-sm font-extrabold leading-none text-white shadow-md shadow-blue-200">
                      {review.avatar ? (
                        <img
                          src={review.avatar}
                          alt={review.customerName}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="flex h-full w-full items-center justify-center">
                          {initial}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <b className="block truncate text-sm text-[#10213f]">{review.customerName}</b>
                      <p className="truncate text-xs text-slate-500">
                        {review.designation}
                        {review.company ? ` · ${review.company}` : ''}
                      </p>
                    </div>
                  </div>
                </motion.article>
              )
            })}
          </div>
        </div>
        {slides.length > 1 && (
          <div className="mt-6 flex justify-center gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                type="button"
                aria-label={`Show review slide ${index + 1}`}
                onClick={() => setSlide(index)}
                className={`h-2 rounded-full transition-all ${slide === index ? 'w-7 bg-blue-600' : 'w-2 bg-blue-200'}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
