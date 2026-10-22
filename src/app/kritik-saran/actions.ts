"use server";

// SCRUM - PBI 2: Mengisi dan Mengirimkan Form Kritik & Saran
// SCRUM-286: Menambahkan validasi dasar untuk memastikan input wajib sudah diisi sebelum data terkirim
// Server Action: Menyimpan data masukan user ke tabel kritik_saran di Supabase

import { createClient } from "../lib/supabase-server";

export type FormState = {
  status: "idle" | "success" | "error";
  message: string;
};

export async function submitKritikSaran(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  // Ambil data dari FormData
  const nama     = (formData.get("nama")     as string)?.trim();
  const email    = (formData.get("email")    as string)?.trim();
  const kategori = (formData.get("kategori") as string)?.trim();
  const pesan    = (formData.get("pesan")    as string)?.trim();

  // SCRUM-286: Validasi sisi server — lapisan kedua setelah validasi HTML native (atribut required)
  // Memastikan tidak ada data kosong yang lolos walau validasi client di-bypass
  if (!nama || !email || !kategori || !pesan) {
    return {
      status: "error",
      message: "Semua kolom wajib diisi. Mohon lengkapi formulir Anda.",
    };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return {
      status: "error",
      message: "Format alamat email tidak valid.",
    };
  }

  // Simpan ke Supabase
  try {
    const supabase = createClient();
    const { error } = await supabase.from("kritik_saran").insert({
      nama,
      email,
      kategori,
      pesan,
    });

    if (error) {
      console.error("[submitKritikSaran] Supabase error:", error.message);
      return {
        status: "error",
        message: "Gagal menyimpan masukan. Silakan coba lagi dalam beberapa saat.",
      };
    }

    return {
      status: "success",
      message: "Terima kasih! Masukan Anda berhasil dikirim dan telah direkam oleh sistem.",
    };
  } catch (err) {
    console.error("[submitKritikSaran] Unexpected error:", err);
    return {
      status: "error",
      message: "Terjadi kesalahan tidak terduga. Silakan coba lagi.",
    };
  }
}
