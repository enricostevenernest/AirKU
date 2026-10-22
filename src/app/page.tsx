"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "./lib/supabase";
import { useNotifications } from "./lib/notification";
import { JENIS_LABEL } from "./maintenance/frontend/types";
import "./dashboard.css";

type Berita = {
  id: number;
  judul: string;
  konten: string;
  kategori: string;
  lokasi: string;
  created_at?: string;
};

type Edukasi = {
  id: number;
  judul: string;
  konten: string;
  kategori: string;
};

export default function UserDashboard() {
  const [statsData, setStatsData] = useState({
    berita: 0,
    edukasi: 0,
    lokasi: 0,
    vendor: 0,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [latestNews, setLatestNews] = useState<Berita[]>([]);
  const [latestEdukasi, setLatestEdukasi] = useState<Edukasi[]>([]);

  const { notifications, loading: notifLoading } = useNotifications();

  const stripHtml = (html: string) => {
    if (!html) return "";

    if (typeof window === "undefined") {
      return html.replace(/<[^>]*>/g, "");
    }

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;

    return tempDiv.textContent || tempDiv.innerText || "";
  };

  const truncateText = (html: string, maxLength: number) => {
    const text = stripHtml(html);

    if (text.length <= maxLength) return text;

    return text.substring(0, maxLength) + "...";
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      const supabase = createClient();

      setIsLoading(true);

      try {
        const [
          { count: countBerita },
          { count: countEdukasi },
          { count: countLokasi },
          { count: countVendor },
          { data: newsData },
          { data: edukasiData },
        ] = await Promise.all([
          supabase
            .from("berita")
            .select("*", { count: "exact", head: true })
            .eq("status", "Aktif"),

          supabase
            .from("edukasi")
            .select("*", { count: "exact", head: true }),

          supabase
            .from("lokasi_air_bersih")
            .select("*", { count: "exact", head: true }),

          supabase
            .from("vendors")
            .select("*", { count: "exact", head: true }),

          supabase
            .from("berita")
            .select("*")
            .eq("status", "Aktif")
            .order("id", { ascending: false })
            .limit(3),

          supabase
            .from("edukasi")
            .select("*")
            .order("id", { ascending: false })
            .limit(2),
        ]);

        setStatsData({
          berita: countBerita || 0,
          edukasi: countEdukasi || 0,
          lokasi: countLokasi || 0,
          vendor: countVendor || 0,
        });

        if (newsData) setLatestNews(newsData);
        if (edukasiData) setLatestEdukasi(edukasiData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <>
      <div className="dash-header-row">
        <h1 className="dash-title">
          Selamat Datang Di Aplikasi AIRKU!
          <br />
          Dikelola Oleh Kelompok D
        </h1>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "12px",
          marginBottom: "24px",
        }}
      >
        {[
          { title: "Artikel Edukasi", value: statsData.edukasi, icon: "📚" },
          { title: "Sumber Air", value: statsData.lokasi, icon: "📍" },
          { title: "Kontak Vendor", value: statsData.vendor, icon: "🏢" },
          { title: "Berita Aktif", value: statsData.berita, icon: "📰" },
        ].map((stat, idx) => (
          <div
            key={idx}
            className="schedule-card"
            style={{ padding: "12px 16px" }}
          >
            <div className="card-info">
              <p
                className="card-sub"
                style={{
                  fontSize: "0.7rem",
                  textTransform: "uppercase",
                }}
              >
                {stat.title}
              </p>

              <p
                className="card-title"
                style={{
                  fontSize: "1.4rem",
                  marginTop: "4px",
                }}
              >
                {isLoading ? "..." : stat.value}
              </p>
            </div>

            <div className="card-right" style={{ fontSize: "1.5rem" }}>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      <div
        className="dashboard-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 340px",
          gap: "20px",
          alignItems: "start",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "12px",
              }}
            >
              <p className="section-title" style={{ margin: 0 }}>
                Pengingat Perawatan
              </p>

              <Link
                href="/maintenance"
                style={{
                  fontSize: "0.75rem",
                  color: "#1a6a8a",
                  textDecoration: "none",
                  fontWeight: "bold",
                }}
              >
                Buka Modul
              </Link>
            </div>

            <div className="schedule-list">
              {notifLoading ? (
                <div
                  style={{
                    padding: "20px",
                    textAlign: "center",
                    color: "#999",
                    fontSize: "0.8rem",
                    background: "#fff",
                    borderRadius: "9px",
                  }}
                >
                  Memuat jadwal...
                </div>
              ) : notifications.length > 0 ? (
                notifications.slice(0, 2).map((s) => (
                  <div key={s.id} className="schedule-card">
                    <div className="card-info">
                      <p className="card-title">
                        {JENIS_LABEL[s.jenis_perawatan]}
                      </p>

                      <p className="card-sub">
                        Jatuh tempo:{" "}
                        {new Date(s.tanggal_mulai).toLocaleDateString(
                          "id-ID",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </p>
                    </div>

                    <div className="card-right">
                      <span
                        className={`badge ${
                          s.status === "terlambat"
                            ? "badge-terlambat"
                            : "badge-segera"
                        }`}
                      >
                        {s.status === "terlambat" ? "Terlambat" : "Segera"}
                      </span>

                      <Link href="/maintenance" style={{ textDecoration: "none" }}>
                        <button
                          className="btn-done"
                          style={{
                            background: "transparent",
                            borderColor: "#2e86ab",
                            color: "#2e86ab",
                          }}
                        >
                          →
                        </button>
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div
                  className="empty-state"
                  style={{
                    padding: "20px 16px",
                    background: "#f8fafc",
                    border: "1px solid #e1ecf2",
                    borderStyle: "dashed",
                  }}
                >
                  <p>Tidak ada jadwal perawatan mendesak saat ini.</p>
                </div>
              )}
            </div>
          </div>

          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "12px",
              }}
            >
              <p className="section-title" style={{ margin: 0 }}>
                Rekomendasi Edukasi
              </p>

              <Link
                href="/edukasi"
                style={{
                  fontSize: "0.75rem",
                  color: "#1a6a8a",
                  textDecoration: "none",
                  fontWeight: "bold",
                }}
              >
                Lihat Semua
              </Link>
            </div>

            <div className="schedule-list">
              {isLoading ? (
                <div
                  style={{
                    padding: "20px",
                    textAlign: "center",
                    color: "#999",
                    fontSize: "0.8rem",
                    background: "#fff",
                    borderRadius: "9px",
                  }}
                >
                  Memuat edukasi...
                </div>
              ) : latestEdukasi.length > 0 ? (
                latestEdukasi.map((edu) => (
                  <div
                    key={edu.id}
                    className="schedule-card"
                    style={{ padding: "16px" }}
                  >
                    <div className="card-info">
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          marginBottom: "4px",
                        }}
                      >
                        <span
                          className="badge badge-terjadwal"
                          style={{
                            fontSize: "0.6rem",
                            padding: "2px 8px",
                          }}
                        >
                          {edu.kategori || "Panduan"}
                        </span>
                      </div>

                      <p
                        className="card-title"
                        style={{ fontSize: "0.95rem" }}
                      >
                        {edu.judul}
                      </p>

                      <p
                        className="card-sub"
                        style={{
                          marginTop: "4px",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {truncateText(edu.konten, 120)}
                      </p>
                    </div>

                    <div className="card-right">
                      <Link href="/edukasi" style={{ textDecoration: "none" }}>
                        <button
                          className="btn-done"
                          style={{
                            background: "transparent",
                            borderColor: "#ccc",
                            color: "#666",
                          }}
                        >
                          →
                        </button>
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div
                  className="empty-state"
                  style={{
                    padding: "20px 16px",
                    background: "#f8fafc",
                    border: "1px solid #e1ecf2",
                    borderStyle: "dashed",
                  }}
                >
                  <p>Belum ada artikel edukasi.</p>
                </div>
              )}
            </div>
          </div>

          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "12px",
              }}
            >
              <p className="section-title" style={{ margin: 0 }}>
                Panduan Fitur
              </p>

              <Link
                href="/panduan"
                style={{
                  fontSize: "0.75rem",
                  color: "#1a6a8a",
                  textDecoration: "none",
                  fontWeight: "bold",
                }}
              >
                Lihat Panduan
              </Link>
            </div>

            <div className="schedule-card" style={{ padding: "18px" }}>
              <div className="card-info">
                <span
                  className="badge badge-terjadwal"
                  style={{
                    fontSize: "0.65rem",
                    padding: "4px 10px",
                    marginBottom: "10px",
                    display: "inline-block",
                  }}
                >
                  Tutorial Penggunaan
                </span>

                <p
                  className="card-title"
                  style={{
                    fontSize: "1rem",
                    marginBottom: "6px",
                  }}
                >
                  Pelajari Cara Menggunakan AIR KU
                </p>

                <p className="card-sub" style={{ lineHeight: "1.5" }}>
                  Lihat panduan lengkap penggunaan fitur identifikasi air,
                  maintenance, maps air, vendor teknisi, edukasi, dan berita
                  terbaru.
                </p>
              </div>

              <div className="card-right">
                <Link href="/panduan" style={{ textDecoration: "none" }}>
                  <button className="btn-primary" style={{ padding: "10px 16px" }}>
                    Buka →
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "12px",
            }}
          >
            <p className="section-title" style={{ margin: 0 }}>
              Berita Terkini
            </p>

            <Link
              href="/berita"
              style={{
                fontSize: "0.75rem",
                color: "#1a6a8a",
                textDecoration: "none",
                fontWeight: "bold",
              }}
            >
              Lihat Semua
            </Link>
          </div>

          <div
            className="riwayat-list bg-white"
            style={{
              padding: "14px",
              borderRadius: "10px",
              boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
            }}
          >
            {isLoading ? (
              <div
                style={{
                  padding: "20px",
                  textAlign: "center",
                  color: "#999",
                  fontSize: "0.8rem",
                }}
              >
                Memuat berita...
              </div>
            ) : latestNews.length > 0 ? (
              latestNews.map((news) => (
                <div
                  key={news.id}
                  className="riwayat-item clickable"
                  style={{
                    flexDirection: "column",
                    alignItems: "flex-start",
                    gap: "6px",
                    borderBottom: "1px solid #f0f0f0",
                    borderRadius: 0,
                    padding: "10px 0",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      width: "100%",
                      alignItems: "center",
                    }}
                  >
                    <span
                      className={`badge ${
                        news.kategori === "Darurat"
                          ? "badge-terlambat"
                          : news.kategori === "Bencana"
                          ? "badge-segera"
                          : "badge-terjadwal"
                      }`}
                      style={{
                        padding: "3px 8px",
                        fontSize: "0.65rem",
                      }}
                    >
                      {news.kategori}
                    </span>

                    <span
                      style={{
                        fontSize: "0.65rem",
                        color: "#aaa",
                      }}
                    >
                      {news.created_at
                        ? new Date(news.created_at).toLocaleDateString(
                            "id-ID",
                            {
                              month: "short",
                              day: "numeric",
                            }
                          )
                        : "Baru"}
                    </span>
                  </div>

                  <p
                    className="card-title"
                    style={{
                      fontSize: "0.85rem",
                      lineHeight: "1.3",
                    }}
                  >
                    {news.judul}
                  </p>

                  <p
                    className="card-sub"
                    style={{
                      fontSize: "0.75rem",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {news.konten}
                  </p>
                </div>
              ))
            ) : (
              <div
                style={{
                  padding: "20px",
                  textAlign: "center",
                  color: "#999",
                  fontSize: "0.8rem",
                }}
              >
                Belum ada berita.
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .dashboard-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  );
}