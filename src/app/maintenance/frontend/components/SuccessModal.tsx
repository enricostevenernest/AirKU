"use client";

interface Props {
  onClose: () => void;
}

export default function SuccessModal({ onClose }: Props) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Tutup">✕</button>

        {/* Lingkaran dengan centang hijau sesuai gambar 3 */}
        <div className="modal-circle">
          ✓
        </div>

        <p className="modal-title">Penambahan Jadwal Berhasil Tersimpan</p>

        <button className="btn-modal-done" onClick={onClose}>
          Selesai
        </button>
      </div>
    </div>
  );
}
