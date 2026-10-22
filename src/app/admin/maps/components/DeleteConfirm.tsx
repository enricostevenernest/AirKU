'use client';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  locationName: string;
}

export default function DeleteConfirmModal({ isOpen, onClose, onConfirm, locationName }: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="delete-modal-overlay" onClick={onClose}>
      <div
        className="delete-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="delete-modal-content">
          <div className="delete-icon-wrapper">
            <span className="delete-icon">🗑️</span>
          </div>

          <h3 className="delete-title">Konfirmasi Hapus</h3>
          <p className="delete-message">
            Apakah Anda yakin ingin menghapus lokasi <strong>{locationName}</strong>? 
          </p>

          <p className="delete-warning">Data yang dihapus tidak dapat dikembalikan.</p>

        </div>

        <div className="delete-actions">
          <button
            onClick={onClose}
            className="delete-cancel-btn"
          >
            Batal
          </button>

          <button
            onClick={onConfirm}
            className="delete-confirm-btn"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
}