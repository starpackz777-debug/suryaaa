import React from 'react';
import { LayoutDashboard, Database, Layers, Navigation, FileText, Bell, Server } from 'lucide-react';

export type ActiveTab = 'dashboard' | 'master' | 'transactions' | 'tracking' | 'reports' | 'database' | 'notifications';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard' as ActiveTab, label: 'Dashboard Analitik', icon: LayoutDashboard },
    { id: 'master' as ActiveTab, label: 'Master Data', icon: Database },
    { id: 'transactions' as ActiveTab, label: 'Transaksi Data', icon: Layers },
    { id: 'tracking' as ActiveTab, label: 'Pelacakan Realtime', icon: Navigation },
    { id: 'reports' as ActiveTab, label: 'Laporan & Rekap', icon: FileText },
    { id: 'database' as ActiveTab, label: 'Konfigurasi Database', icon: Server },
    { id: 'notifications' as ActiveTab, label: 'Notifikasi Otomatis', icon: Bell },
  ];

  return (
    <aside className="w-full md:w-64 bg-slate-900 border-r border-slate-800 p-4 flex md:flex-col justify-between shrink-0 overflow-x-auto">
      <div className="flex md:flex-col space-x-2 md:space-x-0 md:space-y-1.5 w-full">
        <div className="hidden md:block px-3 py-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
          Menu Utama
        </div>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span className="hidden md:inline">{item.label}</span>
            </button>
          );
        })}
      </div>

      <div className="hidden md:block mt-6 p-3.5 bg-slate-800/60 rounded-xl border border-slate-700/60">
        <div className="flex items-center space-x-2 mb-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-xs font-semibold text-slate-200">Sistem Online</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Sinkronisasi real-time aktif dengan Supabase, Neon DB, & Firebase Gateway.
        </p>
      </div>
    </aside>
  );
};
