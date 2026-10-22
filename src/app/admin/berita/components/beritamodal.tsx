import React from "react";
import { Trash2, X } from "lucide-react";

type BeritaFormData = {
  judul: string;
  kategori: string;
  status: string;
  lokasi: string;
  konten: string;
};

type Props = {
  isOpen: boolean;
  editId: number | null;
  formData: BeritaFormData;
  setFormData: (data: BeritaFormData) => void;
  onSave: (e: React.FormEvent) => void;
  onDelete: () => void;
  onClose: () => void;
};

export default function BeritaModal({
  isOpen,
  editId,
  formData,
  setFormData,
  onSave,
  onDelete,
  onClose,
}: Props) {
  if (!isOpen) return null;

  const set =
    (key: keyof BeritaFormData) =>
    (
      e:
        | React.ChangeEvent<HTMLInputElement>
        | React.ChangeEvent<HTMLTextAreaElement>
        | React.ChangeEvent<HTMLSelectElement>
    ) =>
      setFormData({
        ...formData,
        [key]: e.target.value,
      });

  return (
    <div
      className="berita-modal-overlay"
      onClick={(e) =>
        e.target === e.currentTarget && onClose()
      }
    >
      <div className="berita-modal">
        {/* HEADER */}
        <div className="berita-modal-header">
          <div>
            <p className="berita-modal-subtitle">
              {editId ? "Edit Data" : "Tambah Data"}
            </p>

            <h2 className="berita-modal-title">
              {editId
                ? "Edit Berita"
                : "Tambah Berita Baru"}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="modal-close-btn"
          >
            <X size={20} />
          </button>
        </div>

        {/* FORM */}
        <form
          onSubmit={onSave}
          className="berita-modal-form"
        >
          <div className="berita-modal-body">

            <div className="form-field">
              <label>Judul Berita</label>
              <input
                className="form-input"
                value={formData.judul}
                onChange={set("judul")}
                placeholder="Masukkan judul berita"
                required
              />
            </div>

            <div className="form-grid">
              <div className="form-field">
                <label>Kategori</label>

                <select
                  className="form-input"
                  value={formData.kategori}
                  onChange={set("kategori")}
                  required
                >
                  <option value="">
                    Pilih Kategori
                  </option>

                  <option value="Darurat">
                    Darurat
                  </option>

                  <option value="Bencana">
                    Bencana
                  </option>

                  <option value="Berita">
                    Berita
                  </option>
                </select>
              </div>

              <div className="form-field">
                <label>Status</label>

                <select
                  className="form-input"
                  value={formData.status}
                  onChange={set("status")}
                  required
                >
                  <option value="">
                    Pilih Status
                  </option>

                  <option value="Aktif">
                    Aktif
                  </option>

                  <option value="Tidak Aktif">
                    Tidak Aktif
                  </option>
                </select>
              </div>
            </div>

            <div className="form-field">
              <label>Lokasi</label>

              <input
                className="form-input"
                value={formData.lokasi}
                onChange={set("lokasi")}
                placeholder="Contoh: Karawang, Jawa Barat"
              />
            </div>

            <div className="form-field">
              <label>Isi Berita</label>

              <textarea
                className="form-textarea"
                value={formData.konten}
                onChange={set("konten")}
                placeholder="Tulis isi berita di sini..."
                required
              />
            </div>
          </div>

          {/* FOOTER */}
          <div className="berita-modal-footer">

            {editId && (
              <button
                type="button"
                onClick={onDelete}
                className="btn-delete"
              >
                <Trash2 size={16} />
                Hapus Berita
              </button>
            )}

            <div className="footer-actions">
              <button
                type="button"
                onClick={onClose}
                className="btn-cancel"
              >
                Batal
              </button>

              <button
                type="submit"
                className="btn-save"
              >
                Simpan Perubahan
              </button>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
}