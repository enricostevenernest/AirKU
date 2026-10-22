'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// icon marker Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Types (sama seperti sebelumnya)
export type StatusLokasi = 'aktif' | 'perbaikan' | 'tidak aktif';
export type TipeLokasi = 'sumur' | 'pdam' | 'penampungan' | 'mata air';

export interface LokasiAirBersih {
  id: string;
  nama_lokasi: string;
  deskripsi: string | null;
  alamat: string;
  latitude: number;
  longitude: number;
  status: StatusLokasi;
  kapasitas: string | null;
  tipe: TipeLokasi | null;
  jam_operasional: string | null;
  created_at: string;
  updated_at: string;
}

export interface LokasiAirFormData {
  nama_lokasi: string;
  deskripsi: string;
  alamat: string;
  latitude: number;
  longitude: number;
  status: StatusLokasi;
  kapasitas: string;
  tipe: TipeLokasi;
  jam_operasional: string;
}

export interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  name: string;
  description?: string;
  alamat?: string;
  jam_operasional?: string;
  status?: string;
  tipe?: string;
  kapasitas?: string;
}

// Custom marker icon (sama seperti sebelumnya)
const getMarkerIcon = (tipe?: string, status?: string) => {
  const typeIcons: { [key: string]: string } = {
    sumur: '💧',
    pdam: '🚰',
    penampungan: '🗄️',
    'mata air': '🏔️'
  };
  const statusColors: { [key: string]: string } = {
    aktif: '#22c55e',
    perbaikan: '#eab308',
    'tidak aktif': '#ef4444'
  };
  const icon = tipe ? typeIcons[tipe] || '📍' : '📍';
  const color = status ? statusColors[status] || '#3b82f6' : '#3b82f6';
  return L.divIcon({
    html: `
      <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
        <div style="font-size: 20px; line-height: 1; filter: drop-shadow(0px 2px 2px rgba(0,0,0,0.5));">${icon}</div>
        <div style="background-color: ${color}; width: 10px; height: 10px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.5); position: absolute; bottom: -4px; right: -4px;"></div>
      </div>
    `,
    className: 'custom-marker',
    iconSize: [24, 24],
    popupAnchor: [0, -12]
  });
};

interface MapComponentProps {
  markers?: Array<MapMarker>;
  center?: [number, number];
  zoom?: number;
  onClickMap?: (lat: number, lng: number) => void;
  onMarkerClick?: (marker: MapMarker) => void;
  height?: string | number;
  showPopup?: boolean;
  showLegend?: boolean;
}

// Komponen untuk memastikan drag berfungsi
function EnsureDragging() {
  const map = useMap();
  useEffect(() => {
    if (!map) return;
    // Aktifkan semua interaksi
    map.dragging.enable();
    map.touchZoom.enable();
    map.scrollWheelZoom.enable();
    map.doubleClickZoom.enable();
    console.log('✅ Dragging enabled:', map.dragging.enabled());
  }, [map]);
  return null;
}

