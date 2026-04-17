import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

interface LeafletMapProps {
  center?: [number, number];
  zoom?: number;
  popupText?: string;
}

const LeafletMap: React.FC<LeafletMapProps> = ({ 
  center = [-7.75545, 110.42621], 
  zoom = 16,
  popupText = "<b>Klinik Hewan D'FREEZE & SON</b><br>Jl. Raya Stadion Maguwoharjo"
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    if (mapRef.current && !mapInstance.current) {
      // Initialize map
      mapInstance.current = L.map(mapRef.current).setView(center, zoom);

      // Add CartoDB Positron Tile Layer
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> | <a href="https://carto.com/attributions">Carto</a>',
        subdomains: 'abcd',
        maxZoom: 20
      }).addTo(mapInstance.current);

      // Add Marker
      const marker = L.marker(center).addTo(mapInstance.current);
      if (popupText) {
        marker.bindPopup(popupText).openPopup();
      }
    }

    // Cleanup on unmount
    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [center, zoom, popupText]);

  return (
    <div 
      ref={mapRef} 
      className="h-full w-full rounded-3xl z-0"
      style={{ minHeight: '100%', background: '#f1f5f9' }}
    />
  );
};

export default LeafletMap;
