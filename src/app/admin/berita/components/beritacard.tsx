import { MapPin } from "lucide-react";
import StatusBadge from "./statusbadge";
import {
  badgeForKategori,
  accentForKategori,
} from "../utils/beritahelper";

type Props = {
  item: any;
  onEdit: (item: any) => void;
  onView: (item: any) => void;
};

export default function BeritaCard({
  item,
  onEdit,
  onView,
}: Props) {
  const badge = badgeForKategori(item.kategori);

  return (
    <div className="berita-card">

      <div
        className={`h-[6px] bg-gradient-to-r ${accentForKategori(
          item.kategori
        )}`}
      />

      <div className="card-content">

        <div className="card-top">
          <span
            className={`badge ${badge.bg} ${badge.text} ${badge.border}`}
          >
            {item.kategori}
          </span>

          <StatusBadge
            status={item.status}
          />
        </div>

        <h3 className="card-title">
          {item.judul}
        </h3>

        <p className="card-description">
          {item.konten}
        </p>

        {item.lokasi && (
          <div className="card-location">
            <MapPin size={12} />
            {item.lokasi}
          </div>
        )}
      </div>

      <div className="card-footer">

        <button
          className="btn-secondary"
          onClick={() => onView(item)}
        >
          Detail
        </button>

        <button
          className="btn-edit"
          onClick={() => onEdit(item)}
        >
          Edit
        </button>

      </div>
    </div>
  );
}