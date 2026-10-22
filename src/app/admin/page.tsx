'use client';

import { useEffect, useState } from 'react';
import { createClient } from '../lib/supabase';
import '../dashboard.css';

export default function DashboardAdmin() {
  const [statsData, setStatsData] = useState({
    berita: 0,
    edukasi: 0,
    identifikasi: 0,
    visualisasi: 0,
    teknisi: 0,
    vendor: 0
  });

  useEffect(() => {
    const supabase = createClient();

    const fetchStats = async () => {
      const [
        { count: countBerita },
        { count: countEdukasi },
        { count: countIdentifikasi },
        { count: countVisualisasi },
        { count: countTeknisi },
        { count: countVendor }
      ] = await Promise.all([
        supabase.from('berita').select('*', { count: 'exact', head: true }),
        supabase.from('edukasi').select('*', { count: 'exact', head: true }),
        supabase.from('identifikasi').select('*', { count: 'exact', head: true }),
        supabase.from('lokasi_air_bersih').select('*', { count: 'exact', head: true }),
        supabase.from('teknisi').select('*', { count: 'exact', head: true }),
        supabase.from('vendors').select('*', { count: 'exact', head: true })
      ]);

      setStatsData({
        berita: countBerita || 0,
        edukasi: countEdukasi || 0,
        identifikasi: countIdentifikasi || 0,
        visualisasi: countVisualisasi || 0,
        teknisi: countTeknisi || 0,
        vendor: countVendor || 0
      });
    };

    fetchStats();

    // Realtime subscriptions for updates
    const channel = supabase.channel('dashboard-stats')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'berita' }, fetchStats)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'edukasi' }, fetchStats)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'identifikasi' }, fetchStats)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'lokasi_air_bersih' }, fetchStats)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'teknisi' }, fetchStats)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'vendors' }, fetchStats)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const stats = [
    { title: "Berita", value: statsData.berita, icon: "📰", color: "#9b59b6", bg: "#f5eef8" },
    { title: "Edukasi", value: statsData.edukasi, icon: "📚", color: "#f39c12", bg: "#fcf3cf" },
    { title: "Identifikasi Masalah Air", value: statsData.identifikasi, icon: "🩺", color: "#2e86ab", bg: "#e6f4fb" },
    { title: "Visualisasi Sumber Air", value: statsData.visualisasi,  icon: "📍", color: "#e07b39", bg: "#fdf0e8" },
    { title: "Kontak Teknisi", value: statsData.teknisi, icon: "🔧", color: "#3498db", bg: "#ebf5fb" },
    { title: "Kontak Vendor", value: statsData.vendor, icon: "🏢", color: "#5cb85c", bg: "#e8f7ea" },
  ];

  return (
    <>
      <style>{`
        .welcome-card {
          background: white;
          border-radius: 12px;
          border: 1px solid #e4f0f7;
          padding: 40px 32px;
          text-align: center;
          box-shadow: 0 1px 4px rgba(0,0,0,0.06);
          margin-bottom: 28px;
        }

        .welcome-icon {
          font-size: 44px;
          margin-bottom: 14px;
        }

        .welcome-title {
          font-size: 20px;
          font-weight: 700;
          color: #1a516b;
          margin-bottom: 8px;
        }

        .welcome-sub {
          font-size: 14px;
          color: #8ab0c0;
          max-width: 360px;
          margin: 0 auto;
          line-height: 1.6;
        }
      `}</style>

      <h1 className="dash-title">Dashboard Admin</h1>

      {/* STATS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px", marginBottom: "24px" }}>
        {stats.map((stat, idx) => (
          <div key={idx} className="schedule-card" style={{ padding: "12px 16px" }}>
            <div className="card-info">
              <p className="card-sub" style={{ fontSize: "0.7rem", textTransform: "uppercase" }}>{stat.title}</p>
              <p className="card-title" style={{ fontSize: "1.4rem", marginTop: "4px" }}>
                {stat.value}
              </p>
            </div>
            <div className="card-right" style={{ fontSize: "1.5rem" }}>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* WELCOME */}
      <div className="welcome-card">
        <div className="welcome-icon">👋</div>
        <h2 className="welcome-title">Selamat Datang di Halaman Admin!</h2>
        <p className="welcome-sub">Silakan pilih menu di sebelah kiri untuk mulai mengelola data database.</p>
      </div>
    </>
  );
}