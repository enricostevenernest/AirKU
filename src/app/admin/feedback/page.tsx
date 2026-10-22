"use client";

import React, { useState, useEffect } from "react";
import { Search, Filter, MessageSquare, Star, Trash2, CheckCircle, MailOpen } from "lucide-react";
import { createClient } from "@/app/lib/supabase";

export default function FeedbackPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("Semua");
  const supabase = createClient();

  // State for feedback data
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      setIsLoading(true);
      setErrorMsg(null);
      const { data, error } = await supabase
        .from('feedback')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setFeedbacks(data);
    } catch (error: any) {
      console.error("Error fetching feedbacks:", error?.message || error);
      setErrorMsg(error?.message || "Gagal memuat data kritik dan saran. Pastikan Anda memiliki akses.");
    } finally {
      setIsLoading(false);
    }
  };
  const markAsRead = async (id: number) => {
    try {
      const { error } = await supabase
        .from('feedback')
        .update({ status: 'read' })
        .eq('id', id);

      if (error) throw error;
      setFeedbacks(feedbacks.map(fb => fb.id === id ? { ...fb, status: "read" } : fb));
    } catch (error) {
      console.error("Error updating feedback status:", error);
    }
  };

  const deleteFeedback = async (id: number) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus masukan ini?")) return;

    try {
      const { error } = await supabase
        .from('feedback')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setFeedbacks(feedbacks.filter(fb => fb.id !== id));
    } catch (error) {
      console.error("Error deleting feedback:", error);
    }
  };

  const filteredFeedbacks = feedbacks.filter(fb => {
    const matchSearch = (fb.pesan || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (fb.nama || "").toLowerCase().includes(searchQuery.toLowerCase());

    // mapping filter category
    const mapCategory = (dbCategory: string) => {
      if (dbCategory === "bug") return "Kritik";
      if (dbCategory === "fitur") return "Saran";
      if (dbCategory === "tampilan" || dbCategory === "kinerja") return "Kritik";
      if (dbCategory === "lainnya") return "Saran";
      return dbCategory;
    };

    const displayType = mapCategory(fb.kategori);
    const matchFilter = filterType === "Semua" || displayType === filterType;
    return matchSearch && matchFilter;
  });

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', animation: 'fadeIn 0.3s ease' }}>
      {/* Header Section */}
      <div className="dash-header-row" style={{ marginBottom: '28px' }}>
        <div>
          <h1 className="dash-title">Kritik & Saran</h1>
          <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '6px', marginBottom: 0 }}>
            Kelola masukan dan evaluasi dari pengguna untuk peningkatan sistem.
          </p>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <Search style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} size={16} />
            <input
              type="text"
              placeholder="Cari pesan atau nama..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="feedback-search-input"
              style={{
                padding: '9px 16px 9px 38px',
                borderRadius: '24px',
                border: '1px solid #dcdcdc',
                outline: 'none',
                fontSize: '0.85rem',
                width: '260px',
                transition: 'all 0.2s',
                boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
              }}
              onFocus={(e) => e.target.style.borderColor = '#2e86ab'}
              onBlur={(e) => e.target.style.borderColor = '#dcdcdc'}
            />
          </div>

          <div style={{ position: 'relative' }}>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="feedback-filter-select"
              style={{
                appearance: 'none',
                padding: '9px 36px 9px 16px',
                borderRadius: '24px',
                border: '1px solid #dcdcdc',
                fontSize: '0.85rem',
                cursor: 'pointer',
                outline: 'none',
                fontWeight: 500
              }}
            >
              <option value="Semua">Semua Tipe</option>
              <option value="Kritik">Kritik (Bug, Tampilan, Kinerja)</option>
              <option value="Saran">Saran & Lainnya</option>
            </select>
            <Filter style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: '#999', pointerEvents: 'none' }} size={14} />
          </div>
        </div>
      </div>

      {/* List Section */}
      <div className="schedule-list" style={{ gap: '14px' }}>
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            <p>Memuat data masukan...</p>
          </div>
        ) : errorMsg ? (
          <div className="feedback-error-banner" style={{ textAlign: 'center', padding: '40px', borderRadius: '12px' }}>
            <p style={{ fontWeight: 500 }}>⚠️ Terjadi Kesalahan</p>
            <p style={{ fontSize: '0.9rem' }}>{errorMsg}</p>
            <button 
              onClick={fetchFeedbacks}
              className="feedback-error-btn"
              style={{ marginTop: '12px', padding: '6px 16px', borderRadius: '20px', border: '1px solid #ef9a9a', cursor: 'pointer' }}
            >
              Coba Lagi
            </button>
          </div>
        ) : filteredFeedbacks.map((item) => {
          // mapping filter category for display
          const mapCategory = (dbCategory: string) => {
            if (dbCategory === "bug") return "Kritik";
            if (dbCategory === "fitur") return "Saran";
            if (dbCategory === "tampilan" || dbCategory === "kinerja") return "Kritik";
            if (dbCategory === "lainnya") return "Saran";
            return dbCategory || "Saran";
          };
          const displayType = mapCategory(item.kategori);
          const dateStr = item.created_at ? new Date(item.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) : "";

          return (
            <div
              key={item.id}
              className={`schedule-card feedback-card ${item.status === 'unread' ? 'unread' : 'read'}`}
              style={{
                alignItems: 'flex-start',
                padding: '20px',
                borderLeft: item.status === 'unread' ? '4px solid #2e86ab' : '4px solid transparent',
                transition: 'all 0.2s ease',
                borderRadius: '12px'
              }}
            >
              {/* Avatar / Icon */}
              <div className={`feedback-avatar ${item.status === 'unread' ? 'unread' : 'read'}`} style={{
                width: '44px', height: '44px', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, marginTop: '2px'
              }}>
                {item.status === 'unread' ? <MessageSquare size={20} /> : <MailOpen size={20} />}
              </div>

              {/* Content */}
              <div className="card-info" style={{ marginLeft: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div>
                    <h3 className="card-title feedback-card-title" style={{ fontSize: '1.05rem', margin: '0 0 4px' }}>{item.nama}</h3>
                    <span className="feedback-date" style={{ fontSize: '0.75rem', fontWeight: 500 }}>{dateStr}</span>
                  </div>

                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2px', color: '#f5a623' }}>
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} fill={i < 5 ? "currentColor" : "none"} strokeWidth={i < 5 ? 0 : 1.5} />
                      ))}
                    </div>
                    <span className={`badge ${displayType === 'Kritik' ? 'badge-terlambat' : displayType === 'Saran' ? 'badge-segera' : 'badge-terjadwal'}`} style={{ padding: '4px 12px' }}>
                      {displayType}
                    </span>
                  </div>
                </div>

                <div className="feedback-content-box" style={{
                  padding: '14px 16px',
                  borderRadius: '8px',
                  border: '1px solid #eee',
                  marginTop: '12px'
                }}>
                  <p className="feedback-content-text" style={{ fontSize: '0.9rem', lineHeight: 1.6, margin: 0, fontStyle: 'italic', whiteSpace: 'pre-wrap' }}>
                    "{item.pesan}"
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="card-right" style={{ flexDirection: 'column', gap: '10px', marginLeft: '12px' }}>
                {item.status === 'unread' && (
                  <button
                    className="btn-done"
                    title="Tandai sudah dibaca"
                    onClick={() => markAsRead(item.id)}
                    style={{ width: '36px', height: '36px' }}
                  >
                    <CheckCircle size={18} />
                  </button>
                )}
                <button
                  className="btn-delete"
                  title="Hapus umpan balik"
                  onClick={() => deleteFeedback(item.id)}
                  style={{ width: '36px', height: '36px' }}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          );
        })}

        {!isLoading && !errorMsg && filteredFeedbacks.length === 0 && (
          <div className="empty-state" style={{ padding: '60px 20px', border: '1px dashed #ccc', background: 'transparent' }}>
            <MessageSquare size={40} color="#ccc" style={{ marginBottom: '12px' }} />
            <p style={{ fontSize: '0.95rem', color: '#888' }}>Tidak ada kritik atau saran yang ditemukan.</p>
          </div>
        )}
      </div>
    </div>
  );
}
