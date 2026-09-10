import { useCallback, useEffect, useRef, useState } from "react";
import { getBestFreshPosition, toLocationDetails } from "../utils/location.js";
import { API_BASE } from "../utils/api.js";

const initial = {
  label: "Click Use current location to detect your pickup.",
  details: null,
  coordinates: null,
  timestamp: null,
  loading: false,
  error: "",
  warning: "",
  acquisitionStatus: "",
};

// Share only in-flight acquisition across the header, forms and StrictMode.
// A newly opened booking must obtain a fresh fix, even after the user moves.
let activeAcquisition = null;

export default function useCurrentLocation({ autoStart = false } = {}) {
  const [location, setLocation] = useState(initial);
  const acquisitionRef = useRef(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const loadLocation = useCallback(() => {
    if (acquisitionRef.current) return acquisitionRef.current;
    if (!window.isSecureContext || !navigator.geolocation) {
      const result = {
        ...initial,
        error: !window.isSecureContext
          ? "Location requires HTTPS (or localhost for development). You can enter your address manually."
          : "Location is not supported by this browser. Enter your address manually.",
      };
      setLocation(result);
      return Promise.resolve(result);
    }
    setLocation({
      ...initial,
      loading: true,
      acquisitionStatus: "Finding your current location…",
    });
    const controller = new AbortController();
    const acquisition =
      activeAcquisition ||
      (async () => {
        let result = { ...initial };
        try {
          const selected = await getBestFreshPosition(
            navigator.geolocation,
            controller.signal,
            (acquisitionStatus) => {
              if (mounted.current)
                setLocation((old) => ({ ...old, acquisitionStatus }));
            },
            true,
          );
          result.coordinates = selected.coordinates;
          result.timestamp = selected.timestamp;
          if (selected.coordinates.accuracy > 100)
            result.warning = `Location is approximate (within ${Math.ceil(selected.coordinates.accuracy)} metres). Enable precise location on your device and refresh, or check the pickup pin before confirming.`;
          result.label =
            "Current location detected. Review the available address below.";
          if (mounted.current)
            setLocation({
              ...result,
              loading: true,
              acquisitionStatus: "Location detected. Looking up the address…",
            });
          // Reverse geocoding is optional convenience data; it must never keep
          // the pickup control in a loading state for a long time.
          const timeout = setTimeout(() => controller.abort(), 3500);
          try {
            const query = new URLSearchParams({
              latitude: String(selected.coordinates.latitude),
              longitude: String(selected.coordinates.longitude),
            });
            const response = await fetch(
              `${API_BASE}/api/location/reverse?${query}`,
              {
                signal: controller.signal,
              },
            );
            if (!response.ok) throw new Error("Address lookup failed");
            result.details = toLocationDetails(await response.json());
            result.label = result.details.formattedAddress || result.label;
          } catch {
            result.error =
              "GPS coordinates were detected, but the address lookup failed. Retry or fill in the address below; your coordinates are retained.";
          } finally {
            clearTimeout(timeout);
          }
        } catch (error) {
          result.error =
            error?.code === 1
              ? "Location permission was denied. Allow location access in your browser settings or enter the address manually."
              : error?.code === 3
                ? "Location detection timed out. Please retry or enter your address manually."
                : "Your current location is unavailable. Check device location services, retry, or enter the address manually.";
        }
        if (mounted.current) setLocation(result);
        return result;
      })();
    activeAcquisition = acquisition;
    acquisitionRef.current = acquisition;
    void acquisition
      .then((result) => {
        if (mounted.current) setLocation(result);
      })
      .finally(() => {
        acquisitionRef.current = null;
        if (activeAcquisition === acquisition) activeAcquisition = null;
      });
    return acquisition;
  }, []);

  const fetchLocation = useCallback(() => loadLocation(false), [loadLocation]);
  const fetchInitialLocation = useCallback(
    () => loadLocation(true),
    [loadLocation],
  );
  useEffect(() => {
    if (autoStart) void fetchInitialLocation();
  }, [autoStart, fetchInitialLocation]);

  return { ...location, fetchLocation, fetchInitialLocation };
}
