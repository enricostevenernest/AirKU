import { useState, useEffect } from "react";
import { createClient } from "./supabase";
import { MaintenanceSchedule } from "../maintenance/frontend/types";

/**
 * Menghitung status otomatis berdasarkan selisih jam antara
 * tanggal perawatan dan waktu saat ini:
 *   - < 0 jam   → "terlambat"
 *   - 0–3 jam   → "segera" (perlu segera dilakukan dalam 3 jam)
 *   - > 3 jam   → "terjadwal" (masih dalam rencana)
 */
export function computeStatus(s: MaintenanceSchedule): MaintenanceSchedule["status"] {
  if (s.status === "selesai") return "selesai";
  if (s.is_deleted) return s.status;

  const now = new Date();
  const target = new Date(s.tanggal_mulai);

  // Selisih dalam satuan jam (1 jam = 3.600.000 ms)
  const diffHours = Math.ceil((target.getTime() - now.getTime()) / 3600000);

  if (diffHours < 0) return "terlambat";
  if (diffHours <= 3) return "segera";
  return "terjadwal";
}

/**
 * Hook untuk mengambil jadwal perawatan yang berstatus "segera" atau "terlambat"
 */
export function useNotifications() {
  const [notifications, setNotifications] = useState<MaintenanceSchedule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase.from("maintenance_schedules").select("*");
        if (!error && data) {
          const activeSchedules = data
            .map((s: any) => ({ ...s, status: computeStatus(s) }))
            .filter((s: MaintenanceSchedule) =>
              !s.is_deleted &&
              s.status !== "selesai" &&
              (s.status === "segera" || s.status === "terlambat")
            )
            // Urutkan yang terlambat terlebih dahulu, lalu yang paling mendekati hari ini
            .sort((a: MaintenanceSchedule, b: MaintenanceSchedule) => {
              if (a.status === "terlambat" && b.status !== "terlambat") return -1;
              if (b.status === "terlambat" && a.status !== "terlambat") return 1;
              return new Date(a.tanggal_mulai).getTime() - new Date(b.tanggal_mulai).getTime();
            });
          setNotifications(activeSchedules);
        }
      } catch (err) {
        console.error("Failed to fetch notifications", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  return { notifications, loading };
}
