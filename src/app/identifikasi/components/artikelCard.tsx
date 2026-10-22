import { ChevronRight, Droplets } from "lucide-react";
import { Identifikasi } from "../types/identifikasi";

type Props = {
  artikel: Identifikasi;
  onSelect: (id: number) => void;
};

export default function ArtikelCard({
  artikel,
  onSelect,
}: Props) {
  return (
    <div
      className="artikel-card"
      onClick={() => onSelect(artikel.id)}
    >
      <div className="artikel-image">
        <img
          src={
            artikel.gambar_url ||
            "/no-image.png"
          }
          alt={artikel.judul}
          onError={(e) =>
            (e.currentTarget.src =
              "/no-image.png")
          }
        />
      </div>

      <div className="artikel-content">

        <span className="artikel-category">
          <Droplets size={11} />
          {artikel.kategori}
        </span>

        <h3 className="artikel-title">
          {artikel.judul}
        </h3>

        <p className="artikel-desc">
          {artikel.konten}
        </p>

        <span className="artikel-link">
          Baca Selengkapnya

          <ChevronRight
            size={14}
          />
        </span>

      </div>
    </div>
  );
}