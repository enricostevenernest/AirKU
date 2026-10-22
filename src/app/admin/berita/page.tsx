"use client";

import "./Berita.css";

import React, { useEffect, useState } from "react";
import { createClient } from "../../lib/supabase";
import { Search, Newspaper, Plus } from "lucide-react";

import BeritaCard from "./components/beritacard";
import BeritaModal from "./components/beritamodal";
import DetailModal from "./components/detailmodal";
import SkeletonCard from "./components/skeletoncard";

const supabase = createClient();

export type Berita = {
  id: number;
  judul: string;
  konten: string;
  kategori: string;
  lokasi: string;
  status: string;
};

type FormData = Omit<Berita, "id">;

const EMPTY_FORM: FormData = {
  judul: "",
  konten: "",
  kategori: "",
  lokasi: "",
  status: "",
};

export default function BeritaAdmin() {
  const [dataList, setDataList] = useState<Berita[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedKategori, setSelectedKategori] =
    useState("Semua");

  const [isModalOpen, setIsModalOpen] =
    useState(false);

  const [editId, setEditId] =
    useState<number | null>(null);

  const [selectedBerita, setSelectedBerita] =
    useState<Berita | null>(null);

  const [formData, setFormData] =
    useState<FormData>(EMPTY_FORM);

  const kategoriList = [
    "Semua",
    "Darurat",
    "Bencana",
    "Berita",
  ];

  const getBerita = async (): Promise<Berita[]> => {
    const { data, error } = await supabase
      .from("berita")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.error(error.message);
      return [];
    }

    return data as Berita[];
  };

  const fetchData = async () => {
    setIsLoading(true);

    const result = await getBerita();

    setDataList(result);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenModal = (item?: Berita) => {
    if (item) {
      setEditId(item.id);

      setFormData({
        judul: item.judul,
        konten: item.konten,
        kategori: item.kategori,
        lokasi: item.lokasi,
        status: item.status,
      });
    } else {
      setEditId(null);
      setFormData(EMPTY_FORM);
    }

    setIsModalOpen(true);
  };

  const handleSave = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setIsLoading(true);

    const { error } = editId
      ? await supabase
          .from("berita")
          .update(formData)
          .eq("id", editId)
      : await supabase
          .from("berita")
          .insert([formData]);

    if (error) {
      alert(error.message);
      setIsLoading(false);
      return;
    }

    setIsModalOpen(false);

    await fetchData();
  };

  const handleDelete = async () => {
    if (
      !editId ||
      !confirm("Yakin hapus berita ini?")
    )
      return;

    const { error } = await supabase
      .from("berita")
      .delete()
      .eq("id", editId);

    if (error) {
      alert(error.message);
      return;
    }

    setIsModalOpen(false);

    await fetchData();
  };

  const filtered = dataList.filter((item) => {
    const matchSearch = item.judul
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchKategori =
      selectedKategori === "Semua" ||
      item.kategori === selectedKategori;

    return matchSearch && matchKategori;
  });

  return (
    <div className="berita-page">
      <div className="berita-container">

        <div className="page-header">
          <p className="page-subtitle">
            Admin
          </p>

          <h1 className="page-title">
            Kelola Berita
          </h1>

          <p className="page-description">
            Tambah, edit, dan kelola data berita
          </p>
        </div>

        <div className="toolbar">
          <div className="toolbar-row">

            <div className="search-box">
              <Search size={16} />

              <input
                type="text"
                placeholder="Cari judul berita..."
                value={searchQuery}
                onChange={(e) =>
                  setSearchQuery(
                    e.target.value
                  )
                }
              />
            </div>

            <button
              className="btn-primary"
              onClick={() =>
                handleOpenModal()
              }
            >
              <Plus size={16} />
              Tambah
            </button>

          </div>
        </div>

        <div className="kategori-filter">
          {kategoriList.map((kategori) => (
            <button
              key={kategori}
              onClick={() =>
                setSelectedKategori(
                  kategori
                )
              }
              className={`kategori-btn ${
                selectedKategori ===
                kategori
                  ? "active"
                  : ""
              }`}
            >
              {kategori}
            </button>
          ))}
        </div>

        {!isLoading &&
          filtered.length > 0 && (
            <div className="count-row">
              <Newspaper size={14} />
              <span>
                {filtered.length} berita
              </span>
            </div>
          )}

        {isLoading ? (
          <div className="berita-grid">
            {[1, 2, 3, 4, 5, 6].map(
              (item) => (
                <SkeletonCard
                  key={item}
                />
              )
            )}
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <Newspaper size={40} />
            <p>
              {searchQuery
                ? "Tidak ada berita yang cocok."
                : "Belum ada berita."}
            </p>
          </div>
        ) : (
          <div className="berita-grid">
            {filtered.map((item) => (
              <BeritaCard
                key={item.id}
                item={item}
                onEdit={handleOpenModal}
                onView={setSelectedBerita}
              />
            ))}
          </div>
        )}

        <BeritaModal
          isOpen={isModalOpen}
          editId={editId}
          formData={formData}
          setFormData={setFormData}
          onSave={handleSave}
          onDelete={handleDelete}
          onClose={() =>
            setIsModalOpen(false)
          }
        />

        <DetailModal
          berita={selectedBerita}
          onClose={() =>
            setSelectedBerita(null)
          }
        />

      </div>
    </div>
  );
}