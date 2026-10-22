"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

export default function PanduanPage() {
  const [search, setSearch] = useState("");

  const panduanList = [
    {
      fitur: "Dashboard",
      title: "🏠 Dashboard",
      category: "Utama",
      color: "#d0eaf8",
      desc: [
        "Masuk ke halaman Dashboard AIR KU.",
        "Lihat jumlah berita, edukasi, sumber air, dan vendor yang tersedia.",
        "Cek pengingat perawatan yang sedang aktif.",
        "Baca rekomendasi edukasi terbaru.",
        "Gunakan menu navigasi untuk membuka fitur lainnya.",
      ],
      link: "/",
    },

    {
      fitur: "Berita Terkini",
      title: "📰 Berita Terkini",
      category: "Informasi",
      color: "#ffe4e6",
      desc: [
        "Masuk ke menu Berita Terkini.",
        "Lihat berita terbaru terkait air bersih dan lingkungan.",
        "Pilih kategori berita yang ingin dibaca.",
        "Baca isi berita secara lengkap.",
        "Gunakan informasi berita sebagai referensi tambahan.",
      ],
      link: "/berita",
    },

    {
      fitur: "Edukasi Teknis",
      title: "📚 Edukasi Teknis",
      category: "Pembelajaran",
      color: "#d0eaf8",
      desc: [
        "Masuk ke menu Edukasi Teknis.",
        "Cari artikel menggunakan kolom pencarian.",
        "Gunakan filter kategori edukasi.",
        "Tambahkan artikel ke favorit jika diperlukan.",
        "Klik tombol Baca Selengkapnya untuk melihat isi artikel lengkap.",
      ],
      link: "/edukasi",
    },

    {
      fitur: "Identifikasi Masalah Air",
      title: "🔍 Identifikasi Masalah Air",
      category: "Diagnosa",
      color: "#fff3cd",
      desc: [
        "Masuk ke menu Identifikasi Masalah Air.",
        "Gunakan kolom pencarian untuk mencari masalah air.",
        "Pilih kategori permasalahan air yang tersedia.",
        "Lihat daftar artikel solusi dan penanganan.",
        "Pelajari solusi sesuai kondisi air yang dialami.",
      ],
      link: "/identifikasi",
    },

    {
      fitur: "Visualisasi Sumber Air",
      title: "🗺 Visualisasi Sumber Air",
      category: "Lokasi",
      color: "#d4edda",
      desc: [
        "Masuk ke menu Visualisasi Sumber Air.",
        "Lihat persebaran sumber air pada peta.",
        "Klik marker lokasi yang tersedia.",
        "Lihat detail informasi sumber air.",
        "Gunakan data lokasi sebagai referensi kebutuhan air.",
      ],
      link: "/maps",
    },

    {
      fitur: "Pengingat Perawatan",
      title: "🛠 Pengingat Perawatan",
      category: "Perawatan",
      color: "#fde8e8",
      desc: [
        "Masuk ke menu Pengingat Perawatan.",
        "Tambahkan jadwal maintenance baru.",
        "Pilih jenis dan frekuensi perawatan.",
        "Edit, tandai selesai, atau hapus jadwal perawatan.",
        "Pantau status jadwal melalui dashboard maintenance.",
      ],
      link: "/maintenance",
    },

    {
      fitur: "Kontak Teknisi dan Vendor",
      title: "👨‍🔧 Kontak Teknisi dan Vendor",
      category: "Vendor",
      color: "#ede9fe",
      desc: [
        "Masuk ke menu Kontak Teknisi dan Vendor.",
        "Pilih tab Teknisi atau Vendor Material.",
        "Cari vendor menggunakan kolom pencarian.",
        "Tambahkan vendor ke daftar favorit.",
        "Hubungi vendor melalui WhatsApp atau buka lokasi Maps.",
      ],
      link: "/vendor",
    },

    {
      fitur: "Panduan Fitur",
      title: "📘 Panduan Fitur",
      category: "Panduan",
      color: "#dcfce7",
      desc: [
        "Masuk ke menu Panduan Fitur.",
        "Cari fitur yang ingin dipelajari.",
        "Baca langkah penggunaan setiap fitur.",
        "Gunakan tombol Coba Fitur untuk langsung membuka halaman.",
        "Pelajari seluruh fitur AIR KU secara interaktif.",
      ],
      link: "/panduan",
    },

    {
      fitur: "Feedback",
      title: "💬 Feedback",
      category: "Masukan",
      color: "#cffafe",
      desc: [
        "Masuk ke menu Feedback.",
        "Isi kritik dan saran terkait aplikasi.",
        "Tuliskan pengalaman penggunaan AIR KU.",
        "Berikan masukan untuk pengembangan sistem.",
        "Kirim feedback melalui form yang tersedia.",
      ],
      link: "/feedback",
    },
  ];

  const filteredPanduan = useMemo(() => {
    return panduanList.filter(
      (item) =>
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.category.toLowerCase().includes(search.toLowerCase()) ||
        item.fitur.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  return (
    <div className="maintenance-page">
      {/* HEADER */}
      <div
        className="page-header"
        style={{
          marginBottom: "28px",
          background:
            "linear-gradient(135deg, #1f7aa5 0%, #5aa8c8 55%, #b8d9ea 100%)",
          borderRadius: "20px",
          padding: "32px",
          color: "#fff",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: "-40px",
            top: "-40px",
            width: "180px",
            height: "180px",
            background: "rgba(255,255,255,0.12)",
            borderRadius: "50%",
          }}
        />

        <div
          style={{
            position: "absolute",
            left: "-30px",
            bottom: "-60px",
            width: "160px",
            height: "160px",
            background: "rgba(255,255,255,0.08)",
            borderRadius: "50%",
          }}
        />

        <div style={{ position: "relative", zIndex: 2 }}>
          <span
            style={{
              background: "rgba(255,255,255,0.2)",
              padding: "6px 14px",
              borderRadius: "999px",
              fontSize: "0.8rem",
              fontWeight: "600",
              display: "inline-block",
              marginBottom: "14px",
            }}
          >
            📘 Panduan Interaktif
          </span>

          <h1
            className="page-title"
            style={{
              fontSize: "2rem",
              fontWeight: "800",
              marginBottom: "10px",
              color: "#fff",
            }}
          >
            Panduan Penggunaan AIR KU
          </h1>

          <p
            className="page-subtitle"
            style={{
              maxWidth: "760px",
              lineHeight: "1.7",
              fontSize: "0.95rem",
              color: "rgba(255,255,255,0.92)",
            }}
          >
            Pelajari seluruh fitur AIR KU dengan mudah melalui panduan
            interaktif berikut untuk membantu pengelolaan kualitas air secara
            mandiri dan lebih efektif.
          </p>

          {/* SEARCH */}
          <div
            style={{
              marginTop: "24px",
              maxWidth: "420px",
              position: "relative",
            }}
          >
            <input
              type="text"
              placeholder="Cari fitur panduan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                padding: "14px 18px",
                borderRadius: "14px",
                border: "none",
                outline: "none",
                fontSize: "0.9rem",
                background: "rgba(255,255,255,0.95)",
                color: "#333",
                boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
              }}
            />
          </div>
        </div>
      </div>

      {/* INFO BOX */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "14px",
          marginBottom: "28px",
        }}
      >
        {[
          {
            label: "Total Fitur",
            value: panduanList.length,
            icon: "📌",
          },
          {
            label: "Panduan Aktif",
            value: filteredPanduan.length,
            icon: "📘",
          },
  
        ].map((item, index) => (
          <div
            key={index}
            className="schedule-card"
            style={{
              padding: "18px",
              borderRadius: "16px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <p
                  style={{
                    fontSize: "0.75rem",
                    color: "#777",
                    marginBottom: "6px",
                    textTransform: "uppercase",
                  }}
                >
                  {item.label}
                </p>

                <h3
                  style={{
                    margin: 0,
                    fontSize: "1.4rem",
                    color: "#1a516b",
                  }}
                >
                  {item.value}
                </h3>
              </div>

              <div
                style={{
                  fontSize: "1.8rem",
                }}
              >
                {item.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CARD LIST */}
      <div
        className="dashboard-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "20px",
        }}
      >
        {filteredPanduan.map((item, i) => (
          <div
            key={i}
            className="schedule-card"
            style={{
              padding: "22px",
              borderRadius: "18px",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "18px",
              transition: "all 0.2s ease",
              border: "1px solid #e5eef4",
            }}
          >
            {/* HEADER CARD */}
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: "12px",
              }}
            >
              <div>
                <span
                  style={{
                    background: item.color,
                    color: "#333",
                    padding: "6px 12px",
                    borderRadius: "999px",
                    fontSize: "0.72rem",
                    fontWeight: "700",
                    display: "inline-block",
                    marginBottom: "12px",
                  }}
                >
                  {item.fitur}
                </span>

                <h2
                  style={{
                    margin: 0,
                    fontSize: "1.1rem",
                    color: "#1a516b",
                    lineHeight: "1.4",
                  }}
                >
                  {item.title}
                </h2>
              </div>

              <div
                style={{
                  background: "#f4f8fb",
                  padding: "8px 12px",
                  borderRadius: "10px",
                  fontSize: "0.75rem",
                  fontWeight: "600",
                  color: "#1a6a8a",
                  whiteSpace: "nowrap",
                }}
              >
                {item.category}
              </div>
            </div>

            {/* CONTENT */}
            <div style={{ width: "100%" }}>
              <ul
                className="guide-list"
                style={{
                  margin: 0,
                  paddingLeft: "18px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                {item.desc.map((step, index) => (
                  <li
                    key={index}
                    style={{
                      fontSize: "0.87rem",
                      lineHeight: "1.6",
                      color: "#555",
                    }}
                  >
                    {step}
                  </li>
                ))}
              </ul>
            </div>

            {/* BUTTON */}
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "auto",
              }}
            >
              <span
                style={{
                  fontSize: "0.75rem",
                  color: "#999",
                }}
              >
                AIR KU Guide System
              </span>

              <Link href={item.link}>
                <button
                  className="btn-primary"
                  style={{
                    borderRadius: "12px",
                    padding: "10px 18px",
                    fontSize: "0.82rem",
                    fontWeight: "700",
                  }}
                >
                  Coba Fitur →
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* EMPTY STATE */}
      {filteredPanduan.length === 0 && (
        <div
          className="empty-state"
          style={{
            marginTop: "30px",
            padding: "40px",
          }}
        >
          <h3
            style={{
              marginBottom: "10px",
              color: "#1a516b",
            }}
          >
            Fitur tidak ditemukan
          </h3>

          <p>
            Coba gunakan kata kunci lain untuk mencari panduan fitur AIR KU.
          </p>
        </div>
      )}
    </div>
  );
}