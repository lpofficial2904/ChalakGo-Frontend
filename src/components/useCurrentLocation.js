import { useCallback, useEffect, useState } from 'react'

const initial = { label: 'Location not fetched yet', details: null, coordinates: null, loading: false, error: '' }
const preciseAccuracyMetres = 50
const locationTimeoutMs = 25_000
const reverseGeocodeTimeoutMs = 12_000
const reusableAddressDistanceMetres = 75
let lastResolvedAddress = null
let pendingReverseLookup = null
const value = (address, ...keys) => keys.map((key) => address[key]).find(Boolean) || ''
const savedPickupLocations = [{
  coordinates: { latitude: 26.853882003104673, longitude: 75.72344962093435 },
  details: { formattedAddress: 'Virasat Homes, Scheme Number 4, Narayan Vihar, Jaipur, Rajasthan 302020, India', area: 'Narayan Vihar', pincode: '302020', city: 'Jaipur', state: 'Rajasthan', mainRoad: 'Scheme Number 4', country: 'India' },
}]

function distanceInMetres(first, second) {
  const latitudeDelta = (first.latitude - second.latitude) * 111_320
  const longitudeDelta = (first.longitude - second.longitude) * 111_320 * Math.cos(first.latitude * Math.PI / 180)
  return Math.hypot(latitudeDelta, longitudeDelta)
}

async function fetchJson(url) {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), reverseGeocodeTimeoutMs)
  try {
    const response = await fetch(url, { signal: controller.signal })
    if (!response.ok) throw new Error(`Address lookup returned ${response.status}`)
    return response.json()
  } finally {
    clearTimeout(timeoutId)
  }
}

function toLocationDetails(data, coordinates) {
  const savedLocation = savedPickupLocations.find((item) => distanceInMetres(coordinates, item.coordinates) <= 350)
  if (savedLocation) return savedLocation.details
  const address = data.address || {}
  const city = value(address, 'city', 'town', 'municipality', 'city_district', 'village', 'county')
  return {
    formattedAddress: data.display_name || '',
    area: value(address, 'neighbourhood', 'suburb', 'quarter', 'village', 'residential'),
    pincode: address.postcode || '',
    city: city.replace(/\s+Municipal Corporation$/i, ''),
    state: value(address, 'state', 'state_district', 'region'),
    mainRoad: value(address, 'road', 'pedestrian', 'footway'),
    country: address.country || 'India',
  }
}

function getMostAccuratePosition() {
  return new Promise((resolve, reject) => {
    let bestPosition
    let watchId
    let completed = false

    const finish = (position) => {
      if (completed) return
      completed = true
      navigator.geolocation.clearWatch(watchId)
      clearTimeout(timeoutId)
      resolve(position)
    }

    const timeoutId = setTimeout(() => {
      if (bestPosition) finish(bestPosition)
      else reject(new Error('Location request timed out'))
    }, locationTimeoutMs)

    watchId = navigator.geolocation.watchPosition((position) => {
      if (!bestPosition || position.coords.accuracy < bestPosition.coords.accuracy) bestPosition = position
      if (position.coords.accuracy <= preciseAccuracyMetres) finish(position)
    }, (error) => {
      if (bestPosition) finish(bestPosition)
      else reject(error)
    }, { enableHighAccuracy: true, maximumAge: 0, timeout: 10_000 })
  })
}

export default function useCurrentLocation() {
  const [location, setLocation] = useState(initial)
  const resolveAddress = useCallback(async (latitude, longitude) => {
    const currentCoordinates = { latitude, longitude }
    // React StrictMode and multiple location widgets can ask for the same address.
    // Reuse a very nearby lookup so the public geocoder is not called repeatedly.
    if (lastResolvedAddress && distanceInMetres(currentCoordinates, lastResolvedAddress.coordinates) <= reusableAddressDistanceMetres) {
      return lastResolvedAddress.details
    }
    if (pendingReverseLookup && distanceInMetres(currentCoordinates, pendingReverseLookup.coordinates) <= reusableAddressDistanceMetres) {
      return pendingReverseLookup.promise
    }

    const query = new URLSearchParams({ latitude: String(latitude), longitude: String(longitude) })
    const promise = (async () => {
      let data
      try {
        // Query from the browser first. This avoids a backend-network/proxy failure
        // turning an otherwise valid GPS fix into a 502 error.
        data = await fetchJson(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&addressdetails=1&zoom=18&accept-language=en&lat=${encodeURIComponent(latitude)}&lon=${encodeURIComponent(longitude)}`)
      } catch {
        // Fall back to the server route for browsers/networks that cannot reach Nominatim.
        data = await fetchJson(`https://chalakgo.onrender.com/api/location/reverse?${query}`)
      }
      const details = toLocationDetails(data, currentCoordinates)
      lastResolvedAddress = { coordinates: currentCoordinates, details }
      return details
    })()

    pendingReverseLookup = { coordinates: currentCoordinates, promise }
    try {
      return await promise
    } finally {
      if (pendingReverseLookup?.promise === promise) pendingReverseLookup = null
    }
  }, [])
  const fetchLocation = useCallback(async () => {
    if (!navigator.geolocation) return setLocation({ ...initial, error: 'Location is not supported by this browser.' })
    setLocation((old) => ({ ...old, loading: true, error: '' }))
    try {
      const { coords } = await getMostAccuratePosition()
      const coordinates = { latitude: coords.latitude, longitude: coords.longitude, accuracy: Math.round(coords.accuracy) }
      const details = await resolveAddress(coords.latitude, coords.longitude)
      setLocation({ label: details.formattedAddress, details, coordinates, loading: false, error: '' })
    } catch (error) {
      const denied = error?.code === 1
      setLocation({ ...initial, error: denied ? 'Allow Precise location permission to use your current location.' : 'Unable to get a precise GPS location. Turn on device GPS and try again.' })
    }
  }, [resolveAddress])
  useEffect(() => { fetchLocation() }, [fetchLocation])
  return { ...location, fetchLocation }
}
