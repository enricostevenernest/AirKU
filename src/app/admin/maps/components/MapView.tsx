"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import type { LokasiAirBersih } from "@/types/lokasi_air";
import type { MapMarker } from "@/components/MapComponent";

const MapComponent = dynamic(() => import("@/components/MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="map-loading">
      <div className="spinner"></div>
      <p>Memuat peta...</p>
    </div>
  ),
});

interface MapViewProps {
  locations: LokasiAirBersih[];
  onMapClick: (lat: number, lng: number) => void;
  onMarkerClick: (marker: MapMarker) => void; // Ubah dari (id: string) menjadi (marker: MapMarker)
}

export default function MapView({ locations, onMapClick, onMarkerClick }: MapViewProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const markers = locations.map((item) => ({
    id: item.id,
    lat: item.latitude,
    lng: item.longitude,
    name: item.nama_lokasi,
    description: item.deskripsi || "",
    alamat: item.alamat,
    jam_operasional: item.jam_operasional || "",
    status: item.status,
    tipe: item.tipe || "sumur",
  }));

  if (!isMounted) {
    return (
      <div className="map-loading">
        <div className="spinner"></div>
        <p>Memuat peta...</p>
      </div>
    );
  }

  return (
    <div className="map-container">
      <div className="map-header">
        <h3 className="map-title">🗺️ Visualisasi Peta Lokasi</h3>
        <p className="map-subtitle">Klik pada peta untuk menambah lokasi | Klik marker untuk edit</p>
      </div>
      <div className="map-wrapper">
        <MapComponent
          markers={markers}
          center={[-6.2088, 106.8456]}
          zoom={13}
          onClickMap={onMapClick}
          onMarkerClick={onMarkerClick} // Sekarang mengirim MapMarker object
          height="450px"
          showPopup={true}
          showLegend={true}
        />
      </div>
    </div>
  );
}