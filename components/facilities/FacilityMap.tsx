import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Facility } from '../../types';

interface FacilityMapProps {
  facilities: Facility[];
  selectedFacility: Facility | null;
  onSelectFacility: (fac: Facility) => void;
  center?: { lat: number; lng: number };
}

export const FacilityMap: React.FC<FacilityMapProps> = ({
  facilities,
  selectedFacility,
  onSelectFacility,
  center = { lat: 37.7749, lng: -122.4194 }
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  // Function to create colored SVG markers
  const createCustomIcon = (type: string, isSelected: boolean) => {
    let color = '#0d9488'; // default teal
    let label = 'H';
    if (type === 'hospital') {
      color = '#ef4444'; // red for hospital/emergency
      label = 'H';
    } else if (type === 'clinic') {
      color = '#0284c7'; // blue
      label = 'C';
    } else if (type === 'pharmacy') {
      color = '#10b981'; // green
      label = 'Rx';
    } else if (type === 'laboratory') {
      color = '#f59e0b'; // amber
      label = 'Lab';
    }

    const size = isSelected ? 38 : 30;
    const border = isSelected ? '3px solid #0f172a' : '2px solid #ffffff';

    const html = `
      <div style="
        background-color: ${color};
        width: ${size}px;
        height: ${size}px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        border: ${border};
      ">
        <span style="
          transform: rotate(45deg);
          color: white;
          font-size: ${isSelected ? '12px' : '10px'};
          font-weight: bold;
          font-family: sans-serif;
        ">${label}</span>
      </div>
    `;

    return L.divIcon({
      html,
      className: 'custom-map-pin',
      iconSize: [size, size],
      iconAnchor: [size / 2, size]
    });
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current).setView([center.lat, center.lng], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    return () => {
      // Map cleanup if container unmounts
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update center when center prop changes
  useEffect(() => {
    if (mapInstanceRef.current && center) {
      mapInstanceRef.current.setView([center.lat, center.lng], 13);
    }
  }, [center.lat, center.lng]);

  // Update markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    facilities.forEach(fac => {
      const isSelected = selectedFacility?.id === fac.id;
      const icon = createCustomIcon(fac.type, isSelected);

      const marker = L.marker([fac.lat, fac.lng], { icon }).addTo(map);

      const popupContent = `
        <div style="font-family: sans-serif; font-size: 13px; line-height: 1.4; padding: 2px;">
          <strong style="color: #0f172a; font-size: 14px; display: block; margin-bottom: 2px;">${fac.name}</strong>
          <span style="display: inline-block; padding: 2px 6px; background-color: #f1f5f9; color: #334155; border-radius: 4px; font-size: 10px; font-weight: bold; text-transform: uppercase; margin-bottom: 6px;">
            ${fac.type} ${fac.hasEmergencyRoom ? '• 24/7 ER' : ''}
          </span>
          <div style="color: #64748b; margin-bottom: 4px;">${fac.address}, ${fac.city}</div>
          <div style="color: #0d9488; font-weight: 600; margin-bottom: 6px;">📞 ${fac.phone}</div>
          <div style="font-size: 11px; color: #475569;">🕒 ${fac.operatingHours}</div>
        </div>
      `;

      marker.bindPopup(popupContent);

      marker.on('click', () => {
        onSelectFacility(fac);
      });

      if (isSelected) {
        marker.openPopup();
      }

      markersRef.current.push(marker);
    });
  }, [facilities, selectedFacility]);

  return (
    <div className="relative w-full h-[450px] lg:h-[580px] rounded-2xl overflow-hidden border border-slate-200 shadow-soft">
      <div ref={mapContainerRef} className="w-full h-full z-10" />

      {/* Map Legend */}
      <div className="absolute top-4 right-4 z-20 bg-white/95 backdrop-blur-sm p-3 rounded-xl border border-slate-200/80 shadow-md text-xs space-y-1.5">
        <p className="font-bold text-slate-800 text-[11px] uppercase tracking-wider mb-1">Facility Types</p>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500"></span>
          <span className="text-slate-600 font-medium">Hospital / 24/7 ER</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-sky-600"></span>
          <span className="text-slate-600 font-medium">Urgent Care / Clinic</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
          <span className="text-slate-600 font-medium">Pharmacy</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-amber-500"></span>
          <span className="text-slate-600 font-medium">Diagnostic Lab</span>
        </div>
      </div>
    </div>
  );
};
