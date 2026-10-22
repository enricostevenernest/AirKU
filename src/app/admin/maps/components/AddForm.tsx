"use client";

import { useState, useEffect } from "react";
import { LokasiAirFormData, StatusLokasi, TipeLokasi } from "@/types/lokasi_air";

interface AddLocationFormProps {
  onSubmit: (data: LokasiAirFormData) => Promise<void>;
  onCancel: () => void;
  initialLatLng?: { lat: number; lng: number } | null;
}

export default function AddLocationForm({
  onSubmit,
  onCancel,
  initialLatLng,
}: AddLocationFormProps) {
  const [formData, setFormData] = useState<LokasiAirFormData>({
    nama_lokasi: "",
    deskripsi: "",
    alamat: "",
    latitude: -6.2088,
    longitude: 106.8456,
    status: "aktif",
    kapasitas: "",
    tipe: "sumur",
    jam_operasional: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialLatLng) {
      setFormData((prev) => ({
        ...prev,
        latitude: initialLatLng.lat,
        longitude: initialLatLng.lng,
      }));
    }
  }, [initialLatLng]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // ===== VALIDASI GABUNGAN (disamakan dengan EditLocationModal) =====
    const errors: string[] = [];

    // ✅ Validasi nama lokasi (tidak kosong & minimal 5 karakter)
    const namaTrimmed = formData.nama_lokasi.trim();
    if (!namaTrimmed) {
      errors.push("Nama lokasi tidak boleh kosong");
    } else if (namaTrimmed.length < 5) {
      errors.push("Nama lokasi harus minimal 5 karakter");
    }

    // Validasi latitude
    if (formData.latitude < -90 || formData.latitude > 90) {
      errors.push("Latitude harus antara -90 dan 90");
    }

    // Validasi longitude
    if (formData.longitude < -180 || formData.longitude > 180) {
      errors.push("Longitude harus antara -180 dan 180");
    }

    // Jika ada error, gabungkan dan tampilkan
    if (errors.length > 0) {
      setError(errors.join(" | "));
      setLoading(false);
      return;
    }

    try {
      await onSubmit(formData);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-location-container">
      <div className="add-location-card">
        <div className="card-header">
          <button className="back-button" onClick={onCancel}>
            ← Kembali
          </button>
          <h1>➕ Tambah Lokasi Air Bersih</h1>
          <p>Isi formulir berikut untuk menambahkan titik koordinat baru</p>
        </div>

        <form onSubmit={handleSubmit} className="add-form">
          {error && <div className="form-error">❌ {error}</div>}

          {/* Grid form seperti maintenance: 3 kolom */}
          <div className="form-main-grid">
            <div className="form-group">
              <label>Nama Lokasi <span className="required">*</span></label>
              <input
                type="text"
                value={formData.nama_lokasi}
                onChange={(e) => setFormData({ ...formData, nama_lokasi: e.target.value })}
                onFocus={() => setError("")}
                placeholder="Contoh: Sumur Bor RW 05, Mata Air Cikapundung"
                autoFocus
              />
              <small className="form-hint">
                Minimal 5 karakter, deskriptif
                {formData.nama_lokasi && formData.nama_lokasi.trim().length > 0 && formData.nama_lokasi.trim().length < 5 && (
                  <span className="error-hint"> (kurang {5 - formData.nama_lokasi.trim().length} karakter lagi)</span>
                )}
              </small>
            </div>

            <div className="form-group">
              <label>Alamat</label>
              <input
                type="text"
                value={formData.alamat}
                onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                placeholder="Jl. Contoh No. 123, RT/RW"
              />
            </div>

            <div className="form-group">
              <label>Tipe</label>
              <select
                value={formData.tipe}
                onChange={(e) => setFormData({ ...formData, tipe: e.target.value as TipeLokasi })}
              >
                <option value="sumur">💧 Sumur</option>
                <option value="pdam">🚰 PDAM</option>
                <option value="penampungan">🗄️ Penampungan</option>
                <option value="mata air">🏔️ Mata Air</option>
              </select>
            </div>

            <div className="form-group">
              <label>Latitude <span className="required">*</span></label>
              <input
                type="number"
                step="any"
                required
                value={formData.latitude}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  if (!isNaN(val)) {
                    setFormData({ ...formData, latitude: val });
                  }
                  setError("");
                }}
                onFocus={() => setError("")}
              />
              {initialLatLng && <small className="form-hint">✓ Dari klik peta</small>}
            </div>

            <div className="form-group">
              <label>Longitude <span className="required">*</span></label>
              <input
                type="number"
                step="any"
                required
                value={formData.longitude}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  if (!isNaN(val)) {
                    setFormData({ ...formData, longitude: val });
                  }
                  setError("");
                }}
                onFocus={() => setError("")}
              />
              {initialLatLng && <small className="form-hint">✓ Dari klik peta</small>}
            </div>

            <div className="form-group">
              <label>Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as StatusLokasi })}
              >
                <option value="aktif">🟢 Aktif</option>
                <option value="perbaikan">🟡 Perbaikan</option>
                <option value="tidak aktif">🔴 Tidak Aktif</option>
              </select>
            </div>

            <div className="form-group">
              <label>Kapasitas</label>
              <input
                type="text"
                value={formData.kapasitas}
                onChange={(e) => setFormData({ ...formData, kapasitas: e.target.value })}
                placeholder="Contoh: 5000 liter/hari"
              />
            </div>

            <div className="form-group">
              <label>Jam Operasional</label>
              <input
                type="text"
                value={formData.jam_operasional}
                onChange={(e) => setFormData({ ...formData, jam_operasional: e.target.value })}
                placeholder="Contoh: 08:00 - 17:00"
              />
            </div>
          </div>

          {/* Deskripsi full width */}
          <div className="form-group full-width">
            <label>Deskripsi</label>
            <textarea
              value={formData.deskripsi}
              onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
              rows={4}
              placeholder="Informasi tambahan tentang lokasi (kondisi, akses, dll)..."
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onCancel}>
              Batal
            </button>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? "Menyimpan..." : "Simpan Lokasi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}