function MapClickHandler({ onClick }: { onClick?: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      if (onClick) onClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function MapLegend() {
  return (
    <div className="map-legend-custom absolute bottom-4 right-4 z-[1000] flex gap-6">
      <div>
        <h4 className="font-semibold text-gray-700 mb-2 text-xs border-b pb-1">Tipe Lokasi</h4>
        <div className="space-y-1">
          <div className="flex items-center gap-2"><span>💧</span><span className="text-xs">Sumur</span></div>
          <div className="flex items-center gap-2"><span>🚰</span><span className="text-xs">PDAM</span></div>
          <div className="flex items-center gap-2"><span>🗄️</span><span className="text-xs">Penampungan</span></div>
          <div className="flex items-center gap-2"><span>🏔️</span><span className="text-xs">Mata Air</span></div>
        </div>
      </div>
      <div>
        <h4 className="font-semibold text-gray-700 mb-2 text-xs border-b pb-1">Status</h4>
        <div className="space-y-1">
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-green-500"></div><span className="text-xs">Aktif</span></div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-yellow-500"></div><span className="text-xs">Perbaikan</span></div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-500"></div><span className="text-xs">Tidak Aktif</span></div>
        </div>
      </div>
    </div>
  );
}

// Custom Popup Content (seperti gambar)
function CustomPopupContent({
  marker,
  onEditClick,
}: {
  marker: MapMarker;
  onEditClick: (marker: MapMarker) => void;
}) {
  const statusConfig = {
    aktif: {
      text: "Aktif",
      color: "text-green-600",
      dot: "bg-green-500",
    },
    perbaikan: {
      text: "Sedang Perbaikan",
      color: "text-yellow-600",
      dot: "bg-yellow-500",
    },
    "tidak aktif": {
      text: "Tidak Aktif",
      color: "text-red-500",
      dot: "bg-red-500",
    },
  };

  const current =
    statusConfig[marker.status as keyof typeof statusConfig] ||{
      text: "Tidak diketahui",
      color: "text-gray-500",
      dot: "bg-gray-400",
    };

  return (
    <div className="custom-popup">

      {/* Header */}
      <div className="custom-popup-header">
        <h3 className="custom-popup-title">
          {marker.name}
        </h3>
      </div>

      {/* Alamat */}
      <div className="custom-popup-address">
        <div className="custom-popup-address-icon">📍</div>
        <div className="custom-popup-address-text">{marker.alamat || "Alamat tidak tersedia"}</div>
      </div>

      {/* Deskripsi */}
      {marker.description && (
        <div className="custom-popup-description">
          <p>{marker.description}</p>
        </div>
      )}

      {/* Status */}
      <div className="custom-popup-status">
        <div
          className={`custom-popup-status-dot ${current.dot}`}
        />
        <span className={`custom-popup-status-text ${current.color}`}>
          {current.text}
        </span>
      </div>

      {/* Detail */}
      <div className="custom-popup-details">

        {marker.kapasitas && (
          <div className="custom-popup-detail-item">
            <span>💧</span>
            <span>
              Kapasitas: {marker.kapasitas}
            </span>
          </div>
        )}

        {marker.jam_operasional && (
          <div className="custom-popup-detail-item">
            <span>🕒</span>
            <span>
              Operasional: {marker.jam_operasional}
            </span>
          </div>
        )}

      </div>

      {/* Button */}
      <button
        className="custom-popup-button"
        onClick={(e) => {
          e.stopPropagation();
          onEditClick(marker);
        }}
      >
        Lihat detail lengkap / edit →
      </button>
    </div>
  );
}

// KOMPONEN MAP UTAMA
function MapComponent({ 
  markers = [], 
  center = [-6.2088, 106.8456] as [number, number],
  zoom = 13,
  onClickMap,
  onMarkerClick,
  height = '100%',
  showPopup = true,
  showLegend = true
}: MapComponentProps) {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => { setIsMounted(true); }, []);

  if (!isMounted) {
    return (
      <div className="bg-gray-200 rounded-lg flex items-center justify-center" style={{ height: typeof height === 'number' ? `${height}px` : height }}>Loading map...</div>
    );
  }

  const mapCenter: [number, number] = center;

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={mapCenter}
        zoom={zoom}
        dragging={true}
        touchZoom={true}
        scrollWheelZoom={true}
        doubleClickZoom={true}
        style={{ height: typeof height === 'number' ? `${height}px` : height, width: '100%', borderRadius: '0.5rem' }}
        className="z-0"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <EnsureDragging />
        {onClickMap && <MapClickHandler onClick={onClickMap} />}
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            position={[marker.lat, marker.lng]}
            icon={getMarkerIcon(marker.tipe, marker.status)}
          >
            {showPopup && (
              <Popup>
                <CustomPopupContent marker={marker} onEditClick={(clickedMarker) => onMarkerClick && onMarkerClick(clickedMarker)} />
              </Popup>
            )}
          </Marker>
        ))}
      </MapContainer>
      {showLegend && <MapLegend />}
    </div>
  );
}

export default MapComponent;