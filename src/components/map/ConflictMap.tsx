import { MapContainer, ImageOverlay, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { EVENT_TYPES, type MapEvent } from "../../lib/data";

const W = 1600;
const H = 1000;
const bounds = new L.LatLngBounds([0, 0], [H, W]);

function pinIcon(color: string, enemy: boolean) {
  return L.divIcon({
    className: "",
    html: `<span class="nav-pin ${enemy ? "enemy" : ""}" style="display:block;width:22px;height:22px;background:${color};box-shadow:0 0 10px ${color}aa"></span>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
  });
}

export default function ConflictMap({
  events,
  onSelect,
}: {
  events: MapEvent[];
  onSelect: (e: MapEvent) => void;
}) {
  return (
    <MapContainer
      crs={L.CRS.Simple}
      bounds={bounds}
      maxBounds={bounds.pad(0.25)}
      minZoom={-2}
      maxZoom={2}
      zoomSnap={0.25}
      zoomControl
      attributionControl={false}
      style={{ height: "100%", width: "100%" }}
    >
      <ImageOverlay url="/map/region.svg" bounds={bounds} />
      {events.map((e) => (
        <Marker
          key={e.id}
          position={[H - e.y, e.x]}
          icon={pinIcon(EVENT_TYPES[e.type].color, e.type === "enemy")}
          eventHandlers={{ click: () => onSelect(e) }}
        />
      ))}
    </MapContainer>
  );
}
