-- ============================================================
-- SCRUM-285: Membuat tabel baru di Supabase dengan kolom yang sesuai
-- PBI      : Mengisi dan Mengirimkan Form Kritik & Saran
-- ============================================================
--
-- CARA PENGGUNAAN:
--   Salin dan jalankan script ini di Supabase SQL Editor:
--   Dashboard Supabase → SQL Editor → New Query → Paste → Run
--
-- KOLOM TABEL:
--   id         : Primary key, auto-increment (BIGSERIAL)
--   nama       : Nama lengkap pengirim (wajib diisi)
--   email      : Alamat email pengirim (wajib diisi)
--   kategori   : Kategori masukan — bug | fitur | tampilan | kinerja | lainnya (wajib diisi)
--   pesan      : Isi pesan / masukan dari user (wajib diisi)
--   created_at : Timestamp otomatis saat data dimasukkan
-- ============================================================

CREATE TABLE IF NOT EXISTS public.kritik_saran (
  id         BIGSERIAL    PRIMARY KEY,
  nama       TEXT         NOT NULL,
  email      TEXT         NOT NULL,
  kategori   TEXT         NOT NULL,
  pesan      TEXT         NOT NULL,
  created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- Mengaktifkan RLS agar akses tabel dikendalikan per policy
-- ============================================================

ALTER TABLE public.kritik_saran ENABLE ROW LEVEL SECURITY;

-- Policy 1: Izinkan INSERT publik (tanpa login) → digunakan oleh Server Action
CREATE POLICY "Allow public insert"
  ON public.kritik_saran
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Policy 2: Hanya service_role (admin) yang dapat membaca seluruh data masukan
CREATE POLICY "Allow admin select"
  ON public.kritik_saran
  FOR SELECT
  TO service_role
  USING (true);
