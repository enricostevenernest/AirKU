"use client";

import {
  ArrowLeft,
  Droplets,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import {
  getArtikelById,
} from "../services/identifikasiServices";

import DetailSkeleton from "./detailSkeleton";

import {
  Identifikasi,
} from "../types/identifikasi";

type Props = {
  id: number;
  onBack: () => void;
};

export default function DetailView({
  id,
  onBack,
}: Props) {
  const [
    artikel,
    setArtikel,
  ] =
    useState<Identifikasi | null>(
      null
    );

  useEffect(() => {
    setArtikel(null);

    getArtikelById(id).then(
      setArtikel
    );
  }, [id]);

  return (
    <div className="detail-page">

      <div className="detail-container">

        <button
          className="back-button"
          onClick={onBack}
        >
          <ArrowLeft size={15} />
          Kembali
        </button>

        {!artikel ? (
          <DetailSkeleton />
        ) : (
          <div className="detail-card">

            <div className="detail-image">
              <img
                src={
                  artikel.gambar_url ||
                  "/no-image.png"
                }
                alt={
                  artikel.judul
                }
              />

              <span className="detail-category">

                <Droplets
                  size={11}
                />

                {
                  artikel.kategori
                }

              </span>
            </div>

            <div className="detail-body">

              <p className="detail-subtitle">
                Artikel Edukasi Air
              </p>

              <h1 className="detail-title">
                {artikel.judul}
              </h1>

              <div className="detail-divider" />

              <div className="detail-content">
                {artikel.konten}
              </div>

            </div>

          </div>
        )}

      </div>

    </div>
  );
}