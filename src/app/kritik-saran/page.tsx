// SCRUM - PBI: Tampilan Halaman Kritik dan Saran
// SCRUM-246: Membuat Route dan Halaman Baru kritik dan saran
// SCRUM-247: Melakukan slicing layout kerangka halaman
// SCRUM-248: Membangun elemen UI form lengkap
// SCRUM-249: Meningkatkan form lebih menarik dan selaras


import type { Metadata } from "next";
import KritikSaranForm from "./components/KritikSaranForm";
import PageHeader from "./components/PageHeader";

export const metadata: Metadata = {
  title: "Kritik & Saran – Air Ku",
  description:
    "Sampaikan kritik, saran, dan masukan Anda untuk membantu kami meningkatkan kualitas aplikasi Air Ku.",
};

export default function KritikSaranPage() {
  // Data gelembung: [left%, size-rem, delay-s, duration-s, opacity]
  const bubbles = [
    { left: 5,  size: 1.8, delay: 0,   dur: 7,  op: 0.18 },
    { left: 12, size: 3.2, delay: 1.5, dur: 10, op: 0.12 },
    { left: 22, size: 1.2, delay: 3,   dur: 8,  op: 0.22 },
    { left: 35, size: 2.5, delay: 0.8, dur: 12, op: 0.14 },
    { left: 48, size: 1.5, delay: 5,   dur: 9,  op: 0.20 },
    { left: 58, size: 3.8, delay: 2,   dur: 14, op: 0.10 },
    { left: 67, size: 1.0, delay: 4.5, dur: 7,  op: 0.25 },
    { left: 75, size: 2.8, delay: 1,   dur: 11, op: 0.13 },
    { left: 83, size: 1.6, delay: 6,   dur: 8,  op: 0.18 },
    { left: 90, size: 2.2, delay: 3.5, dur: 10, op: 0.15 },
    { left: 95, size: 1.1, delay: 0.5, dur: 6,  op: 0.22 },
    { left: 28, size: 4.0, delay: 7,   dur: 15, op: 0.08 },
  ];

  // Data tetesan melayang: [top%, left%, scale, delay-s, dur-s]
  const drops = [
    { top: 8,  left: 8,  scale: 0.9, delay: 0,   dur: 6  },
    { top: 15, left: 88, scale: 1.2, delay: 2,   dur: 8  },
    { top: 60, left: 5,  scale: 0.7, delay: 4,   dur: 7  },
    { top: 75, left: 92, scale: 1.0, delay: 1,   dur: 9  },
    { top: 40, left: 96, scale: 0.8, delay: 5.5, dur: 6  },
    { top: 30, left: 2,  scale: 1.1, delay: 3,   dur: 8  },
  ];

  return (
    <main className="kritik-saran-page">

      {/* ===== LAPISAN ANIMASI AIR ===== */}
      <div className="water-bg" aria-hidden="true">

        {/* Gelembung mengambang */}
        {bubbles.map((b, i) => (
          <span
            key={i}
            className="water-bubble"
            style={{
              left: `${b.left}%`,
              width: `${b.size}rem`,
              height: `${b.size}rem`,
              animationDelay: `${b.delay}s`,
              animationDuration: `${b.dur}s`,
              opacity: b.op,
            }}
          />
        ))}

        {/* Tetesan air melayang */}
        {drops.map((d, i) => (
          <span
            key={i}
            className="water-drop"
            style={{
              top: `${d.top}%`,
              left: `${d.left}%`,
              transform: `scale(${d.scale})`,
              animationDelay: `${d.delay}s`,
              animationDuration: `${d.dur}s`,
            }}
          />
        ))}

        {/* Ombak berlapis — Layer 1 (depan, lebih cepat) */}
        <div className="wave-layer wave-layer--1">
          <svg viewBox="0 0 1440 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,60 C240,110 480,10 720,60 C960,110 1200,10 1440,60 L1440,120 L0,120 Z" />
          </svg>
        </div>

        {/* Ombak berlapis — Layer 2 (tengah) */}
        <div className="wave-layer wave-layer--2">
          <svg viewBox="0 0 1440 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,80 C360,20 720,120 1080,50 C1260,20 1350,70 1440,80 L1440,120 L0,120 Z" />
          </svg>
        </div>

        {/* Ombak berlapis — Layer 3 (belakang, paling lambat) */}
        <div className="wave-layer wave-layer--3">
          <svg viewBox="0 0 1440 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,40 C180,90 360,10 540,50 C720,90 900,20 1080,60 C1260,90 1380,30 1440,40 L1440,120 L0,120 Z" />
          </svg>
        </div>
      </div>
      {/* ===== AKHIR LAPISAN ANIMASI AIR ===== */}

      {/* Konten utama */}
      <div className="kritik-saran-container">
        {/* Subtask 1.2: Header & Layout */}
        <PageHeader />

        {/* Subtask 1.3 & 1.4: Form UI + UX */}
        <KritikSaranForm />
      </div>
    </main>
  );
}
