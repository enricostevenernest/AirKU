"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "../lib/supabase";
import styles from "./BeritaUser.module.css";

const supabase = createClient();

type Berita = {
  id: number;
  judul: string;
  konten: string;
  kategori: string;
  lokasi: string;
  status: string;
  created_at?: string;
};

async function getBeritaAktif(): Promise<Berita[]> {
  const { data, error } = await supabase
    .from("berita")
    .select("*")
    .eq("status", "Aktif")
    .order("id", { ascending: false });

  if (error) {
    console.error("Error fetch berita:", error.message);
    return [];
  }
  return data as Berita[];
}

async function getBeritaById(id: number): Promise<Berita | null> {
  const { data, error } = await supabase
    .from("berita")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetch detail berita:", error.message);
    return null;
  }
  return data as Berita;
}

export default function UserBeritaPage() {
  const [beritaList, setBeritaList] = useState<Berita[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBerita, setSelectedBerita] = useState<Berita | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  // TAMBAHAN FITUR 1: state untuk filter kategori
  const [kategoriFilter, setKategoriFilter] = useState("Semua"); 

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const data = await getBeritaAktif();
      setBeritaList(data);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const handleOpenDetail = async (id: number) => {
    setIsDetailLoading(true);
    const berita = await getBeritaById(id);
    if (berita) {
      setSelectedBerita(berita);
    } else {
      alert("Berita tidak ditemukan");
    }
    setIsDetailLoading(false);
  };

  const handleCloseDetail = () => {
    setSelectedBerita(null);
  };

  // TAMBAHAN FITUR 1: filter berdasarkan kategori dan judul
  const filteredBerita = beritaList.filter((item) => {
    const matchJudul = item.judul.toLowerCase().includes(searchQuery.toLowerCase());
    const matchKategori = kategoriFilter === "Semua" ? true : item.kategori === kategoriFilter;
    return matchJudul && matchKategori;
  });

  const getCategoryClass = (kategori: string) => {
    if (kategori === "Darurat") return styles.categoryDarurat;
    if (kategori === "Bencana") return styles.categoryBencana;
    return styles.categoryBerita;
  };

  // TAMPILAN LIST BERITA
  if (selectedBerita === null) {
    return (
      <div className={styles.container}>
        <div className={styles.inner}>
          <div className={styles.header}>
            <h1 className={styles.title}>Berita Terkini</h1>
            <p className={styles.subtitle}>
              Informasi terbaru seputar bencana, darurat, dan kegiatan sosial
            </p>
          </div>

          <div className={styles.searchWrapper}>
            <input
              type="text"
              placeholder="Cari judul berita..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          {/* TAMBAHAN FITUR 1: Tombol filter kategori */}
          <div className={styles.filterWrapper}>
            <button
              className={`${styles.filterButton} ${kategoriFilter === "Semua" ? styles.filterActive : ""}`}
              onClick={() => setKategoriFilter("Semua")}
            >
              Semua
            </button>
            <button
              className={`${styles.filterButton} ${kategoriFilter === "Darurat" ? styles.filterActive : ""}`}
              onClick={() => setKategoriFilter("Darurat")}
            >
              Darurat
            </button>
            <button
              className={`${styles.filterButton} ${kategoriFilter === "Bencana" ? styles.filterActive : ""}`}
              onClick={() => setKategoriFilter("Bencana")}
            >
              Bencana
            </button>
            <button
              className={`${styles.filterButton} ${kategoriFilter === "Berita" ? styles.filterActive : ""}`}
              onClick={() => setKategoriFilter("Berita")}
            >
              Berita Umum
            </button>
          </div>          

          {isLoading ? (
            <div className={styles.loadingState}>Memuat berita...</div>
          ) : filteredBerita.length === 0 ? (
            <div className={styles.emptyState}>
              {searchQuery ? "Berita tidak ditemukan" : "Belum ada berita"}
            </div>
          ) : (
            <div className={styles.grid}>
              {filteredBerita.map((item) => (
                <div
                  key={item.id}
                  className={styles.card}
                  onClick={() => handleOpenDetail(item.id)}
                >
                  <div>
                    <span
                      className={`${styles.categoryBadge} ${getCategoryClass(
                        item.kategori
                      )}`}
                    >
                      {item.kategori}
                    </span>
                  </div>
                  <h2 className={styles.cardTitle}>{item.judul}</h2>
                  {item.lokasi && (
                    <div className={styles.location}>
                      <span>📍</span> {item.lokasi}
                    </div>
                  )}
                  <p className={styles.preview}>{item.konten}</p>
                  <div className={styles.readMore}>
                    Baca selengkapnya →
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // TAMPILAN DETAIL BERITA
  return (
    <div className={styles.detailContainer}>
      <div className={styles.detailInner}>
        <button onClick={handleCloseDetail} className={styles.backButton}>
          ← Kembali ke daftar berita
        </button>

        {isDetailLoading ? (
          <div className={styles.loadingState}>Memuat detail berita...</div>
        ) : (
          <article className={styles.detailCard}>
            <div className={styles.detailCategory}>
              <span
                className={`${styles.categoryBadge} ${getCategoryClass(
                  selectedBerita.kategori
                )}`}
              >
                {selectedBerita.kategori}
              </span>
            </div>
            <h1 className={styles.detailTitle}>{selectedBerita.judul}</h1>
            <div className={styles.detailMeta}>
              {selectedBerita.lokasi && (
                <div>📍 {selectedBerita.lokasi}</div>
              )}
              {selectedBerita.created_at && (
                <div>
                  📅{" "}
                  {new Date(selectedBerita.created_at).toLocaleDateString(
                    "id-ID",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </div>
              )}
            </div>
            <div className={styles.detailContent}>
              {selectedBerita.konten}
            </div>
          </article>
        )}
      </div>
    </div>
  );
}