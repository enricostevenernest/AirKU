"use client";

import React, { useEffect, useMemo, useState } from "react";
import { createClient } from "../lib/supabase";

type DataContact = {
  id: number;
  nama: string;
  kontak: string;
  layanan: string;
  lokasi: string;
};

export default function VendorUser() {
  const [dataList, setDataList] = useState<DataContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"teknisi" | "vendors">("teknisi");
  const [search, setSearch] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [wilayah, setWilayah] = useState("Semua Wilayah");
  const [layanan, setLayanan] = useState("Semua Layanan");
  const [toast, setToast] = useState("");

  // ================= FETCH =================
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const supabase = createClient();
      const { data } = await supabase
        .from(activeTab)
        .select("*")
        .order("id", { ascending: true });

      setDataList(data || []);
      setLoading(false);
    };

    fetchData();
  }, [activeTab]);

  // ================= FAVORITE INIT =================
  useEffect(() => {
    const saved = localStorage.getItem("fav_vendors");
    if (saved) {
      setFavorites(JSON.parse(saved));
    }
  }, []);

  // ================= TOAST =================
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => {
      setToast("");
    }, 2000);
  };

  // ================= TOGGLE FAVORITE =================
  const toggleFavorite = (id: number) => {
    const key = `${activeTab}_${id}`;
    const updated = favorites.includes(key)
      ? favorites.filter((f) => f !== key)
      : [...favorites, key];

    setFavorites(updated);
    localStorage.setItem("fav_vendors", JSON.stringify(updated));
    showToast(favorites.includes(key) ? "Favorit dihapus" : "Ditambahkan ke favorit");
  };

  // ================= COPY NUMBER =================
  const copyNumber = async (number: string) => {
    await navigator.clipboard.writeText(number);
    showToast("Nomor berhasil dicopy");
  };

  // ================= FILTER OPTIONS =================
  const wilayahOptions = useMemo(() => {
    return ["Semua Wilayah", ...Array.from(new Set(dataList.map((d) => d.lokasi)))].filter(Boolean);
  }, [dataList]);

  const layananOptions = useMemo(() => {
    return ["Semua Layanan", ...Array.from(new Set(dataList.map((d) => d.layanan)))].filter(Boolean);
  }, [dataList]);

  // ================= FILTER DATA =================
  const filteredData = useMemo(() => {
    return dataList.filter((d) => {
      const fav = favorites.includes(`${activeTab}_${d.id}`);
      const matchSearch =
        d.nama.toLowerCase().includes(search.toLowerCase()) ||
        d.layanan.toLowerCase().includes(search.toLowerCase());
      const matchWilayah = wilayah === "Semua Wilayah" || d.lokasi === wilayah;
      const matchLayanan = layanan === "Semua Layanan" || d.layanan === layanan;
      const matchFav = !showFavorites || fav;

      return matchSearch && matchWilayah && matchLayanan && matchFav;
    });
  }, [dataList, search, wilayah, layanan, favorites, showFavorites, activeTab]);

  return (
    <div className="maintenance-page" style={{ padding: "0 4px" }}>
      
      {/* TOAST NOTIFICATION */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 bg-[#1f7aa5] text-white px-6 py-3.5 rounded-2xl shadow-xl font-bold transition-all duration-300 transform scale-100">
          {toast}
        </div>
      )}

      {/* HEADER */}
      <div
        className="page-header"
        style={{
          marginBottom: "28px",
          background: "linear-gradient(135deg, #1f7aa5 0%, #5aa8c8 55%, #b8d9ea 100%)",
          borderRadius: "20px",
          padding: "32px",
          color: "#fff",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", right: "-40px", top: "-40px", width: "180px", height: "180px", background: "rgba(255,255,255,0.12)", borderRadius: "50%" }} />
        <div style={{ position: "absolute", left: "-30px", bottom: "-60px", width: "160px", height: "160px", background: "rgba(255,255,255,0.08)", borderRadius: "50%" }} />

        <div style={{ position: "relative", zIndex: 2 }}>
          <span
            style={{
              background: "rgba(255,255,255,0.2)",
              padding: "10px 20px",
              borderRadius: "999px",
              fontSize: "0.8rem",
              fontWeight: "600",
              display: "inline-block",
              marginBottom: "14px",
            }}
          >
            👨‍🔧 AIR KU Vendor
          </span>

          <h1
            className="page-title"
            style={{
              fontSize: "2rem",
              fontWeight: "800",
              marginBottom: "10px",
              color: "#fff",
            }}
          >
            Kontak Teknisi, Material & Vendor
          </h1>

          <p
            className="page-subtitle"
            style={{
              maxWidth: "760px",
              lineHeight: "1.7",
              fontSize: "0.95rem",
              color: "rgba(255,255,255,0.92)",
            }}
          >
            Temukan teknisi, vendor, dan material terpercaya dengan tampilan modern dan mudah digunakan.
          </p>

          {/* SEARCH */}
          <div style={{ marginTop: "24px", maxWidth: "420px", position: "relative" }}>
            <input
              type="text"
              placeholder="Cari nama teknisi, vendor, layanan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                padding: "14px 18px",
                borderRadius: "14px",
                border: "none",
                outline: "none",
                fontSize: "0.9rem",
                background: "rgba(255,255,255,0.95)",
                color: "#333",
                boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
              }}
            />
          </div>
        </div>
      </div>

      {/* INFO BOX / METRICS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "14px",
          marginBottom: "28px",
        }}
      >
        {[
          { label: "Total Data", value: dataList.length, icon: "📌" },
          { label: "Data Ditampilkan", value: filteredData.length, icon: "📘" },
        ].map((item, index) => (
          <div
            key={index}
            className="schedule-card"
            style={{
              padding: "18px",
              borderRadius: "16px",
              background: "#fff",
              border: "1px solid #e5eef4",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ fontSize: "0.75rem", color: "#777", marginBottom: "6px", textTransform: "uppercase" }}>
                  {item.label}
                </p>
                <h3 style={{ margin: 0, fontSize: "1.4rem", color: "#1a516b" }}>
                  {item.value}
                </h3>
              </div>
              <div style={{ fontSize: "1.8rem" }}>{item.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* CONTROLS BAR (PERBAIKAN POSISI TOMBOL FAVORIT) */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4 mb-6 bg-white p-3 rounded-2xl border border-[#e5eef4]">
        
        {/* Tabs Group */}
        <div className="flex gap-2 bg-slate-100 p-1.5 rounded-xl w-full lg:w-[320px] shrink-0">
          {[
            ["teknisi", "👨‍🔧 Teknisi"],
            ["vendors", "🏪 Vendor"],
          ].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as any)}
              className={`w-1/2 py-2.5 rounded-lg font-bold text-base transition-all duration-200 text-center flex items-center justify-center whitespace-nowrap ${
                activeTab === key
                  ? "bg-[#1f7aa5] text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* PERBAIKAN: Mengubah justify-end menjadi justify-start / item-center agar jajarannya seimbang dan Favorit tidak terlalu ke ujung */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-start lg:justify-end flex-1">
          <select
            value={wilayah}
            onChange={(e) => setWilayah(e.target.value)}
            className="h-11 px-3 rounded-xl border border-slate-200 bg-white text-slate-700 font-semibold text-sm outline-none focus:border-[#1f7aa5] transition-all cursor-pointer min-w-[140px]"
          >
            {wilayahOptions.map((w) => (
              <option key={w} value={w}>
                {w === "Semua Wilayah" ? "📍 Semua Wilayah" : `📍 ${w}`}
              </option>
            ))}
          </select>

          <select
            value={layanan}
            onChange={(e) => setLayanan(e.target.value)}
            className="h-11 px-3 rounded-xl border border-slate-200 bg-white text-slate-700 font-semibold text-sm outline-none focus:border-[#1f7aa5] transition-all cursor-pointer min-w-[150px]"
          >
            {layananOptions.map((l) => (
              <option key={l} value={l}>
                {l === "Semua Layanan" ? "🛠 Semua Layanan" : `🛠 ${l}`}
              </option>
            ))}
          </select>

          <button
            onClick={() => setShowFavorites(!showFavorites)}
            className={`h-11 px-5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-1.5 border ${
              showFavorites
                ? "bg-amber-400 border-amber-400 text-slate-900 shadow-sm"
                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {showFavorites ? "⭐ Favorit" : "☆ Favorit"}
          </button>
        </div>
      </div>

      {/* MAIN GRID CARDS */}
      {loading ? (
        <div className="bg-white rounded-2xl p-16 text-center border border-[#e5eef4] text-slate-400 font-medium">
          Memuat data...
        </div>
      ) : filteredData.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 text-center border border-[#e5eef4] text-slate-400 font-medium">
          Data tidak ditemukan 😢
        </div>
      ) : (
        <div
          className="dashboard-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
            gap: "30px",
          }}
        >
          {filteredData.map((item) => {
            const isFav = favorites.includes(`${activeTab}_${item.id}`);
            const cleanWaNumber = item.kontak.startsWith("0")
              ? "62" + item.kontak.slice(1)
              : item.kontak.replace(/[^0-9]/g, "");

            return (
              <div
                key={item.id}
                className="schedule-card"
                style={{
                  padding: "22px",
                  borderRadius: "18px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  gap: "14px",
                  transition: "all 0.2s ease",
                  border: "1px solid #e5eef4",
                  background: "#fff",
                  position: "relative",
                }}
              >
                {/* HEADER CARD */}
                <div className="w-full flex justify-between items-start gap-3">
                  <div className="min-w-0 flex-1">
                    <span
                      style={{
                        background: activeTab === "teknisi" ? "#ede9fe" : "#dcfce7",
                        color: "#333",
                        padding: "4px 10px",
                        borderRadius: "999px",
                        fontSize: "0.72rem",
                        fontWeight: "700",
                        display: "inline-block",
                        marginBottom: "15px",
                      }}
                    >
                      {activeTab === "teknisi" ? "👨‍🔧 Teknisi" : "🏪 Vendor"}
                    </span>
                    
                    <h2
                      style={{
                        margin: 0,
                        fontSize: "1.1rem",
                        color: "#1a516b",
                        lineHeight: "1.4",
                        fontWeight: "700",
                      }}
                      className="truncate"
                      title={item.nama}
                    >
                      {item.nama}
                    </h2>
                  </div>

                  <div
                    style={{
                      background: "#f4f8fb",
                      padding: "6px 10px",
                      borderRadius: "10px",
                      fontSize: "0.72rem",
                      fontWeight: "600",
                      color: "#1a6a8a",
                      whiteSpace: "nowrap",
                    }}
                    className="max-w-[120px] truncate"
                  >
                    {item.layanan}
                  </div>
                </div>

                {/* CONTENT DATA DETAIL */}
                <div className="w-full space-y-2 py-1 text-xs text-slate-600 border-t border-b border-slate-50">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 font-medium w-14">Lokasi:</span>
                    <span className="truncate font-semibold text-slate-700">{item.lokasi}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 font-medium w-14">Kontak:</span>
                    <span className="font-bold text-[#1f7aa5]">{item.kontak}</span>
                  </div>
                </div>

                {/* ACTION BUTTONS */}
                <div className="w-full flex items-center justify-between gap-3 mt-auto pt-2">
                  
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => copyNumber(item.kontak)}
                      className="h-10 px-3 rounded-xl border border-slate-100 bg-slate-50 text-slate-600 text-sm font-bold hover:bg-slate-100 transition-all flex items-center justify-center whitespace-nowrap"
                      title="Salin Nomor"
                    >
                      📋 Copy
                    </button>
                    <button
                      onClick={() => toggleFavorite(item.id)}
                      className={`h-10 w-10 rounded-xl border text-base font-bold transition-all flex items-center justify-center shrink-0 ${
                        isFav 
                          ? "bg-amber-50 border-amber-200 text-amber-500" 
                          : "border-slate-100 bg-slate-50 text-slate-400 hover:bg-slate-100"
                      }`}
                    >
                      {isFav ? "⭐" : "☆"}
                    </button>
                  </div>

                  <div className="flex gap-2 flex-1 min-w-0">
                    <a
                      href={`tel:${item.kontak}`}
                      className="h-10 flex-1 min-w-[70px] rounded-xl border border-slate-200 text-slate-600 text-sm font-bold hover:bg-slate-50 transition-all flex items-center justify-center whitespace-nowrap px-2"
                    >
                      📞 Call
                    </a>
                    <a
                      href={`https://wa.me/${cleanWaNumber}?text=Halo%20saya%20ingin%20bertanya%20tentang%20layanan`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-10 flex-[1.2] min-w-[85px] rounded-xl bg-[#1f7aa5] hover:bg-[#176587] text-white text-sm font-bold transition-all shadow-sm flex items-center justify-center gap-1 whitespace-nowrap px-2"
                    >
                      💬 Chat
                    </a>
                  </div>

                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}