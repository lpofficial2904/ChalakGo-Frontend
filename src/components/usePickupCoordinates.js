import { useCallback, useEffect, useRef, useState } from "react";
import { getQuickPosition } from "../utils/location.js";

export default function usePickupCoordinates(initial = null) {
  const [state, setState] = useState({
    coordinates: initial?.coordinates || null,
    timestamp: initial?.timestamp || null,
    loading: false,
    error: "",
  });
  const pending = useRef(null);
  const controller = useRef(null);
  useEffect(() => () => controller.current?.abort(), []);
  const fetchLocation = useCallback(() => {
    if (pending.current) return pending.current;
    controller.current = new AbortController();
    const signal = controller.current.signal;
    setState({ coordinates: null, timestamp: null, loading: true, error: "" });
    const request = (async () => {
      let result;
      try {
        if (!window.isSecureContext || !navigator.geolocation)
          throw new Error(
            "Location requires HTTPS and browser location support.",
          );
        result = {
          ...(await getQuickPosition(navigator.geolocation, signal)),
          loading: false,
          error: "",
        };
      } catch (error) {
        result = {
          coordinates: null,
          timestamp: null,
          loading: false,
          error:
            error.code === 1
              ? "Allow location access or enter your location manually."
              : "Could not detect location. Please retry or enter it manually.",
        };
      }
      if (!signal.aborted) setState(result);
      return result;
    })();
    pending.current = request;
    void request.finally(() => {
      if (pending.current === request) pending.current = null;
    });
    return request;
  }, []);
  return {
    ...state,
    fetchLocation,
    fetchInitialLocation: fetchLocation,
    acquisitionStatus: "Detecting location…",
    label: "",
  };
}
