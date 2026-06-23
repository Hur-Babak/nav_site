import seed from "../data/companies.json";

// Палітра кольорів для міток. Назву кожній мітці задає користувач сам.
export const MARKER_COLORS = [
  "#e24b4a",
  "#ef9f27",
  "#63a022",
  "#2f8fd0",
  "#9a64d0",
  "#dadfd1",
  "#8b8b85",
];

export interface MapMarker {
  id: string;
  color: string;
  title: string;
  date: string;
  description: string;
  x: number; // easting, ігрові метри
  y: number; // northing, ігрові метри
  images?: string[];
  videos?: string[];
  units?: string[];
  source?: string;
  image?: string; // legacy (одне фото) — для зворотної сумісності
}

export function markerImages(m: MapMarker): string[] {
  const arr = m.images ?? (m.image ? [m.image] : []);
  return arr.map((s) => s.trim()).filter(Boolean);
}

export function markerVideos(m: MapMarker): string[] {
  return (m.videos ?? []).map((s) => s.trim()).filter(Boolean);
}

export interface Company {
  id: string;
  name: string;
  color: string;
  map: string; // slug карти atlas
  markers: MapMarker[];
}

const KEY = "nav.companies.v1";

export function loadCompanies(): Company[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as Company[];
  } catch {
    /* ignore */
  }
  return structuredClone(seed) as Company[];
}

export function saveCompanies(companies: Company[]): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(companies));
  } catch {
    /* ignore */
  }
}

export function resetCompanies(): Company[] {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
  return structuredClone(seed) as Company[];
}

export function exportCompanies(companies: Company[]): void {
  const blob = new Blob([JSON.stringify(companies, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "companies.json";
  a.click();
  URL.revokeObjectURL(url);
}

export function uid(prefix = "id"): string {
  return prefix + "_" + Math.random().toString(36).slice(2, 9);
}
