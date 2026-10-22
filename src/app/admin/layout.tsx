"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/app/lib/supabase";
import React from "react";
import "@/app/dashboard.css";
import { useTheme } from "@/app/ThemeProvider";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  };

  const handleBackToHome = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const menuItems = [
    { name: "Dashboard", path: "/admin" },
    { name: "Berita Terkini", path: "/admin/berita" },
    { name: "Edukasi Teknis", path: "/admin/edukasi" },
    { name: "Identifikasi Masalah Air", path: "/admin/identifikasi" },
    { name: "Visualisasi Sumber Air", path: "/admin/maps" },
    { name: "Kontak Teknisi dan Vendor", path: "/admin/vendor" },
    { name: "Feedback Pengguna", path: "/admin/feedback" },
    { name: "Pengaturan Akun", path: "/admin/profile" },
  ];

  return (
    <div className="maintenance-layout">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-search">
          <input type="text" placeholder="Search" />
        </div>
        
        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`nav-item${isActive ? " active" : ""}`}
                style={{ textDecoration: "none" }}
              >
                <span className={`nav-dot${isActive ? " filled" : ""}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* BOTTOM SIDEBAR ACTIONS & AVATAR */}
        <div style={{ marginTop: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: "10px" }}>

          {/* Dark Mode Toggle for Admin Interface */}
          <button className="theme-toggle-btn" onClick={toggleTheme} title={isDark ? "Beralih ke Mode Terang" : "Beralih ke Mode Gelap"}>
            <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              {isDark ? "🌙" : "☀️"}
              {isDark ? "Mode Gelap" : "Mode Terang"}
            </span>
            <div className={`theme-toggle-pill${isDark ? " dark" : ""}`}>
              <div className="theme-toggle-thumb" />
            </div>
          </button>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <button
              onClick={handleBackToHome}
              style={{ background: "transparent", color: "rgba(255,255,255,0.8)", border: "none", cursor: "pointer", fontSize: "0.75rem", fontWeight: "600", textAlign: "left", padding: "4px 8px" }}
            >
              Kembali ke Beranda
            </button>
            <button
              onClick={handleLogout}
              style={{ background: "transparent", color: "#ff8a8a", border: "none", cursor: "pointer", fontSize: "0.75rem", fontWeight: "600", textAlign: "left", padding: "4px 8px" }}
            >
              Logout Admin
            </button>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "0 8px" }}>
            <div style={{ 
              width: "36px", 
              height: "36px", 
              borderRadius: "50%", 
              background: "#2c3e50", 
              color: "white", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              fontWeight: "bold",
              fontSize: "1.1rem"
            }}>
              N
            </div>
            <span style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.85rem", fontWeight: "500" }}>v1.0.1</span>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}
// Linked to SCRUM-163 & SCRUM-165