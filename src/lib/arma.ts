import * as L from "leaflet";

// jetelain/Arma3Map — тайли та конфіги карт Arma 3 для Leaflet.
// Конфіг кожної карти: Arma3Map.Maps[slug] = { CRS, tilePattern, tileSize, ... }
export const ARMA_BASE = "https://jetelain.github.io/Arma3Map";

// Слой Aerial (супутник) із нового atlas.plan-ops.fr.
// ID беруться зі сторінки карти (atlas.plan-ops.fr/maps/arma3/<slug>):
// мініатюри шарів мають вигляд /data/1/maps/<mapId>/<layerId>/0/0/0.<ext>.
export const ATLAS_DATA = "https://atlas.plan-ops.fr/data/1/maps";

export interface AtlasAerial {
  mapId: number;
  aerialLayer: number;
  ext: string;
}

export const ATLAS_AERIAL: Record<string, AtlasAerial> = {
  altis: { mapId: 3, aerialLayer: 295, ext: "webp" },
  stratis: { mapId: 104, aerialLayer: 291, ext: "webp" },
  malden: { mapId: 68, aerialLayer: 292, ext: "webp" },
  tanoa: { mapId: 109, aerialLayer: 294, ext: "webp" },
  enoch: { mapId: 37, aerialLayer: 293, ext: "webp" },
  lythium: { mapId: 67, aerialLayer: 296, ext: "webp" },
};

export interface ArmaMapConfig {
  title: string;
  tilePattern: string;
  tileSize: number;
  minZoom: number;
  maxZoom: number;
  defaultZoom: number;
  worldSize: number;
  center: [number, number];
  attribution: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  CRS: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

const scriptCache: Record<string, Promise<void>> = {};

function loadScript(src: string): Promise<void> {
  if (src in scriptCache) return scriptCache[src];
  scriptCache[src] = new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = src;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error(`Не вдалося завантажити ${src}`));
    document.head.appendChild(s);
  });
  return scriptCache[src];
}

// mapUtils.js будує MGRS_CRS поверх глобального L — даємо йому наш екземпляр leaflet.
export async function loadArmaMap(slug: string): Promise<ArmaMapConfig> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).L = L;
  await loadScript(`${ARMA_BASE}/js/mapUtils.js`);
  await loadScript(`${ARMA_BASE}/maps/${slug}.js`);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const maps = (window as any).Arma3Map?.Maps as Record<string, ArmaMapConfig> | undefined;
  const cfg = maps?.[slug] ?? (maps ? Object.values(maps).pop() : undefined);
  if (!cfg || !cfg.CRS) {
    throw new Error(`Карту «${slug}» не знайдено в atlas`);
  }
  return cfg;
}

export interface MapOption {
  slug: string;
  name: string;
}

// Поширені карти (slug = той самий, що в URL atlas.plan-ops.fr/maps/arma3/<slug>).
// Будь-яку іншу карту можна додати, вписавши її slug вручну.
export const POPULAR_MAPS: MapOption[] = [
  { slug: "altis", name: "Altis" },
  { slug: "stratis", name: "Stratis" },
  { slug: "malden", name: "Malden 2035" },
  { slug: "tanoa", name: "Tanoa" },
  { slug: "enoch", name: "Livonia (Enoch)" },
  { slug: "chernarus_summer", name: "Chernarus (літо)" },
  { slug: "lythium", name: "Lythium" },
  { slug: "takistan", name: "Takistan" },
  { slug: "vt5", name: "Vt5 — Suomi Finland" },
];
