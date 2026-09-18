import React from 'react';
import { User, DatabaseConfig } from '../types';
import { Ship, Anchor, Database, LogOut, Bell, Shield, UserCheck } from 'lucide-react';

interface NavbarProps {
  user: User;
  dbConfig: DatabaseConfig;
  onLogout: () => void;
  onOpenDbConfig: () => void;
  onOpenNotifications: () => void;
  unreadNotificationsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  dbConfig,
  onLogout,
  onOpenDbConfig,
  onOpenNotifications,
  unreadNotificationsCount
}) => {
  return (
    <header className="bg-slate-900 text-white shadow-md sticky top-0 z-50 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="bg-blue-600 p-2.5 rounded-xl shadow-lg flex items-center justify-center">
            <Anchor className="w-6 h-6 text-white animate-pulse" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
              PelniOS <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/30">Enterprise v2.5</span>
            </h1>
            <p className="text-xs text-slate-400">Sistem Manajemen Muatan Kapal & Penumpang</p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          
          {/* Database Status Pill */}
          <button
            onClick={onOpenDbConfig}
            className="hidden md:flex items-center space-x-2 bg-slate-800 hover:bg-slate-700/80 px-3 py-1.5 rounded-lg border border-slate-700 text-xs transition-colors"
            title="Status Database & Koneksi"
          >
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-300 font-medium capitalize">{dbConfig.provider} DB</span>
            <span className={`w-2 h-2 rounded-full ${dbConfig.isConnected ? 'bg-emerald-500 animate-ping' : 'bg-amber-500'}`}></span>
          </button>

          {/* Notification Bell */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            title="Pusat Notifikasi Otomatis"
          >
            <Bell className="w-5 h-5" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {/* User Profile */}
          <div className="flex items-center space-x-3 pl-3 border-l border-slate-700">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-semibold text-slate-200">{user.fullName}</p>
              <p className="text-[11px] text-blue-400 uppercase tracking-wide flex items-center justify-end gap-1">
                <Shield className="w-3 h-3" /> {user.role}
              </p>
            </div>
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-white shadow">
              {user.fullName.charAt(0)}
            </div>
            <button
              onClick={onLogout}
              className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
              title="Keluar (Logout)"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>

        </div>

      </div>
    </header>
  );
};
