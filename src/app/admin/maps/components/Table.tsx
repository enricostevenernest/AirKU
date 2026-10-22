"use client";

import { LokasiAirBersih, STATUS_CONFIG, TIPE_CONFIG } from "@/types/lokasi_air";

interface LocationTableProps {
  locations: LokasiAirBersih[];
  onEdit: (location: LokasiAirBersih) => void;
  onDelete: (location: LokasiAirBersih) => void;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function LocationTable({ locations, onEdit, onDelete }: LocationTableProps) {
  if (locations.length === 0) {
    return (
      <div className="empty-table">
        <span className="empty-icon">🗺️</span>
        <p>Belum ada data lokasi air bersih</p>
        <p className="empty-hint">Klik "Tambah Lokasi Baru" untuk memulai</p>
      </div>
    );
  }

  return (
    <div className="table-wrapper">
      <table className="location-table">
        <thead>
          <tr>
            <th>No</th>
            <th>Nama Lokasi</th>
            <th>Alamat</th>
            <th>Koordinat</th>
            <th>Tipe</th>
            <th>Status</th>
            <th>Kapasitas</th>
            <th>Terakhir Update</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {locations.map((location, index) => {
            const statusConfig = STATUS_CONFIG[location.status];
            const tipeConfig = location.tipe ? TIPE_CONFIG[location.tipe] : null;
            
            return (
              <tr key={location.id}>
                <td>{index + 1}</td>
                <td className="location-name">{location.nama_lokasi}</td>
                <td className="location-address">{location.alamat || "-"}</td>
                <td className="location-coord">
                  <span className="coord">{location.latitude.toFixed(6)}</span>
                  <span className="coord-sep">,</span>
                  <span className="coord">{location.longitude.toFixed(6)}</span>
                </td>
                <td>
                  {tipeConfig && (
                    <span className="tipe-badge">
                      {tipeConfig.icon} {tipeConfig.label}
                    </span>
                  )}
                </td>
                <td>
                  <span 
                    className="status-badge"
                    style={{ background: statusConfig.bg, color: statusConfig.color }}
                  >
                    {statusConfig.icon} {statusConfig.label}
                  </span>
                </td>
                <td>{location.kapasitas || "-"}</td>
                <td>{formatDate(location.updated_at)}</td>
                <td className="action-buttons">
                  <button
                    className="action-btn edit-btn"
                    onClick={() => onEdit(location)}
                    title="Edit lokasi"
                  >
                    ✏️
                  </button>
                  <button
                    className="action-btn delete-btn"
                    onClick={() => onDelete(location)}
                    title="Hapus lokasi"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

