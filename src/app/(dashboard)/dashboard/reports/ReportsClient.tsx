"use client";

import { BarChart3, TrendingUp, Users, Building, ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function ReportsClient({ 
  paymentsData, 
  roomsCount, 
  rentersCount 
}: { 
  paymentsData: any[], 
  roomsCount: number, 
  rentersCount: number 
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);
  };

  // Kalkulasi Keuangan
  const totalPendapatanLunas = paymentsData.filter(p => p.status === 'paid').reduce((sum, p) => sum + Number(p.amount), 0);
  const totalPiutang = paymentsData.filter(p => p.status === 'unpaid').reduce((sum, p) => sum + Number(p.amount), 0);

  // Kalkulasi Tingkat Hunian (Occupancy Rate)
  const occupancyRate = roomsCount === 0 ? 0 : Math.round((rentersCount / roomsCount) * 100);

  // Olah Data untuk Grafik (Agregat Pendapatan per Bulan berdasarkan tanggal bayar)
  const monthlyRevenue: Record<string, number> = {};
  
  // Inisialisasi 6 bulan terakhir dengan 0 (untuk tampilan grafik yang rapi)
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des"];
  const currentDate = new Date();
  
  for (let i = 5; i >= 0; i--) {
    const d = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    const label = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
    monthlyRevenue[label] = 0;
  }

  // Isi data pemasukan aktual
  paymentsData.forEach(p => {
    if (p.status === 'paid' && p.paid_at) {
      const date = new Date(p.paid_at);
      const label = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
      // Jika label ada dalam rentang 6 bulan terakhir, tambahkan
      if (monthlyRevenue[label] !== undefined) {
        monthlyRevenue[label] += Number(p.amount);
      }
    }
  });

  const chartData = {
    labels: Object.keys(monthlyRevenue),
    datasets: [
      {
        label: 'Pendapatan (Rp)',
        data: Object.values(monthlyRevenue),
        backgroundColor: 'rgba(59, 35, 198, 0.8)', // #3b23c6
        borderRadius: 6,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: '#f3f4f6', // gray-100
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Laporan & Analitik Kos</h1>
          <p className="text-gray-500 mt-1">
            Pantau kinerja keuangan dan tingkat hunian properti Anda.
          </p>
        </div>
      </div>

      {/* Statistik Ringkas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 bg-green-50 text-green-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <p className="text-sm font-medium text-gray-500 mb-1">Total Pendapatan</p>
          <h3 className="text-2xl font-bold text-gray-900">{formatCurrency(totalPendapatanLunas)}</h3>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5" />
            </div>
          </div>
          <p className="text-sm font-medium text-gray-500 mb-1">Piutang (Belum Lunas)</p>
          <h3 className="text-2xl font-bold text-gray-900">{formatCurrency(totalPiutang)}</h3>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
              <Building className="w-5 h-5" />
            </div>
          </div>
          <p className="text-sm font-medium text-gray-500 mb-1">Tingkat Hunian</p>
          <div className="flex items-end gap-2">
            <h3 className="text-2xl font-bold text-gray-900">{occupancyRate}%</h3>
            <span className="text-sm text-gray-500 mb-1">({rentersCount}/{roomsCount} Kamar)</span>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-gray-100 rounded-full h-1.5 mt-3 overflow-hidden">
            <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${occupancyRate}%` }}></div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <p className="text-sm font-medium text-gray-500 mb-1">Total Penyewa Aktif</p>
          <h3 className="text-2xl font-bold text-gray-900">{rentersCount} Orang</h3>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-900">Grafik Pendapatan (6 Bulan Terakhir)</h2>
          <span className="flex items-center gap-1 text-sm font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full">
            Lunas Saja
          </span>
        </div>
        
        <div className="w-full h-[300px]">
          {mounted && paymentsData.length > 0 ? (
            <Bar data={chartData} options={chartOptions} />
          ) : mounted ? (
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
              <BarChart3 className="w-12 h-12 mb-3 opacity-20" />
              <p>Belum ada data pendapatan historis.</p>
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 animate-pulse">Memuat grafik...</div>
          )}
        </div>
      </div>
    </div>
  );
}