"use client";

import { useState } from "react";
import { Bell } from "lucide-react";
import Link from "next/link";
import { useNotifications } from "../app/lib/notification";
import { JENIS_LABEL } from "../app/maintenance/frontend/types";

export default function GlobalNotification() {
  const { notifications, loading } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  // Jangan tampilkan widget jika masih loading atau tidak ada notifikasi
  if (loading || notifications.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Notification Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center justify-center w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105 active:scale-95 border-2 border-white/20"
        aria-label="Notifikasi"
      >
        <Bell size={24} className="animate-pulse" />
        <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full border-2 border-white shadow-sm">
          {notifications.length}
        </span>
      </button>

      {/* Notification Panel */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 sm:w-96 bg-white/95 backdrop-blur-md rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.3)] border border-gray-100/50 overflow-hidden flex flex-col transform origin-bottom-right transition-all animate-in fade-in zoom-in-95 duration-200">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-5 py-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-2">
              <Bell size={18} className="opacity-80" />
              <h3 className="font-semibold tracking-wide">Pengingat Perawatan</h3>
            </div>
            <span className="text-xs bg-white/20 text-white font-medium px-2.5 py-1 rounded-full backdrop-blur-sm">
              {notifications.length} tugas
            </span>
          </div>
          
          <div className="max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
            {notifications.map((notif) => (
              <div key={notif.id} className="p-4 border-b border-gray-100 hover:bg-blue-50/50 transition-colors group">
                <div className="flex justify-between items-start mb-1.5">
                  <span className="font-medium text-sm text-gray-800 group-hover:text-blue-700 transition-colors">
                    {JENIS_LABEL[notif.jenis_perawatan] || notif.jenis_perawatan}
                  </span>
                  <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-wider ${
                    notif.status === 'terlambat' 
                      ? 'bg-red-100 text-red-700 border border-red-200' 
                      : 'bg-amber-100 text-amber-700 border border-amber-200'
                  }`}>
                    {notif.status === 'terlambat' ? 'Terlambat' : 'Segera'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  <span>
                    Jadwal: {new Date(notif.tanggal_mulai).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-center">
            <Link 
              href="/maintenance" 
              onClick={() => setIsOpen(false)}
              className="text-sm text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 transition-colors group"
            >
              Lakukan Perawatan Sekarang
              <span className="transform group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
