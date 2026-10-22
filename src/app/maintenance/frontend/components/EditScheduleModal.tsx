"use client";

import { useState } from "react";
import {
  MaintenanceSchedule,
  JenisPerawatan,
  Frekuensi,
  TipeInstalasi,
  JENIS_LABEL,
  FREKUENSI_LABEL,
  INSTALASI_LABEL,
} from "../types";

interface Props {
  schedule: MaintenanceSchedule;
  onClose: () => void;
  onSave: (updated: MaintenanceSchedule) => void;
  onMarkDone: (id: string) => void;
  onDelete: (id: string) => void;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getDaysLabel(dateStr: string): string {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr); target.setHours(0, 0, 0, 0);
  const diff = Math.ceil((target.getTime() - today.getTime()) / 86400000);
  if (diff < 0) return `${Math.abs(diff)} hari yang lalu`;
  if (diff === 0) return "Hari ini";
  if (diff === 1) return "Besok";
  return `${diff} hari lagi`;
}

const STATUS_CONFIG: Record<
  MaintenanceSchedule["status"],
  { label: string; color: string; bg: string; icon: string }
> = {
  terjadwal: { label: "Terjadwal",  color: "#1a5f7a", bg: "#d0eaf8", icon: "📅" },
  segera:    { label: "Segera",     color: "#856404", bg: "#fff3cd", icon: "🔔" },
  terlambat: { label: "Terlambat",  color: "#b71c1c", bg: "#fde8e8", icon: "⚠️" },
  selesai:   { label: "Selesai",    color: "#1a5c2a", bg: "#d4edda", icon: "✅" },
};

export default function EditScheduleModal({
  schedule,
  onClose,
  onSave,
  onMarkDone,
  onDelete,
}: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Form state
  const [jenis, setJenis] = useState<JenisPerawatan>(schedule.jenis_perawatan);
  const [instalasi, setInstalasi] = useState<TipeInstalasi>(schedule.tipe_instalasi);
  const [tanggal, setTanggal] = useState(schedule.tanggal_mulai);
  const [frekuensi, setFrekuensi] = useState<Frekuensi>(schedule.frekuensi);
  const [notes, setNotes] = useState(schedule.notes);

  const cfg = STATUS_CONFIG[schedule.status];
  const isRiwayat = schedule.status === "selesai" || schedule.is_deleted;

  const handleSave = () => {
    onSave({
      ...schedule,
      jenis_perawatan: jenis,
      tipe_instalasi: instalasi,
      tanggal_mulai: tanggal,
      frekuensi,
      notes,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Reset ke data asli
    setJenis(schedule.jenis_perawatan);
    setInstalasi(schedule.tipe_instalasi);
    setTanggal(schedule.tanggal_mulai);
    setFrekuensi(schedule.frekuensi);
    setNotes(schedule.notes);
    setIsEditing(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="edit-modal-box" onClick={(e) => e.stopPropagation()}>

        {/* ── Header Modal ── */}
        <div className="edit-modal-header">
          <div>
            <h3 className="edit-modal-title">{JENIS_LABEL[schedule.jenis_perawatan]}</h3>
            <p className="edit-modal-sub">
              Dibuat: {new Date(schedule.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Tutup">✕</button>
        </div>

        {/* ── Status Banner ── */}
        <div className="edit-status-banner" style={{ background: cfg.bg, color: cfg.color }}>
          <span className="edit-status-icon">{cfg.icon}</span>
          <div className="edit-status-text">
            <strong>Status: {schedule.is_deleted ? `${cfg.label} (Dihapus)` : cfg.label}</strong>
            <span>{getDaysLabel(schedule.tanggal_mulai)} · {formatDate(schedule.tanggal_mulai)}</span>
          </div>
          {!isRiwayat && (
            <button
              className="edit-btn-done-inline"
              style={{ borderColor: cfg.color, color: cfg.color }}
              onClick={() => { onMarkDone(schedule.id); onClose(); }}
            >
              ✓ Tandai Selesai
            </button>
          )}
        </div>

        {/* ── Detail / Form Edit ── */}
        {!isEditing ? (
          /* MODE TAMPIL */
          <div className="edit-detail-grid">
            <div className="edit-detail-item">
              <span className="edit-detail-label">Jenis Perawatan</span>
              <span className="edit-detail-value">{JENIS_LABEL[schedule.jenis_perawatan]}</span>
            </div>
            <div className="edit-detail-item">
              <span className="edit-detail-label">Tanggal Mulai</span>
              <span className="edit-detail-value">{formatDate(schedule.tanggal_mulai)}</span>
            </div>
            <div className="edit-detail-item">
              <span className="edit-detail-label">Frekuensi</span>
              <span className="edit-detail-value">{FREKUENSI_LABEL[schedule.frekuensi]}</span>
            </div>
            <div className="edit-detail-item">
              <span className="edit-detail-label">Tipe Instalasi</span>
              <span className="edit-detail-value">{INSTALASI_LABEL[schedule.tipe_instalasi]}</span>
            </div>
            {schedule.notes && (
              <div className="edit-detail-item edit-detail-full">
                <span className="edit-detail-label">Catatan</span>
                <span className="edit-detail-value">{schedule.notes}</span>
              </div>
            )}
          </div>
        ) : (
          /* MODE EDIT */
          <div className="edit-form-grid">
            <div className="form-group">
              <label>Jenis Perawatan</label>
              <select value={jenis} onChange={(e) => setJenis(e.target.value as JenisPerawatan)}>
                {Object.entries(JENIS_LABEL).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Tanggal Mulai</label>
              <input type="date" value={tanggal} onChange={(e) => setTanggal(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Frekuensi Pengulangan</label>
              <select value={frekuensi} onChange={(e) => setFrekuensi(e.target.value as Frekuensi)}>
                {Object.entries(FREKUENSI_LABEL).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Tipe Instalasi Air</label>
              <select value={instalasi} onChange={(e) => setInstalasi(e.target.value as TipeInstalasi)}>
                {Object.entries(INSTALASI_LABEL).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
            <div className="form-group edit-form-full">
              <label>Catatan Tambahan</label>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} placeholder="Catatan tambahan..." />
            </div>
          </div>
        )}

        {/* ── Footer Aksi (Disembunyikan jika Riwayat) ── */}
        {!isRiwayat && (
          <div className="edit-modal-footer">
            {/* Kiri: Hapus */}
            <div>
              {!confirmDelete ? (
                <button className="edit-btn-delete" onClick={() => setConfirmDelete(true)}>
                  🗑 Hapus Jadwal
                </button>
              ) : (
                <div className="edit-confirm-delete">
                  <span>Yakin hapus?</span>
                  <button className="edit-btn-confirm-yes" onClick={() => { onDelete(schedule.id); onClose(); }}>Ya, Hapus</button>
                  <button className="edit-btn-confirm-no" onClick={() => setConfirmDelete(false)}>Batal</button>
                </div>
              )}
            </div>

            {/* Kanan: Edit / Simpan */}
            <div style={{ display: "flex", gap: 8 }}>
              {!isEditing ? (
                <button className="btn-primary" onClick={() => setIsEditing(true)}>
                  ✏️ Edit Jadwal
                </button>
              ) : (
                <>
                  <button className="btn-outline" onClick={handleCancel}>Batal</button>
                  <button className="btn-primary" onClick={handleSave}>💾 Simpan</button>
                </>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}