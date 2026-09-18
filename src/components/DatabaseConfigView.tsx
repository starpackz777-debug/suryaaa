import React, { useEffect, useState } from 'react';
import { DatabaseConfig } from '../types';
import { fetchDbConfig, updateDbConfig, testDbConnection } from '../lib/api';
import { Database, Server, CheckCircle2, RefreshCcw, ShieldCheck, AlertCircle } from 'lucide-react';

export const DatabaseConfigView: React.FC = () => {
  const [config, setConfig] = useState<DatabaseConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [testing, setTesting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const data = await fetchDbConfig();
      setConfig(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!config) return;
    try {
      const res = await updateDbConfig(config);
      setMessage(res.message);
      setConfig(res.dbConfig);
    } catch (err) {
      setMessage('Gagal menyimpan konfigurasi.');
    }
  };

  const handleTest = async () => {
    setTesting(true);
    setMessage('');
    try {
      const res = await testDbConnection();
      setMessage(res.message);
      loadConfig();
    } catch (err) {
      setMessage('Koneksi database gagal.');
    } finally {
      setTesting(false);
    }
  };

  if (loading || !config) {
    return <div className="p-12 text-center text-slate-400">Memuat konfigurasi database...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Database className="w-5 h-5 text-emerald-400" />
            <span>Konfigurasi Real Database (Multi-Provider)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">Hubungkan aplikasi ke Supabase, Neon DB (PostgreSQL), atau Firebase Firestore.</p>
        </div>
        <div className="flex items-center space-x-2 bg-slate-800 px-3.5 py-1.5 rounded-xl border border-slate-700">
          <span className={`w-2.5 h-2.5 rounded-full ${config.isConnected ? 'bg-emerald-500 animate-ping' : 'bg-amber-500'}`}></span>
          <span className="text-xs font-semibold text-slate-200">
            {config.isConnected ? 'Terhubung & Aktif' : 'Belum Terhubung'}
          </span>
        </div>
      </div>

      {message && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 p-4 rounded-2xl text-sm flex items-center space-x-2">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSave} className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-xl space-y-6">
        
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Pilih Provider Database Utama
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            <button
              type="button"
              onClick={() => setConfig({...config, provider: 'supabase'})}
              className={`p-4 rounded-2xl border text-left transition-all ${config.provider === 'supabase' ? 'bg-emerald-600/20 border-emerald-500 text-white shadow-lg' : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-750'}`}
            >
              <div className="font-bold text-base text-white">Supabase</div>
              <div className="text-xs mt-1 text-slate-300">PostgreSQL Cloud + Realtime API</div>
            </button>

            <button
              type="button"
              onClick={() => setConfig({...config, provider: 'neon'})}
              className={`p-4 rounded-2xl border text-left transition-all ${config.provider === 'neon' ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg' : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-750'}`}
            >
              <div className="font-bold text-base text-white">Neon DB</div>
              <div className="text-xs mt-1 text-slate-300">Serverless PostgreSQL Engine</div>
            </button>

            <button
              type="button"
              onClick={() => setConfig({...config, provider: 'firebase'})}
              className={`p-4 rounded-2xl border text-left transition-all ${config.provider === 'firebase' ? 'bg-amber-600/20 border-amber-500 text-white shadow-lg' : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-750'}`}
            >
              <div className="font-bold text-base text-white">Firebase</div>
              <div className="text-xs mt-1 text-slate-300">Google Cloud Firestore NoSQL</div>
            </button>

          </div>
        </div>

        {/* Dynamic Fields */}
        {config.provider === 'supabase' && (
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <h3 className="text-sm font-bold text-white">Kredensial Supabase</h3>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Supabase Project URL</label>
              <input
                type="text"
                value={config.supabaseUrl || ''}
                onChange={e => setConfig({...config, supabaseUrl: e.target.value})}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white font-mono"
                placeholder="https://xyz.supabase.co"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Supabase Anon / Service Key</label>
              <input
                type="password"
                value={config.supabaseKey || ''}
                onChange={e => setConfig({...config, supabaseKey: e.target.value})}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white font-mono"
                placeholder="eyJhbGciOi..."
              />
            </div>
          </div>
        )}

        {config.provider === 'neon' && (
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <h3 className="text-sm font-bold text-white">Kredensial Neon DB (PostgreSQL)</h3>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Connection String (URI)</label>
              <input
                type="text"
                value={config.neonConnectionString || ''}
                onChange={e => setConfig({...config, neonConnectionString: e.target.value})}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white font-mono"
                placeholder="postgresql://user:password@ep-xyz.us-east-2.aws.neon.tech/neondb?sslmode=require"
              />
            </div>
          </div>
        )}

        {config.provider === 'firebase' && (
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <h3 className="text-sm font-bold text-white">Kredensial Firebase Firestore</h3>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Firebase Project ID</label>
              <input
                type="text"
                value={config.firebaseProjectId || ''}
                onChange={e => setConfig({...config, firebaseProjectId: e.target.value})}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white font-mono"
                placeholder="pelni-ship-app-prod"
              />
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={handleTest}
            disabled={testing}
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-sm flex items-center space-x-2 border border-slate-700 transition-colors"
          >
            <RefreshCcw className={`w-4 h-4 ${testing ? 'animate-spin' : ''}`} />
            <span>{testing ? 'Menguji Koneksi...' : 'Test Koneksi DB'}</span>
          </button>

          <button
            type="submit"
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-sm shadow-lg shadow-blue-600/30 transition-all"
          >
            Simpan Konfigurasi
          </button>
        </div>

      </form>

    </div>
  );
};
