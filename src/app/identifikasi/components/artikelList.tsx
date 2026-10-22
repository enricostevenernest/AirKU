import { BookOpen } from "lucide-react";

import ArtikelCard from "./artikelCard";
import SkeletonCard from "./skeletonCard";

import { Identifikasi } from "../types/identifikasi";

type Props = {
  artikel: Identifikasi[];
  loading: boolean;
  total: number;
  onSelect: (
    id: number
  ) => void;
};

export default function ArtikelList({
  artikel,
  loading,
  total,
  onSelect,
}: Props) {
  return (
    <div>

      <div className="artikel-header">

        <h2>
          <BookOpen size={16} />
          Semua Artikel
        </h2>

        {!loading && (
          <span className="artikel-count">
            {total} Artikel
          </span>
        )}

      </div>

      {loading ? (
        <div className="artikel-list">

          {[1, 2, 3].map(
            (item) => (
              <SkeletonCard
                key={item}
              />
            )
          )}

        </div>
      ) : artikel.length === 0 ? (
        <div className="empty-state">

          <p>
            Tidak ada artikel
          </p>

        </div>
      ) : (
        <div className="artikel-list">

          {artikel.map((item) => (
            <ArtikelCard
              key={item.id}
              artikel={item}
              onSelect={
                onSelect
              }
            />
          ))}

        </div>
      )}
    </div>
  );
}