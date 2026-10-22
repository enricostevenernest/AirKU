// SCRUM - Subtask 1.2: Membangun Kerangka & Layout Halaman
// Komponen PageHeader: Menampilkan judul, deskripsi ajakan, dan ikon dekoratif

import { MessageSquareHeart, Droplets } from "lucide-react";

export default function PageHeader() {
  return (
    <header className="ks-header">
      {/* Ikon Dekoratif */}
      <div className="ks-header-icon-wrapper" aria-hidden="true">
        <Droplets className="ks-header-icon-drop" size={36} />
        <MessageSquareHeart className="ks-header-icon-msg" size={48} />
      </div>

      {/* Subtask 1.2: Judul Halaman */}
      <h1 className="ks-header-title">Kritik &amp; Saran</h1>

      {/* Subtask 1.2: Deskripsi Ajakan */}
      <p className="ks-header-description">
        Suara Anda sangat berarti bagi kami! Sampaikan pengalaman, masukan,
        atau kritik Anda untuk membantu kami terus meningkatkan kualitas
        layanan <strong>Air Ku</strong>.
      </p>

      {/* Subtask 1.4: Indikator Langkah Pengisian */}
      <div className="ks-header-steps" role="list" aria-label="Langkah pengisian">
        {[
          { num: 1, label: "Isi Data Diri" },
          { num: 2, label: "Pilih Kategori" },
          { num: 3, label: "Tulis Masukan" },
        ].map((step) => (
          <div key={step.num} className="ks-step-item" role="listitem">
            <span className="ks-step-num" aria-hidden="true">{step.num}</span>
            <span className="ks-step-label">{step.label}</span>
          </div>
        ))}
      </div>
    </header>
  );
}
