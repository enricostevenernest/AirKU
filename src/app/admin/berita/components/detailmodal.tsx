import { MapPin, X } from "lucide-react";
import StatusBadge from "./statusbadge";
import {
  badgeForKategori,
  accentForKategori,
} from "../utils/beritahelper";

type Berita = {
  kategori: string;
  status: string;
  judul: string;
  lokasi?: string;
  konten: string;
};

type Props = {
  berita: Berita | null;
  onClose: () => void;
};

export default function DetailModal({
  berita,
  onClose,
}: Props) {
  if (!berita) return null;

  const badge = badgeForKategori(berita.kategori);

  return (
    <div
      className="detail-modal-overlay"
      onClick={onClose}
    >
      <div
        className="detail-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={`detail-accent bg-gradient-to-r ${accentForKategori(
            berita.kategori
          )}`}
        />

        {/* HEADER */}
        <div className="detail-header">
          <div>
            <p className="detail-subtitle">
              Detail Berita
            </p>

            <h2 className="detail-title">
              {berita.judul}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="detail-close-btn"
          >
            <X size={18} />
          </button>
        </div>

        {/* META */}
        <div className="detail-meta">

          <span
            className={`badge ${badge.bg} ${badge.text} ${badge.border}`}
          >
            {berita.kategori}
          </span>

          <StatusBadge status={berita.status} />

          {berita.lokasi && (
            <div className="detail-location">
              <MapPin size={14} />
              <span>{berita.lokasi}</span>
            </div>
          )}

        </div>

        {/* CONTENT */}
        <div className="detail-content">
          {berita.konten}
        </div>

        {/* FOOTER */}
        <div className="detail-footer">
          <button
            onClick={onClose}
            className="detail-btn-close"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}