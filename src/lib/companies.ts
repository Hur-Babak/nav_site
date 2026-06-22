import seed from "../data/companies.json";
import type { EventType } from "./data";

export interface MapMarker {
  id: string;
  type: EventType;
  title: string;
  date: string;
  description: string;
  x: number; // easting, ігрові метри
  y: number; // northing, ігрові метри
  image?: string;
  units?: string[];
  source?: string;
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
