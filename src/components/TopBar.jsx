import { MapPin, Phone, RefreshCw } from 'lucide-react'
import { useEffect, useState } from 'react'
import { API_BASE } from '../utils/api.js'
import useCurrentLocation from './useCurrentLocation'

const defaults = {
  topBarMessage: 'Professional drivers for every journey · 24/7 booking support',
  phone: '+91 98765 43210',
}

export default function TopBar() {
  const [settings, setSettings] = useState(defaults)
  const { label, loading, error, fetchLocation } = useCurrentLocation({ autoStart: true })

  useEffect(() => {
    fetch(`${API_BASE}/api/settings`)
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => data && setSettings((value) => ({ ...value, ...data })))
      .catch(() => {})
  }, [])
  const locationText = loading ? 'Finding your current location…' : error || label

  return (
    <div className="bg-[#07162f] px-4 py-2 text-xs text-slate-300">
      <div className="mx-auto grid max-w-[1380px] items-center gap-2 sm:grid-cols-[1fr_auto_1fr]">
        <p className="hidden font-medium sm:block">{settings.topBarMessage}</p>
        <div className="flex min-w-0 items-center justify-center gap-2 text-blue-100">
          <MapPin size={14} className="shrink-0 text-cyan-300" />
          <span className="max-w-64 truncate">{locationText}</span>
          <button
            type="button"
            onClick={loading ? undefined : fetchLocation}
            aria-label="Refresh current location"
            disabled={loading}
            className="rounded p-1 text-cyan-300 hover:bg-white/10 disabled:opacity-50"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
        <a
          className="inline-flex items-center justify-center gap-2 font-bold text-blue-200 transition hover:text-white sm:justify-self-end"
          href={`tel:${settings.phone.replace(/\s/g, '')}`}
        >
          <Phone size={13} />
          {settings.phone}
        </a>
      </div>
    </div>
  )
}
