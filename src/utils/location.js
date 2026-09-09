const value = (address, ...keys) =>
  keys
    .map((key) => address?.[key])
    .find((entry) => typeof entry === 'string' && entry.trim())
    ?.trim() || ''

export function toLocationDetails(data) {
  if (!data || data.error || (!data.display_name && !Object.keys(data.address || {}).length))
    throw new Error('No address found for this location')
  const address = data.address || {}
  const buildingName =
    value(address, 'building', 'house_name', 'apartments', 'residential') ||
    (['building', 'amenity', 'office', 'shop'].includes(data.category || data.class)
      ? value(data, 'name')
      : '')
  const details = {
    houseNumber: value(address, 'house_number'),
    buildingName,
    road: value(
      address,
      'road',
      'pedestrian',
      'street',
      'footway',
      'path',
      'cycleway',
      'track',
      'lane'
    ),
    neighbourhood: value(address, 'neighbourhood', 'quarter'),
    suburb: value(address, 'suburb'),
    locality: value(address, 'locality', 'hamlet', 'isolated_dwelling', 'village'),
    area: value(
      address,
      'neighbourhood',
      'suburb',
      'quarter',
      'locality',
      'hamlet',
      'city_district',
      'village',
      'town',
      'township'
    ),
    city: value(address, 'city', 'town', 'village', 'municipality'),
    district: value(address, 'district', 'state_district', 'county'),
    state: value(address, 'state', 'region'),
    pincode: value(address, 'postcode'),
    country: value(address, 'country'),
  }
  details.formattedAddress =
    value(data, 'display_name') || [...new Set(Object.values(details).filter(Boolean))].join(', ')
  return details
}

export function getFreshPosition(geolocation, signal, timeout = 15000) {
  return new Promise((resolve, reject) => {
    let settled = false
    const finish = (error, position) => {
      if (settled) return
      settled = true
      clearTimeout(timer)
      signal?.removeEventListener('abort', abort)
      if (error) return reject(error)
      const { latitude, longitude, accuracy } = position?.coords || {}
      if (
        ![latitude, longitude, accuracy, position?.timestamp].every(Number.isFinite) ||
        Math.abs(latitude) > 90 ||
        Math.abs(longitude) > 180 ||
        accuracy < 0 ||
        position.timestamp <= 0
      )
        return reject(new Error('Invalid location reading'))
      resolve({ coordinates: { latitude, longitude, accuracy }, timestamp: position.timestamp })
    }
    const abort = () => finish(new Error('Location request cancelled'))
    const timer = setTimeout(() => finish({ code: 3 }), timeout + 1000)
    if (signal?.aborted) return abort()
    signal?.addEventListener('abort', abort, { once: true })
    try {
      geolocation.getCurrentPosition(
        (position) => finish(null, position),
        (error) => finish(error),
        { enableHighAccuracy: true, timeout, maximumAge: 0 }
      )
    } catch (error) {
      finish(error)
    }
  })
}

export async function getBestFreshPosition(geolocation, signal, onProgress = () => {}) {
  let best = null
  let lastError
  // Bounded acquisition, not live tracking: at most three fresh fixes, 30s total.
  const deadline = Date.now() + 30000
  for (let attempt = 0; attempt < 3 && Date.now() < deadline; attempt++) {
    if (signal?.aborted) throw new Error('Location request cancelled')
    try {
      const reading = await getFreshPosition(
        geolocation,
        signal,
        Math.min(10000, deadline - Date.now())
      )
      if (!best || reading.coordinates.accuracy <= best.coordinates.accuracy) best = reading
      if (best.coordinates.accuracy <= 30) return best
      if (attempt < 2) onProgress('Finding your pickup location...')
    } catch (error) {
      if (signal?.aborted || error?.code === 1) throw error
      lastError = error
    }
  }
  if (best) return best
  throw lastError || { code: 3 }
}

export const addressFields = [
  ['🏠 House / flat number', 'houseNumber'],
  ['🏠 Apartment / building name', 'buildingName'],
  ['🛣️ Street / road', 'mainRoad'],
  ['Neighbourhood', 'neighbourhood'],
  ['Suburb', 'suburb'],
  ['Locality', 'locality'],
  ['📍 Area', 'area'],
  ['🏙️ City / town / village', 'city'],
  ['District', 'district'],
  ['📌 State', 'state'],
  ['📮 Pincode', 'pincode'],
  ['Country', 'country'],
]

export function addressFormValues(details) {
  return {
    ...Object.fromEntries(
      addressFields.map(([, name]) => [name, details?.[name === 'mainRoad' ? 'road' : name] || ''])
    ),
    address: details?.formattedAddress || '',
  }
}

export function pickupPayload(form, source, coordinates, timestamp) {
  const pickup = {
    source,
    formattedAddress: form.address,
    houseNumber: form.houseNumber || '',
    buildingName: form.buildingName || '',
    building: form.buildingName || '',
    road: form.mainRoad || '',
    area: form.area || '',
    city: form.city || '',
    neighbourhood: form.neighbourhood || '',
    suburb: form.suburb || '',
    locality: form.locality || '',
    district: form.district || '',
    state: form.state || '',
    pincode: form.pincode || '',
    country: form.country || '',
    ...(source === 'current' ? { coordinates } : {}),
  }
  return {
    pickup,
    pickupLocation: form.address,
    pickupAddress: form.address,
    pickupHouseNumber: pickup.houseNumber,
    pickupBuildingName: pickup.buildingName,
    pickupRoad: pickup.road,
    road: pickup.road,
    pickupArea: pickup.area,
    pickupCity: pickup.city,
    pickupState: pickup.state,
    pickupPincode: pickup.pincode,
    pickupCountry: pickup.country,
    locationSource: source === 'current' ? 'gps' : 'manual',
    ...(source === 'current'
      ? {
          coordinates,
          pickupLatitude: coordinates?.latitude,
          pickupLongitude: coordinates?.longitude,
          pickupAccuracy: coordinates?.accuracy,
          pickupTimestamp: timestamp,
        }
      : {}),
  }
}
