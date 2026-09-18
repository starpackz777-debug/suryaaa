import React, { useEffect, useState } from 'react';
import { NotificationLog } from '../types';
import { fetchEntities, sendNotification } from '../lib/api';
import { Bell, Send, CheckCircle2, MessageSquare, Mail, Plus } from 'lucide-react';

export const NotificationsView: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [recipientName, setRecipientName] = useState('');
  const [recipientContact, setRecipientContact] = useState('');
  const [channel, setChannel] = useState<'WhatsApp' | 'Email'>('WhatsApp');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const data = await fetchEntities<NotificationLog>('/api/notifications');
      setNotifications(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setSuccessMsg('');
    try {
      await sendNotification({ recipientName, recipientContact, channel, message });
      setSuccessMsg('Notifikasi otomatis berhasil dikirim ke pelanggan!');
      setRecipientName('');
      setRecipientContact('');
      setMessage('');
      loadNotifications();
    } catch (err) {
      alert('Gagal mengirim notifikasi.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-400" />
            <span>Pusat Notifikasi Otomatis Pelanggan</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">Kirim peringatan jadwal keberangkatan kapal, resi kargo, dan konfirmasi tiket via WhatsApp & Email.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Send Notification Form */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
          <h3 className="text-base font-bold text-white mb-4">Kirim Notifikasi Baru</h3>
          
          {successMsg && (
            <div className="mb-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 p-3 rounded-xl text-xs flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSend} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Nama Penerima</label>
              <input
                type="text"
                value={recipientName}
                onChange={e => setRecipientName(e.target.value)}
                required
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white"
                placeholder="Contoh: Budi Santoso"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Nomor WhatsApp / Email</label>
              <input
                type="text"
                value={recipientContact}
                onChange={e => setRecipientContact(e.target.value)}
                required
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white"
                placeholder="08123456789 atau email@domain.com"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Saluran Pengiriman</label>
              <select
                value={channel}
                onChange={e => setChannel(e.target.value as any)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white"
              >
                <option value="WhatsApp">WhatsApp Gateway</option>
                <option value="Email">Email SMTP</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Pesan / Informasi</label>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                required
                rows={3}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white"
                placeholder="Tulis pesan untuk pelanggan..."
              />
            </div>

            <button
              type="submit"
              disabled={sending}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl text-sm shadow-lg shadow-blue-600/30 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{sending ? 'Mengirim...' : 'Kirim Notifikasi'}</span>
            </button>
          </form>
        </div>

        {/* Notifications History Log */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
          <h3 className="text-base font-bold text-white mb-4">Riwayat Log Notifikasi</h3>
          
          {loading ? (
            <div className="py-12 text-center text-slate-400">Memuat riwayat...</div>
          ) : (
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
              {notifications.map(n => (
                <div key={n.id} className="bg-slate-800/60 border border-slate-700/60 p-4 rounded-2xl flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-bold text-white">{n.recipientName}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${n.channel === 'WhatsApp' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-blue-500/20 text-blue-300'}`}>
                        {n.channel}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">({n.recipientContact})</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{n.message}</p>
                    <p className="text-[11px] text-slate-400">{n.timestamp}</p>
                  </div>
                  <span className="shrink-0 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded-lg text-xs font-semibold">
                    {n.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
