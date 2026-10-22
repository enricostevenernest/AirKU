export const BADGE_PALETTE = [
  {
    bg: "bg-amber-100",
    text: "text-amber-800",
    border: "border-amber-200",
  },
  {
    bg: "bg-orange-100",
    text: "text-orange-700",
    border: "border-orange-200",
  },
  {
    bg: "bg-teal-100",
    text: "text-teal-700",
    border: "border-teal-200",
  },
  {
    bg: "bg-sky-100",
    text: "text-sky-700",
    border: "border-sky-200",
  },
  {
    bg: "bg-violet-100",
    text: "text-violet-700",
    border: "border-violet-200",
  },
  {
    bg: "bg-rose-100",
    text: "text-rose-700",
    border: "border-rose-200",
  },
  {
    bg: "bg-emerald-100",
    text: "text-emerald-700",
    border: "border-emerald-200",
  },
];

export const badgeForKategori = (name: string) => {
  let h = 0;

  for (let i = 0; i < name.length; i++) {
    h = (h * 31 + name.charCodeAt(i)) >>> 0;
  }

  return BADGE_PALETTE[h % BADGE_PALETTE.length];
};

export const KATEGORI_ACCENT: Record<string, string> = {
  Darurat: "from-red-400 to-rose-500",
  Bencana: "from-orange-400 to-amber-500",
  Berita: "from-sky-400 to-blue-500",
};

export const accentForKategori = (kategori: string) =>
  KATEGORI_ACCENT[kategori] ??
  "from-slate-300 to-slate-400";