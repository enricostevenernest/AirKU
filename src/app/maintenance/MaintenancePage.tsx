"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import MaintenanceDashboard from "./frontend/components/MaintenanceDashboard";
import { MaintenanceSchedule } from "./frontend/types";
import { createClient } from "../lib/supabase";
import { computeStatus } from "../lib/notification";
import "./frontend/maintenance.css";

/* ── Lazy load: komponen ini hanya dimuat saat pertama kali dibutuhkan ── */

// SCRUM-116: AddScheduleForm di-lazy-load agar tidak memperbesar bundle awal
const AddScheduleForm = dynamic(
  () => import("./frontend/components/AddScheduleForm"),
  { loading: () => <div style={{ padding: 24, color: "#888" }}>Memuat form...</div> }
);
// SCRUM-117: SuccessModal & EditScheduleModal di-lazy-load — loading fallback null
// mencegah layout shift (CLS) saat modal pertama kali dibuka
const SuccessModal = dynamic(
  () => import("./frontend/components/SuccessModal"),
  { loading: () => null }
);
const EditScheduleModal = dynamic(
  () => import("./frontend/components/EditScheduleModal"),
  { loading: () => null }
);

/* ---- Tipe Toast ---- */
type ToastType = "success" | "delete" | "info";

interface Toast {
  id: number;
  type: ToastType;
  message: string;
}



type View = "dashboard" | "add";

export default function MaintenancePage() {
  const [view, setView] = useState<View>("dashboard");
  const [schedules, setSchedules] = useState<MaintenanceSchedule[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<MaintenanceSchedule | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  /* Tampilkan toast sementara (2.8 detik) */
  const addToast = useCallback((message: string, type: ToastType = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2800);
  }, []);

  /* Load dari Supabase */
  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase.from("maintenance_schedules").select("*");
        if (!error && data) {
          const updated = data.map((s: any) => ({ ...s, status: computeStatus(s) }));
          setSchedules(updated);
        }
      } catch { /* ignore */ }
      setIsLoaded(true);
    };
    fetchSchedules();
  }, []);

  /* Handler: tambah jadwal */
  const handleAddSchedule = async (data: {
    jenis_perawatan: MaintenanceSchedule["jenis_perawatan"];
    tanggal_mulai: string;
    frekuensi: MaintenanceSchedule["frekuensi"];
    tipe_instalasi: MaintenanceSchedule["tipe_instalasi"];
    notes: string;
  }) => {
    const newSchedule: MaintenanceSchedule = {
      id: Date.now().toString(),
      ...data,
      status: "terjadwal",
      created_at: new Date().toISOString(),
    };
    
    setSchedules((prev) => {
      const updated = [...prev, newSchedule].map(s => ({ ...s, status: computeStatus(s) }));
      return updated;
    });
    
    const supabase = createClient();
    await supabase.from("maintenance_schedules").insert([newSchedule]);
    
    setShowSuccess(true);
  };

  /* Handler: update jadwal dari modal edit */
  const handleUpdateSchedule = async (updated: MaintenanceSchedule) => {
    const s = { ...updated, updated_at: new Date().toISOString() };
    s.status = computeStatus(s);
    setSchedules((prev) => prev.map((item) => (item.id === s.id ? s : item)));
    setSelectedSchedule(null);
    addToast("✅  Jadwal berhasil diperbarui!", "success");

    const supabase = createClient();
    await supabase.from("maintenance_schedules").update(s).eq("id", s.id);
  };

  /* Handler: tandai selesai */
  const handleMarkDone = async (id: string) => {
    const updated_at = new Date().toISOString();
    setSchedules((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: "selesai" as const, updated_at } : s))
    );
    addToast("✅  Jadwal berhasil ditandai selesai!", "success");

    const supabase = createClient();
    await supabase.from("maintenance_schedules").update({ status: "selesai", updated_at }).eq("id", id);
  };

  /* Handler: hapus (masukkan ke riwayat) */
  const handleDelete = async (id: string) => {
    const updated_at = new Date().toISOString();
    setSchedules((prev) =>
      prev.map((s) => (s.id === id ? { ...s, is_deleted: true, updated_at } : s))
    );
    addToast("🗑  Jadwal dihapus & dipindah ke riwayat.", "delete");

    const supabase = createClient();
    await supabase.from("maintenance_schedules").update({ is_deleted: true, updated_at }).eq("id", id);
  };

  if (!isLoaded) {
    return (
      <div style={{ padding: 24, color: "#555" }}>Memuat data...</div>
    );
  }

  return (
    <>
        {view === "dashboard" ? (
          <MaintenanceDashboard
            schedules={schedules}
            onAddNew={() => setView("add")}
            onMarkDone={handleMarkDone}
            onDelete={handleDelete}
            onEditSchedule={setSelectedSchedule}
          />
        ) : (
          <>
            <AddScheduleForm
              schedules={schedules}
              onSubmit={handleAddSchedule}
              onMarkDone={handleMarkDone}
              onEditSchedule={setSelectedSchedule}
            />
            <div style={{ marginTop: 10 }}>
              <button className="btn-outline" onClick={() => setView("dashboard")}>
                ← Kembali ke Dashboard
              </button>
            </div>
          </>
        )}

      {/* ═══════════ SUCCESS MODAL ═══════════ */}
      {showSuccess && (
        <SuccessModal
          onClose={() => {
            setShowSuccess(false);
            setView("dashboard");
          }}
        />
      )}

      {/* ═══════════ EDIT MODAL ═══════════ */}
      {selectedSchedule && (
        <EditScheduleModal
          schedule={selectedSchedule}
          onClose={() => setSelectedSchedule(null)}
          onSave={handleUpdateSchedule}
          onMarkDone={(id) => { handleMarkDone(id); setSelectedSchedule(null); }}
          onDelete={(id) => { handleDelete(id); setSelectedSchedule(null); }}
        />
      )}

      {/* ═══════════ TOAST NOTIFICATIONS ═══════════ */}
      <div className="toast-wrapper">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast-${t.type}`}>
            <span className="toast-icon">
              {t.type === "success" && "✅"}
              {t.type === "delete"  && "🗑️"}
              {t.type === "info"    && "ℹ️"}
            </span>
            {t.message.replace(/^(✅|🗑)\s*/, "")}
          </div>
        ))}
      </div>
    </>
  );
}