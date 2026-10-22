"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import "@/app/dashboard.css";
import GlobalNotification from "./GlobalNotification";
import { useTheme } from "@/app/ThemeProvider";

export default function UserLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  if (!pathname || pathname.startsWith("/admin") || pathname.startsWith("/login")) {
    return <>{children}</>;
  }

  const NAV_ITEMS = [
    { label: "Dashboard",               key: "dashboard",   path: "/" },
    { label: "Berita Terkini",          key: "berita",      path: "/berita" },
    { label: "Edukasi Teknis",          key: "edukasi",     path: "/edukasi" },
    { label: "Identifikasi Masalah Air",key: "identifikasi",path: "/identifikasi" },
    { label: "Visualisasi Sumber Air",  key: "visualisasi", path: "/maps" },
    { label: "Pengingat Perawatan",     key: "maintenance", path: "/maintenance" },
    { label: "Kontak Teknisi dan Vendor",key: "kontak",     path: "/vendor" },
    { label: "Panduan Fitur"            ,key: "panduan",    path: "/panduan" },
    { label: "Feedback"                 ,key: "feedback",   path: "/kritik-saran" },
  ];

  return (
    <div className="maintenance-layout">
      {/* ═══════════ SIDEBAR ═══════════ */}
      <aside className="sidebar">
                <div className="sidebar-brand">
          <Link href="/" style={{ textDecoration: "none" }}>
            <div className="sidebar-brand-inner">
              <span className="sidebar-brand-icon">💧</span>
              <span className="sidebar-brand-text">Air Ku</span>
            </div>
          </Link>
        </div>


        <div className="sidebar-search">
          <input type="text" placeholder="Search" />
        </div>
        <nav className="sidebar-nav">
          {NAV_ITEMS.map((item) => {
            const isActive = item.path === "/" ? pathname === "/" : pathname.startsWith(item.path);
            return (
              <Link
                href={item.path}
                key={item.key}
                className={`nav-item${isActive ? " active" : ""}`}
                style={{ textDecoration: "none" }}
              >
                <span className={`nav-dot${isActive ? " filled" : ""}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        {/* Bottom sidebar: Theme Toggle + Admin Login */}
        <div style={{ padding: "16px", marginTop: "auto", display: "flex", flexDirection: "column", gap: "10px" }}>
          {/* Dark Mode Toggle for User Interface */}
          <button className="theme-toggle-btn" onClick={toggleTheme} title={isDark ? "Beralih ke Mode Terang" : "Beralih ke Mode Gelap"}>
            <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              {isDark ? "🌙" : "☀️"}
              {isDark ? "Mode Gelap" : "Mode Terang"}
            </span>
            <div className={`theme-toggle-pill${isDark ? " dark" : ""}`}>
              <div className="theme-toggle-thumb" />
            </div>
          </button>

          {/* Admin Login Link */}
          <Link
            href="/admin/login"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              padding: "10px 20px",
              background: "rgba(255,255,255,0.15)",
              color: "white",
              borderRadius: "8px",
              textDecoration: "none",
              fontSize: "0.9rem",
              fontWeight: 500,
              border: "1px solid rgba(255,255,255,0.2)",
              width: "100%",
              boxSizing: "border-box",
              transition: "background 0.2s"
            }}
            onMouseOver={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.25)"}
            onMouseOut={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.15)"}
            title="Masuk sebagai Administrator"
          >
            <span style={{ fontSize: "1.1rem" }}>🔐</span> Login Admin
          </Link>
          <span style={{ textAlign: "center", fontSize: "0.75rem", color: "rgba(255,255,255,0.4)" }}>v1.0.1</span>
        </div>
      </aside>

      {/* ═══════════ KONTEN UTAMA ═══════════ */}
      <main className="main-content relative overflow-x-hidden">
        {children}
      </main>
      <GlobalNotification />
    </div>
  );
}
