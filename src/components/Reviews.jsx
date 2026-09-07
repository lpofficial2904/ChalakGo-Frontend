import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import PageLayout from './PageLayout'

export default function Reviews() {
  const [reviews, setReviews] = useState([])
  const [message, setMessage] = useState('')
  useEffect(() => {
    fetch('https://chalakgo.onrender.com/api/reviews').then((response) => response.ok ? response.json() : Promise.reject()).then(setReviews).catch(() => { setMessage('Reviews will appear here once added by an admin.'); setReviews([]) })
  }, [])
  return <PageLayout><section className="mx-auto max-w-[1280px] px-6 py-20 sm:py-28"><motion.div initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} className="text-center"><p className="text-sm font-bold text-blue-600">TESTIMONIALS</p><h1 className="mt-4 text-4xl font-extrabold sm:text-6xl">Sought After by Leaders</h1><p className="mt-5 text-lg text-slate-500">Discover how premium households and modern enterprises leverage ChalakGo.</p></motion.div>{message && <p className="mt-12 text-center text-slate-500">{message}</p>}<div className="mt-16 grid gap-7 lg:grid-cols-3">{reviews.map((review, i) => <motion.article initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * .1 }} key={review._id} className="rounded-3xl border border-slate-200 p-8 shadow-sm"><p className="text-xl text-blue-600">★★★★★</p><p className="mt-6 leading-7 text-slate-500">“{review.message}”</p><div className="mt-7"><h2 className="font-extrabold">{review.customerName}</h2><p className="text-sm text-slate-500">{review.designation}</p></div></motion.article>)}</div></section></PageLayout>
}
