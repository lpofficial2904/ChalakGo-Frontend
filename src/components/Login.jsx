import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function Login() {
  const [isSignup, setIsSignup] = useState(false)
  const [fullName, setFullName] = useState('')
  const [mobile, setMobile] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const submit = async event => {
    event.preventDefault(); setMessage(''); setLoading(true)
    try {
      const response = await fetch(`https://chalakgo.onrender.com/api/users/${isSignup ? 'signup' : 'login'}`, { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ fullName, mobile, password }) })
      const data = await response.json()
      if (!response.ok) throw Error(data.message)
      sessionStorage.setItem('chalakgo_user_token', data.token)
      navigate('/services')
    } catch (error) { setMessage(error.message || 'Login failed.') } finally { setLoading(false) }
  }
  return <main className="min-h-screen bg-[#f7f9fc] px-5 py-16 sm:py-24"><motion.form onSubmit={submit} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-md rounded-3xl border border-white bg-white p-7 shadow-2xl sm:p-9"><p className="font-bold tracking-wider text-blue-600">CHALAKGO CUSTOMER</p><h1 className="mt-3 text-4xl font-extrabold text-[#101a31]">{isSignup ? 'Create your account' : 'Welcome back'}</h1><p className="mt-2 text-sm leading-6 text-slate-500">{isSignup ? 'Create an account once, then book a driver anytime.' : 'Log in securely to continue with your driver booking.'}</p>{isSignup && <input className="input mt-7" placeholder="Full name" value={fullName} onChange={event => setFullName(event.target.value)} required autoComplete="name" />}<input className={`input ${isSignup ? '' : 'mt-7'}`} placeholder="10-digit mobile number" value={mobile} onChange={event => setMobile(event.target.value.replace(/\D/g, '').slice(0, 10))} required inputMode="numeric" autoComplete="tel" /><input className="input" placeholder="Password (minimum 8 characters)" type="password" value={password} onChange={event => setPassword(event.target.value)} required minLength="8" autoComplete={isSignup ? 'new-password' : 'current-password'} /><button disabled={loading} className="mt-6 w-full rounded-xl bg-blue-600 py-4 font-bold text-white shadow-lg shadow-blue-200 disabled:opacity-60">{loading ? 'Please wait...' : isSignup ? 'Create account' : 'Login securely'}</button>{message && <p className="mt-4 text-center text-sm font-medium text-red-600">{message}</p>}<p className="mt-6 text-center text-sm text-slate-500">{isSignup ? 'Already registered?' : 'New to ChalakGo?'} <button type="button" onClick={() => { setIsSignup(value => !value); setMessage('') }} className="font-bold text-blue-600">{isSignup ? 'Log in' : 'Create an account'}</button></p></motion.form></main>
}
