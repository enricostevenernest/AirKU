"use client";

import React from "react";

type Props = {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  selectedLayanan: string;
  setSelectedLayanan: (val: string) => void;
  layananList: string[];
  onAdd: () => void; // tombol tambah
};

export default function VendorFilter({
  searchQuery,
  setSearchQuery,
  selectedLayanan,
  setSelectedLayanan,
  layananList,
  onAdd,
}: Props) {
  return (
    <div className="flex gap-3 mb-6">

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Cari nama / layanan..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="flex-1 border px-4 py-2 rounded-xl"
      />

      {/* FILTER LAYANAN */}
      <select
        value={selectedLayanan}
        onChange={(e) => setSelectedLayanan(e.target.value)}
        className="border px-3 py-2 rounded-xl"
      >
        {layananList.map((layanan) => (
          <option key={layanan} value={layanan}>
            {layanan}
          </option>
        ))}
      </select>

      {/* BUTTON TAMBAH */}
      <button
        onClick={onAdd}
        className="bg-[#0b5478] text-white px-6 rounded-xl"
      >
        + Tambah
      </button>
    </div>
  );
}