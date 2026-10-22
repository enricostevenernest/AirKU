"use client";

import "./Identifikasi.css";

import { useState } from "react";

import useIdentifikasi from "./hooks/useIdentifikasi";

import SearchBar from "./components/searchBar";
import KategoriList from "./components/kategoriList";
import ArtikelList from "./components/artikelList";
import DetailView from "./components/detailView";

export default function IdentifikasiPage() {
  const [selectedId, setSelectedId] =
    useState<number | null>(null);

  const {
    kategori,
    artikel,
    selectedKategori,
    pilihKategori,
    keyword,
    setKeyword,
    handleSearch,
    loading,
  } = useIdentifikasi();

  // ============================================
  // DETAIL PAGE
  // ============================================

  if (selectedId !== null) {
    return (
      <DetailView
        id={selectedId}
        onBack={() =>
          setSelectedId(null)
        }
      />
    );
  }

  // ============================================
  // LIST PAGE
  // ============================================

  return (
    <div className="identifikasi-page">
      <div className="identifikasi-container">

        {/* HEADER */}

        <div className="page-header">

          <p className="page-subtitle">
            FITUR
          </p>

          <h1 className="page-title">
            Identifikasi Masalah Air
          </h1>

          <p className="page-description">
            Temukan artikel edukasi,
            penyebab, dan solusi terkait
            kualitas air.
          </p>

        </div>

        {/* SEARCH + FILTER */}

        <div className="filter-card">

          <SearchBar
  keyword={keyword}
  setKeyword={setKeyword}
  onSearch={handleSearch}
/>

<KategoriList
  kategori={kategori}
  selected={selectedKategori}
  onSelect={pilihKategori}
/>

        </div>

        {/* LIST ARTIKEL */}

        <ArtikelList
          artikel={artikel}
          total={artikel.length}
          loading={loading}
          onSelect={(id) =>
            setSelectedId(id)
          }
        />

      </div>
    </div>
  );
}