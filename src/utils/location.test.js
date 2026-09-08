import test from 'node:test'
import assert from 'node:assert/strict'
import { toLocationDetails, addressFormValues, pickupPayload, getFreshPosition, getBestFreshPosition } from './location.js'

// Synthetic fixtures are confined to tests; production uses only runtime data.
test('maps house, building, street and administrative address fields', () => {
  const details = toLocationDetails({ display_name: 'Complete returned address', address: {
    house_number: '7B', building: 'Test Apartments', road: 'Test Street', neighbourhood: 'Test Neighbourhood',
    suburb: 'Test Suburb', city: 'Test City', state_district: 'Test District', state: 'Test State', postcode: '302001', country: 'India',
  } })
  assert.equal(details.houseNumber, '7B')
  assert.equal(details.buildingName, 'Test Apartments')
  assert.equal(details.area, 'Test Neighbourhood')
  assert.equal(details.district, 'Test District')
  const form = addressFormValues(details)
  assert.equal(form.mainRoad, 'Test Street')
  assert.equal(form.address, 'Complete returned address')
  assert.equal(form.pincode, '302001')
})

test('rural and partial responses leave unavailable details blank', () => {
  const details = toLocationDetails({ address: { village: 'Test Village', county: 'Test District', state: 'Test State' } })
  assert.equal(details.city, 'Test Village')
  assert.equal(details.houseNumber, '')
  assert.equal(details.buildingName, '')
  assert.equal(details.pincode, '')
  assert.equal(toLocationDetails({ address: { county: 'Test District' } }).city, '')
  assert.equal(addressFormValues(null).houseNumber, '')
  assert.equal(addressFormValues(null).address, '')
})

test('does not mislabel a road name as an apartment name', () => {
  assert.equal(toLocationDetails({ name: 'Test Road', category: 'highway', address: { road: 'Test Road' } }).buildingName, '')
  assert.equal(toLocationDetails({ name: 'Test Building', category: 'building', address: { road: 'Test Road' } }).buildingName, 'Test Building')
  assert.throws(() => toLocationDetails({ error: 'Unable to geocode' }))
  assert.throws(() => toLocationDetails({}))
})

test('edited address values are submitted with original GPS coordinates', () => {
  const form = { ...addressFormValues(toLocationDetails({ address: { road: 'Old Road', building: 'Old Building' } })),
    address: 'Customer corrected address', houseNumber: '8', buildingName: 'Corrected Building', mainRoad: 'Corrected Road' }
  const coordinates = { latitude: 12.3456789, longitude: 76.5432198, accuracy: 16.5 }
  const payload = pickupPayload(form, 'current', coordinates, 12345)
  assert.equal(payload.pickup.formattedAddress, form.address)
  assert.equal(payload.pickupBuildingName, form.buildingName)
  assert.equal(payload.pickup.houseNumber, form.houseNumber)
  assert.equal(payload.pickupRoad, form.mainRoad)
  assert.deepEqual(payload.pickup.coordinates, coordinates)
  assert.equal(payload.pickupTimestamp, 12345)
  const manual = pickupPayload(form, 'manual', coordinates, 12345)
  assert.equal(manual.locationSource, 'manual')
  assert.equal(manual.pickupLatitude, undefined)
  assert.equal(manual.pickup.coordinates, undefined)
})

test('requests fresh high accuracy fix once and preserves device precision', async () => {
  const coords = { latitude: 12.3456789, longitude: 76.5432198, accuracy: 150.75 }
  let calls = 0
  const result = await getFreshPosition({ getCurrentPosition(success, _error, options) {
    calls++
    assert.deepEqual(options, { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 })
    success({ coords, timestamp: 123456 })
  } })
  assert.equal(calls, 1)
  assert.deepEqual(result, { coordinates: coords, timestamp: 123456 })
})

test('permission, timeout, invalid reading and cancellation reject cleanly', async () => {
  for (const code of [1, 2, 3]) await assert.rejects(getFreshPosition({ getCurrentPosition(_success, error) { error({ code }) } }), error => error.code === code)
  await assert.rejects(getFreshPosition({ getCurrentPosition(success) { success({ coords: { latitude: 100, longitude: 1, accuracy: 1 }, timestamp: 123 }) } }), /Invalid/)
  const controller = new AbortController()
  const pending = getFreshPosition({ getCurrentPosition() {} }, controller.signal)
  controller.abort()
  await assert.rejects(pending, /cancelled/)
})

test('improves an approximate first fix and stops when a precise fix arrives', async () => {
  const accuracies = [1800, 75, 12]
  let calls = 0
  const result = await getBestFreshPosition({ getCurrentPosition(success, _error, options) {
    assert.equal(options.maximumAge, 0)
    assert.equal(options.enableHighAccuracy, true)
    success({ coords: { latitude: 12 + calls / 100, longitude: 76, accuracy: accuracies[calls++] }, timestamp: 123456 + calls })
  } })
  assert.equal(calls, 3)
  assert.equal(result.coordinates.accuracy, 12)
  assert.equal(result.coordinates.latitude, 12.02)
})

test('never replaces a better GPS fix with a worse reading or loops forever', async () => {
  let calls = 0
  const result = await getBestFreshPosition({ getCurrentPosition(success) {
    success({ coords: { latitude: 12, longitude: 76, accuracy: [200, 150, 900][calls++] }, timestamp: 123456 })
  } })
  assert.equal(calls, 3)
  assert.equal(result.coordinates.accuracy, 150)
})

test('good first reading needs no retry and permission denial stops immediately', async () => {
  let calls = 0
  await getBestFreshPosition({ getCurrentPosition(success) {
    calls++
    success({ coords: { latitude: 12, longitude: 76, accuracy: 10 }, timestamp: 123456 })
  } })
  assert.equal(calls, 1)
  calls = 0
  await assert.rejects(getBestFreshPosition({ getCurrentPosition(_success, error) { calls++; error({ code: 1 }) } }), error => error.code === 1)
  assert.equal(calls, 1)
})

test('keeps the available fix if subsequent refinement times out', async () => {
  let calls = 0
  const result = await getBestFreshPosition({ getCurrentPosition(success, error) {
    if (calls++ === 0) success({ coords: { latitude: 12, longitude: 76, accuracy: 70 }, timestamp: 123456 })
    else error({ code: 3 })
  } })
  assert.equal(calls, 3)
  assert.equal(result.coordinates.accuracy, 70)
})
