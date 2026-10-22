"use client";

import { useState } from "react";
import {
  JenisPerawatan,
  Frekuensi,
  TipeInstalasi,
  MaintenanceSchedule,
  JENIS_LABEL,
  FREKUENSI_LABEL,
  INSTALASI_LABEL,
} from "../types";

interface Props {
  schedules: MaintenanceSchedule[];
  onSubmit: (data: {
    jenis_perawatan: JenisPerawatan;
    tanggal_mulai: string;
    frekuensi: Frekuensi;
    tipe_instalasi: TipeInstalasi;
    notes: string;
  }) => void;
  onMarkDone: (id: string) => void;
  onEditSchedule: (s: MaintenanceSchedule) => void;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function AddScheduleForm({ schedules, onSubmit, onMarkDone, onEditSchedule }: Props) {
  const [jenis, setJenis] = useState<JenisPerawatan>("pengurasan_tandon");
  const [instalasi, setInstalasi] = useState<TipeInstalasi>("tandon_reservoir");
  const [tanggal, setTanggal] = useState("");
  const [frekuensi, setFrekuensi] = useState<Frekuensi>("1_bulan");
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tanggal) {
      alert("Pilih tanggal mulai!");
      return;
    }
    onSubmit({ jenis_perawatan: jenis, tipe_instalasi: instalasi, tanggal_mulai: tanggal, frekuensi, notes });
    setTanggal("");
    setNotes("");
    setJenis("pengurasan_tandon");
    setInstalasi("tandon_reservoir");
    setFrekuensi("1_bulan");
  };

  // Tampilkan riwayat diurutkan berdasarkan kapan data terakhir kali dimodifikasi (diselesaikan/dihapus)
  const riwayatSchedules = [...schedules]
    .filter((s) => s.status === "selesai" || s.is_deleted)
    .sort((a, b) => {
      const timeA = new Date(a.updated_at || a.created_at).getTime();
      const timeB = new Date(b.updated_at || b.created_at).getTime();
      return timeB - timeA;
    });

  return (
    <div>
      <h2 className="form-page-title">Tambah Jadwal Perawatan</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-main-grid">
          {/* Kolom Kiri: Jenis & Frekuensi */}
          <div className="form-col">
            <div className="form-group">
              <label>Jenis perawatan</label>
              <select value={jenis} onChange={(e) => setJenis(e.target.value as JenisPerawatan)} required>
                {Object.entries(JENIS_LABEL).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
            <div className="form-group" style={{ marginTop: 16 }}>
              <label>Frekuensi pengulangan</label>
              <select value={frekuensi} onChange={(e) => setFrekuensi(e.target.value as Frekuensi)} required>
                {Object.entries(FREKUENSI_LABEL).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Kolom Tengah: Tanggal & Instalasi */}
          <div className="form-col">
            <div className="form-group">
              <label>Tanggal mulai</label>
              <input
                type="date"
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
                required
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
            <div className="form-group" style={{ marginTop: 16 }}>
              <label>Tipe instalasi air</label>
              <select value={instalasi} onChange={(e) => setInstalasi(e.target.value as TipeInstalasi)} required>
                {Object.entries(INSTALASI_LABEL).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Kolom Kanan: Notes memanjang kebawah */}
          <div className="form-group notes-group">
            <label>Notes:</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Catatan tambahan..."
            />
          </div>
        </div>

        {/* Tombol Simpan */}
        <div className="form-submit-row">
          <button type="submit" className="btn-primary">
            Simpan Jadwal
          </button>
        </div>
      </form>

      {/* Riwayat Perawatan */}
      {riwayatSchedules.length > 0 && (
        <div>
          <p className="riwayat-title">Riwayat Perawatan</p>
          <div className="riwayat-list scrollable-list">
            {riwayatSchedules.map((s) => (
              <div 
                key={s.id} 
                className="riwayat-item clickable"
                onClick={() => onEditSchedule(s)}
              >
                <span>{formatDate(s.tanggal_mulai)} – {JENIS_LABEL[s.jenis_perawatan]}</span>
                {s.status === "selesai" && !s.is_deleted ? (
                  <span className="btn-selesai" style={{ cursor: "default" }}>
                    ✓ Selesai
                  </span>
                ) : (
                  <span className={`badge badge-${s.status}`} style={{ opacity: 0.85, cursor: "default", fontSize: "0.7rem", padding: "4px 10px", borderRadius: "12px" }}>
                    {s.status === "segera" ? "Segera" : s.status === "terlambat" ? "Terlambat" : s.status === "selesai" ? "Selesai" : "Terjadwal"} (Terhapus)
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}