"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "../../lib/supabase";

type Kategori = {
  id: number;
  nama: string;
  gambar_url: string;
};

type Identifikasi = {
  id: number;
  kategori: string;
  judul: string;
  konten: string;
  gambar_url: string;
};

export default function IdentifikasiAdmin() {
  const [activeTab, setActiveTab] = useState<"artikel" | "kategori">("kategori");
  const [isLoading, setIsLoading] = useState(true);

  // Data
  const [kategoriList, setKategoriList] = useState<Kategori[]>([]);
  const [artikelList, setArtikelList] = useState<Identifikasi[]>([]);

  // Filter & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [activeKategoriFilter, setActiveKategoriFilter] = useState<string>("");

  // Modal Kategori
  const [isKategoriModalOpen, setIsKategoriModalOpen] = useState(false);
  const [editKategoriId, setEditKategoriId] = useState<number | null>(null);
  const [kategoriForm, setKategoriForm] = useState({ nama: "", gambar_url: "" });

  // Modal Artikel
  const [isArtikelModalOpen, setIsArtikelModalOpen] = useState(false);
  const [editArtikelId, setEditArtikelId] = useState<number | null>(null);
  const [artikelForm, setArtikelForm] = useState({ kategori: "", judul: "", gejala: "", solusi: "", gambar_url: "" });

  const fetchData = async () => {
    setIsLoading(true);
    const supabase = createClient();
    
    // Fetch Kategori
    const { data: katData, error: katErr } = await supabase
      .from("kategori_identifikasi")
      .select("*")
      .order("id", { ascending: true });
      
    if (katData) {
      setKategoriList(katData);
      if (katData.length > 0 && !activeKategoriFilter) {
        setActiveKategoriFilter(katData[0].nama);
      }
    }

    // Fetch Artikel
    const { data: artData, error: artErr } = await supabase
      .from("identifikasi")
      .select("*")
      .order("id", { ascending: false });
      
    if (artData) {
      setArtikelList(artData);
    }
    
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- HANDLERS KATEGORI ---
  const handleOpenKategoriModal = (item?: Kategori) => {
    if (item) {
      setEditKategoriId(item.id);
      setKategoriForm({ nama: item.nama, gambar_url: item.gambar_url });
    } else {
      setEditKategoriId(null);
      setKategoriForm({ nama: "", gambar_url: "" });
    }
    setIsKategoriModalOpen(true);
  };

  const handleSaveKategori = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const supabase = createClient();

    if (editKategoriId) {
      const { error } = await supabase
        .from("kategori_identifikasi")
        .update({ nama: kategoriForm.nama, gambar_url: kategoriForm.gambar_url })
        .eq("id", editKategoriId);
      if (error) alert("Gagal update kategori!");
    } else {
      const { error } = await supabase
        .from("kategori_identifikasi")
        .insert([{ nama: kategoriForm.nama, gambar_url: kategoriForm.gambar_url }]);
      if (error) alert("Gagal menambah kategori!");
    }

    setIsKategoriModalOpen(false);
    await fetchData();
  };

  const handleDeleteKategori = async () => {
    if (!editKategoriId) return;
    if (!confirm("Yakin ingin menghapus kategori ini? Pastikan tidak ada artikel yang menggunakan kategori ini.")) return;
    
    setIsLoading(true);
    const supabase = createClient();
    const { error } = await supabase.from("kategori_identifikasi").delete().eq("id", editKategoriId);
    
    if (error) {
      alert("Gagal menghapus kategori!");
    } else {
      setIsKategoriModalOpen(false);
      await fetchData();
    }
    setIsLoading(false);
  };

  // --- HANDLERS ARTIKEL ---
  const handleOpenArtikelModal = (item?: Identifikasi) => {
    if (item) {
      setEditArtikelId(item.id);
      
      // Parse konten for gejala & solusi
      let parsedGejala = "";
      let parsedSolusi = "";
      try {
        const parsed = JSON.parse(item.konten);
        if (parsed.gejala !== undefined && parsed.solusi !== undefined) {
          parsedGejala = parsed.gejala;
          parsedSolusi = parsed.solusi;
        } else {
          // Fallback if JSON but no gejala/solusi
          parsedGejala = item.konten;
        }
      } catch (e) {
        // Not JSON, fallback to old plain text
        parsedGejala = item.konten;
      }

      setArtikelForm({ 
        kategori: item.kategori, 
        judul: item.judul, 
        gejala: parsedGejala, 
        solusi: parsedSolusi, 
        gambar_url: item.gambar_url 
      });
    } else {
      setEditArtikelId(null);
      setArtikelForm({ 
        kategori: activeKategoriFilter || (kategoriList.length > 0 ? kategoriList[0].nama : ""), 
        judul: "", 
        gejala: "", 
        solusi: "", 
        gambar_url: "" 
      });
    }
    setIsArtikelModalOpen(true);
  };

  const handleSaveArtikel = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const supabase = createClient();

    const payload = JSON.stringify({
      gejala: artikelForm.gejala,
      solusi: artikelForm.solusi
    });

    if (editArtikelId) {
      const { error } = await supabase
        .from("identifikasi")
        .update({ 
          kategori: artikelForm.kategori,
          judul: artikelForm.judul, 
          konten: payload, 
          gambar_url: artikelForm.gambar_url 
        })
        .eq("id", editArtikelId);
      if (error) alert("Gagal update artikel!");
    } else {
      const { error } = await supabase
        .from("identifikasi")
        .insert([{ 
          id: Date.now(), 
          kategori: artikelForm.kategori,
          judul: artikelForm.judul, 
          konten: payload, 
          gambar_url: artikelForm.gambar_url 
        }]);
      if (error) alert("Gagal mempublikasi artikel!");
    }

    setIsArtikelModalOpen(false);
    await fetchData();
  };

  const handleDeleteArtikel = async () => {
    if (!editArtikelId) return;
    if (!confirm("Yakin ingin menghapus artikel ini?")) return;
    
    setIsLoading(true);
    const supabase = createClient();
    const { error } = await supabase.from("identifikasi").delete().eq("id", editArtikelId);
    
    if (!error) {
      setIsArtikelModalOpen(false);
      await fetchData();
    }
    setIsLoading(false);
  };

  // --- FILTERING ---
  const filteredArtikel = artikelList.filter(v => 
    v.kategori?.toLowerCase() === activeKategoriFilter?.toLowerCase() &&
    v.judul?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full pb-10">
      <h1 className="text-2xl md:text-3xl font-bold text-[#145d82] mb-6 border-b pb-4">
        Admin Identifikasi Masalah Air
      </h1>

      {/* TABS */}
      <div className="flex space-x-4 mb-8">
        <button
          onClick={() => setActiveTab("kategori")}
          className={`px-6 py-3 rounded-xl font-bold transition-all shadow-sm ${
            activeTab === "kategori" ? "bg-[#145d82] text-white" : "bg-white text-[#1a5b82] border hover:bg-gray-50"
          }`}
        >
          🏷️ Kelola Kategori Air
        </button>
        <button
          onClick={() => setActiveTab("artikel")}
          className={`px-6 py-3 rounded-xl font-bold transition-all shadow-sm ${
            activeTab === "artikel" ? "bg-[#145d82] text-white" : "bg-white text-[#1a5b82] border hover:bg-gray-50"
          }`}
        >
          📝 Kelola Artikel Edukasi
        </button>
      </div>

      {isLoading && (
        <div className="text-center text-[#1a5b82] py-20 font-medium text-lg animate-pulse">Memuat data...</div>
      )}

      {/* ======================= TAB KATEGORI ======================= */}
      {!isLoading && activeTab === "kategori" && (
        <div className="animate-in fade-in duration-300">
          <div className="flex justify-between items-center bg-white border border-[#bedff2] rounded-2xl p-4 mb-8 shadow-sm">
            <p className="text-gray-500 px-4">Kelola kategori masalah air yang akan tampil di halaman utama.</p>
            <button 
              onClick={() => handleOpenKategoriModal()} 
              className="font-bold text-white bg-[#0b5478] px-6 py-3 rounded-xl hover:bg-[#08415c] shadow-md transition"
            >
              + Tambah Kategori
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {kategoriList.map(kat => (
              <div key={kat.id} className="bg-white rounded-2xl shadow-sm border border-[#e4f2fa] overflow-hidden flex flex-col group relative">
                <div className="h-40 w-full bg-gray-100">
                  <img src={kat.gambar_url} alt={kat.nama} className="w-full h-full object-cover" onError={e => (e.currentTarget.src="https://via.placeholder.com/400x300?text=No+Image")} />
                </div>
                <div className="p-4 text-center">
                  <h3 className="font-bold text-[#1a5b82] text-lg">{kat.nama}</h3>
                </div>
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleOpenKategoriModal(kat)} className="bg-white text-[#145d82] px-4 py-2 rounded-lg font-bold shadow hover:bg-gray-100">
                    Edit Kategori
                  </button>
                </div>
              </div>
            ))}
            {kategoriList.length === 0 && (
              <div className="col-span-full text-center text-gray-500 py-10 bg-white rounded-2xl border border-dashed border-gray-300">
                Belum ada kategori. Silakan tambah kategori pertama!
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================= TAB ARTIKEL ======================= */}
      {!isLoading && activeTab === "artikel" && (
        <div className="animate-in fade-in duration-300">
          {/* Filter Categories */}
          {kategoriList.length > 0 ? (
            <div className="flex flex-wrap gap-3 mb-6">
              {kategoriList.map((kat) => (
                <button
                  key={kat.id}
                  onClick={() => setActiveKategoriFilter(kat.nama)}
                  className={`px-6 py-2.5 rounded-full font-bold transition-all shadow-sm ${
                    activeKategoriFilter === kat.nama ? "bg-[#145d82] text-white" : "bg-white text-[#1a5b82] border hover:bg-gray-50"
                  }`}
                >
                  {kat.nama}
                </button>
              ))}
            </div>
          ) : (
            <div className="bg-orange-50 border border-orange-200 text-orange-800 p-4 rounded-xl mb-6 font-medium">
              ⚠️ Anda belum membuat Kategori. Silakan buat kategori terlebih dahulu di tab "Kelola Kategori".
            </div>
          )}

          {/* Search & Add Action */}
          <div className="flex flex-col md:flex-row justify-between items-center bg-white border border-[#bedff2] rounded-2xl p-4 mb-8 shadow-sm space-y-4 md:space-y-0">
            <div className="flex w-full md:w-2/3 bg-gray-50 rounded-xl px-4 py-3 items-center border border-gray-100 focus-within:border-[#8ec7e6] transition-colors">
              <input 
                type="text" 
                placeholder="Cari judul artikel..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-[#1a5b82] w-full"
              />
            </div>
            
            <button 
              onClick={() => handleOpenArtikelModal()} 
              disabled={kategoriList.length === 0}
              className="w-full md:w-auto font-bold text-white bg-[#0b5478] px-6 py-3 rounded-xl hover:bg-[#08415c] shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              + Tambah Artikel
            </button>
          </div>

          {/* Grid Content Artikel */}
          {filteredArtikel.length === 0 && kategoriList.length > 0 && (
            <div className="text-center text-gray-500 py-20 bg-white rounded-2xl border border-dashed border-gray-300">
              Belum ada artikel untuk kategori {activeKategoriFilter}.
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArtikel.map((item) => {
               let previewText = item.konten;
               try {
                 const parsed = JSON.parse(item.konten);
                 previewText = parsed.gejala || parsed.solusi || "";
               } catch (e) {}

               return (
                <div key={item.id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl border border-[#e4f2fa] overflow-hidden transition-all duration-300 flex flex-col group">
                  <div className="h-48 w-full bg-gray-200 relative overflow-hidden shrink-0">
                    <img src={item.gambar_url} alt={item.judul} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={e => (e.currentTarget.src="https://via.placeholder.com/800x400?text=No+Image")} />
                    <div className="absolute top-3 left-3 bg-[#145d82] text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                      {item.kategori}
                    </div>
                    <div className="absolute top-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleOpenArtikelModal(item)} className="bg-white/90 text-[#145d82] hover:bg-[#145d82] hover:text-white px-3 py-1.5 rounded-lg text-sm font-bold shadow-sm transition">
                        Edit Artikel
                      </button>
                    </div>
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-bold text-[#1a5b82] text-xl mb-3 line-clamp-2 leading-tight">{item.judul}</h3>
                    <p className="text-gray-500 text-sm line-clamp-3 mb-4 flex-1">{previewText}</p>
                    <div className="mt-auto">
                      <button onClick={() => handleOpenArtikelModal(item)} className="w-full py-2.5 bg-gray-50 hover:bg-[#e4f2fa] text-[#1a5b82] font-semibold border-t border-gray-100 transition">
                        Edit / Selengkapnya
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}


      {/* ======================= KATEGORI ======================= */}
      {isKategoriModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0b5478]/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md animate-in slide-in-from-bottom-4 duration-300">
            <div className="bg-[#f4f9f9] px-6 py-5 border-b border-[#cde8f6] flex justify-between items-center rounded-t-3xl">
              <h3 className="text-xl font-bold text-[#1a5b82]">
                {editKategoriId ? `Edit Kategori` : `Tambah Kategori`}
              </h3>
              <button onClick={() => setIsKategoriModalOpen(false)} className="text-[#a6ddfc] hover:text-[#1a5b82] transition bg-white rounded-full p-1">✖</button>
            </div>
            <form onSubmit={handleSaveKategori} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-bold text-[#145d82] mb-2">Nama Kategori</label>
                <input 
                  type="text" required placeholder="Contoh: Air Berbusa"
                  value={kategoriForm.nama} onChange={e => setKategoriForm({...kategoriForm, nama: e.target.value})}
                  className="w-full px-4 py-3 bg-white border border-[#bedff2] rounded-xl focus:ring-2 focus:ring-[#e4f2fa] focus:border-[#7caac4] outline-none transition" 
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#145d82] mb-2">Link Gambar Kategori (URL)</label>
                <input 
                  type="url" required placeholder="https://..."
                  value={kategoriForm.gambar_url} onChange={e => setKategoriForm({...kategoriForm, gambar_url: e.target.value})}
                  className="w-full px-4 py-3 bg-white border border-[#bedff2] rounded-xl focus:ring-2 focus:ring-[#e4f2fa] focus:border-[#7caac4] outline-none transition" 
                />
                {kategoriForm.gambar_url && (
                  <div className="mt-3 p-2 bg-gray-50 rounded-lg border inline-block">
                    <img src={kategoriForm.gambar_url} alt="Preview" className="h-16 object-contain rounded" />
                  </div>
                )}
              </div>
              <div className="pt-4 flex justify-between border-t border-gray-100">
                {editKategoriId ? (
                  <button type="button" onClick={handleDeleteKategori} className="text-red-600 font-bold px-4 py-2 hover:bg-red-50 rounded-lg">Hapus</button>
                ) : <div></div>}
                <div className="space-x-2 flex">
                  <button type="button" onClick={() => setIsKategoriModalOpen(false)} className="px-5 py-2.5 text-gray-500 font-bold hover:bg-gray-100 rounded-xl">Batal</button>
                  <button type="submit" disabled={isLoading} className="px-6 py-2.5 bg-[#145d82] text-white font-bold rounded-xl hover:bg-[#0b5478] transition">Simpan</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* ======================= ARTIKEL ======================= */}
      {isArtikelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0b5478]/40 backdrop-blur-sm p-4 h-screen">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col animate-in slide-in-from-bottom-10 duration-300">
            <div className="bg-[#f4f9f9] px-8 py-6 border-b border-[#cde8f6] flex justify-between items-center rounded-t-3xl shrink-0">
              <h3 className="text-2xl font-bold text-[#1a5b82] font-serif">
                {editArtikelId ? `Edit Artikel Identifikasi` : `Tulis Artikel Baru`}
              </h3>
              <button onClick={() => setIsArtikelModalOpen(false)} className="text-[#a6ddfc] hover:text-[#1a5b82] transition bg-white rounded-full p-1 opacity-70 hover:opacity-100">✖</button>
            </div>
            
            <form onSubmit={handleSaveArtikel} className="p-8 overflow-auto flex-1 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-[#145d82] mb-2 uppercase tracking-wider">Kategori</label>
                  <select
                    value={artikelForm.kategori}
                    onChange={e => setArtikelForm({...artikelForm, kategori: e.target.value})}
                    className="w-full px-5 py-3 bg-white border border-[#bedff2] rounded-xl focus:ring-4 focus:ring-[#e4f2fa] focus:border-[#7caac4] outline-none transition text-gray-900 text-lg shadow-sm"
                  >
                    {kategoriList.map(opt => (
                      <option key={opt.id} value={opt.nama}>{opt.nama}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#145d82] mb-2 uppercase tracking-wider">Judul Artikel</label>
                  <input 
                    type="text" required placeholder="Contoh: Mengatasi Air Lumpur"
                    value={artikelForm.judul} onChange={e => setArtikelForm({...artikelForm, judul: e.target.value})}
                    className="w-full px-5 py-3 bg-white border border-[#bedff2] rounded-xl focus:ring-4 focus:ring-[#e4f2fa] focus:border-[#7caac4] outline-none transition text-gray-900 text-lg shadow-sm" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-[#145d82] mb-2 uppercase tracking-wider">Link Gambar Artikel (URL)</label>
                <input 
                  type="url" required placeholder="https://..."
                  value={artikelForm.gambar_url} onChange={e => setArtikelForm({...artikelForm, gambar_url: e.target.value})}
                  className="w-full px-5 py-3 bg-white border border-[#bedff2] rounded-xl focus:ring-4 focus:ring-[#e4f2fa] focus:border-[#7caac4] outline-none transition text-gray-900 shadow-sm" 
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-orange-600 mb-2 uppercase tracking-wider flex items-center gap-2">
                    <span>⚠️</span> Gejala / Ciri-ciri
                  </label>
                  <textarea 
                    required rows={6} placeholder="Sebutkan ciri-ciri masalah air ini..."
                    value={artikelForm.gejala} onChange={e => setArtikelForm({...artikelForm, gejala: e.target.value})}
                    className="w-full px-5 py-4 bg-orange-50/50 border border-orange-200 rounded-xl focus:ring-4 focus:ring-orange-100 focus:border-orange-400 outline-none transition text-gray-900 shadow-sm resize-none leading-relaxed" 
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-bold text-green-600 mb-2 uppercase tracking-wider flex items-center gap-2">
                    <span>✅</span> Solusi / Penanganan
                  </label>
                  <textarea 
                    required rows={6} placeholder="Sebutkan langkah-langkah solusinya..."
                    value={artikelForm.solusi} onChange={e => setArtikelForm({...artikelForm, solusi: e.target.value})}
                    className="w-full px-5 py-4 bg-green-50/50 border border-green-200 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-400 outline-none transition text-gray-900 shadow-sm resize-none leading-relaxed" 
                  ></textarea>
                </div>
              </div>

              <div className="pt-4 flex justify-between border-t border-gray-100">
                {editArtikelId ? (
                  <button type="button" onClick={handleDeleteArtikel} className="px-6 py-3 text-red-600 font-bold hover:bg-red-50 rounded-xl transition">
                    Hapus Artikel
                  </button>
                ) : <div></div>}
                
                <div className="space-x-3 flex">
                  <button type="button" onClick={() => setIsArtikelModalOpen(false)} disabled={isLoading} className="px-6 py-3 text-gray-500 font-bold hover:bg-gray-100 rounded-xl transition disabled:opacity-50">
                    Batal
                  </button>
                  <button type="submit" disabled={isLoading} className="px-8 py-3 bg-gradient-to-r from-[#145d82] to-[#0b5478] text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition transform disabled:opacity-50">
                    {isLoading ? "Menyimpan..." : "Simpan Artikel"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}