"use client";

import React, { useEffect, useRef, useState } from "react";
import { createClient } from "../../lib/supabase";
import { useRouter } from "next/navigation";
import "./page.css";

type Edukasi = {
  id: number;
  judul: string;
  konten: string;
  gambar_url: string;
  kategori: string;
};

const BUCKET_NAME = "edukasi_bucket";

const KATEGORI_OPTIONS = [
  "Kelayakan Air",
  "Perawatan",
  "Kesehatan",
  "Teknologi",
];

export default function EdukasiAdmin() {
  const router = useRouter();
  const editorRef = useRef<HTMLDivElement>(null);

  const [artikelList, setArtikelList] = useState<Edukasi[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedKategori, setSelectedKategori] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    judul: "",
    konten: "",
    gambar_url: "",
    kategori: "",
  });

  const [file, setFile] = useState<File | null>(null);

  const resetForm = () => {
    setFormData({
      judul: "",
      konten: "",
      gambar_url: "",
      kategori: "",
    });
    setFile(null);
    setEditId(null);
  };

  const fetchEdukasi = async () => {
    const supabase = createClient();
    setIsLoading(true);

    const { data, error } = await supabase
      .from("edukasi")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.error(error);
      setArtikelList([]);
    } else {
      setArtikelList(data || []);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    fetchEdukasi();
  }, []);

  useEffect(() => {
    if (isModalOpen && editorRef.current) {
      editorRef.current.innerHTML = formData.konten || "";
    }
  }, [isModalOpen, formData.konten]);

  const handleBack = () => {
    router.back();
  };

  const handleOpenModal = (item?: Edukasi) => {
    if (item) {
      setEditId(item.id);
      setFormData({
        judul: item.judul,
        konten: item.konten || "",
        gambar_url: item.gambar_url,
        kategori: item.kategori || "",
      });
    } else {
      resetForm();
    }

    setFile(null);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    if (confirm("Yakin ingin membatalkan?")) {
      setIsModalOpen(false);
      resetForm();
    }
  };

  const handleRemoveImage = () => {
    setFile(null);
    setFormData((prev) => ({
      ...prev,
      gambar_url: "",
    }));
  };

  const handleEditorInput = () => {
    if (!editorRef.current) return;

    setFormData((prev) => ({
      ...prev,
      konten: editorRef.current?.innerHTML || "",
    }));
  };

  const handleEditorCommand = (command: string, value?: string) => {
    if (!editorRef.current) return;

    editorRef.current.focus();
    document.execCommand(command, false, value || "");

    setFormData((prev) => ({
      ...prev,
      konten: editorRef.current?.innerHTML || "",
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const supabase = createClient();
    let imageUrl = formData.gambar_url;
    const editorContent = editorRef.current?.innerHTML || "";

    if (!formData.judul.trim()) {
      alert("Judul wajib diisi");
      return;
    }

    if (!formData.kategori.trim()) {
      alert("Kategori wajib dipilih");
      return;
    }

    if (!editorContent.trim()) {
      alert("Konten wajib diisi");
      return;
    }

    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("File harus berupa gambar");
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        alert("Ukuran maksimal gambar adalah 2MB");
        return;
      }

      const fileExt = file.name.split(".").pop();
      const fileName = `edukasi-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        console.error(uploadError);
        alert("Upload gambar gagal");
        return;
      }

      const { data } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(fileName);

      imageUrl = data.publicUrl;
    }

    if (!imageUrl) {
      alert("Masukkan URL gambar atau upload file dari local");
      return;
    }

    const payload = {
      judul: formData.judul,
      konten: editorContent,
      gambar_url: imageUrl,
      kategori: formData.kategori,
    };

    if (editId) {
      const { error } = await supabase
        .from("edukasi")
        .update(payload)
        .eq("id", editId);

      if (error) {
        console.error(error);
        alert("Gagal memperbarui artikel");
        return;
      }
    } else {
      const { error } = await supabase.from("edukasi").insert([
        {
          id: Date.now(),
          ...payload,
        },
      ]);

      if (error) {
        console.error(error);
        alert("Gagal menambahkan artikel");
        return;
      }
    }

    setIsModalOpen(false);
    resetForm();
    fetchEdukasi();
  };

  const handleDelete = async () => {
    if (!editId) return;
    if (!confirm("Yakin ingin menghapus artikel ini?")) return;

    const supabase = createClient();

    const { error } = await supabase.from("edukasi").delete().eq("id", editId);

    if (error) {
      console.error(error);
      alert("Gagal menghapus artikel");
      return;
    }

    setIsModalOpen(false);
    resetForm();
    fetchEdukasi();
  };

  const filteredData = artikelList.filter((item) => {
    const query = searchQuery.toLowerCase();

    const matchSearch =
      item.judul.toLowerCase().includes(query) ||
      item.konten.toLowerCase().includes(query);

    const matchKategori =
      selectedKategori === "" || item.kategori === selectedKategori;

    return matchSearch && matchKategori;
  });

  return (
    <div className="admin-edukasi-page">
      <div className="admin-edukasi-container">
        <button onClick={handleBack} className="admin-back-button">
          ← Kembali
        </button>

        <h1 className="admin-edukasi-title">Edukasi Teknis</h1>

        <div className="admin-action-row">
          <input
            type="text"
            placeholder="Cari artikel..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="admin-search-input"
          />

          <select
            value={selectedKategori}
            onChange={(e) => setSelectedKategori(e.target.value)}
            className="admin-search-input"
          >
            <option value="">Semua Kategori</option>
            {KATEGORI_OPTIONS.map((kategori) => (
              <option key={kategori} value={kategori}>
                {kategori}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => handleOpenModal()}
            className="admin-add-button"
          >
            + Tambah
          </button>
        </div>

        {isLoading ? (
          <p className="admin-loading">Loading...</p>
        ) : filteredData.length === 0 ? (
          <div className="admin-empty-state">
            <p>Artikel tidak ditemukan.</p>
          </div>
        ) : (
          <div className="admin-list">
            {filteredData.map((item) => (
              <div key={item.id} className="admin-card">
                <img
                  src={item.gambar_url}
                  alt={item.judul}
                  className="admin-card-image"
                />

                <div className="admin-card-content">
                  <h2 className="admin-card-title">{item.judul}</h2>

                  <p className="admin-card-category">{item.kategori}</p>

                  <div
                    className="admin-card-text"
                    dangerouslySetInnerHTML={{ __html: item.konten }}
                  />
                </div>

                <button
                  type="button"
                  onClick={() => handleOpenModal(item)}
                  className="admin-edit-button"
                >
                  ✏️
                </button>
              </div>
            ))}
          </div>
        )}

        {isModalOpen && (
          <div className="admin-modal-overlay">
            <div className="admin-modal">
              <form onSubmit={handleSave} className="admin-form">
                <h2 className="admin-modal-title">
                  {editId ? "Edit Artikel" : "Tambah Artikel"}
                </h2>

                <input
                  type="text"
                  placeholder="Judul artikel"
                  value={formData.judul}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      judul: e.target.value,
                    }))
                  }
                  className="admin-form-input"
                />

                <select
                  value={formData.kategori}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      kategori: e.target.value,
                    }))
                  }
                  className="admin-form-input"
                >
                  <option value="">Pilih Kategori</option>
                  {KATEGORI_OPTIONS.map((kategori) => (
                    <option key={kategori} value={kategori}>
                      {kategori}
                    </option>
                  ))}
                </select>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="admin-file-input"
                />

                <input
                  type="text"
                  placeholder="Atau masukkan URL gambar"
                  value={formData.gambar_url}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      gambar_url: e.target.value,
                    }))
                  }
                  className="admin-form-input"
                />

                {(file || formData.gambar_url) && (
                  <div className="admin-preview">
                    <img
                      src={
                        file
                          ? URL.createObjectURL(file)
                          : formData.gambar_url
                      }
                      alt="Preview gambar"
                      className="admin-preview-image"
                    />

                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="admin-remove-image"
                    >
                      ✕
                    </button>
                  </div>
                )}

                <div className="editor-wrapper">
                  <div className="editor-toolbar">
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => handleEditorCommand("bold")}
                    >
                      <b>B</b>
                    </button>

                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => handleEditorCommand("italic")}
                    >
                      <i>I</i>
                    </button>

                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => handleEditorCommand("underline")}
                    >
                      <u>U</u>
                    </button>

                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => handleEditorCommand("justifyLeft")}
                    >
                      ⬅
                    </button>

                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => handleEditorCommand("justifyCenter")}
                    >
                      ↔
                    </button>

                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => handleEditorCommand("justifyRight")}
                    >
                      ➡
                    </button>

                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => handleEditorCommand("justifyFull")}
                    >
                      ☰
                    </button>

                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() =>
                        handleEditorCommand("insertUnorderedList")
                      }
                    >
                      • List
                    </button>

                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => handleEditorCommand("insertOrderedList")}
                    >
                      1. List
                    </button>

                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => handleEditorCommand("formatBlock", "h2")}
                    >
                      H2
                    </button>

                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => handleEditorCommand("formatBlock", "p")}
                    >
                      P
                    </button>
                  </div>

                  <div
                    ref={editorRef}
                    className="rich-editor"
                    contentEditable
                    suppressContentEditableWarning
                    onInput={handleEditorInput}
                    data-placeholder="Tulis isi artikel di sini..."
                    dir="ltr"
                  />
                </div>

                <div className="admin-button-row">
                  {editId && (
                    <button
                      type="button"
                      onClick={handleDelete}
                      className="admin-delete-button"
                    >
                      Hapus
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={handleCancel}
                    className="admin-cancel-button"
                  >
                    Batal
                  </button>

                  <button type="submit" className="admin-save-button">
                    Simpan
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