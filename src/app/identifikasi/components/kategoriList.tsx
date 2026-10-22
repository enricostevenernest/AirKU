import {
  Grid2X2,
  Droplets,
} from "lucide-react";

type Props = {
  kategori: string[];
  selected: string;
  onSelect: (v: string) => void;
};

export default function KategoriList({
  kategori,
  selected,
  onSelect,
}: Props) {
  return (
    <div className="kategori-wrapper">
      {kategori.map((item) => (
        <button
          key={item}
          onClick={() => onSelect(item)}
          className={`kategori-item ${
            selected === item
              ? "active"
              : ""
          }`}
        >
          {item === "Semua" ? (
            <Grid2X2 size={14} />
          ) : (
            <Droplets size={14} />
          )}

          <span>{item}</span>
        </button>
      ))}
    </div>
  );
}