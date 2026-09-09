import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate, useParams } from 'react-router-dom'
import useCurrentLocation from './useCurrentLocation'
import { API_BASE } from '../utils/api.js'
import { bookingConfirmation } from '../utils/bookingConfirmation.js'
import { toast } from 'sonner'
import { addressFields, addressFormValues, pickupPayload } from '../utils/location.js'
import { calculateDistanceFare, calculateMonthlyFare, calculateTemporaryDriverFare } from '../utils/fare.js'

const defaultServices = [
  { slug: 'driver-only', name: 'Driver Only', price: '₹65/hr; ₹60/hr for 24 hours', eyebrow: 'YOUR CAR, OUR EXPERT DRIVER', detail: 'A trained, verified chauffeur drives your own car safely and professionally.', features: ['Background-verified driver', 'Live trip location updates', 'Hourly, daily, and weekly options'], image: 'https://images.unsplash.com/photo-1551830820-330a71b99659?auto=format&fit=crop&w=1200&q=85' },
  { slug: 'car-driver', name: 'Cab (Car + Driver)', price: 'SUV ₹18/km; Hatchback ₹14/km; Haravan Traveller ₹35/km', pricingType: 'distance', vehicleRates: { suv: 18, hatchback: 14, traveller: 35 }, eyebrow: 'PREMIUM CAR WITH PROFESSIONAL CHAUFFEUR', detail: 'Travel in comfort with a clean premium car and an experienced driver for work, airport transfers, and special occasions.', features: ['Executive sedan and SUV choices', 'Professional uniformed driver', 'Clean, sanitised vehicle and live tracking'], image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=85' },
  { slug: 'permanent-driver', name: 'Permanent Driver', price: '₹15,000–₹22,000/month', pricingType: 'monthly', monthlyRates: { sixToEight: 15000, eightToTen: 18000, tenToTwelve: 22000 }, eyebrow: 'YOUR DEDICATED MONTHLY CHAUFFEUR', detail: 'A reliable dedicated driver for daily family travel, office commutes, and a consistent driving routine.', features: ['Dedicated driver matching', 'Backup-driver support', 'Personalised monthly schedule'], image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=85' },
]
const plans = [['6–8 Hours / Day', '4 days/month', '₹13,000 – ₹15,000/month'], ['8–10 Hours / Day', '4 days/month', '₹15,000 – ₹18,000/month'], ['10–12 Hours / Day', '4 days/month', '₹18,000 – ₹22,000/month']]

const jaipurTour = { slug: 'jaipur-tour', name: 'Jaipur Tour', price: 'Plans from ₹2,999', pricingType: 'fixed', eyebrow: 'EXPLORE THE PINK CITY', detail: 'Book a comfortable private Jaipur sightseeing tour for one day or two days with a professional driver.', features: ['Flexible 1-day and 2-day plans', 'Choose your preferred places', 'Private car and professional driver'], image: 'https://images.unsplash.com/photo-1599661046827-dacde6976540?auto=format&fit=crop&w=1200&q=85', tourPlans: [{ days: 1, price: '₹2,999', places: ['Amber Fort', 'Jal Mahal', 'Hawa Mahal', 'City Palace', 'Jantar Mantar'] }, { days: 2, price: '₹3,499', places: ['Amber Fort', 'Jal Mahal', 'Hawa Mahal', 'City Palace', 'Jantar Mantar', 'Nahargarh Fort', 'Jaigarh Fort', 'Albert Hall Museum'] }] }

export default function Services() {
  const { service: slug } = useParams()
  const [services, setServices] = useState([...defaultServices, jaipurTour])
  // Published services saved from Admin render here automatically.
  useEffect(() => { fetch(`${API_BASE}/api/services`).then(r => r.ok ? r.json() : null).then(items => { if (Array.isArray(items)) setServices(items) }).catch(() => {}) }, [])
  const selected = services.find(item => item.slug === slug)
  return selected ? <ServiceDetails service={selected} /> : <ServiceList services={services} />
}

function ServiceList({ services }) {
  return <main className="min-h-screen overflow-hidden bg-[#f6f9ff] px-5 py-12 text-[#10213f] sm:py-16"><section className="mx-auto max-w-6xl"><motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-[32px] bg-[#081a38] px-7 py-14 text-center text-white shadow-2xl shadow-blue-950/15 sm:px-14 sm:py-18"><div aria-hidden="true" className="absolute -left-20 -top-24 h-64 w-64 rounded-full bg-blue-500/25 blur-3xl" /><div aria-hidden="true" className="absolute -bottom-24 -right-12 h-64 w-64 rounded-full bg-cyan-400/20 blur-3xl" /><div className="relative"><p className="text-xs font-extrabold tracking-[.16em] text-blue-200">CHALAKGO SERVICES</p><h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">The right driver for every journey.</h1><p className="mx-auto mt-4 max-w-2xl text-lg leading-7 text-slate-300">Flexible service options, professional standards and transparent pricing—designed around the way you travel.</p></div></motion.div><div className="mx-auto -mt-5 grid max-w-[1120px] gap-6 md:grid-cols-2 xl:grid-cols-3">{services.map((item, index) => <motion.article initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} whileHover={{ y: -8 }} viewport={{ once: true }} transition={{ delay: index * .1 }} key={item.slug} className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_14px_40px_rgba(25,54,96,.10)]"><div className="relative"><img src={item.image} alt={item.name} className="h-52 w-full object-cover transition duration-500 group-hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-t from-[#071a37]/75 via-transparent to-transparent" /><p className="absolute bottom-4 left-5 rounded-full bg-white/95 px-3 py-1.5 text-sm font-extrabold text-blue-700">{item.price || 'Custom pricing'}</p></div><div className="flex min-h-[270px] flex-col p-7"><p className="text-[11px] font-extrabold tracking-[.12em] text-blue-600">{item.eyebrow || 'PROFESSIONAL SERVICE'}</p><h2 className="mt-3 text-2xl font-extrabold tracking-tight">{item.name}</h2><p className="mt-3 text-sm leading-6 text-slate-500">{item.detail}</p><div className="mt-5 flex flex-wrap gap-2">{(item.features || []).slice(0, 2).map(feature => <span key={feature} className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">✓ {feature}</span>)}</div><Link to={`/services/${item.slug}`} className="mt-auto pt-6 text-sm font-extrabold text-blue-600 transition group-hover:text-blue-800">Explore service &amp; book →</Link></div></motion.article>)}</div></section></main>
}
function ServiceDetails({ service }) {
  if (service.slug === 'jaipur-tour') return <JaipurTour service={service} />
  const permanent = service.slug === 'permanent-driver'
  return <main className="min-h-screen bg-[#f7f9fc] px-5 py-12 text-[#101a31]"><section className="mx-auto max-w-6xl"><Link to="/services" className="text-sm font-bold text-blue-600">← All services</Link><div className="mt-6 overflow-hidden rounded-3xl bg-[#0b1c38] text-white shadow-xl lg:grid lg:grid-cols-2"><img src={service.image} alt={service.name} className="h-72 w-full object-cover lg:h-full" /><div className="p-8 sm:p-11"><p className="text-sm font-bold text-blue-300">{service.eyebrow}</p><h1 className="mt-3 text-4xl font-extrabold">{service.name}</h1><p className="mt-4 text-lg leading-7 text-slate-300">{service.detail}</p><ul className="mt-7 space-y-3">{service.features.map(item => <li key={item} className="text-sm text-slate-200">✓ {item}</li>)}</ul><p className="mt-8 text-3xl font-extrabold">{service.price}</p></div></div>{permanent && <PermanentInfo service={service} />}<BookingForm service={service} /></section></main>
}

function JaipurTour({ service }) {
  const fallbackPlans = [{ days: 1, price: '₹2,999', places: ['Amber Fort', 'Jal Mahal', 'Hawa Mahal', 'City Palace', 'Jantar Mantar'] }, { days: 2, price: '₹3,499', places: ['Amber Fort', 'Jal Mahal', 'Hawa Mahal', 'City Palace', 'Jantar Mantar', 'Nahargarh Fort', 'Jaigarh Fort', 'Albert Hall Museum'] }]
  const plans = service.tourPlans?.length ? service.tourPlans : fallbackPlans
  const [selected, setSelected] = useState(null)
  const active = selected === null ? null : plans[selected]
  return <main className="min-h-screen bg-[#f7f9fc] px-5 py-12 text-[#101a31]"><section className="mx-auto max-w-6xl"><Link to="/services" className="text-sm font-bold text-blue-600">← All services</Link><div className="mt-6 overflow-hidden rounded-3xl bg-[#0b1c38] text-white shadow-xl lg:grid lg:grid-cols-2"><img src={service.image} alt="Jaipur sightseeing" className="h-72 w-full object-cover lg:h-full" /><div className="p-8 sm:p-11"><p className="text-sm font-bold text-blue-300">EXPLORE THE PINK CITY</p><h1 className="mt-3 text-4xl font-extrabold">Jaipur Tour</h1><p className="mt-4 text-lg leading-7 text-slate-300">Choose a one-day or two-day private sightseeing itinerary. Tap a plan below to see all included places and its price.</p></div></div><div className="mt-10 grid gap-6 md:grid-cols-2"><TourBookingForm service={service} plan={active} />{plans.map((plan, index) => <button key={plan.days} type="button" onClick={() => setSelected(index)} className="rounded-3xl border border-slate-200 bg-white p-8 text-left shadow-sm transition hover:-translate-y-1 hover:border-blue-400 hover:shadow-lg"><p className="font-bold text-blue-600">JAIPUR SIGHTSEEING</p><h2 className="mt-2 text-3xl font-extrabold">{plan.days} Day Tour</h2><p className="mt-5 text-3xl font-extrabold">{plan.price}</p><p className="mt-4 text-sm text-slate-600">{plan.places?.length || 0} places included</p><span className="mt-7 inline-block font-bold text-blue-600">View places &amp; full details →</span></button>)}</div>{active && <section className="mt-8 rounded-3xl border border-blue-100 bg-white p-7 shadow-sm sm:p-10"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="font-bold text-blue-600">{active.days} DAY JAIPUR TOUR</p><h2 className="mt-2 text-3xl font-extrabold">Places &amp; price details</h2></div><button type="button" onClick={() => setSelected(null)} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-bold">Close</button></div><p className="mt-5 text-2xl font-extrabold">{active.price}</p><h3 className="mt-7 font-bold">Places included</h3><div className="mt-3 grid gap-3 sm:grid-cols-2">{active.places?.map(place => <div key={place} className="rounded-xl bg-blue-50 px-4 py-3 font-medium">✓ {place}</div>)}</div><p className="mt-7 text-sm leading-6 text-slate-600">The itinerary can be customised. Contact our team before travel for pickup time, route preferences, tolls, parking, and any additional charges.</p></section>}</section></main>
}

function TourBookingForm({ service, plan }) {
  const navigate = useNavigate()
  const { coordinates, timestamp, loading, error, label, fetchLocation } = useCurrentLocation()
  const [form, setForm] = useState({ fullName: '', phone: '', email: '', address: '', city: '', state: '' })
  const [locationMode, setLocationMode] = useState('manual')
  const [status, setStatus] = useState('')
  const [saving, setSaving] = useState(false)
  const update = event => setForm(old => ({ ...old, [event.target.name]: event.target.name === 'phone' ? event.target.value.replace(/\D/g, '').slice(0, 10) : event.target.value }))
  const useCurrent = async () => { setLocationMode('current'); const result = await fetchLocation(); if (result.coordinates) setForm(old => ({ ...old, address: result.details?.formattedAddress || result.details?.city || old.address, city: result.details?.city || old.city, state: result.details?.state || old.state })) }
  const submit = async event => {
    event.preventDefault()
      if (!plan) return setStatus('Select a 1-day or 2-day tour plan first.')
    if (!/^[6-9][0-9]{9}$/.test(form.phone)) return setStatus('Enter a valid 10-digit Indian mobile number.')
    if (locationMode === 'current' && !coordinates) return setStatus('Detect and confirm your pickup location first.')
    if (!localStorage.getItem('chalakgo_user_token') && !sessionStorage.getItem('chalakgo_user_token')) return navigate('/login')
    setSaving(true); setStatus('')
    try {
      const token = localStorage.getItem('chalakgo_user_token') || sessionStorage.getItem('chalakgo_user_token')
      const response = await fetch(`${API_BASE}/api/bookings`, { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: JSON.stringify({ ...form, service: service.name, carType: 'Tour vehicle', duration: `${plan.days} day tour`, tourPlanDays: plan.days, totalFare: Number(String(plan.price).replace(/[^0-9.]/g, '')), pickupLocation: form.address, pickup: pickupPayload(form, locationMode, coordinates, timestamp) }) })
      const data = await response.json()
      if (!response.ok) throw Error(data.message || data.error)
      toast.success('Jaipur Tour booking request saved.', { description: `Plan: ${plan.days} day tour · ${plan.price}` }); setStatus(`Booking ID: ${data.booking?.bookingId || 'Saved successfully'}`)
    } catch (requestError) { setStatus(requestError.message || 'Unable to save booking.'); toast.error(requestError.message || 'Unable to save booking.') } finally { setSaving(false) }
  }
  if (!plan) return null
  return <form onSubmit={submit} className="col-span-full mt-6 rounded-3xl bg-white p-7 shadow-xl sm:p-10"><p className="font-bold text-blue-600">BOOK JAIPUR TOUR</p><h2 className="mt-2 text-3xl font-extrabold">Share your details to reserve this plan.</h2><p className="mt-2 text-slate-500">Selected plan: {plan ? `${plan.days} day tour · ${plan.price}` : 'Choose a plan above'}</p><div className="mt-7 grid gap-5 sm:grid-cols-2"><label className="text-sm font-bold">Full name<input className="input" name="fullName" value={form.fullName} onChange={update} required /></label><label className="text-sm font-bold">Mobile number<input className="input" name="phone" value={form.phone} onChange={update} required inputMode="numeric" maxLength="10" /></label><label className="text-sm font-bold">Email address<input className="input" name="email" type="email" value={form.email} onChange={update} required /></label><label className="text-sm font-bold">City<input className="input" name="city" value={form.city} onChange={update} required /></label><label className="text-sm font-bold sm:col-span-2">Pickup address<textarea className="input min-h-24 py-3" name="address" value={form.address} onChange={update} required /></label></div><div className="mt-5 flex flex-wrap items-center gap-3"><button type="button" onClick={useCurrent} disabled={loading} className="rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white">{loading ? 'Detecting...' : 'Use current location'}</button><span className="text-sm text-slate-500">{locationMode === 'current' ? error || label : 'Enter pickup address manually'}</span></div><button disabled={saving} className="mt-7 w-full rounded-xl bg-blue-600 py-4 font-bold text-white disabled:opacity-60">{saving ? 'Saving booking...' : `Book ${plan ? `${plan.days}-day tour` : 'tour'}`}</button>{status && <p className="mt-4 text-center font-medium text-blue-700">{status}</p>}</form>
}

function PermanentInfo({ service }) {
  const monthlyRates = service.monthlyRates || { sixToEight: 15000, eightToTen: 18000, tenToTwelve: 22000 }
  const plans = [['6–8 Hours / Day', '4 days/month', `₹${monthlyRates.sixToEight.toLocaleString('en-IN')}/month`], ['8–10 Hours / Day', '4 days/month', `₹${monthlyRates.eightToTen.toLocaleString('en-IN')}/month`], ['10–12 Hours / Day', '4 days/month', `₹${monthlyRates.tenToTwelve.toLocaleString('en-IN')}/month`]]
  return <section className="mt-10 space-y-10"><div><p className="font-bold text-blue-600">PERMANENT DRIVER HIRE</p><h2 className="mt-2 text-3xl font-extrabold">Hire a permanent driver for your daily routine.</h2><p className="mt-3 max-w-4xl leading-7 text-slate-600">Get a reliable, professional driver for your home, office, or business needs. Every driver is background-checked, trained, and matched to your preferred schedule.</p></div><div><h2 className="text-2xl font-extrabold">Why hire drivers from us?</h2><div className="mt-4 grid gap-3 sm:grid-cols-2">{[['Experienced & verified', 'Background-checked and professionally trained drivers.'], ['Flexible timings', 'Choose daily shift times that match your requirement.'], ['Affordable pricing', 'Transparent monthly salary packages with no surprises.'], ['Trusted service', 'Dedicated support and dependable driver matching.']].map(([title, body]) => <div key={title} className="rounded-xl border border-slate-200 bg-white p-5"><p className="font-bold">✓ {title}</p><p className="mt-1 text-sm text-slate-600">{body}</p></div>)}</div></div><div><h2 className="text-2xl font-extrabold">Permanent driver hire plans</h2><div className="mt-4 grid gap-5 lg:grid-cols-3">{plans.map(([timing, leave, salary]) => <article key={timing} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><h3 className="text-xl font-extrabold">{timing}</h3><p className="mt-4 text-sm text-slate-600"><b className="text-[#10213f]">Leave:</b> {leave}</p><p className="mt-2 text-sm text-slate-600"><b className="text-[#10213f]">Salary:</b> {salary}</p></article>)}</div></div><div className="rounded-2xl border border-blue-100 bg-blue-50 p-6"><h2 className="text-2xl font-extrabold">Other services for employers</h2><div className="mt-4 flex flex-wrap gap-x-8 gap-y-3 text-sm font-semibold text-slate-700">{['Temporary Driver Services', 'Event Chauffeurs', 'Corporate & Office Drivers', 'Outstation & Travel Drivers'].map(item => <span key={item}>• {item}</span>)}</div></div></section>
}

function BookingForm({ service }) {
  const navigate = useNavigate()
  const { coordinates, timestamp, loading, error, label, acquisitionStatus, fetchLocation, fetchInitialLocation } = useCurrentLocation()
  const locationRequest = useRef(0)
  const permanent = service.slug === 'permanent-driver'
  const distanceBased = service.pricingType === 'distance' || service.slug === 'car-driver'
  const monthlyBased = service.pricingType === 'monthly' || permanent
  const carTypeOptions = distanceBased ? ['SUV', 'Hatchback', 'Haravan Traveller'] : ['Sedan / SUV', 'Hatchback']
  const temporary = !permanent && !distanceBased && !monthlyBased && /(?:\/|per\s+)(?:hr|hour|hours?|day|days?)\b/i.test(service.price || '')
  const [locationMode, setLocationMode] = useState('current')
  const [confirmedPickup, setConfirmedPickup] = useState(null)
  const [editCurrentAddress, setEditCurrentAddress] = useState(false)
  const manualAddress = useRef(addressFormValues(null))
  const [status, setStatus] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const submitPending = useRef(false)
  const [form, setForm] = useState({ fullName: '', phone: '', email: '', address: '', area: '', pincode: '', city: '', state: '', mainRoad: '', carType: distanceBased ? 'SUV' : 'Sedan / SUV', distanceKm: '', duration: permanent ? '6–8 Hours / Day' : '8 Hours', startDate: '', endDate: '', startTime: '', endTime: '' })

  useEffect(() => {
    let cancelled = false
    const request = locationRequest.current
    void fetchInitialLocation().then(result => {
      if (!cancelled && request === locationRequest.current && result.coordinates) {
        setForm(old => ({ ...old, ...addressFormValues(result.details) }))
      }
    })
    return () => { cancelled = true }
  }, [fetchInitialLocation])

  let fare = null
  let fareError = ''
  if (distanceBased) {
    try { fare = calculateDistanceFare({ ...form, vehicleRates: service.vehicleRates || { suv: 18, hatchback: 14 } }) } catch (error) { fareError = error.message }
  } else if (monthlyBased) {
    try { fare = calculateMonthlyFare({ duration: form.duration, monthlyRates: service.monthlyRates || { sixToEight: 15000, eightToTen: 18000, tenToTwelve: 22000 } }) } catch (error) { fareError = error.message }
  } else if (temporary) {
    try { fare = calculateTemporaryDriverFare({ ...form, price: service.price }) } catch (error) { fareError = error.message }
  }

  const update = event => setForm(old => ({ ...old, [event.target.name]: event.target.name === 'phone' ? event.target.value.replace(/\D/g, '').slice(0, 10) : event.target.value }))
  const field = (title, name, type = 'text', extra = {}) => <label key={name} className="text-sm font-bold">{title}<input className="input" name={name} type={type} value={form[name] || ''} onChange={update} {...extra} /></label>

  const submit = async event => {
    event.preventDefault()
    if (submitPending.current) return
    if (loading && locationMode === 'current') return setStatus('Please wait for location detection to finish.')
    if ((temporary || distanceBased || monthlyBased) && !fare) return setStatus(fareError)
    if (!localStorage.getItem('chalakgo_user_token') && !sessionStorage.getItem('chalakgo_user_token')) return navigate('/login')
    if (!/^[6-9][0-9]{9}$/.test(form.phone)) return setStatus('Enter a valid 10-digit Indian mobile number.')

    const pickupCoordinates = locationMode === 'current' ? (confirmedPickup?.coordinates || coordinates) : undefined
    const pickupTimestamp = locationMode === 'current' ? (confirmedPickup?.timestamp || timestamp) : undefined

    if (locationMode === 'current' && (!pickupCoordinates || !Number.isFinite(pickupCoordinates.latitude) || !Number.isFinite(pickupCoordinates.longitude))) {
      return setStatus('Detect and confirm your current pickup location before submitting.')
    }
    if (locationMode === 'current' && !confirmedPickup) return setStatus('Review the address and confirm your pickup location before submitting.')
    if (locationMode === 'current' && !form.address) return setStatus('Review or enter the readable pickup address.')

    const payload = {
      ...form,
      service: service.name,
      ...((temporary || distanceBased || monthlyBased) ? { duration: distanceBased ? `${fare.distanceKm} km` : monthlyBased ? form.duration : fare.duration, ...(temporary ? { durationMinutes: fare.durationMinutes } : {}), distanceKm: distanceBased ? fare.distanceKm : undefined, totalFare: fare.totalFare } : {}),
      ...pickupPayload(form, locationMode, pickupCoordinates, pickupTimestamp),
    }

    submitPending.current = true
    setSubmitting(true)
    setStatus('')
    const toastId = toast.loading('Saving your booking...')
    try {
      const token = localStorage.getItem('chalakgo_user_token') || sessionStorage.getItem('chalakgo_user_token')
      const response = await fetch(`${API_BASE}/api/bookings`, { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: JSON.stringify(payload) })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error ? `${data.message}: ${data.error}` : data.message)
      const message = bookingConfirmation({ booking: { ...data.booking, bookingId: undefined } }, temporary || distanceBased || monthlyBased).replace('Booking request saved successfully. ', '')
      toast.success('Booking request saved successfully.', { id: toastId, description: message, duration: 8000 })
      setStatus(data.booking?.bookingId ? `Booking ID: ${data.booking.bookingId}` : 'Booking request saved successfully.')
    } catch (requestError) {
      const message = requestError.message || 'Could not reach the booking server. Start the backend first.'
      toast.error('Unable to save booking', { id: toastId, description: message })
      setStatus(message)
    } finally {
      submitPending.current = false
      setSubmitting(false)
    }
  }

  const chooseMode = async mode => {
    const request = ++locationRequest.current
    if (mode !== locationMode) {
      if (locationMode === 'manual') manualAddress.current = { ...Object.fromEntries(addressFields.map(([, name]) => [name, form[name] || ''])), address: form.address }
      setForm(old => ({ ...old, ...(mode === 'manual' ? manualAddress.current : addressFormValues(null)) }))
    }
    setLocationMode(mode)
    setEditCurrentAddress(false)
    setConfirmedPickup(null)
    setStatus('')
    if (mode !== 'current') return
    const result = await fetchLocation()
    if (request !== locationRequest.current) return
    if (result.coordinates) setForm(old => ({ ...old, ...addressFormValues(result.details) }))
  }

  const confirmPickup = () => {
    if (!coordinates) return setStatus('Detect your current location first.')
    if (!form.address.trim()) return setStatus('Add the pickup address before confirming.')
    if (!Number.isFinite(coordinates.accuracy)) return setStatus('The GPS reading is incomplete. Please refresh your current location.')
    setConfirmedPickup({ coordinates, timestamp: timestamp || Date.now() })
    setStatus('Pickup location confirmed. Your reviewed address and detected coordinates will be used for the booking.')
  }

  const showAddressForm = locationMode === 'manual' || editCurrentAddress || (!loading && coordinates && !form.address)
  const locationFields = addressFields
  const distanceControls = distanceBased ? field('Trip distance (km)', 'distanceKm', 'number', { min: 1, step: '0.1', required: true }) : null
  const distanceEstimate = distanceBased && <section aria-live="polite" className="rounded-xl border border-blue-100 bg-blue-50 p-4 sm:col-span-2"><h3 className="font-bold">Fare Estimate</h3>{fare ? <div className="mt-3 space-y-2 text-sm"><p>{fare.distanceKm} km × ₹{fare.ratePerKm}/km ({form.carType})</p><p className="font-bold">TOTAL ESTIMATE = ₹{fare.totalFare.toFixed(2)}</p></div> : <p className="mt-2 text-sm">{fareError || 'Enter trip distance to see the estimate.'}</p>}</section>
  const monthlyEstimate = monthlyBased && <section aria-live="polite" className="rounded-xl border border-blue-100 bg-blue-50 p-4 sm:col-span-2"><h3 className="font-bold">Monthly Estimate</h3>{fare ? <p className="mt-2 text-sm"><b>{form.duration}</b> at <b>₹{fare.monthlyRate.toLocaleString('en-IN')}/month</b></p> : <p className="mt-2 text-sm">{fareError}</p>}</section>
  const schedules = <>{field('Start date & time', 'startDateTime', 'datetime-local', { required: true })}{field('End date & time', 'endDateTime', 'datetime-local', { required: true, min: form.startDateTime || undefined })}{distanceControls}{distanceEstimate}{monthlyEstimate}</>
  return <motion.form initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} onSubmit={submit} className="mt-8 rounded-3xl bg-white p-7 shadow-xl sm:p-10"><p className="font-bold text-blue-600">BOOK {service.name.toUpperCase()}</p><h2 className="mt-2 text-3xl font-extrabold">{permanent ? 'Share your driver schedule.' : 'Share your trip details.'}</h2><p className="mt-2 text-slate-500">Choose the service dates and daily timings, then use live GPS or enter the pickup address.</p><div className="mt-8 grid gap-5 sm:grid-cols-2">{field('Full name', 'fullName', 'text', { required: true })}{field('Mobile number', 'phone', 'tel', { required: true, inputMode: 'numeric', maxLength: 10 })}{field('Email address', 'email', 'email', { required: true })}<label className="text-sm font-bold">Car type<select className="input" name="carType" value={form.carType} onChange={update}>{carTypeOptions.map(type => <option key={type}>{type}</option>)}</select></label>{permanent ? <label className="text-sm font-bold">Daily working hours<select className="input" name="duration" value={form.duration} onChange={update}><option>6–8 Hours / Day</option><option>8–10 Hours / Day</option><option>10–12 Hours / Day</option></select></label> : temporary ? <div className="text-sm font-bold">Duration<p className="mt-2">{fare?.duration || 'Select start and end date/time'}</p></div> : <label className="text-sm font-bold">Duration<select className="input" name="duration" value={form.duration} onChange={update}><option>6 Hours</option><option>8 Hours</option><option>12 Hours</option><option>Weekly</option><option>Monthly</option></select></label>}{schedules}{temporary && <section aria-live="polite" className="rounded-xl border border-blue-100 bg-blue-50 p-4 sm:col-span-2"><h3 className="font-bold">Fare Estimate</h3>{fare ? <div className="mt-3 space-y-2 text-sm"><p>Duration: {fare.duration} ({fare.durationMinutes} minutes)</p><p>First {fare.firstHours.toFixed(2)} hrs @ ₹149/hr = ₹{fare.firstFare.toFixed(2)}</p>{fare.additionalHours > 0 && <p>Additional {fare.additionalHours.toFixed(2)} hrs @ ₹99/hr = ₹{fare.additionalFare.toFixed(2)}</p>}<p>Subtotal = ₹{fare.totalFare.toFixed(2)}</p><p className="font-bold">TOTAL ESTIMATE = ₹{fare.totalFare.toFixed(2)}</p></div> : <p className="mt-2 text-sm">{fareError}</p>}</section>}<div className="rounded-xl border border-blue-100 bg-blue-50 p-4 sm:col-span-2"><p className="text-sm font-bold">Pickup location</p><div className="mt-3 flex flex-wrap gap-3"><button type="button" aria-pressed={locationMode === 'current'} disabled={loading} onClick={() => chooseMode('current')} className={`rounded-lg px-3 py-2 text-xs font-bold disabled:cursor-not-allowed disabled:opacity-60 ${locationMode === 'current' ? 'bg-blue-600 text-white' : 'border border-blue-200 text-blue-700'}`}>{loading ? 'Detecting…' : 'Use current location'}</button><button type="button" aria-pressed={locationMode === 'manual'} onClick={() => chooseMode('manual')} className={`rounded-lg px-3 py-2 text-xs font-bold ${locationMode === 'manual' ? 'bg-blue-600 text-white' : 'border border-blue-200 text-blue-700'}`}>Enter manually</button></div>{locationMode === 'current' && <div className="mt-3 flex flex-wrap items-center justify-between gap-3"><p className="text-sm text-slate-600">{loading ? acquisitionStatus : error || label}</p><div className="flex flex-wrap gap-2"><button type="button" disabled={loading} onClick={() => chooseMode('current')} className="rounded-lg border border-blue-300 px-3 py-2 text-xs font-bold text-blue-700 disabled:opacity-60">{loading ? 'Fetching…' : 'Refresh current location'}</button><button type="button" disabled={loading || !coordinates} onClick={confirmPickup} className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-bold text-white disabled:opacity-60">{confirmedPickup ? 'Pickup location confirmed' : 'Confirm pickup location'}</button></div><p className="w-full break-words text-xs text-slate-600">{coordinates ? `🌍 Latitude: ${coordinates.latitude} | Longitude: ${coordinates.longitude}` : 'GPS coordinates will be captured after detection.'}</p></div>}</div>{locationMode === 'current' && !loading && coordinates && !showAddressForm && <section className="rounded-xl border border-blue-100 bg-blue-50 p-4 sm:col-span-2"><div className="flex flex-wrap items-center justify-between gap-3"><h3 className="font-bold">Current pickup address</h3><button type="button" onClick={() => { setEditCurrentAddress(true); setConfirmedPickup(null) }} className="rounded-lg border border-blue-300 px-3 py-2 text-xs font-bold text-blue-700">Edit detected address</button></div><dl className="mt-4 grid gap-4 sm:grid-cols-2">{locationFields.filter(([, name]) => form[name]).map(([title, name]) => <div key={name}><dt className="text-xs text-slate-500">{title}</dt><dd className="mt-1 break-words text-sm font-medium">{form[name]}</dd></div>)}</dl><p className="mt-4 break-words text-sm">{form.address}</p></section>}{showAddressForm && <><h3 className="font-bold sm:col-span-2">{locationMode === 'manual' ? 'Enter pickup address manually' : 'Update current pickup address'}</h3>{locationFields.map(([title, name]) => field(title, name, 'text', { disabled: loading && locationMode === 'current', required: locationMode === 'manual' && (name === 'city' || name === 'state'), ...(name === 'pincode' ? { inputMode: 'numeric', pattern: '[1-9][0-9]{5}', maxLength: 6 } : {}) }))}<label className="text-sm font-bold sm:col-span-2">Pickup address / landmark<textarea className="input min-h-28 py-3" name="address" value={form.address} onChange={update} disabled={loading && locationMode === 'current'} required /></label>{locationMode === 'current' && form.address.trim() && <button type="button" onClick={() => setEditCurrentAddress(false)} className="rounded-lg border border-blue-300 px-3 py-2 text-sm font-bold text-blue-700 sm:col-span-2">Done editing address</button>}</>}{locationMode === 'current' && coordinates && <p className="text-xs text-slate-600 sm:col-span-2">Address data: <a className="underline" href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap contributors</a></p>}</div><button disabled={submitting || loading && locationMode === 'current'} className="mt-7 w-full rounded-xl bg-blue-600 py-4 font-bold text-white shadow-lg shadow-blue-200">{submitting ? 'Saving booking...' : 'Submit Booking Request'}</button>{status && <p className="mt-4 text-center font-medium text-blue-700">{status}</p>}</motion.form>
}
