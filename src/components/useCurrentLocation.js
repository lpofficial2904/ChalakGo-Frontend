import { useCallback, useEffect, useRef, useState } from 'react'
import { getBestFreshPosition, toLocationDetails } from '../utils/location.js'
import { API_BASE } from '../utils/api.js'

const initial = { label: 'Click Use current location to detect your pickup.', details: null, coordinates: null, timestamp: null, loading: false, error: '', warning: '', acquisitionStatus: '' }

// Shared automatic acquisition prevents duplicate GPS/geocoder calls from the
// header, booking form and React StrictMode. A full page reload starts fresh.
let activeAcquisition = null
let initialAcquisition = null

export default function useCurrentLocation({ autoStart = false } = {}) {
  const [location, setLocation] = useState(initial)
  const acquisitionRef = useRef(null)
  const mounted = useRef(true)

  useEffect(() => {
    mounted.current = true
    return () => { mounted.current = false }
  }, [])

  const loadLocation = useCallback((automatic = false) => {
    if (acquisitionRef.current) return acquisitionRef.current
    if (!window.isSecureContext || !navigator.geolocation) {
      const result = { ...initial, error: !window.isSecureContext ? 'Location requires HTTPS (or localhost for development). You can enter your address manually.' : 'Location is not supported by this browser. Enter your address manually.' }
      setLocation(result)
      return Promise.resolve(result)
    }
    setLocation({ ...initial, loading: true, acquisitionStatus: 'Finding your current location…' })
    const controller = new AbortController()
    const acquisition = (automatic && initialAcquisition) || activeAcquisition || (async () => {
      let result = { ...initial }
      try {
        const selected = await getBestFreshPosition(navigator.geolocation, controller.signal, acquisitionStatus => {
          if (mounted.current) setLocation(old => ({ ...old, acquisitionStatus }))
        })
        result.coordinates = selected.coordinates
        result.timestamp = selected.timestamp
        result.label = 'Current location detected. Review the available address below.'
        if (mounted.current) setLocation({ ...result, loading: true, acquisitionStatus: 'Location detected. Looking up the address…' })
        const timeout = setTimeout(() => controller.abort(), 12000)
        try {
          const query = new URLSearchParams({ latitude: String(selected.coordinates.latitude), longitude: String(selected.coordinates.longitude) })
          const response = await fetch(`${API_BASE}/api/location/reverse?${query}`, { signal: controller.signal })
          if (!response.ok) throw new Error('Address lookup failed')
          result.details = toLocationDetails(await response.json())
          result.label = result.details.formattedAddress || result.label
        } catch {
          result.error = 'GPS coordinates were detected, but the address lookup failed. Retry or fill in the address below; your coordinates are retained.'
        } finally { clearTimeout(timeout) }
      } catch (error) {
        result.error = error?.code === 1
          ? 'Location permission was denied. Allow location access in your browser settings or enter the address manually.'
          : error?.code === 3 ? 'Location detection timed out. Please retry or enter your address manually.'
            : 'Your current location is unavailable. Check device location services, retry, or enter the address manually.'
      }
      if (mounted.current) setLocation(result)
      return result
    })()
    activeAcquisition = acquisition
    if (automatic && !initialAcquisition) initialAcquisition = acquisition
    acquisitionRef.current = acquisition
    void acquisition.then(result => {
      if (mounted.current) setLocation(result)
    }).finally(() => {
      acquisitionRef.current = null
      if (activeAcquisition === acquisition) activeAcquisition = null
    })
    return acquisition
  }, [])

  const fetchLocation = useCallback(() => loadLocation(false), [loadLocation])
  const fetchInitialLocation = useCallback(() => loadLocation(true), [loadLocation])
  useEffect(() => {
    if (autoStart) void fetchInitialLocation()
  }, [autoStart, fetchInitialLocation])

  return { ...location, fetchLocation, fetchInitialLocation }
}
