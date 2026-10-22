export type MaintenanceStatus = "segera" | "terjadwal" | "terlambat" | "selesai";

export type JenisPerawatan =
  | "pengurasan_tandon"
  | "ganti_media_filter"
  | "pemeriksaan_pompa"
  | "penggantian_pipa"
  | "pembersihan_saringan"
  | "lainnya";

export type Frekuensi =
  | "1_minggu"
  | "2_minggu"
  | "1_bulan"
  | "3_bulan"
  | "6_bulan"
  | "1_tahun";

export type TipeInstalasi =
  | "tandon_reservoir"
  | "sumur_gali"
  | "sumur_bor"
  | "pdam"
  | "filter_air"
  | "lainnya";

export interface MaintenanceSchedule {
  id: string;
  jenis_perawatan: JenisPerawatan;
  tanggal_mulai: string; // ISO date string YYYY-MM-DD
  frekuensi: Frekuensi;
  tipe_instalasi: TipeInstalasi;
  notes: string;
  status: MaintenanceStatus;
  created_at: string;
  is_deleted?: boolean;
  updated_at?: string;
}

export const JENIS_LABEL: Record<JenisPerawatan, string> = {
  pengurasan_tandon: "Pengurasan Tandon",
  ganti_media_filter: "Ganti Media Filter",
  pemeriksaan_pompa: "Pemeriksaan Pompa Air",
  penggantian_pipa: "Penggantian Pipa",
  pembersihan_saringan: "Pembersihan Saringan",
  lainnya: "Lainnya",
};

export const FREKUENSI_LABEL: Record<Frekuensi, string> = {
  "1_minggu": "Setiap 1 Minggu",
  "2_minggu": "Setiap 2 Minggu",
  "1_bulan": "Setiap 1 Bulan",
  "3_bulan": "Setiap 3 Bulan",
  "6_bulan": "Setiap 6 Bulan",
  "1_tahun": "Setiap 1 Tahun",
};

export const INSTALASI_LABEL: Record<TipeInstalasi, string> = {
  tandon_reservoir: "Tandon / Reservoir",
  sumur_gali: "Sumur Gali",
  sumur_bor: "Sumur Bor",
  pdam: "PDAM",
  filter_air: "Filter Air",
  lainnya: "Lainnya",
};
