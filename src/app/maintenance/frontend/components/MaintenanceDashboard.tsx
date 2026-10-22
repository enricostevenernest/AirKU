"use client";

import { MaintenanceSchedule, JENIS_LABEL, FREKUENSI_LABEL } from "../types";
import Link from "next/link";

interface Props {
  schedules: MaintenanceSchedule[];
  onAddNew: () => void;
  onMarkDone: (id: string) => void;
  onDelete: (id: string) => void;
  onEditSchedule: (s: MaintenanceSchedule) => void;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getDaysLabel(dateStr: string): string {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr); target.setHours(0, 0, 0, 0);
  const diff = Math.ceil((target.getTime() - today.getTime()) / 86400000);
  if (diff < 0) return `terlambat ${Math.abs(diff)} hari`;
  if (diff === 0) return "jatuh tempo hari ini";
  if (diff === 1) return "jatuh tempo besok";
  return `jatuh tempo ${diff} hari lagi`;
}

function StatusBadge({ status }: { status: MaintenanceSchedule["status"] }) {
  const map: Record<string, { label: string; cls: string }> = {
    segera:    { label: "Segera",    cls: "badge-segera" },
    terjadwal: { label: "Terjadwal", cls: "badge-terjadwal" },
    terlambat: { label: "Terlambat", cls: "badge-terlambat" },
    selesai:   { label: "Selesai",   cls: "badge-selesai" },
  };
  const { label, cls } = map[status];
  return <span className={`badge ${cls}`}>{label}</span>;
}

export default function MaintenanceDashboard({
  schedules,
  onAddNew,
  onMarkDone,
  onDelete,
  onEditSchedule,
}: Props) {
  const activeSchedules = schedules.filter((s) => s.status !== "selesai" && !s.is_deleted);
  const prioritySchedule = activeSchedules.find(
    (s) => s.status === "segera" || s.status === "terlambat"
  );

  return (
    <div>
      {/* Header */}
      <div className="dash-header-row">
        <h1 className="dash-title">
          Pengingat<br />Perawatan
        </h1>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <button className="btn-add-schedule" onClick={onAddNew}>
            + Tambah Jadwal Perawatan
          </button>
          <Link
            href="/maintenance/riwayat"
            className="btn-add-schedule"
            style={{
              background: "#2e86ab",
              color: "#fff",
              borderColor: "#2e86ab",
              textDecoration: "none",
            }}
          >
            Riwayat Perawatan
          </Link>
        </div>
      </div>

      {/* Priority Alert */}
      {prioritySchedule && (
        <div className={`priority-alert ${prioritySchedule.status === "terlambat" ? "alert-late" : "alert-soon"}`}>
          <div className="alert-dot" />
          <div className="alert-text">
            <strong>
              {JENIS_LABEL[prioritySchedule.jenis_perawatan]} – {getDaysLabel(prioritySchedule.tanggal_mulai)}
            </strong>
            <span>Terakhir dilakukan: {formatDate(prioritySchedule.tanggal_mulai)}</span>
          </div>
          <button className="btn-alert-done" onClick={() => onMarkDone(prioritySchedule.id)}>
            Tandai Selesai →
          </button>
        </div>
      )}

      {/* Jadwal Aktif */}
      <p className="section-title">Jadwal Aktif</p>

      {activeSchedules.length === 0 ? (
        <div className="empty-state">
          <span style={{ fontSize: "2.2rem" }}>📅</span>
          <p>Belum ada jadwal perawatan aktif.</p>
          <button className="btn-primary" onClick={onAddNew}>
            Tambah Jadwal Pertama
          </button>
        </div>
      ) : (
        <div className="schedule-list">
          {activeSchedules.map((s) => (
            <div 
              key={s.id} 
              className="schedule-card" 
              onClick={() => onEditSchedule(s)}
              style={{ cursor: "pointer" }}
            >
              <div className="card-info">
                <p className="card-title">
                  {JENIS_LABEL[s.jenis_perawatan]} – {getDaysLabel(s.tanggal_mulai)}
                </p>
                <p className="card-sub">
                  Jatuh tempo: {formatDate(s.tanggal_mulai)} · {FREKUENSI_LABEL[s.frekuensi]}
                </p>
              </div>
              <div className="card-right">
                <StatusBadge status={s.status} />
                <button
                  className="btn-done"
                  onClick={(e) => { e.stopPropagation(); onMarkDone(s.id); }}
                  title="Tandai Selesai"
                >
                  ✓
                </button>
                <button
                  className="btn-delete"
                  onClick={(e) => { e.stopPropagation(); onDelete(s.id); }}
                  title="Hapus Jadwal"
                >
                  🗑
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}