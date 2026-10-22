"use client";

import { useState, useEffect, useRef } from "react";
import { LokasiAirBersih, LokasiAirFormData, StatusLokasi, TipeLokasi } from "@/types/lokasi_air";

interface EditLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: LokasiAirFormData) => Promise<void>;
  initialData: LokasiAirBersih | null;
}

export default function EditLocationModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: EditLocationModalProps) {
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
  const [warning, setWarning] = useState(""); // ✅ TAMBAHAN: state untuk warning
  const initialDataRef = useRef<LokasiAirFormData | null>(null);
  const modalBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialData) {
      const newFormData = {
        nama_lokasi: initialData.nama_lokasi,
        deskripsi: initialData.deskripsi || "",
        alamat: initialData.alamat,
        latitude: initialData.latitude,
        longitude: initialData.longitude,
        status: initialData.status,
        kapasitas: initialData.kapasitas || "",
        tipe: initialData.tipe || "sumur",
        jam_operasional: initialData.jam_operasional || "",
      };
      setFormData(newFormData);
      initialDataRef.current = newFormData;
      setWarning(""); // reset warning saat modal dibuka dengan data baru
      setError("");   // reset error juga

      // ADDED: reset scroll ke atas saat modal dibuka dengan data baru
      if (modalBoxRef.current) {
        modalBoxRef.current.scrollTop = 0;
      }
    }
  }, [initialData]);

  // Fungsi helper untuk update form sekaligus menghapus warning/error
  const handleFieldChange = (field: keyof LokasiAirFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (warning) setWarning("");
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setWarning("");

    // ========== VALIDASI GABUNGAN ==========
    const errors: string[] = [];

    // Validasi nama lokasi (tidak kosong & minimal 5 karakter)
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

    if (errors.length > 0) {
      setError(errors.join(" | "));
      setLoading(false);
      if (modalBoxRef.current) {
        modalBoxRef.current.scrollTop = 0;
      }
      return;
    }

    const hasChanged = initialDataRef.current && JSON.stringify(formData) !== JSON.stringify(initialDataRef.current);

    // Jika tidak ada perubahan, tampilkan warning dan batalkan submit
    if (!hasChanged) {
      setWarning("Tidak ada perubahan data. Silakan edit terlebih dahulu sebelum update.");
      // ADDED: scroll ke atas modal agar warning terlihat
      if (modalBoxRef.current) {
        modalBoxRef.current.scrollTo({ top: 0, behavior: "smooth" });
      }
      setLoading(false);
      return; // ← JANGAN tutup modal, jangan panggil onSubmit
    }

    try {
      await onSubmit(formData);
      onClose(); // Tutup modal hanya jika sukses update
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="edit-modal-box" onClick={(e) => e.stopPropagation()} ref={modalBoxRef}>
        <div className="modal-header">
          <h3>✏️ Edit Lokasi</h3>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {error && <div className="form-error">❌ {error}</div>}
          {warning && <div className="form-warning">⚠️ {warning}</div>} {/*TAMPILKAN WARNING */}

          <div className="form-group">
            <label>Nama Lokasi <span className="required">*</span></label>
            <input
              type="text"
              value={formData.nama_lokasi}
              onChange={(e) => handleFieldChange("nama_lokasi", e.target.value)} 
              onFocus={() => { setError(""); setWarning(""); }}
              placeholder="Contoh: Sumur Bor RW 05"
            />
          </div>

          <div className="form-group">
            <label>Alamat</label>
            <input
              type="text"
              value={formData.alamat}
              onChange={(e) => handleFieldChange("alamat", e.target.value)}
              onFocus={() => { setError(""); setWarning(""); }}
              placeholder="Jl. Contoh No. 123, RT/RW"
            />
          </div>

          <div className="form-group">
            <label>Deskripsi</label>
            <textarea
              value={formData.deskripsi}
              onChange={(e) => handleFieldChange("deskripsi", e.target.value)}
              rows={3}
              placeholder="Informasi tambahan tentang lokasi..."
            />
          </div>

          <div className="form-row-2">
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
                    handleFieldChange("latitude", val);
                  }
                }}
                onFocus={() => { setError(""); setWarning(""); }}
              />
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
                    handleFieldChange("longitude", val);
                  }
                }}
                onFocus={() => { setError(""); setWarning(""); }}
              />
            </div>
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label>Tipe</label>
              <select
                value={formData.tipe}
                onChange={(e) => handleFieldChange("tipe", e.target.value as TipeLokasi)}
              >
                <option value="sumur">💧 Sumur</option>
                <option value="pdam">🚰 PDAM</option>
                <option value="penampungan">🗄️ Penampungan</option>
                <option value="mata air">🏔️ Mata Air</option>
              </select>
            </div>
            <div className="form-group">
              <label>Status</label>
              <select
                value={formData.status}
                onChange={(e) => handleFieldChange("status", e.target.value as StatusLokasi)}
              >
                <option value="aktif">🟢 Aktif</option>
                <option value="perbaikan">🟡 Perbaikan</option>
                <option value="tidak aktif">🔴 Tidak Aktif</option>
              </select>
            </div>
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label>Kapasitas</label>
              <input
                type="text"
                value={formData.kapasitas}
                onChange={(e) => handleFieldChange("kapasitas", e.target.value)}
                placeholder="Contoh: 5000 liter/hari"
              />
            </div>
            <div className="form-group">
              <label>Jam Operasional</label>
              <input
                type="text"
                value={formData.jam_operasional}
                onChange={(e) => handleFieldChange("jam_operasional", e.target.value)}
                placeholder="Contoh: 08:00 - 17:00"
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Batal
            </button>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? "Menyimpan..." : "Update Lokasi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}