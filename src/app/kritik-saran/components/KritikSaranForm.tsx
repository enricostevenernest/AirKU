"use client";

// SCRUM - Subtask 1.3: Membuat Komponen Form UI
import "../kritik-saran.css";
// SCRUM - Subtask 1.4: Peningkatan UX (Ikon & Aksesibilitas)
// Komponen KritikSaranForm: UI-only form dengan semua elemen input
// Catatan: Logika submit & koneksi Supabase akan diimplementasikan di PBI 2

import { useState } from "react";
import {
  User,
  Mail,
  Tag,
  MessageSquare,
  Send,
  CheckCircle,
} from "lucide-react";
import { createClient } from "@/app/lib/supabase";

// Tipe data untuk state form
type FormData = {
  nama: string;
  email: string;
  kategori: string;
  pesan: string;
};

// Daftar kategori pilihan
const KATEGORI_OPTIONS = [
  { value: "", label: "-- Pilih Kategori --" },
  { value: "bug", label: "🐛 Laporan Bug / Error" },
  { value: "fitur", label: "💡 Ide / Saran Fitur Baru" },
  { value: "tampilan", label: "🎨 Tampilan & Desain" },
  { value: "kinerja", label: "⚡ Kinerja & Kecepatan" },
  { value: "lainnya", label: "💬 Lainnya" },
];

