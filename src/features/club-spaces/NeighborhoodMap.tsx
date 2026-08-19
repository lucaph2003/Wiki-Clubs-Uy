import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { GeoPoint, Landmark } from '@/domain/types';

/** Estilo raster libre (OSM), sin API key propietaria (§10.1). */
const OSM_RASTER_STYLE: maplibregl.StyleSpecification = {
  version: 8,
  sources: {
    osm: {
      type: 'raster',
      tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
      tileSize: 256,
      attribution: '&copy; OpenStreetMap contributors',
    },
  },
  layers: [{ id: 'osm', type: 'raster', source: 'osm' }],
};

export interface NeighborhoodMapProps {
  center: GeoPoint;
  landmarks: Landmark[];
  markerColor: string;
}

/** Se monta solo tras interacción explícita del usuario (§13). */
export default function NeighborhoodMap({ center, landmarks, markerColor }: NeighborhoodMapProps): React.ReactElement {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const map = new maplibregl.Map({
      container,
      style: OSM_RASTER_STYLE,
      center: [center.lng, center.lat],
      zoom: 14,
    });
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');

    new maplibregl.Marker({ color: markerColor }).setLngLat([center.lng, center.lat]).addTo(map);
    for (const landmark of landmarks) {
      new maplibregl.Marker({ color: markerColor, scale: 0.7 })
        .setLngLat([landmark.location.lng, landmark.location.lat])
        .setPopup(new maplibregl.Popup().setText(landmark.name))
        .addTo(map);
    }

    mapRef.current = map;
    return () => map.remove();
  }, [center, landmarks, markerColor]);

  return <div ref={containerRef} className="h-80 w-full rounded-2xl" role="application" aria-label="Mapa del barrio" />;
}
