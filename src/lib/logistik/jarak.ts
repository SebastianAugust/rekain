import type { Titik } from "@/lib/types";

/*
  Geodesic distance. Pure, dependency-free, and deterministic — the same inputs
  always produce the same kilometre figure, which is what makes the planner
  testable and its savings claim checkable.
*/

const RADIUS_BUMI_KM = 6371;

/** Great-circle distance between two points, in kilometres. */
export function haversine(a: Titik, b: Titik): number {
  const rad = Math.PI / 180;
  const dLat = (b.lat - a.lat) * rad;
  const dLng = (b.lng - a.lng) * rad;

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(dLng / 2) ** 2;

  return 2 * RADIUS_BUMI_KM * Math.asin(Math.min(1, Math.sqrt(h)));
}

/**
 * Straight-line distance understates driving, so every reported figure is scaled
 * by a detour factor. 1.35 is the usual planning value for a dense road network
 * like Bandung's. Applied in one place so the whole plan stays internally
 * consistent, and so it is obvious this is an estimate rather than a road-graph
 * result.
 */
export const FAKTOR_JALAN = 1.35;

export function jarakJalan(a: Titik, b: Titik): number {
  return haversine(a, b) * FAKTOR_JALAN;
}

/** Total length of an open path through the given points, in road-km. */
export function panjangJalur(titik: Titik[]): number {
  let total = 0;
  for (let i = 1; i < titik.length; i++) total += jarakJalan(titik[i - 1], titik[i]);
  return total;
}

/** Length of a closed tour that leaves the depot, visits each point, and returns. */
export function panjangTur(depot: Titik, titik: Titik[]): number {
  if (titik.length === 0) return 0;
  return panjangJalur([depot, ...titik, depot]);
}
