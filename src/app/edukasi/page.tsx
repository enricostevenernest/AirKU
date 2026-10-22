"use client";

import { useState, useMemo, useEffect } from "react";
import { createClient } from "../lib/supabase";
import { useRouter } from "next/navigation";
import "./page.css";

type Edukasi = {
  id: number;
  judul: string;
  konten: string;
  gambar_url: string;
  kategori: string;
};

export default function EdukasiPage() {
  const router = useRouter();

  const [data, setData] = useState<Edukasi[]>([]);
  const [search, setSearch] = useState("");
  const [selectedKategori, setSelectedKategori] = useState("Semua");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState<Edukasi | null>(null);

  const [favorites, setFavorites] = useState<number[]>([]);
  const [showFavorites, setShowFavorites] = useState(false);

  useEffect(() => {
    const savedFavs = localStorage.getItem("fav_edukasi");
    if (savedFavs) {
      setFavorites(JSON.parse(savedFavs));
    }
  }, []);

  const stripHtml = (html: string) => {
    if (!html) return "";

    if (typeof window === "undefined") {
      return html.replace(/<[^>]*>/g, "");
    }

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || "";
  };

  const cleanArticleHtml = (html: string) => {
    if (!html) return "";

    return html
      .replace(/style="[^"]*color\s*:\s*[^;"]+;?[^"]*"/gi, "")
      .replace(/style='[^']*color\s*:\s*[^;']+;?[^']*'/gi, "");
  };

  const truncateText = (text: string, maxLength: number) => {
    const cleanText = stripHtml(text);

    if (cleanText.length <= maxLength) return cleanText;

    return cleanText.substring(0, maxLength) + "...";
  };

  const toggleFavorite = (id: number) => {
    setFavorites((prev) => {
      const newFavs = prev.includes(id)
        ? prev.filter((favId) => favId !== id)
        : [...prev, id];

      localStorage.setItem("fav_edukasi", JSON.stringify(newFavs));

      return newFavs;
    });
  };

  const isFavorite = (id: number) => favorites.includes(id);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      const supabase = createClient();

      const { data, error } = await supabase
        .from("edukasi")
        .select("*")
        .order("id", { ascending: false });

      if (error) {
        console.error(error);
        setData([]);
      } else {
        setData(data || []);
      }

      setIsLoading(false);
    };

    fetchData();
  }, []);

  const categories = useMemo(() => {
    const unique = Array.from(
      new Set(data.map((item) => item.kategori).filter(Boolean))
    );

    return ["Semua", ...unique];
  }, [data]);

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const cleanKonten = stripHtml(item.konten);

      const matchSearch =
        item.judul.toLowerCase().includes(search.toLowerCase()) ||
        cleanKonten.toLowerCase().includes(search.toLowerCase());

      const matchKategori =
        selectedKategori === "Semua" || item.kategori === selectedKategori;

      const matchFavorite = showFavorites ? isFavorite(item.id) : true;

      return matchSearch && matchKategori && matchFavorite;
    });
  }, [search, selectedKategori, data, showFavorites, favorites]);

  return (
    <div className="edukasi-page edukasi-light">
      <div className="edukasi-container">
        <div className="edukasi-header">
          <button onClick={() => router.back()} className="back-button">
            ← Kembali ke Dashboard
          </button>

          <h1 className="edukasi-title">Edukasi Air 💧</h1>
        </div>

        {selectedArticle ? (
          <div className="article-detail">
            <button
              onClick={() => setSelectedArticle(null)}
              className="article-back"
            >
              ← Kembali ke Artikel
            </button>

            <h2 className="article-title">{selectedArticle.judul}</h2>

            {selectedArticle.kategori && (
              <div className="article-category">
                {selectedArticle.kategori}
              </div>
            )}

            {selectedArticle.gambar_url && (
              <img
                src={selectedArticle.gambar_url}
                alt={selectedArticle.judul}
                className="article-image"
              />
            )}

            <div
              className="article-content"
              dangerouslySetInnerHTML={{
                __html: cleanArticleHtml(selectedArticle.konten),
              }}
            />
          </div>
        ) : (
          <>
            <div className="search-wrapper">
              <div className="search-box">
                <input
                  type="text"
                  placeholder="Cari solusi masalah air..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="search-input"
                />

                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="search-clear"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            <div className="filter-row">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedKategori(cat)}
                  className={`category-button ${
                    selectedKategori === cat ? "active" : ""
                  }`}
                >
                  {cat}
                </button>
              ))}

              <div className="filter-spacer" />

              <button
                onClick={() => setShowFavorites(!showFavorites)}
                className={`favorite-toggle ${
                  showFavorites ? "active" : "inactive"
                }`}
              >
                {showFavorites ? "⭐ Favorit Aktif" : "☆ Favorit"}
              </button>
            </div>

            {isLoading ? (
              <div className="loading-text">Loading...</div>
            ) : filteredData.length === 0 ? (
              <div className="empty-state">
                <p>
                  {showFavorites
                    ? "Belum ada favorit"
                    : "Tidak ada hasil ditemukan"}
                </p>
              </div>
            ) : (
              <div className="edukasi-grid">
                {filteredData.map((item) => (
                  <div key={item.id} className="edukasi-card">
                    <button
                      onClick={() => toggleFavorite(item.id)}
                      className="favorite-button"
                      title={
                        isFavorite(item.id)
                          ? "Hapus dari Favorit"
                          : "Tambah ke Favorit"
                      }
                    >
                      {isFavorite(item.id) ? "⭐" : "☆"}
                    </button>

                    {item.gambar_url && (
                      <img
                        src={item.gambar_url}
                        alt={item.judul}
                        className="card-image"
                      />
                    )}

                    <div className="card-content">
                      {item.kategori && (
                        <div className="card-category">{item.kategori}</div>
                      )}

                      <h3 className="card-title">{item.judul}</h3>

                      <p className="card-description">
                        {truncateText(item.konten, 100)}
                      </p>

                      <button
                        onClick={() => setSelectedArticle(item)}
                        className="card-readmore"
                      >
                        Baca Selengkapnya →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}