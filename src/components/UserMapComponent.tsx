'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import styles from '../app/maps/page.module.css';

// Perbaiki icon marker Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Warna marker berdasarkan status
const getMarkerIcon = (status?: string) => {
  const colors: { [key: string]: string } = {
    aktif: '#22c55e',
    perbaikan: '#eab308',
    'tidak aktif': '#ef4444'
  };
  const color = status ? colors[status] : '#3b82f6';
  
  return L.divIcon({
    html: `<div style="background-color: ${color}; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.5);"></div>`,
    className: 'custom-marker',
    iconSize: [14, 14],
    popupAnchor: [0, -7]
  });
};

// Legenda peta
function MapLegend() {
  return (
    <div className={styles.mapLegend}>
      <h4>Legenda</h4>
      <div className={styles.legendItem}>
        <div className={`${styles.legendColor} ${styles.legendColorActive}`}></div>
        <span className={styles.legendText}>Aktif</span>
      </div>
      <div className={styles.legendItem}>
        <div className={`${styles.legendColor} ${styles.legendColorRepair}`}></div>
        <span className={styles.legendText}>Perbaikan</span>
      </div>
      <div className={styles.legendItem}>
        <div className={`${styles.legendColor} ${styles.legendColorInactive}`}></div>
        <span className={styles.legendText}>Tidak Aktif</span>
      </div>
    </div>
  );
}

// Interface props
interface UserMapComponentProps {
  markers: Array<{
    id: string;
    lat: number;
    lng: number;
    name: string;
    description?: string;
    alamat?: string;
    jam_operasional?: string;
    status?: string;
  }>;
  center?: [number, number];
  zoom?: number;
  onDetailClick?: (id: string) => void;
  height?: string | number;
}

export default function UserMapComponent({
  markers = [],
  center = [-6.2088, 106.8456] as [number, number],
  zoom = 12,
  onDetailClick,
  height = '450px'
}: UserMapComponentProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="bg-gray-200 rounded-xl flex items-center justify-center" style={{ height: typeof height === 'number' ? `${height}px` : height }}>
        <div className="text-gray-500">Memuat peta...</div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: typeof height === 'number' ? `${height}px` : height, width: '100%', borderRadius: '0.75rem' }}
        className="z-0"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />
        
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            position={[marker.lat, marker.lng]}
            icon={getMarkerIcon(marker.status)}
          >
            <Popup>
              <div className={styles.popupContent}>
                <h3 className={styles.popupTitle}>{marker.name}</h3>
                <p className={styles.popupAddress}>📍 {marker.alamat}</p>
                {marker.description && <p className={styles.popupDescription}>{marker.description}</p>}
                {marker.jam_operasional && <p className={styles.popupHours}>🕐 {marker.jam_operasional}</p>}
                <span className={`${styles.statusBadge} ${marker.status === 'aktif' ? styles.statusActive : marker.status === 'perbaikan' ? styles.statusRepair : styles.statusInactive}`}>
                    Status: {marker.status}
                  </span>
                <button
                  onClick={() => onDetailClick?.(marker.id)}
                  className={styles.detailButton}
                >
                  📋 Lihat Detail Lengkap
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      <MapLegend />
    </div>
  );
}