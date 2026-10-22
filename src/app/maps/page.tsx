'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';
import { createClient } from "../lib/supabase";
import styles from './page.module.css';

const supabase = createClient();

// ===== SUBTASK 1: IMPORT KOMPONEN PETA USER =====
const UserMapComponent = dynamic(
  () => import('@/components/UserMapComponent'),
  { ssr: false, loading: () => <div className="h-[450px] bg-gray-200 rounded-xl flex items-center justify-center">Memuat peta...</div> }
);

// ===== SUBTASK 2: TIPE DATA TYPESCRIPT =====
type TipeLokasi = 'sumur' | 'pdam' | 'penampungan' | 'mata air';

interface LokasiAirBersih {
  id: string;
  nama_lokasi: string;
  deskripsi: string | null;
  alamat: string;
  latitude: number;
  longitude: number;
  status: string;
  kapasitas: string | null;
  tipe: TipeLokasi | null;
  jam_operasional: string | null;
}

// ============================================================
// ===== KOMPONEN UTAMA =====
// ============================================================
export default function UserMapsPage() {
  
  // State dasar
  const [data, setData] = useState<LokasiAirBersih[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State detail lokasi
  const [selectedLocation, setSelectedLocation] = useState<LokasiAirBersih | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  
  // State filter tipe
  const [filterTipe, setFilterTipe] = useState('');
  
  // State pencarian
  const [search, setSearch] = useState('');

  const [searchInput, setSearchInput] = useState('');

  const [showWarning, setShowWarning] = useState(false);
  
  // State mode darurat
  const [nearestLocations, setNearestLocations] = useState<Array<LokasiAirBersih & { distance: number }>>([]);
  const [showNearest, setShowNearest] = useState(false);

  // ===== FITUR BARU: Sembunyikan lokasi tidak aktif (default true) =====
  const [hideNonActive, setHideNonActive] = useState(true);

  const tableRef = useRef<HTMLDivElement>(null);

  const scrollToTable = () => {
    if (tableRef.current) {
      const elementPosition = tableRef.current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - 90;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };
    

  // FETCH DATA dengan kondisi status
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('lokasi_air_bersih')
        .select('*');

      // Jika hideNonActive true, hanya tampilkan aktif
      if (hideNonActive) {
        query = query.eq('status', 'aktif');
      }
      // Jika false, tidak ada filter status (tampilkan semua)
      
      // Filter tipe
      if (filterTipe) {
        query = query.eq('tipe', filterTipe);
      }
      
      // Pencarian
      if (search) {
        query = query.or(`nama_lokasi.ilike.%${search}%,alamat.ilike.%${search}%`);
      }     
      
      const { data: result, error } = await query.order('nama_lokasi');
      if (error) throw error;
      setData(result || []);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  }, [hideNonActive, filterTipe, search]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  // Debounce pencarian
  useEffect(() => {
    const timer = setTimeout(() => fetchData(), 400);
    return () => clearTimeout(timer);
  }, [search]);
  
  // Hitung jarak
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };
  
  // Cari 3 lokasi terdekat (dari data yang sedang ditampilkan)
  const findNearestLocations = (userLat: number, userLng: number) => {
    const withDistance = data.map(loc => ({
      ...loc,
      distance: calculateDistance(userLat, userLng, loc.latitude, loc.longitude)
    }));
    const sorted = withDistance.sort((a, b) => a.distance - b.distance);
    setNearestLocations(sorted.slice(0, 3));
    setShowNearest(true);
  };
  
  // Ambil lokasi user
  const getUserLocation = () => {
    if (!navigator.geolocation) {
      alert("Browser tidak mendukung geolokasi");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => findNearestLocations(position.coords.latitude, position.coords.longitude),
      () => alert("Gagal mendapatkan lokasi")
    );
  };
  
  // Navigasi Google Maps
  const openGoogleMaps = (lat: number, lng: number) => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
  };
  
  // Handler klik marker
  const handleMarkerClick = (id: string) => {
    const location = data.find(d => d.id === id);
    if (location) {
      setSelectedLocation(location);
      setShowDetail(true);
    }
  };

  const handleFilterTipeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterTipe(e.target.value);
    setTimeout(() => scrollToTable(), 150);
  };

  const handleSearchClick = () => {
    if (searchInput.trim() === '') {
      setShowWarning(true);
      setTimeout(() => setShowWarning(false), 3000); // warning hilang setelah 3 detik
      return;
    }
    setShowWarning(false);
    setSearch(searchInput);
    setTimeout(() => scrollToTable(), 150);
  };

  // Konversi data ke marker
  const markers = data.map(item => ({
    id: item.id,
    lat: item.latitude,
    lng: item.longitude,
    name: item.nama_lokasi,
    description: item.deskripsi || '',
    alamat: item.alamat,
    jam_operasional: item.jam_operasional || '',
    status: item.status  // status dikirim untuk warna marker
  }));
  
  // Helper icon tipe
  const getTipeIcon = (tipe: string | null) => {
    switch (tipe) {
      case 'sumur': return '💧';
      case 'pdam': return '🚰';
      case 'penampungan': return '🗄️';
      case 'mata air': return '🏔️';
      default: return '📍';
    }
  };
  
  // Statistik berdasarkan data yang tampil
  const totalLocations = data.length;
  const sumurCount = data.filter(d => d.tipe === 'sumur').length;
  const pdamCount = data.filter(d => d.tipe === 'pdam').length;
  const mataAirCount = data.filter(d => d.tipe === 'mata air').length;
  
  // ============================================================
  // TAMPILAN HALAMAN
  // ============================================================
  return (
    <div className={styles.pageWrapper}>
      
      {/* HEADER */}
      <header className={styles.header}>
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold">🗺️ AIR KU</h1>
          <p className="text-sm opacity-90 mt-1">Temukan sumber air bersih terdekat</p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-5">
        
        {/* STATISTIK */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <p className={`${styles.statNumber} ${styles.statNumberPrimary}`}>{totalLocations}</p>
            <p className={styles.statLabel}>Total Lokasi</p>
          </div>
          <div className={styles.statCard}>
            <p className={`${styles.statNumber} ${styles.statNumberBlue}`}>{sumurCount}</p>
            <p className={styles.statLabel}>💧 Sumur</p>
          </div>
          <div className={styles.statCard}>
            <p className={`${styles.statNumber} ${styles.statNumberGreen}`}>{pdamCount}</p>
            <p className={styles.statLabel}>🚰 PDAM</p>
          </div>
          <div className={styles.statCard}>
            <p className={`${styles.statNumber} ${styles.statNumberPurple}`}>{mataAirCount}</p>
            <p className={styles.statLabel}>🏔️ Mata Air</p>
          </div>
        </div>
        
        {/* FILTER, PENCARIAN, DAN CHECKBOX */}
        <div className={styles.filterSection}>
          <div className={styles.filterGroup}>
            <input
              type="text"
              placeholder="🔍 Cari nama lokasi atau alamat..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className={styles.searchInput}
            />
            <button onClick={handleSearchClick} className={styles.searchBtn}>
              🔍 Cari
            </button>
            <select
              value={filterTipe}
              onChange={handleFilterTipeChange}
              className={styles.filterSelect}
            >
              <option value="">Semua Tipe</option>
              <option value="sumur">💧 Sumur</option>
              <option value="pdam">🚰 PDAM</option>
              <option value="penampungan">🗄️ Penampungan</option>
              <option value="mata air">🏔️ Mata Air</option>
            </select>
            {(filterTipe || search) && (
              <button onClick={() => { 
                setFilterTipe(''); 
                setSearch(''); 
                setSearchInput('');
              }} className={styles.resetBtn}>
                Reset ↺
              </button>
            )}
          </div>

          {showWarning && (
            <div className={styles.warningMessage}>
              ⚠️ Silakan masukkan nama lokasi atau alamat terlebih dahulu.
            </div>
          )}

          {/* CHECKBOX FILTER STATUS */}
          <div className={styles.filterStatusWrapper}>
            <div className={styles.checkboxRow}>
              <input
                type="checkbox"
                id="hideNonActive"
                checked={hideNonActive}
                onChange={(e) => setHideNonActive(e.target.checked)}
              />
              <label htmlFor="hideNonActive" className={styles.checkboxLabel}>
                Hanya tampilkan lokasi dengan status ✅ <span>AKTIF</span> (sembunyikan yang non-aktif)
              </label>
            </div>
            <div className={styles.infoText}>
              <span className={styles.infoIcon}>💡</span> Non-aktifkan centang untuk melihat semua lokasi (termasuk perbaikan & tidak aktif) - marker berwarna sesuai status
            </div>
          </div>

        </div>

        {/* TOMBOL MODE DARURAT */}
        <button
          onClick={getUserLocation}
          className={styles.emergencyBtn}
        >
          🚨 MODE DARURAT - Cari 3 Lokasi Terdekat 🚨
        </button>

        {/* 3 LOKASI TERDEKAT */}
        {showNearest && nearestLocations.length > 0 && (
          <div className={styles.nearestSection}>
            <div className={styles.nearestHeader}>
              <h3 className={styles.nearestTitle}>🚨 3 LOKASI TERDEKAT DARI ANDA</h3>
              <button onClick={() => setShowNearest(false)} className={styles.nearestClose}>&times;</button>
            </div>
            <div className={styles.nearestList}>
              {nearestLocations.map((loc, idx) => (
                <div key={loc.id} className={`${styles.nearestItem} ${idx === 0 ? styles.nearestItemTerdekat : styles.nearestItemBiasa}`}>
                  <div className={styles.nearestInfo}>
                    <div className={styles.nearestHeaderRow}>
                      <span className={styles.nearestRank}>{idx + 1}</span>
                      <span className={styles.nearestName}>{loc.nama_lokasi}</span>
                      {idx === 0 && <span className={styles.nearestBadge}>TERDEKAT</span>}
                    </div>
                    <p className={styles.nearestAddress}>📍 {loc.alamat}</p>
                    <p className={styles.nearestTipe}>{getTipeIcon(loc.tipe)} {loc.tipe}</p>
                    <p className={styles.nearestDistance}>📏 Jarak: {loc.distance.toFixed(2)} km</p>
                      <p className={styles.nearestStatus}>
                        Status:
                        <span className={`${styles.statusBadgeSmall} ${
                        loc.status === 'aktif' ? styles.statusActiveSmall :
                        loc.status === 'perbaikan' ? styles.statusRepairSmall : styles.statusInactiveSmall
                      }`}>
                        {loc.status}
                        </span>
                      </p>
                  </div>
                  <button
                    onClick={() => openGoogleMaps(loc.latitude, loc.longitude)}
                    className={styles.navigateBtn}
                  >
                    🧭 Navigasi
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* PETA */}
        <div className={styles.mapCard}>
          <div className={styles.mapContainer}>
            <UserMapComponent
              markers={markers}
              center={[-6.2088, 106.8456]}
              zoom={12}
              onDetailClick={handleMarkerClick}
              height="450px"
            />
          </div>
          <p className={styles.mapHint}>💡 Klik marker pada peta untuk melihat detail lokasi</p>
        </div>
        
        {/* TABEL LOKASI */}
        <div className={styles.tableWrapper} ref={tableRef}>
          <div className={styles.tableHeader}>
            <span className="font-semibold">📋 Semua Lokasi Sumber Air Bersih</span>
          </div>
          <div className={styles.tableResponsive}>
            <table className={styles.locationTable}>
              <thead>
                <tr>
                  <th>Nama</th>
                  <th>Alamat</th>
                  <th>Tipe</th>
                  <th>Status</th>
                  <th className={styles.tableActionHeader}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {!loading && data.length === 0 && (
                  <tr>
                    <td colSpan={5} className={styles.noDataRow}>
                      <div className={styles.noDataMessage}>
                        <span>🔍</span> Lokasi tidak ditemukan. Coba kata kunci lain.
                      </div>
                    </td>
                  </tr>
                )}
                {data.map(item => (
                  <tr key={item.id}>
                    <td className={styles.tableNama}>{item.nama_lokasi}</td>
                    <td className={styles.tableAlamat}>{item.alamat}</td>
                    <td className={styles.tableTipe}>{getTipeIcon(item.tipe)} {item.tipe}</td>
                    <td className={styles.tableStatus}>
                      <span className={`${styles.statusBadgeTable} ${
                        item.status === 'aktif' ? styles.statusActiveTable :
                        item.status === 'perbaikan' ? styles.statusRepairTable : styles.statusInactiveTable
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className={styles.tableAction}>
                      <button
                        onClick={() => openGoogleMaps(item.latitude, item.longitude)}
                        className={styles.navigateSmBtn}
                      >
                        🧭 Navigasi
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* MODAL DETAIL */}
      {showDetail && selectedLocation && (
        <div className={styles.modalOverlay} onClick={() => setShowDetail(false)}>
          <div className={styles.modalContainer} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>📍 Detail Lokasi</h2>
              <button onClick={() => setShowDetail(false)} className={styles.modalClose}>&times;</button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.modalField}>
                <label>Nama</label>
                <p className={styles.modalFieldValue}>{selectedLocation.nama_lokasi}</p>
              </div>
              <div className={styles.modalField}>
                <label>Alamat</label>
                <p>{selectedLocation.alamat}</p>
              </div>
              <div className={styles.modalField}>
                <label>Deskripsi</label>
                <p>{selectedLocation.deskripsi || '-'}</p>
              </div>
              <div className={styles.modalField}>
                <label>Tipe</label>
                <p>{getTipeIcon(selectedLocation.tipe)} {selectedLocation.tipe}</p>
              </div>
              <div className={styles.modalField}>
                <label>Status</label>
                <p>
                  <span className={`${styles.statusBadgeModal} ${
                    selectedLocation.status === 'aktif' ? styles.statusActiveModal :
                    selectedLocation.status === 'perbaikan' ? styles.statusRepairModal : styles.statusInactiveModal
                  }`}>
                    {selectedLocation.status}
                  </span>
                </p>
              </div>
              <div className={styles.modalField}>
                <label>Jam Operasional</label>
                <p>{selectedLocation.jam_operasional || '-'}</p>
              </div>
              <button
                onClick={() => openGoogleMaps(selectedLocation.latitude, selectedLocation.longitude)}
                className={styles.modalNavigate}
              >
                🧭 Buka Navigasi Google Maps
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
