"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "../../lib/supabase";
import VendorFilter from "./VendorFilter";

type DataContact = {
  id: number;
  nama: string;
  kontak: string;
  layanan: string;
  lokasi: string;
};

export default function VendorAdmin() {
  const [dataList, setDataList] = useState<DataContact[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [activeTab, setActiveTab] = useState<"teknisi" | "vendors">("teknisi");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLayanan, setSelectedLayanan] = useState("Semua");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    nama: "",
    kontak: "",
    layanan: "",
    lokasi: "",
  });
  const [customLayanan, setCustomLayanan] = useState("");
  const [customLokasi, setCustomLokasi] = useState("");
  const [isCustomLayanan, setIsCustomLayanan] = useState(false);
  const [isCustomLokasi, setIsCustomLokasi] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  // ================= FETCH =================
  const fetchData = async () => {
    setIsLoading(true);
    const supabase = createClient();

    const { data, error } = await supabase
      .from(activeTab)
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      console.error(error);
      setErrorMessage("Gagal mengambil data");
      setDataList([]);
    } else {
      setDataList(data || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    setSearchQuery("");
    setSelectedLayanan("Semua");
    fetchData();
  }, [activeTab]);

  const existingLayananList = Array.from(new Set(dataList.map((d) => d.layanan))).filter(Boolean);
  const existingLokasiList = Array.from(new Set(dataList.map((d) => d.lokasi))).filter(Boolean);

  // ================= MODAL =================
  const handleOpenModal = (item?: DataContact) => {
    setErrorMessage("");
    setIsCustomLayanan(false);
    setIsCustomLokasi(false);
    setCustomLayanan("");
    setCustomLokasi("");

    if (item) {
      setEditId(item.id);
      setFormData(item);
    } else {
      setEditId(null);
      setFormData({
        nama: "",
        kontak: "",
        layanan: existingLayananList[0] || "",
        lokasi: existingLokasiList[0] || "",
      });
    }
    setIsModalOpen(true);
  };

  // ================= VALIDASI =================
  const validateForm = () => {
    if (!formData.nama.trim()) return "Nama wajib diisi";
    if (!formData.kontak.trim()) return "Kontak wajib diisi";
    if (!/^(08|\+628|628)[0-9]{8,13}$/.test(formData.kontak)) return "Format nomor tidak valid";
    
    const finalLayanan = isCustomLayanan ? customLayanan.trim() : formData.layanan;
    const finalLokasi = isCustomLokasi ? customLokasi.trim() : formData.lokasi;

    if (!finalLayanan) return "Layanan wajib diisi";
    if (!finalLokasi) return "Lokasi wajib diisi";

    return "";
  };

  // ================= SAVE =================
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validateForm();
    if (err) {
      setErrorMessage(err);
      return;
    }

    const finalLayanan = isCustomLayanan ? customLayanan.trim() : formData.layanan;
    const finalLokasi = isCustomLokasi ? customLokasi.trim() : formData.lokasi;

    const payload = {
      ...formData,
      layanan: finalLayanan,
      lokasi: finalLokasi,
    };

    const supabase = createClient();
    setIsLoading(true);

    try {
      if (editId) {
        const { error } = await supabase
          .from(activeTab)
          .update(payload)
          .eq("id", editId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from(activeTab)
          .insert([{ id: Date.now(), ...payload }]);
        if (error) throw error;
      }

      await fetchData();
      setIsModalOpen(false);
    } catch (error: any) {
      console.error(error);
      setErrorMessage(error.message || "Gagal menyimpan data");
    } finally {
      setIsLoading(false);
    }
  };

  // ================= DELETE =================
  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus data ini?")) return;
    const supabase = createClient();
    const { error } = await supabase.from(activeTab).delete().eq("id", id);

    if (error) {
      console.error(error);
      setErrorMessage("Gagal hapus data");
    } else {
      fetchData();
    }
  };

  // ================= EXPORT CSV =================
  const handleExportCSV = () => {
    if (filteredData.length === 0) {
      alert("Tidak ada data untuk diekspor");
      return;
    }
    const headers = "Nama,Kontak,Layanan,Lokasi\n";
    const rows = filteredData
      .map((item) => `"${item.nama}","${item.kontak}","${item.layanan}","${item.lokasi}"`)
      .join("\n");

    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Data_${activeTab}_AIR_KU.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const layananList = ["Semua", ...new Set(dataList.map((d) => d.layanan))];

  // ================= FILTER =================
  const filteredData = dataList.filter((v) => {
    const matchSearch =
      v.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.layanan.toLowerCase().includes(searchQuery.toLowerCase());

    const matchLayanan = selectedLayanan === "Semua" || v.layanan === selectedLayanan;
    return matchSearch && matchLayanan;
  });

  return (
    <div className="min-h-screen bg-slate-50 p-8 md:p-10 antialiased text-slate-800">
      {/* CONTAINER UTAMA */}
      <div className="max-w-7xl mx-auto flex flex-col gap-12">
        
        {/* HEADER ASLI */}
        <div
          className="vendor-header-bg"
          style={{
            background: "linear-gradient(135deg, #1f7aa5 0%, #5aa8c8 55%, #b8d9ea 100%)",
            borderRadius: "28px",
            padding: "34px",
            color: "#fff",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div style={{ position: "absolute", right: "-40px", top: "-40px", width: "180px", height: "180px", background: "rgba(255,255,255,0.12)", borderRadius: "50%" }} />
          <div style={{ position: "relative", zIndex: 2 }}>
            <span style={{ background: "rgba(255,255,255,0.2)", padding: "8px 16px", borderRadius: "999px", fontSize: "0.85rem", fontWeight: "700", display: "inline-block", marginBottom: "16px" }}>
              ⚙️ AIR KU Admin
            </span>
            <h1 style={{ fontSize: "2.4rem", fontWeight: "800", marginBottom: "12px" }}>
              Kelola Kontak Teknisi & Vendor
            </h1>
            <p style={{ maxWidth: "700px", lineHeight: "1.7", color: "rgba(255,255,255,0.92)" }}>
              Kelola informasi teknisi & vendor secara efisien dengan tampilan yang modern dan mudah digunakan.
            </p>
          </div>
        </div>

        {/* METRICS STATS INFO */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { label: "Total Data", value: dataList.length, icon: "📌", color: "text-sky-400 bg-sky-50" },
            { label: "Data Ditampilkan", value: filteredData.length, icon: "📘", color: "text-indigo-600 bg-indigo-50" },
          ].map((item, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between transition-all hover:shadow-md">
              <div className="space-y-1">
                <p className="text-slate-400 text-sm font-semibold tracking-wide uppercase">{item.label}</p>
                <h2 className="text-3xl font-black text-slate-800">{item.value}</h2>
              </div>
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl ${item.color}`}>
                {item.icon}
              </div>
            </div>
          ))}
        </div>

        {/* CONTROLS (TABS & EXPORT EXCEL) */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-white p-3 rounded-2xl border border-slate-100 shadow-sm">
          
          {/* Button Group: Memanjang penuh dari ujung kiri ke tengah (flex-1 tanpa max-width). Ukuran tombol sedang (py-3, px-8, text-lg). */}
          <div className="flex flex-row gap-2 bg-slate-100 p-1.5 rounded-xl flex-1">
            {[
              ["teknisi", "👨‍🔧 Teknisi"],
              ["vendors", "🏪 Vendor"],
            ].map(([key, label]) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as any)}
                className={`flex-1 py-3 px-8 rounded-xl font-extrabold text-lg transition-all duration-300 tracking-wide text-center ${
                  activeTab === key
                    ? "bg-gradient-to-r from-[#1f7aa5] via-[#3a91b8] to-[#5aa8c8] text-white shadow-sm transform scale-[1.01]"
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-200/50"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Tombol Export CSV */}
          <button
            onClick={handleExportCSV}
            className="lg:w-auto py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base transition-all flex items-center justify-center gap-2 shadow-sm whitespace-nowrap"
          >
            📥 Ekspor ke Excel (.csv)
          </button>
        </div>

        {/* FILTER BAR */}
        <div className="bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
          <VendorFilter
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedLayanan={selectedLayanan}
            setSelectedLayanan={setSelectedLayanan}
            layananList={layananList}
            onAdd={() => handleOpenModal()}
          />
        </div>

        {/* GRID MAIN CARDS */}
        {isLoading ? (
          <div className="bg-white rounded-2xl p-16 text-center border border-slate-100 text-slate-400 font-medium shadow-sm">
            Memuat data...
          </div>
        ) : filteredData.length === 0 ? (
          <div className="bg-white rounded-2xl p-16 text-center border border-slate-100 text-slate-400 font-medium shadow-sm">
            Data tidak ditemukan 😢
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {filteredData.map((item) => (
              <div 
                key={item.id} 
                className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:border-slate-200/90 transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between overflow-hidden"
              >
                <div className="p-6 space-y-4 relative">
                  <span className="absolute top-6 right-8 inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap flex-shrink-0 shadow-sm">
                    🟢 Aktif
                  </span>

                  <div className="flex items-start gap-3.5 pt-1">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 group-hover:bg-sky-50 transition-colors flex items-center justify-center text-xl flex-shrink-0 border border-slate-100 shadow-sm mt-1">
                      {activeTab === "teknisi" ? "👨‍🔧" : "🏪"}
                    </div>

                    <div className="flex-1 min-w-0 pr-28 space-y-1">
                      <h2 className="text-base font-bold text-slate-800 truncate" title={item.nama}>
                        {item.nama}
                      </h2>
                      <p className="text-xs font-semibold text-slate-400 tracking-wider uppercase truncate">{item.layanan}</p>
                    </div>
                  </div>

                  <hr className="border-slate-100 mt-5" />

                  <div className="space-y-2.5 text-sm text-slate-600 mt-4">
                    <div className="flex items-start gap-2">
                      <span className="text-slate-400 font-medium text-xs uppercase tracking-wider w-16 flex-shrink-0 pt-0.5">Lokasi:</span>
                      <span className="truncate font-medium text-slate-700">{item.lokasi}</span>
                    </div>

                    <div className="flex items-start gap-2">
                      <span className="text-slate-400 font-medium text-xs uppercase tracking-wider w-16 flex-shrink-0 pt-0.5">Kontak:</span>
                      <a
                        href={`https://wa.me/${item.kontak.replace(/^[0]/, "62").replace(/[^0-9]/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-sky-600 hover:text-sky-700 hover:underline inline-flex items-center gap-0.5"
                        title="Klik untuk chat WhatsApp"
                      >
                        {item.kontak} <span className="text-[10px]">↗</span>
                      </a>
                    </div>
                  </div>
                </div>

                {/* CARD ACTIONS */}
                <div className="grid grid-cols-2 border-t border-slate-100 bg-slate-50/50 p-3 gap-2 mt-2">
                  <button 
                    onClick={() => handleOpenModal(item)} 
                    className="h-9 rounded-lg border border-slate-200 bg-white text-slate-600 text-xs font-bold hover:bg-slate-100 hover:border-slate-300 shadow-sm transition-all flex items-center justify-center gap-1"
                  >
                    ✏️ Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(item.id)} 
                    className="h-9 rounded-lg bg-red-50 hover:bg-red-100/70 text-red-600 text-xs font-bold transition-all flex items-center justify-center gap-1"
                  >
                    🗑 Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* MODAL INPUT & EDIT */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-slate-100 p-6 max-h-[90vh] overflow-y-auto space-y-6">
              <div>
                <h2 className="text-xl font-black text-slate-800">{editId ? "Edit Data" : "Tambah Data"}</h2>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nama</label>
                  <input
                    type="text"
                    placeholder="Masukkan nama"
                    value={formData.nama}
                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-slate-50/50 outline-none focus:bg-white focus:border-[#1f7aa5] text-sm transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">No. Kontak (WA)</label>
                  <input
                    type="text"
                    placeholder="Contoh: 08123456789"
                    value={formData.kontak}
                    onChange={(e) => setFormData({ ...formData, kontak: e.target.value })}
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-slate-50/50 outline-none focus:bg-white focus:border-[#1f7aa5] text-sm transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Jenis Layanan</label>
                  {!isCustomLayanan ? (
                    <select
                      value={formData.layanan}
                      onChange={(e) => {
                        if (e.target.value === "__NEW__") {
                          setIsCustomLayanan(true);
                        } else {
                          setFormData({ ...formData, layanan: e.target.value });
                        }
                      }}
                      className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-white outline-none focus:border-[#1f7aa5] text-sm transition-all cursor-pointer"
                    >
                      {existingLayananList.map((layanan) => (
                        <option key={layanan} value={layanan}>{layanan}</option>
                      ))}
                      <option value="__NEW__" className="text-sky-600 font-bold">+ Tulis Layanan Baru...</option>
                    </select>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Tulis nama layanan baru"
                        value={customLayanan}
                        onChange={(e) => setCustomLayanan(e.target.value)}
                        className="flex-1 h-11 px-3.5 rounded-xl border border-[#1f7aa5] outline-none text-sm"
                        autoFocus
                      />
                      <button type="button" onClick={() => setIsCustomLayanan(false)} className="px-2 text-xs text-slate-400 font-bold hover:text-red-500 transition-colors">Batal</button>
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Lokasi / Wilayah</label>
                  {!isCustomLokasi ? (
                    <select
                      value={formData.lokasi}
                      onChange={(e) => {
                        if (e.target.value === "__NEW__") {
                          setIsCustomLokasi(true);
                        } else {
                          setFormData({ ...formData, lokasi: e.target.value });
                        }
                      }}
                      className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-white outline-none focus:border-[#1f7aa5] text-sm transition-all cursor-pointer"
                    >
                      {existingLokasiList.map((lokasi) => (
                        <option key={lokasi} value={lokasi}>{lokasi}</option>
                      ))}
                      <option value="__NEW__" className="text-sky-600 font-bold">+ Tulis Lokasi Baru...</option>
                    </select>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Tulis nama lokasi baru"
                        value={customLokasi}
                        onChange={(e) => setCustomLokasi(e.target.value)}
                        className="flex-1 h-11 px-3.5 rounded-xl border border-[#1f7aa5] outline-none text-sm"
                        autoFocus
                      />
                      <button type="button" onClick={() => setIsCustomLokasi(false)} className="px-2 text-xs text-slate-400 font-bold hover:text-red-500 transition-colors">Batal</button>
                    </div>
                  )}
                </div>

                {errorMessage && (
                  <div className="p-3 rounded-xl bg-red-50 text-red-600 text-xs font-semibold border border-red-100">
                    {errorMessage}
                  </div>
                )}

                <div className="flex gap-3 pt-4 border-t border-slate-100 mt-6">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 h-11 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 font-bold text-sm transition-all">
                    Batal
                  </button>
                  <button type="submit" className="flex-1 h-11 rounded-xl bg-[#1f7aa5] hover:bg-[#1b6b91] text-white font-bold text-sm transition-all shadow-md">
                    Simpan Data
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}