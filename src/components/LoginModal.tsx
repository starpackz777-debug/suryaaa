import React, { useState } from 'react';
import { apiLogin } from '../lib/api';
import { User } from '../types';
import { Anchor, ShieldCheck, Lock, User as UserIcon, ArrowRight, CheckCircle2 } from 'lucide-react';

interface LoginModalProps {
  onLoginSuccess: (user: User) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await apiLogin(username, password);
      if (res.success && res.user) {
        onLoginSuccess(res.user);
      } else {
        setError(res.message || 'Login gagal. Periksa kembali username dan password.');
      }
    } catch (err) {
      setError('Terjadi kesalahan koneksi server.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (demoUser: string, demoPass: string) => {
    setUsername(demoUser);
    setPassword(demoPass);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden transition-all">
        
        {/* Header Header */}
        <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-950 p-8 text-center relative border-b border-slate-800">
          <div className="mx-auto w-16 h-16 bg-blue-600 rounded-2xl shadow-xl flex items-center justify-center mb-4 text-white">
            <Anchor className="w-8 h-8 animate-bounce" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">PelniOS Portal</h2>
          <p className="text-xs text-slate-400 mt-1">Sistem Manajemen Muatan Kapal & Penumpang</p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs p-3.5 rounded-xl text-center">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Nama / Username Bebas
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                  <UserIcon className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="Ketik nama bebas (contoh: Budi, Kapten Joko)..."
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-blue-600/30 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
          >
            {loading ? (
              <span>Memproses Autentikasi...</span>
            ) : (
              <>
                <span>Masuk ke Sistem</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {/* Quick Demo Accounts */}
          <div className="pt-4 border-t border-slate-800 text-center">
            <p className="text-[11px] text-slate-400 mb-2">Akun Demo Cepat (Klik untuk isi):</p>
            <div className="flex flex-wrap gap-2 justify-center">
              <button
                type="button"
                onClick={() => handleDemoLogin('admin', 'admin123')}
                className="text-[11px] bg-slate-800 hover:bg-slate-700 text-blue-400 px-3 py-1.5 rounded-lg border border-slate-700 transition-colors flex items-center gap-1"
              >
                <ShieldCheck className="w-3 h-3" /> Admin
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('dispatcher', 'pass123')}
                className="text-[11px] bg-slate-800 hover:bg-slate-700 text-emerald-400 px-3 py-1.5 rounded-lg border border-slate-700 transition-colors flex items-center gap-1"
              >
                <CheckCircle2 className="w-3 h-3" /> Dispatcher
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('captain', 'pass123')}
                className="text-[11px] bg-slate-800 hover:bg-slate-700 text-amber-400 px-3 py-1.5 rounded-lg border border-slate-700 transition-colors"
              >
                Captain
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
