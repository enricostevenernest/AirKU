"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/app/lib/supabase";
import {
    MaintenanceSchedule,
    JENIS_LABEL,
    INSTALASI_LABEL,
} from "@/app/maintenance/frontend/types";
import {
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { Settings, CheckCircle, Clock, AlertTriangle, Activity } from "lucide-react";

// Helper function to compute status
function computeStatus(s: MaintenanceSchedule): MaintenanceSchedule["status"] {
    if (s.status === "selesai") return "selesai";
    if (s.is_deleted) return s.status;
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const target = new Date(s.tanggal_mulai); target.setHours(0, 0, 0, 0);
    const diff = Math.ceil((target.getTime() - today.getTime()) / 86400000);
    if (diff < 0) return "terlambat";
    if (diff <= 3) return "segera";
    return "terjadwal";
}

// color statistics
const COLORS = ["#145d82", "#6393b0", "#97d5f9", "#38bdf8", "#0284c7", "#0ea5e9"];
const STATUS_COLORS = {
    selesai: "#10b981", // green
    terjadwal: "#3b82f6", // blue
    segera: "#f59e0b", // yellow
    terlambat: "#ef4444", // red
};

export default function StatistikPage() {
    const [schedules, setSchedules] = useState<MaintenanceSchedule[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSchedules = async () => {
            try {
                const supabase = createClient();
                const { data, error } = await supabase.from("maintenance_schedules").select("*");
                if (!error && data) {
                    const updated = data.map((s: any) => ({ ...s, status: computeStatus(s) }));
                    setSchedules(updated);
                }
            } catch (err) {
                console.error("Failed to fetch schedules", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchSchedules();
    }, []);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-full w-full py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#145d82]"></div>
            </div>
        );
    }

    // Calculate stats
    // Only count active schedules (not deleted)
    const activeSchedules = schedules.filter(s => !s.is_deleted);
    const totalSchedules = activeSchedules.length;

    const statusCounts = activeSchedules.reduce((acc, curr) => {
        acc[curr.status] = (acc[curr.status] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const jenisData = Object.entries(
        activeSchedules.reduce((acc, curr) => {
            const label = JENIS_LABEL[curr.jenis_perawatan] || curr.jenis_perawatan;
            acc[label] = (acc[label] || 0) + 1;
            return acc;
        }, {} as Record<string, number>)
    ).map(([name, value]) => ({ name, value: value as number })).sort((a, b) => b.value - a.value);

    const instalasiData = Object.entries(
        activeSchedules.reduce((acc, curr) => {
            const label = INSTALASI_LABEL[curr.tipe_instalasi] || curr.tipe_instalasi;
            acc[label] = (acc[label] || 0) + 1;
            return acc;
        }, {} as Record<string, number>)
    ).map(([name, value]) => ({ name, value: value as number })).sort((a, b) => b.value - a.value);

    const statusData = [
        { name: "Selesai", value: statusCounts["selesai"] || 0, color: STATUS_COLORS.selesai },
        { name: "Terjadwal", value: statusCounts["terjadwal"] || 0, color: STATUS_COLORS.terjadwal },
        { name: "Segera", value: statusCounts["segera"] || 0, color: STATUS_COLORS.segera },
        { name: "Terlambat", value: statusCounts["terlambat"] || 0, color: STATUS_COLORS.terlambat },
    ].filter(item => item.value > 0);

    return (
        <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-[#145d82] mb-2 font-serif">Statistik Perawatan</h2>
                <p className="text-gray-500">Melihat ringkasan data dan jadwal perawatan air</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4 transition-transform hover:-translate-y-1 hover:shadow-md duration-300">
                    <div className="p-4 bg-blue-50 rounded-xl text-blue-500">
                        <Activity size={28} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Total Jadwal</p>
                        <p className="text-3xl font-bold text-gray-800">{totalSchedules}</p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4 transition-transform hover:-translate-y-1 hover:shadow-md duration-300">
                    <div className="p-4 bg-green-50 rounded-xl text-green-500">
                        <CheckCircle size={28} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Selesai</p>
                        <p className="text-3xl font-bold text-gray-800">{statusCounts["selesai"] || 0}</p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4 transition-transform hover:-translate-y-1 hover:shadow-md duration-300">
                    <div className="p-4 bg-yellow-50 rounded-xl text-yellow-500">
                        <Clock size={28} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Segera/Terjadwal</p>
                        <p className="text-3xl font-bold text-gray-800">{(statusCounts["segera"] || 0) + (statusCounts["terjadwal"] || 0)}</p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4 transition-transform hover:-translate-y-1 hover:shadow-md duration-300">
                    <div className="p-4 bg-red-50 rounded-xl text-red-500">
                        <AlertTriangle size={28} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Terlambat</p>
                        <p className="text-3xl font-bold text-gray-800">{statusCounts["terlambat"] || 0}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                {/* Status Chart */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                    <h3 className="text-xl font-bold text-[#145d82] mb-6 flex items-center gap-2">
                        <Settings size={20} />
                        Status Perawatan
                    </h3>
                    {statusData.length > 0 ? (
                        <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={statusData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={70}
                                        outerRadius={100}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {statusData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Legend verticalAlign="bottom" height={36} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="h-72 flex items-center justify-center text-gray-400">Tidak ada data</div>
                    )}
                </div>

                {/* Instalasi Chart */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                    <h3 className="text-xl font-bold text-[#145d82] mb-6">Distribusi Tipe Instalasi</h3>
                    {instalasiData.length > 0 ? (
                        <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={instalasiData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f0f0f0" />
                                    <XAxis type="number" />
                                    <YAxis dataKey="name" type="category" width={120} tick={{ fill: '#666', fontSize: 12 }} />
                                    <Tooltip
                                        cursor={{ fill: '#f8fafc' }}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Bar dataKey="value" fill="#6393b0" radius={[0, 4, 4, 0]}>
                                        {instalasiData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="h-72 flex items-center justify-center text-gray-400">Tidak ada data</div>
                    )}
                </div>
            </div>

            {/* Jenis Perawatan Bar Chart */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mt-6 hover:shadow-md transition-shadow duration-300">
                <h3 className="text-xl font-bold text-[#145d82] mb-6">Frekuensi Berdasarkan Jenis Perawatan</h3>
                {jenisData.length > 0 ? (
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={jenisData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis
                                    dataKey="name"
                                    tick={{ fill: '#666', fontSize: 12 }}
                                    interval={0}
                                    angle={-25}
                                    textAnchor="end"
                                    height={60}
                                />
                                <YAxis allowDecimals={false} />
                                <Tooltip
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="value" fill="#145d82" radius={[6, 6, 0, 0]} maxBarSize={60}>
                                    {jenisData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <div className="h-80 flex items-center justify-center text-gray-400">Tidak ada data</div>
                )}
            </div>
        </div>
    );
}
