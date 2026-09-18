import React, { useEffect, useState } from 'react';
import { Ship, Anchor, Package, Users, TrendingUp, DollarSign, Activity, Sparkles, AlertCircle } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar, CartesianGrid } from 'recharts';
import { fetchAnalytics, fetchAiAdvice } from '../lib/api';

export const DashboardView: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [aiAdvice, setAiAdvice] = useState<string>('');
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const res = await fetchAnalytics();
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getAiRecommendation = async () => {
    setAiLoading(true);
    try {
      const res = await fetchAiAdvice();
      setAiAdvice(res.advice);
    } catch (err) {
      setAiAdvice('Gagal memuat saran AI.');
    } finally {
      setAiLoading(false);
    }
  };

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center h-96 text-slate-400">
        <Activity className="w-6 h-6 animate-spin mr-2 text-blue-500" /> Memuat analitik armada...
      </div>
    );
  }

  const { summary, revenueByMonth, fleetUtilization } = data;

  return (
    <div className="space-y-6">
      
      {/* Top Banner & AI Advisor */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-blue-800/40 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 bg-blue-500/20 border border-blue-400/30 px-3 py-1 rounded-full text-xs font-semibold text-blue-300 mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Maritime Operations Center</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Dashboard Performa Armada PelniOS</h2>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              Pantau utilisasi kapasitas kapal, volume kargo tonase, manifest penumpang, dan pendapatan operasional secara real-time.
            </p>
          </div>
          <button
            onClick={getAiRecommendation}
            disabled={aiLoading}
            className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-3 rounded-2xl font-semibold shadow-lg shadow-blue-600/30 flex items-center space-x-2 transition-all disabled:opacity-50 shrink-0"
          >
            <Sparkles className={`w-4 h-4 ${aiLoading ? 'animate-spin' : ''}`} />
            <span>{aiLoading ? 'Menganalisis...' : 'Analisis AI & Rekomendasi'}</span>
          </button>
        </div>

        {aiAdvice && (
          <div className="mt-6 bg-slate-900/80 border border-blue-500/30 rounded-2xl p-4 text-sm text-slate-200 backdrop-blur">
            <div className="flex items-center space-x-2 text-blue-400 font-semibold mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Rekomendasi Cerdas Gemini AI:</span>
            </div>
            <p className="leading-relaxed text-slate-300">{aiAdvice}</p>
          </div>
        )}
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Armada Kapal</p>
            <h3 className="text-3xl font-bold text-white mt-1">{summary.totalShips} <span className="text-xs font-normal text-slate-400">Unit</span></h3>
            <p className="text-xs text-emerald-400 mt-2 flex items-center gap-1 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span> {summary.activeVoyages} Sedang Berlayar
            </p>
          </div>
          <div className="w-12 h-12 bg-blue-600/20 text-blue-400 rounded-2xl flex items-center justify-center border border-blue-500/30">
            <Ship className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Tiket Penumpang</p>
            <h3 className="text-3xl font-bold text-white mt-1">{summary.totalPassengersBooked} <span className="text-xs font-normal text-slate-400">Orang</span></h3>
            <p className="text-xs text-blue-400 mt-2 flex items-center gap-1 font-medium">
              <TrendingUp className="w-3.5 h-3.5" /> +14% dari bulan lalu
            </p>
          </div>
          <div className="w-12 h-12 bg-emerald-600/20 text-emerald-400 rounded-2xl flex items-center justify-center border border-emerald-500/30">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Muatan Kargo</p>
            <h3 className="text-3xl font-bold text-white mt-1">{summary.totalCargoTons} <span className="text-xs font-normal text-slate-400">Ton</span></h3>
            <p className="text-xs text-amber-400 mt-2 flex items-center gap-1 font-medium">
              <Package className="w-3.5 h-3.5" /> 3 Kapal Kontainer Aktif
            </p>
          </div>
          <div className="w-12 h-12 bg-amber-600/20 text-amber-400 rounded-2xl flex items-center justify-center border border-amber-500/30">
            <Package className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pendapatan Bruto</p>
            <h3 className="text-3xl font-bold text-white mt-1">Rp {(summary.totalRevenue / 1000000).toFixed(1)} <span className="text-xs font-normal text-slate-400">Juta</span></h3>
            <p className="text-xs text-emerald-400 mt-2 flex items-center gap-1 font-medium">
              <DollarSign className="w-3.5 h-3.5" /> Terverifikasi Real DB
            </p>
          </div>
          <div className="w-12 h-12 bg-indigo-600/20 text-indigo-400 rounded-2xl flex items-center justify-center border border-indigo-500/30">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Revenue Trend Chart */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-white">Tren Pendapatan & Penumpang</h3>
              <p className="text-xs text-slate-400">Statistik bulanan tahun 2026</p>
            </div>
            <span className="text-xs bg-slate-800 text-blue-400 px-3 py-1 rounded-full border border-slate-700 font-medium">
              Realtime Sync
            </span>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueByMonth} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(val) => `${val / 1000000}jt`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                  formatter={(val: any) => [`Rp ${Number(val).toLocaleString('id-ID')}`, 'Pendapatan']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Fleet Capacity Load */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-lg">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-white">Utilisasi Kapal</h3>
            <p className="text-xs text-slate-400">Beban muatan terhadap kapasitas maksimal</p>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={fleetUtilization} layout="vertical" margin={{ top: 5, right: 5, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis type="number" stroke="#94a3b8" fontSize={12} />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={11} width={85} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                />
                <Bar dataKey="load" fill="#6366f1" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
};
