"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "../../lib/supabase";
import { JENIS_LABEL, JenisPerawatan } from "../frontend/types";

export default function MaintenancePage() {
  const [data, setData] = useState<any[]>([]);
  const [filter, setFilter] = useState("Semua");
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const supabase = createClient();
        const { data: schedules, error } = await supabase
          .from("maintenance_schedules")
          .select("*")
          .or("status.eq.selesai,is_deleted.eq.true");

        if (schedules && !error) {
          const mappedData = schedules.map(s => {
            const kategori = s.jenis_perawatan === "pemeriksaan_pompa" ? "Pengecekan" :
                             s.jenis_perawatan === "penggantian_pipa" ? "Perbaikan" : "Perawatan";
            
            return {
              id: s.id,
              aktivitas: kategori,
              judul: JENIS_LABEL[s.jenis_perawatan as JenisPerawatan] || s.jenis_perawatan,
              catatan: s.notes || "Tidak ada catatan",
              tanggal: new Date(s.updated_at || s.tanggal_mulai).toLocaleDateString("id-ID", {
                day: "2-digit", month: "long", year: "numeric"
              }),
              timestamp: new Date(s.updated_at || s.tanggal_mulai).getTime(),
              status: s.status === "selesai" ? "Selesai" : "Dihapus"
            };
          });
          mappedData.sort((a, b) => b.timestamp - a.timestamp);
          setData(mappedData);
        }
      } catch (err) {
        console.error("Error fetching history:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredData = data.filter((item) => {
    const matchFilter =
      filter === "Semua" ||
      item.aktivitas?.toLowerCase() === filter.toLowerCase();
    const matchSearch =
      item.judul?.toLowerCase().includes(search.toLowerCase()) ||
      item.catatan?.toLowerCase().includes(search.toLowerCase()) ||
      item.aktivitas?.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,300;9..144,600&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          font-family: 'Plus Jakarta Sans', sans-serif;
          background: #eef6f8;
        }

        .sidebar {
          position: fixed;
          top: 0; left: 0;
          width: 240px;
          height: 100vh;
          background: linear-gradient(180deg, #b8dff5 0%, #6fa8cc 60%, #4a87ae 100%);
          display: flex;
          flex-direction: column;
          padding: 28px 18px;
          z-index: 20;
          box-shadow: 4px 0 24px rgba(30,90,130,0.10);
        }

        .sidebar-label {
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.18em;
          color: #1b5e7a;
          margin-bottom: 20px;
          opacity: 0.7;
        }

        .sidebar-active {
          display: flex;
          align-items: center;
          gap: 10px;
          background: white;
          border-radius: 14px;
          padding: 12px 16px;
          color: #0b4c6a;
          font-weight: 700;
          font-size: 14px;
          box-shadow: 0 4px 16px rgba(11,84,120,0.13);
        }

        .sidebar-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: #2e86ab;
          flex-shrink: 0;
        }

        .sidebar-back {
          margin-top: auto;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          border-radius: 12px;
          text-decoration: none;
          color: #0b4c6a;
          font-weight: 600;
          font-size: 13px;
          transition: background 0.18s;
        }
        .sidebar-back:hover { background: rgba(255,255,255,0.35); }

        .avatar {
          width: 34px; height: 34px;
          border-radius: 50%;
          background: #0b4c6a;
          color: white;
          font-size: 13px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .main {
          margin-left: 240px;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        .header {
          background: linear-gradient(110deg, #b8dff5 0%, #6fa8cc 55%, #4a87ae 100%);
          padding: 32px 48px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          min-height: 120px;
          position: relative;
          overflow: hidden;
        }

        .header::after {
          content: '';
          position: absolute;
          right: -40px; top: -40px;
          width: 220px; height: 220px;
          border-radius: 50%;
          background: rgba(255,255,255,0.08);
          pointer-events: none;
        }

        .header-title {
          font-family: 'Fraunces', serif;
          font-size: 36px;
          font-weight: 600;
          color: #0b3a54;
          letter-spacing: -0.5px;
          line-height: 1.1;
        }

        .header-subtitle {
          font-size: 13px;
          color: #1b5e7a;
          margin-top: 4px;
          opacity: 0.75;
          font-weight: 500;
        }

        .header-avatar {
          width: 46px; height: 46px;
          border-radius: 50%;
          background: white;
          color: #0b4c6a;
          font-weight: 800;
          font-size: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 16px rgba(11,84,120,0.18);
          z-index: 1;
        }

        .content {
          padding: 36px 48px;
          flex: 1;
        }

        .section-title {
          font-size: 15px;
          font-weight: 600;
          color: #4a6070;
          margin-bottom: 18px;
          letter-spacing: 0.01em;
        }

        .search-wrap {
          position: relative;
          margin-bottom: 18px;
        }

        .search-input {
          width: 100%;
          padding: 14px 20px 14px 48px;
          border-radius: 14px;
          border: 1.5px solid #d4eaf5;
          background: white;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 14px;
          color: #2c4a5a;
          outline: none;
          transition: border 0.2s, box-shadow 0.2s;
          box-shadow: 0 2px 8px rgba(30,90,130,0.06);
        }
        .search-input:focus {
          border-color: #6fa8cc;
          box-shadow: 0 0 0 3px rgba(111,168,204,0.15);
        }
        .search-input::placeholder { color: #a0bfcd; }

        .search-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 18px;
          pointer-events: none;
          opacity: 0.5;
        }

        .filters {
          display: flex;
          gap: 10px;
          margin-bottom: 28px;
          flex-wrap: wrap;
        }

        .filter-btn {
          padding: 8px 20px;
          border-radius: 999px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 13px;
          font-weight: 600;
          border: 1.5px solid transparent;
          cursor: pointer;
          transition: all 0.18s;
        }
        .filter-btn.active {
          background: #0b4c6a;
          color: white;
          box-shadow: 0 4px 12px rgba(11,84,120,0.22);
        }
        .filter-btn:not(.active) {
          background: white;
          color: #4a6070;
          border-color: #d4eaf5;
        }
        .filter-btn:not(.active):hover {
          background: #eaf5fb;
          border-color: #a8d4ea;
        }

        .empty-card {
          background: white;
          border-radius: 20px;
          border: 1.5px solid #e4f0f7;
          padding: 64px 32px;
          text-align: center;
          box-shadow: 0 4px 24px rgba(30,90,130,0.06);
        }

        .empty-icon { font-size: 48px; margin-bottom: 16px; }
        .empty-title { font-size: 18px; font-weight: 700; color: #2c4a5a; margin-bottom: 6px; }
        .empty-sub { font-size: 13px; color: #8ab0c0; }

        .card-list { display: flex; flex-direction: column; gap: 14px; }

        .card {
          background: white;
          border-radius: 16px;
          padding: 18px 22px;
          display: flex;
          align-items: center;
          gap: 18px;
          border: 1.5px solid #e4f0f7;
          box-shadow: 0 2px 10px rgba(30,90,130,0.05);
          transition: transform 0.15s, box-shadow 0.15s;
          cursor: default;
        }
        .card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(30,90,130,0.10);
        }

        .card-badge {
          width: 40px; height: 40px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          flex-shrink: 0;
        }

        .card-body { flex: 1; min-width: 0; }
        .card-title { font-size: 14px; font-weight: 700; color: #1a3a50; margin-bottom: 3px; }
        .card-note { font-size: 13px; color: #6a8a9a; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

        .card-meta { text-align: right; flex-shrink: 0; }
        .card-date { font-size: 12px; color: #8ab0c0; font-weight: 500; }
        .card-status {
          display: inline-block;
          margin-top: 4px;
          padding: 2px 10px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 700;
          background: #e6f4ea;
          color: #3a7d44;
        }

        .summary-bar {
          display: flex;
          gap: 14px;
          margin-bottom: 28px;
        }
        .summary-chip {
          background: white;
          border: 1.5px solid #daeef7;
          border-radius: 12px;
          padding: 10px 18px;
          font-size: 13px;
          font-weight: 600;
          color: #1a3a50;
          box-shadow: 0 2px 8px rgba(30,90,130,0.05);
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .chip-dot {
          width: 8px; height: 8px; border-radius: 50%;
        }
      `}</style>

      <div style={{ minHeight: "100vh", background: "#eef6f8" }}>

        {/* SIDEBAR */}
        <aside className="sidebar">
          <p className="sidebar-label">MENU NAVIGASI</p>

          <div className="sidebar-active">
            <span className="sidebar-dot" />
            Maintenance
          </div>

          <Link href="/" className="sidebar-back">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0b4c6a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
            Kembali ke Beranda
          </Link>
        </aside>

        {/* MAIN */}
        <div className="main">

          {/* HEADER */}
          <div className="header">
            <div>
              <h1 className="header-title">Riwayat Perawatan</h1>
              <p className="header-subtitle">Pantau semua aktivitas perawatan kendaraan Anda</p>
            </div>
            <div className="header-avatar">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
              </svg>
            </div>
          </div>

          {/* CONTENT */}
          <div className="content" style={{ maxWidth: 860, width: "100%" }}>

            {/* SUMMARY */}
            <div className="summary-bar">
              {[
                { label: "Total", value: data.length, color: "#2e86ab", icon: "📋" },
                { label: "Perawatan", value: data.filter(d => d.aktivitas === "Perawatan").length, color: "#2e86ab", icon: "🔧" },
                { label: "Perbaikan", value: data.filter(d => d.aktivitas === "Perbaikan").length, color: "#e07b39", icon: "🔩" },
                { label: "Pengecekan", value: data.filter(d => d.aktivitas === "Pengecekan").length, color: "#5cb85c", icon: "✅" },
              ].map(s => (
                <div className="summary-chip" key={s.label}>
                  <span>{s.icon}</span>
                  <span style={{ color: "#8ab0c0", fontWeight: 500 }}>{s.label}</span>
                  <span style={{ color: s.color, fontSize: 16 }}>{s.value}</span>
                </div>
              ))}
            </div>

            <p className="section-title">Lihat riwayat perawatan di sini</p>

            {/* SEARCH */}
            <div className="search-wrap">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Cari riwayat perawatan..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="search-input"
              />
            </div>

            {/* FILTER */}
            <div className="filters">
              {["Semua", "Perawatan", "Perbaikan", "Pengecekan"].map((btn) => (
                <button
                  key={btn}
                  onClick={() => setFilter(btn)}
                  className={`filter-btn ${filter === btn ? "active" : ""}`}
                >
                  {btn}
                </button>
              ))}
            </div>

            {/* LIST */}
            {isLoading ? (
              <div className="empty-card">
                <p className="empty-title">Memuat data...</p>
                <p className="empty-sub">Harap tunggu sebentar</p>
              </div>
            ) : filteredData.length === 0 ? (
              <div className="empty-card">
                <div className="empty-icon">🛠️</div>
                <p className="empty-title">Belum ada riwayat</p>
                <p className="empty-sub">Data perawatan akan muncul di sini setelah ditandai selesai atau dihapus</p>
              </div>
            ) : (
              <div className="card-list">
                {filteredData.map((item, i) => {
                  const icons: Record<string, string> = { Perawatan: "🔧", Perbaikan: "🔩", Pengecekan: "✅" };
                  const bgColors: Record<string, string> = { Perawatan: "#e6f4fb", Perbaikan: "#fdf0e8", Pengecekan: "#e8f7ea" };
                  const statusColors: Record<string, string> = { Selesai: "#e6f4ea", Dihapus: "#fce8e8" };
                  const statusTextColors: Record<string, string> = { Selesai: "#3a7d44", Dihapus: "#d93025" };
                  return (
                    <div className="card" key={item.id || i}>
                      <div
                        className="card-badge"
                        style={{ background: bgColors[item.aktivitas] || "#eef6f8" }}
                      >
                        {icons[item.aktivitas] || "📋"}
                      </div>
                      <div className="card-body">
                        <p className="card-title">{item.judul}</p>
                        <p className="card-note">{item.catatan}</p>
                      </div>
                      <div className="card-meta">
                        <p className="card-date">{item.tanggal}</p>
                        <span 
                          className="card-status" 
                          style={{ 
                            background: statusColors[item.status] || "#f1f3f4",
                            color: statusTextColors[item.status] || "#5f6368"
                          }}
                        >
                          {item.status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}