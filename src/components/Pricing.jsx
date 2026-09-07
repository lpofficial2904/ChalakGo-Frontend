import { Link } from 'react-router-dom'

const prices = [
  ['Local / Out City Trip', 'Driver Only', ['First 1–4 hours: ₹149/hr', 'Additional hours: ₹99/hr', 'Minimum 4-hour charge applies']],
  ['Multi-Day Trip', 'Outstation Driver', ['₹1,200/day', 'Minimum 2-day charge applies', 'Night and meal charges may apply']],
  ['Drop Ride Driver', 'One-way drop', ['0–140 km: ₹1,100 fixed', 'Additional km: ₹4/km (two-way calculation)', 'Drop near a bus stand or railway station for safe return']],
  ['Permanent Driver', 'Monthly plan', ['6–8 hours: ₹13,000 – ₹15,000/month', '8–10 hours: ₹15,000 – ₹18,000/month', '10–12 hours: ₹18,000 – ₹22,000/month']],
  ['Jaipur Tour', 'Private sightseeing', ['1-day tour: from ₹2,999', '2-day tour: from ₹5,499', 'Places and final price can be tailored']],
]

export default function Pricing() {
  return <main className="min-h-screen bg-[#f7f9fc] px-5 py-16 text-[#101a31] sm:py-24"><section className="mx-auto max-w-6xl"><div className="text-center"><p className="font-bold text-blue-600">SERVICE CHARGES</p><h1 className="mt-3 text-4xl font-extrabold sm:text-5xl">Our pricing</h1><p className="mt-4 text-lg text-slate-600">Clear pricing for every ChalakGo service.</p></div><div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">{prices.map(([title, type, items]) => <article key={title} className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm"><p className="text-sm font-bold text-blue-600">{type}</p><h2 className="mt-2 text-2xl font-extrabold">{title}</h2><ul className="mt-6 space-y-3 text-sm leading-6 text-slate-600">{items.map(item => <li key={item}>✓ {item}</li>)}</ul><Link to={title === 'Jaipur Tour' ? '/services/jaipur-tour' : title === 'Permanent Driver' ? '/services/permanent-driver' : '/services'} className="mt-8 inline-block font-bold text-blue-600">View details &amp; book →</Link></article>)}</div><p className="mt-8 text-center text-sm text-slate-500">Taxes, tolls, parking and any special requirements may be charged separately where applicable.</p></section></main>
}
