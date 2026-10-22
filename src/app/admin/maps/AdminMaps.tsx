"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import LocationTable from "./components/Table";
import EditLocationModal from "./components/EditModal";
import DeleteConfirmModal from "./components/DeleteConfirm";
import AddLocationForm from "./components/AddForm";
import { LokasiAirBersih, LokasiAirFormData } from "@/types/lokasi_air";
import { createClient } from "../../lib/supabase";
import type { MapMarker } from "@/components/MapComponent";
import "./frontend/admin-maps.css";

const MapComponent = dynamic(
  () => import("@/components/MapComponent"),
  { 
    loading: () => (
      <div className="map-loading">
        <div className="loading-spinner"></div>
        <p>Memuat peta...</p>
      </div>
    ),
    ssr: false 
  }
);

type ToastType = "success" | "error" | "info";
type View = "dashboard" | "add";

interface Toast {
  id: number;
  type: ToastType;
  message: string;
}

export default function AdminMapsPage() {
  const [locations, setLocations] = useState<LokasiAirBersih[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState<View>("dashboard");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<LokasiAirBersih | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("semua");
  const [filterTipe, setFilterTipe] = useState<string>("semua");
  const [initialLatLng, setInitialLatLng] = useState<{ lat: number; lng: number } | null>(null);

  const addToast = useCallback((message: string, type: ToastType = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const loadLocations = useCallback(async () => {
    try {
      setIsLoading(true);
      const supabase = createClient();
      const { data, error } = await supabase
        .from("lokasi_air_bersih")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setLocations(data || []);
    } catch (error) {
      console.error("Error loading locations:", error);
      addToast("Gagal memuat data lokasi", "error");
    } finally {
      setIsLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    loadLocations();
  }, [loadLocations]);

  const handleAddLocation = async (data: LokasiAirFormData) => {
    try {
      const supabase = createClient();
      const newLocation = {
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data: inserted, error } = await supabase
        .from("lokasi_air_bersih")
        .insert([newLocation])
        .select()
        .single();

      if (error) throw error;

      setLocations((prev) => [inserted, ...prev]);
      addToast(`✅ Lokasi "${data.nama_lokasi}" berhasil ditambahkan`, "success");
      setView("dashboard");
      setInitialLatLng(null);
    } catch (error) {
      console.error("Error adding location:", error);
      addToast("Gagal menambahkan lokasi", "error");
      throw error;
    }
  };

  const handleUpdateLocation = async (data: LokasiAirFormData) => {
    if (!selectedLocation) return;

    try {
      const supabase = createClient();
      const updatedLocation = {
        ...data,
        updated_at: new Date().toISOString(),
      };

      const { data: updated, error } = await supabase
        .from("lokasi_air_bersih")
        .update(updatedLocation)
        .eq("id", selectedLocation.id)
        .select()
        .single();

      if (error) throw error;

      setLocations((prev) =>
        prev.map((loc) => (loc.id === updated.id ? updated : loc))
      );
      addToast(`✅ Lokasi "${data.nama_lokasi}" berhasil diperbarui`, "success");
      setIsEditModalOpen(false);
      setSelectedLocation(null);
    } catch (error) {
      console.error("Error updating location:", error);
      addToast("Gagal memperbarui lokasi", "error");
      throw error;
    }
  };

  const handleDeleteLocation = async () => {
    if (!selectedLocation) return;

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("lokasi_air_bersih")
        .delete()
        .eq("id", selectedLocation.id);

      if (error) throw error;

      setLocations((prev) => prev.filter((loc) => loc.id !== selectedLocation.id));
      addToast(`🗑️ Lokasi "${selectedLocation.nama_lokasi}" berhasil dihapus`, "success");
      setIsDeleteOpen(false);
      setSelectedLocation(null);
    } catch (error) {
      console.error("Error deleting location:", error);
      addToast("Gagal menghapus lokasi", "error");
    }
  };

  const handleMapClick = (lat: number, lng: number) => {
    setInitialLatLng({ lat, lng });
    setView("add");
  };

  // Fungsi untuk menangani klik tombol "lihat detail lengkap / edit" dari popup
  const handleMarkerEditClick = (marker: MapMarker) => {
    const location = locations.find((loc) => loc.id === marker.id);
    if (location) {
      setSelectedLocation(location);
      setIsEditModalOpen(true);
    }
  };

  const filteredLocations = locations.filter((loc) => {
    const matchesSearch = 
      loc.nama_lokasi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (loc.alamat && loc.alamat.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = filterStatus === "semua" || loc.status === filterStatus;
    const matchesTipe = filterTipe === "semua" || loc.tipe === filterTipe;
    
    return matchesSearch && matchesStatus && matchesTipe;
  });

  const mapMarkers = locations.map((loc) => ({
    id: loc.id,
    lat: loc.latitude,
    lng: loc.longitude,
    name: loc.nama_lokasi,
    description: loc.deskripsi || undefined,
    alamat: loc.alamat,
    jam_operasional: loc.jam_operasional || undefined,
    status: loc.status,
    tipe: loc.tipe || undefined,
    kapasitas: loc.kapasitas || undefined,
  }));

  const stats = {
    total: locations.length,
    aktif: locations.filter((l) => l.status === "aktif").length,
    perbaikan: locations.filter((l) => l.status === "perbaikan").length,
    tidakAktif: locations.filter((l) => l.status === "tidak aktif").length,
  };

  if (view === "add") {
    return (
      <div className="admin-maps-container">
        <AddLocationForm
          onSubmit={handleAddLocation}
          onCancel={() => {
            setView("dashboard");
            setInitialLatLng(null);
          }}
          initialLatLng={initialLatLng}
        />
        <div className="toast-wrapper">
          {toasts.map((toast) => (
            <div key={toast.id} className={`toast toast-${toast.type}`}>
              <span className="toast-icon">
                {toast.type === "success" && "✅"}
                {toast.type === "error" && "❌"}
                {toast.type === "info" && "ℹ️"}
              </span>
              {toast.message}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="admin-maps-container">
      <div className="admin-header">
        <div>
          <h1 className="admin-title">🗺️ Pengelolaan Lokasi Air Bersih</h1>
          <p className="admin-subtitle">
            Kelola titik koordinat sumber air bersih untuk visualisasi peta yang akurat
          </p>
        </div>
        <button
          className="btn-add-location"
          onClick={() => {
            setInitialLatLng(null);
            setView("add");
          }}
        >
          + Tambah Lokasi Baru
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📍</div>
          <div className="stat-info">
            <span className="stat-value">{stats.total}</span>
            <span className="stat-label">Total Lokasi</span>
          </div>
        </div>
        <div className="stat-card stat-active">
          <div className="stat-icon">🟢</div>
          <div className="stat-info">
            <span className="stat-value">{stats.aktif}</span>
            <span className="stat-label">Aktif</span>
          </div>
        </div>
        <div className="stat-card stat-maintenance">
          <div className="stat-icon">🟡</div>
          <div className="stat-info">
            <span className="stat-value">{stats.perbaikan}</span>
            <span className="stat-label">Perbaikan</span>
          </div>
        </div>
        <div className="stat-card stat-inactive">
          <div className="stat-icon">🔴</div>
          <div className="stat-info">
            <span className="stat-value">{stats.tidakAktif}</span>
            <span className="stat-label">Tidak Aktif</span>
          </div>
        </div>
      </div>

      <div className="map-section">
        <div className="section-header">
          <h2>📍 Visualisasi Peta</h2>
          <span className="section-hint">
            Klik pada peta untuk menambah lokasi | Klik marker untuk melihat detail
          </span>
        </div>
        <div className="map-wrapper">
          <MapComponent
            markers={mapMarkers}
            center={[-6.2088, 106.8456]}
            zoom={12}
            onClickMap={handleMapClick}
            onMarkerClick={handleMarkerEditClick}
            height={450}
            showPopup={true}
            showLegend={true}
          />
        </div>
      </div>

      <div className="table-section">
        <div className="section-header">
          <h2>📋 Data Lokasi Air Bersih</h2>
        </div>
        
        <div className="filter-bar">
          <div className="search-box">
            <input
              type="text"
              placeholder="🔍 Cari lokasi atau alamat..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="filter-group">
            <select
              className="filter-select"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="semua">Semua Status</option>
              <option value="aktif">🟢 Aktif</option>
              <option value="perbaikan">🟡 Perbaikan</option>
              <option value="tidak aktif">🔴 Tidak Aktif</option>
            </select>
            <select
              className="filter-select"
              value={filterTipe}
              onChange={(e) => setFilterTipe(e.target.value)}
            >
              <option value="semua">Semua Tipe</option>
              <option value="sumur">💧 Sumur</option>
              <option value="pdam">🚰 PDAM</option>
              <option value="penampungan">🗄️ Penampungan</option>
              <option value="mata air">🏔️ Mata Air</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Memuat data...</p>
          </div>
        ) : (
          <LocationTable
            locations={filteredLocations}
            onEdit={(location) => {
              setSelectedLocation(location);
              setIsEditModalOpen(true);
            }}
            onDelete={(location) => {
              setSelectedLocation(location);
              setIsDeleteOpen(true);
            }}
          />
        )}
      </div>

      <EditLocationModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedLocation(null);
        }}
        onSubmit={handleUpdateLocation}
        initialData={selectedLocation}
      />

      <DeleteConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setSelectedLocation(null);
        }}
        onConfirm={handleDeleteLocation}
        locationName={selectedLocation?.nama_lokasi || ""}
      />

      <div className="toast-wrapper">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast toast-${toast.type}`}>
            <span className="toast-icon">
              {toast.type === "success" && "✅"}
              {toast.type === "error" && "❌"}
              {toast.type === "info" && "ℹ️"}
            </span>
            {toast.message}
          </div>
        ))}
      </div>
    </div>
  );
}