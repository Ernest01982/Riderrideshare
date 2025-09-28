import { useEffect, useState } from "react";
import { gmMatrix } from "../lib/mapsServer";

type LatLng = { lat: number; lng: number };

export default function EstimatePreview({
  pickup,
  dropoff,
}: {
  pickup: LatLng | null;
  dropoff: LatLng | null;
}) {
  const [loading, setLoading] = useState(false);
  const [distanceKm, setDistanceKm] = useState<number | null>(null);
  const [etaMin, setEtaMin] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      if (!pickup || !dropoff) return;
      setLoading(true);
      setError(null);
      try {
        const res = await gmMatrix(pickup, dropoff, "driving");
        const el = res?.rows?.[0]?.elements?.[0];
        if (!el || el.status !== "OK") throw new Error("No route");
        const meters = el.distance?.value ?? 0;
        const secs =
          el.duration_in_traffic?.value ?? el.duration?.value ?? 0;
        if (!cancelled) {
          setDistanceKm(Math.round((meters / 1000) * 10) / 10);
          setEtaMin(Math.round(secs / 60));
        }
      } catch (e: any) {
        if (!cancelled) {
          console.error('EstimatePreview error:', e);
          setError(e.message || "Failed to get ETA");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [pickup, dropoff]);

  if (!pickup || !dropoff) return null;
  return (
    <div className="rounded-xl border p-3 text-sm">
      {loading && <div>Calculating estimate…</div>}
      {error && <div className="text-red-600">{error}</div>}
      {!loading && !error && (
        <div className="flex gap-6">
          <div><span className="font-medium">Distance:</span> {distanceKm} km</div>
          <div><span className="font-medium">ETA:</span> {etaMin} min</div>
        </div>
      )}
    </div>
  );
}