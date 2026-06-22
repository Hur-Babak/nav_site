import { useEffect, useRef, useState } from "react";
import * as L from "leaflet";
import "leaflet/dist/leaflet.css";
import { loadArmaMap, ARMA_BASE } from "../../lib/arma";
import type { Company, MapMarker } from "../../lib/companies";

interface Props {
  company: Company;
  editMode: boolean;
  addColor: string | null;
  onAddMarker: (x: number, y: number) => void;
  onMarkerClick: (m: MapMarker) => void;
  onMarkerMove: (id: string, x: number, y: number) => void;
}

export default function ArmaMap({
  company,
  editMode,
  addColor,
  onAddMarker,
  onMarkerClick,
  onMarkerMove,
}: Props) {
  const elRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerRef = useRef<L.LayerGroup | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [error, setError] = useState("");

  const liveRef = useRef({ editMode, addColor, onAddMarker });
  liveRef.current = { editMode, addColor, onAddMarker };

  useEffect(() => {
    let cancelled = false;
    let map: L.Map | null = null;
    setStatus("loading");
    setError("");

    loadArmaMap(company.map)
      .then((cfg) => {
        if (cancelled || !elRef.current) return;
        const mp = L.map(elRef.current, {
          minZoom: cfg.minZoom,
          maxZoom: cfg.maxZoom,
          crs: cfg.CRS,
          zoomControl: true,
          attributionControl: true,
          maxBoundsViscosity: 0.9,
        });
        map = mp;
        const baseLayer = L.tileLayer(ARMA_BASE + cfg.tilePattern, {
          attribution: cfg.attribution,
          tileSize: cfg.tileSize,
          minZoom: cfg.minZoom,
          maxZoom: cfg.maxZoom,
          noWrap: true,
        });
        baseLayer.addTo(mp);
        mp.setView(cfg.center, cfg.defaultZoom);

        // Обмеження зони перетягування межами карти (worldSize) + невеликий відступ.
        const ws = cfg.worldSize ?? 0;
        if (ws > 0) {
          const pad = ws * 0.08;
          mp.setMaxBounds([
            [-pad, -pad],
            [ws + pad, ws + pad],
          ]);
        }

        // Перемикач шарів: база «Атлас» + оверлеї (назви міст, сітка).
        const overlays: Record<string, L.Layer> = {};
        const cities = (cfg.cities ?? []) as Array<{ name: string; x: number; y: number }>;
        if (cities.length) {
          const cityLayer = L.layerGroup();
          for (const c of cities) {
            L.marker([c.y, c.x], {
              icon: L.divIcon({ className: "", html: `<span class="arma-city">${c.name}</span>`, iconSize: [0, 0] }),
              interactive: false,
            }).addTo(cityLayer);
          }
          overlays["Назви міст"] = cityLayer;
        }
        if (ws > 0) {
          const gridLayer = L.layerGroup();
          const step = ws > 20000 ? 5000 : 2000;
          for (let g = 0; g <= ws; g += step) {
            L.polyline([[g, 0], [g, ws]], { color: "#ffffff", weight: 1, opacity: 0.12, interactive: false }).addTo(gridLayer);
            L.polyline([[0, g], [ws, g]], { color: "#ffffff", weight: 1, opacity: 0.12, interactive: false }).addTo(gridLayer);
          }
          overlays["Координатна сітка"] = gridLayer;
        }
        L.control
          .layers({ "Атлас (топографічна)": baseLayer }, overlays, { position: "topright" })
          .addTo(mp);

        // Розмір міток залежно від зуму.
        const applyPinScale = () => {
          const z = mp.getZoom();
          const s = Math.max(0.5, Math.min(1.8, 1 + (z - cfg.defaultZoom) * 0.22));
          mp.getContainer().style.setProperty("--pin-scale", String(Math.round(s * 100) / 100));
        };
        mp.on("zoom", applyPinScale);
        applyPinScale();

        mp.on("click", (e: L.LeafletMouseEvent) => {
          const s = liveRef.current;
          if (s.editMode && s.addColor) s.onAddMarker(e.latlng.lng, e.latlng.lat);
        });
        mapRef.current = mp;
        layerRef.current = L.layerGroup().addTo(mp);
        setStatus("ready");
      })
      .catch((err: Error) => {
        if (!cancelled) {
          setError(err.message);
          setStatus("error");
        }
      });

    return () => {
      cancelled = true;
      if (map) map.remove();
      mapRef.current = null;
      layerRef.current = null;
    };
  }, [company.map]);

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer || status !== "ready") return;
    layer.clearLayers();
    for (const m of company.markers) {
      const icon = L.divIcon({
        className: "",
        html: `<span class="nav-pin" style="--c:${m.color}"></span>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      });
      const marker = L.marker([m.y, m.x], { icon, draggable: editMode });
      marker.on("click", () => onMarkerClick(m));
      if (editMode) {
        marker.on("dragend", () => {
          const ll = marker.getLatLng();
          onMarkerMove(m.id, ll.lng, ll.lat);
        });
      }
      marker.addTo(layer);
    }
  }, [company.markers, company.id, editMode, status, onMarkerClick, onMarkerMove]);

  return (
    <div className="relative h-full w-full">
      <div
        ref={elRef}
        className="h-full w-full"
        style={{ cursor: editMode && addColor ? "crosshair" : "" }}
      />
      {status !== "ready" && (
        <div className="pointer-events-none absolute inset-0 z-[500] flex items-center justify-center bg-[var(--bg)]/70 text-center">
          <span className="label-mono px-4">
            {status === "loading"
              ? `Завантаження карти «${company.map}»…`
              : `${error}. Перевір slug карти.`}
          </span>
        </div>
      )}
    </div>
  );
}
