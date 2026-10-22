type Props = {
  status: string;
};

export default function StatusBadge({
  status,
}: Props) {
  const cls =
    status === "Aktif"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : "bg-slate-100 text-slate-400 border-slate-200";

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${cls}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
          status === "Aktif"
            ? "bg-emerald-500"
            : "bg-slate-300"
        }`}
      />
      {status}
    </span>
  );
}