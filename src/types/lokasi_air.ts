export type StatusLokasi = 'aktif' | 'perbaikan' | 'tidak aktif';
export type TipeLokasi = 'sumur' | 'pdam' | 'penampungan' | 'mata air';

export interface LokasiAirBersih {
  id: string;
  nama_lokasi: string;
  deskripsi: string | null;
  alamat: string;
  latitude: number;
  longitude: number;
  status: StatusLokasi;
  kapasitas: string | null;
  tipe: TipeLokasi | null;
  jam_operasional: string | null;
  created_at: string;
  updated_at: string;
}

export interface LokasiAirFormData {
  nama_lokasi: string;
  deskripsi: string;
  alamat: string;
  latitude: number;
  longitude: number;
  status: StatusLokasi;
  kapasitas: string;
  tipe: TipeLokasi;
  jam_operasional: string;
}

export const STATUS_CONFIG: Record<StatusLokasi, { label: string; color: string; bg: string; icon: string }> = {
  aktif: { label: "Aktif", color: "#15803d", bg: "#dcfce7", icon: "🟢" },
  perbaikan: { label: "Perbaikan", color: "#a16207", bg: "#fef9c3", icon: "🟡" },
  "tidak aktif": { label: "Tidak Aktif", color: "#b91c1c", bg: "#fee2e2", icon: "🔴" },
};

export const TIPE_CONFIG: Record<TipeLokasi, { label: string; icon: string }> = {
  sumur: { label: "Sumur", icon: "💧" },
  pdam: { label: "PDAM", icon: "🚰" },
  penampungan: { label: "Penampungan", icon: "🗄️" },
  "mata air": { label: "Mata Air", icon: "🏔️" },
};