export default function KritikSaranForm() {
  // State form kosong sebagai nilai awal
  const [formData, setFormData] = useState<FormData>({
    nama: "",
    email: "",
    kategori: "",
    pesan: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  const supabase = createClient();

  // Handler perubahan input yang dapat digunakan untuk semua field
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Hitung sisa karakter untuk textarea
  const MAX_PESAN_LENGTH = 500;
  const sisaKarakter = MAX_PESAN_LENGTH - formData.pesan.length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatusMessage(null);

    try {
      const { error } = await supabase
        .from('feedback')
        .insert([{
          nama: formData.nama,
          email: formData.email,
          kategori: formData.kategori,
          pesan: formData.pesan,
          status: 'unread'
        }]);

      if (error) throw error;

      setStatusMessage({ type: 'success', text: 'Masukan Anda berhasil dikirim! Terima kasih.' });
      setFormData({ nama: "", email: "", kategori: "", pesan: "" });
    } catch (error: any) {
      console.error("Error submitting feedback:", error);
      setStatusMessage({ type: 'error', text: 'Gagal mengirim masukan. Silakan coba lagi nanti.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="ks-form-section" aria-labelledby="form-heading">
      <h2 id="form-heading" className="ks-form-heading">
        Formulir Masukan
      </h2>

      {statusMessage && (
        <div style={{
          padding: '12px 16px',
          marginBottom: '20px',
          borderRadius: '8px',
          backgroundColor: statusMessage.type === 'success' ? '#e0f2f9' : '#ffebee',
          color: statusMessage.type === 'success' ? '#1a516b' : '#c62828',
          border: `1px solid ${statusMessage.type === 'success' ? '#b3e5fc' : '#ffcdd2'}`,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          {statusMessage.type === 'success' && <CheckCircle size={18} />}
          <p style={{ margin: 0, fontSize: '0.9rem' }}>{statusMessage.text}</p>
        </div>
      )}

      <form className="ks-form" onSubmit={handleSubmit} noValidate>
        {/* ===== GRID: Nama & Email ===== */}
        <div className="ks-form-row">

          {/* --- Subtask 1.3: Input Nama (Required) --- */}
          <div className="ks-field-group">
            <label htmlFor="nama" className="ks-label">
              <User size={16} className="ks-label-icon" aria-hidden="true" />
              Nama Lengkap
              <span className="ks-required" aria-label="wajib diisi">*</span>
            </label>
            <input
              id="nama"
              name="nama"
              type="text"
              required
              autoComplete="name"
              placeholder="Contoh: Budi Santoso"
              value={formData.nama}
              onChange={handleChange}
              className="ks-input"
              aria-describedby="nama-hint"
              maxLength={100}
            />
            <span id="nama-hint" className="ks-field-hint">
              Nama akan ditampilkan pada laporan masukan.
            </span>
          </div>

          {/* --- Subtask 1.3: Input Email (Required) --- */}
          <div className="ks-field-group">
            <label htmlFor="email" className="ks-label">
              <Mail size={16} className="ks-label-icon" aria-hidden="true" />
              Alamat Email
              <span className="ks-required" aria-label="wajib diisi">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="Contoh: budi@email.com"
              value={formData.email}
              onChange={handleChange}
              className="ks-input"
              aria-describedby="email-hint"
              maxLength={150}
            />
            <span id="email-hint" className="ks-field-hint">
              Email tidak akan dipublikasikan.
            </span>
          </div>
        </div>

        {/* --- Subtask 1.3: Dropdown Kategori --- */}
        <div className="ks-field-group">
          <label htmlFor="kategori" className="ks-label">
            <Tag size={16} className="ks-label-icon" aria-hidden="true" />
            Kategori Masukan
            <span className="ks-required" aria-label="wajib diisi">*</span>
          </label>
          <div className="ks-select-wrapper">
            <select
              id="kategori"
              name="kategori"
              required
              value={formData.kategori}
              onChange={handleChange}
              className="ks-select"
              aria-describedby="kategori-hint"
            >
              {KATEGORI_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value} disabled={opt.value === ""}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <span id="kategori-hint" className="ks-field-hint">
            Pilih kategori yang paling sesuai dengan masukan Anda.
          </span>
        </div>

        {/* --- Subtask 1.3: Textarea Pesan (Required) --- */}
        <div className="ks-field-group">
          <label htmlFor="pesan" className="ks-label">
            <MessageSquare size={16} className="ks-label-icon" aria-hidden="true" />
            Pesan Masukan
            <span className="ks-required" aria-label="wajib diisi">*</span>
          </label>
          <textarea
            id="pesan"
            name="pesan"
            required
            rows={5}
            placeholder="Ceritakan pengalaman atau saran Anda secara detail di sini..."
            value={formData.pesan}
            onChange={handleChange}
            className="ks-textarea"
            aria-describedby="pesan-hint pesan-counter"
            maxLength={MAX_PESAN_LENGTH}
          />
          <div className="ks-textarea-footer">
            <span id="pesan-hint" className="ks-field-hint">
              Semakin detail masukan Anda, semakin mudah kami memperbaikinya.
            </span>
            <span
              id="pesan-counter"
              className={`ks-char-counter ${sisaKarakter < 50 ? "ks-char-counter--warn" : ""}`}
              aria-live="polite"
              aria-label={`Sisa ${sisaKarakter} karakter`}
            >
              {sisaKarakter}/{MAX_PESAN_LENGTH}
            </span>
          </div>
        </div>

        {/* --- Subtask 1.3: Tombol Submit --- */}
        {/* Catatan: onClick handler & state loading telah diimplementasikan */}
        <div className="ks-form-action">
          <p className="ks-required-note">
            <span aria-hidden="true">*</span> Kolom bertanda bintang wajib diisi.
          </p>
          <button
            id="btn-submit-kritik-saran"
            type="submit"
            className="ks-btn-submit"
            disabled={isLoading || !formData.nama || !formData.email || !formData.kategori || !formData.pesan}
            style={{ opacity: (isLoading || !formData.nama || !formData.email || !formData.kategori || !formData.pesan) ? 0.7 : 1 }}
          >
            <Send size={18} aria-hidden="true" />
            {isLoading ? 'Mengirim...' : 'Kirim Masukan'}
          </button>
        </div>
      </form>

      {/* --- Subtask 1.4: Info Jaminan Privasi --- */}
      <div className="ks-privacy-note" role="note">
        <CheckCircle size={16} className="ks-privacy-icon" aria-hidden="true" />
        <p>
          Data Anda aman bersama kami. Masukan hanya digunakan untuk keperluan
          peningkatan layanan <strong>Air Ku</strong>.
        </p>
      </div>
    </section>
  );
}
