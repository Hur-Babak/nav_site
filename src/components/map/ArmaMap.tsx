import { useEffect, useRef, useState } from "react";
import * as L from "leaflet";
import "leaflet/dist/leaflet.css";
import { loadArmaMap, ARMA_BASE } from "../../lib/arma";
import { EVENT_TYPES, type EventType } from "../../lib/data";
import type { Company, MapMarker } from "../../lib/companies";

interface Props {
  company: Company;
  editMode: boolean;
  addType: EventType | null;
  onAddMarker: (x: number, y: number) => void;
  onMarkerClick: (m: MapMarker) => void;
  onMarkerMove: (id: string, x: number, y: number) => void;
}

export default function ArmaMap({
  company,
  editMode,
  addType,
  onAddMarker,
  onMarkerClick,
  onMarkerMove,
}: Props) {
  const elRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerRef = useRef<L.LayerGroup | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [error, setError] = useState("");

  // Свіжі значення для обробника кліку — щоб не переініціалізовувати карту.
  const liveRef = useRef({ editMode, addType, onAddMarker });
  liveRef.current = { editMode, addType, onAddMarker };

  // Ініціалізація карти при зміні slug.
  useEffect(() => {
    let cancelled = false;
    let map: L.Map | null = null;
    setStatus("loading");
    setError("");

    loadArmaMap(company.map)
      .then((cfg) => {
        if (cancelled || !elRef.current) return;
        map = L.map(elRef.current, {
          minZoom: cfg.minZoom,
          maxZoom: cfg.maxZoom,
          crs: cfg.CRS,
          zoomControl: true,
          attributionControl: true,
        });
        L.tileLayer(ARMA_BASE + cfg.tilePattern, {
          attribution: cfg.attribution,
          tileSize: cfg.tileSize,
          minZoom: cfg.minZoom,
          maxZoom: cfg.maxZoom,
          noWrap: true,
        }).addTo(map);
        map.setView(cfg.center, cfg.defaultZoom);
        map.on("click", (e: L.LeafletMouseEvent) => {
          const s = liveRef.current;
          if (s.editMode && s.addType) s.onAddMarker(e.latlng.lng, e.latlng.lat);
        });
        mapRef.current = map;
        layerRef.current = L.layerGroup().addTo(map);
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

  // Перемальовування міток.
  useEffect(() => {
    const layer = layerRef.current;
    if (!layer || status !== "ready") return;
    layer.clearLayers();
    for (const m of company.markers) {
      const meta = EVENT_TYPES[m.type];
      const icon = L.divIcon({
        className: "",
        html: `<span class="nav-pin ${m.type === "enemy" ? "enemy" : ""}" style="display:block;width:22px;height:22px;background:${meta.color};box-shadow:0 0 10px ${meta.color}aa"></span>`,
        iconSize: [22, 22],
        iconAnchor: [11, 11],
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
        style={{ cursor: editMode && addType ? "crosshair" : "" }}
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
