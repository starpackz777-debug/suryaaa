import React, { useEffect, useState } from 'react';
import { Booking, Cargo, VoyageSchedule, Passenger, Route, Ship } from '../types';
import { fetchEntities, createEntity, updateEntity, deleteEntity } from '../lib/api';
import { Layers, Package, Calendar, Users, Plus, Edit2, Trash2, Search, X } from 'lucide-react';

export const TransactionsView: React.FC = () => {
  const [subTab, setSubTab] = useState<'bookings' | 'cargo' | 'schedules'>('bookings');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [cargoList, setCargoList] = useState<Cargo[]>([]);
  const [schedules, setSchedules] = useState<VoyageSchedule[]>([]);
  const [passengers, setPassengers] = useState<Passenger[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [ships, setShips] = useState<Ship[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [b, c, sch, p, r, s] = await Promise.all([
        fetchEntities<Booking>('/api/bookings'),
        fetchEntities<Cargo>('/api/cargo'),
        fetchEntities<VoyageSchedule>('/api/schedules'),
        fetchEntities<Passenger>('/api/passengers'),
        fetchEntities<Route>('/api/routes'),
        fetchEntities<Ship>('/api/ships')
      ]);
      setBookings(b);
      setCargoList(c);
      setSchedules(sch);
      setPassengers(p);
      setRoutes(r);
      setShips(s);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingItem(null);
    if (subTab === 'bookings') {
      setFormData({
        passengerId: passengers[0]?.id || '',
        routeId: routes[0]?.id || '',
        shipId: ships[0]?.id || '',
        ticketClass: 'Ekonomi',
        seatNumber: 'A-' + Math.floor(10 + Math.random() * 90),
        price: 450000,
        status: 'Confirmed',
        departureDate: '2026-09-20'
      });
    } else if (subTab === 'cargo') {
      setFormData({
        consignorName: 'PT. Sumber Logistik',
        consignorPhone: '0811223344',
        consigneeName: 'CV. Maju Jaya',
        consigneePhone: '0819988776',
        itemDescription: 'Barang Kelontong & Sembako (10 Ton)',
        weightTons: 10,
        volumeM3: 25,
        shipId: ships[0]?.id || '',
        routeId: routes[0]?.id || '',
        shippingCost: 8500000,
        status: 'Menunggu Muat',
        currentLocation: 'Pelabuhan Asal',
        estimatedDelivery: '2026-09-22'
      });
    } else if (subTab === 'schedules') {
      setFormData({
        shipId: ships[0]?.id || '',
        routeId: routes[0]?.id || '',
        departureTime: '2026-09-20 08:00',
        arrivalTime: '2026-09-21 08:00',
        status: 'Dijadwalkan'
      });
    }
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setEditingItem(item);
    setFormData({ ...item });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus transaksi ini?')) return;
    try {
      if (subTab === 'bookings') await deleteEntity('/api/bookings', id);
      else if (subTab === 'cargo') await deleteEntity('/api/cargo', id);
      else if (subTab === 'schedules') await deleteEntity('/api/schedules', id);
      loadData();
    } catch (err) {
      alert('Gagal menghapus transaksi.');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let endpoint = '';
      if (subTab === 'bookings') endpoint = '/api/bookings';
      else if (subTab === 'cargo') endpoint = '/api/cargo';
      else if (subTab === 'schedules') endpoint = '/api/schedules';

      if (editingItem) {
        await updateEntity(endpoint, editingItem.id, formData);
      } else {
        await createEntity(endpoint, formData);
      }
      setIsModalOpen(false);
      loadData();
    } catch (err) {
      alert('Gagal menyimpan transaksi.');
    }
  };

  const filteredBookings = bookings.filter(b => (b.bookingCode && b.bookingCode.toLowerCase().includes(search.toLowerCase())) || (b.passengerName && b.passengerName.toLowerCase().includes(search.toLowerCase())));
  const filteredCargo = cargoList.filter(c => (c.trackingNumber && c.trackingNumber.toLowerCase().includes(search.toLowerCase())) || (c.itemDescription && c.itemDescription.toLowerCase().includes(search.toLowerCase())));
  const filteredSchedules = schedules.filter(s => (s.scheduleCode && s.scheduleCode.toLowerCase().includes(search.toLowerCase())) || (s.shipName && s.shipName.toLowerCase().includes(search.toLowerCase())));

  return (
    <div className="space-y-6">
      
      {/* Header & Subtabs */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-lg">
        <div>
          <h2 className="text-xl font-bold text-white">Modul Transaksi Data</h2>
          <p className="text-xs text-slate-400 mt-1">Kelola tiket penumpang, pengiriman kargo, dan jadwal pelayaran kapal.</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => { setSubTab('bookings'); setSearch(''); }}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${subTab === 'bookings' ? 'bg-blue-600 text-white shadow' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
          >
            Tiket Penumpang ({bookings.length})
          </button>
          <button
            onClick={() => { setSubTab('cargo'); setSearch(''); }}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${subTab === 'cargo' ? 'bg-blue-600 text-white shadow' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
          >
            Muatan Kargo ({cargoList.length})
          </button>
          <button
            onClick={() => { setSubTab('schedules'); setSearch(''); }}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${subTab === 'schedules' ? 'bg-blue-600 text-white shadow' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
          >
            Jadwal Kapal ({schedules.length})
          </button>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:w-80">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari transaksi..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <button
          onClick={handleOpenAdd}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-blue-600/20 flex items-center justify-center space-x-2 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Transaksi Baru</span>
        </button>
      </div>

      {/* Tables Content */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400">Memuat transaksi...</div>
        ) : (
          <div className="overflow-x-auto">
            
            {/* BOOKINGS TABLE */}
            {subTab === 'bookings' && (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/50 text-slate-400 text-xs uppercase tracking-wider">
                    <th className="p-4">Kode Tiket</th>
                    <th className="p-4">Penumpang</th>
                    <th className="p-4">Kapal & Rute</th>
                    <th className="p-4">Kelas & Kursi</th>
                    <th className="p-4">Harga / Status</th>
                    <th className="p-4 text-right">Aksi CRUD</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-sm">
                  {filteredBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-4 font-mono font-bold text-blue-400">{b.bookingCode}</td>
                      <td className="p-4 font-medium text-white">{b.passengerName}</td>
                      <td className="p-4">
                        <div className="text-slate-200">{b.shipName}</div>
                        <div className="text-xs text-slate-400">Rute: {b.routeName}</div>
                      </td>
                      <td className="p-4 text-slate-300">
                        <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 px-2 py-0.5 rounded text-xs font-semibold">{b.ticketClass}</span>
                        <span className="ml-2 text-xs text-slate-400">({b.seatNumber})</span>
                      </td>
                      <td className="p-4">
                        <div className="text-emerald-400 font-semibold">Rp {b.price?.toLocaleString('id-ID')}</div>
                        <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                          b.status === 'Confirmed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                          b.status === 'Checked-in' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30' :
                          'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                        }`}>
                          {b.status}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button onClick={() => handleOpenEdit(b)} className="p-2 bg-slate-800 hover:bg-slate-700 text-blue-400 rounded-lg transition-colors"><Edit2 className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(b.id)} className="p-2 bg-slate-800 hover:bg-slate-700 text-rose-400 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* CARGO TABLE */}
            {subTab === 'cargo' && (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/50 text-slate-400 text-xs uppercase tracking-wider">
                    <th className="p-4">No. Resi</th>
                    <th className="p-4">Pengirim & Penerima</th>
                    <th className="p-4">Deskripsi Barang & Berat</th>
                    <th className="p-4">Biaya / Kapal</th>
                    <th className="p-4">Status & Lokasi</th>
                    <th className="p-4 text-right">Aksi CRUD</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-sm">
                  {filteredCargo.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-4 font-mono font-bold text-amber-400">{c.trackingNumber}</td>
                      <td className="p-4">
                        <div className="text-white font-medium">Dari: {c.consignorName}</div>
                        <div className="text-xs text-slate-400">Ke: {c.consigneeName}</div>
                      </td>
                      <td className="p-4">
                        <div className="text-slate-200">{c.itemDescription}</div>
                        <div className="text-xs text-slate-400">⚖️ {c.weightTons} Ton | 📦 {c.volumeM3} m³</div>
                      </td>
                      <td className="p-4">
                        <div className="text-emerald-400 font-semibold">Rp {c.shippingCost?.toLocaleString('id-ID')}</div>
                        <div className="text-xs text-slate-400">{c.shipName}</div>
                      </td>
                      <td className="p-4">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/30">
                          {c.status}
                        </span>
                        <div className="text-[11px] text-slate-400 mt-1">📍 {c.currentLocation}</div>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button onClick={() => handleOpenEdit(c)} className="p-2 bg-slate-800 hover:bg-slate-700 text-blue-400 rounded-lg transition-colors"><Edit2 className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(c.id)} className="p-2 bg-slate-800 hover:bg-slate-700 text-rose-400 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* SCHEDULES TABLE */}
            {subTab === 'schedules' && (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/50 text-slate-400 text-xs uppercase tracking-wider">
                    <th className="p-4">Kode Jadwal</th>
                    <th className="p-4">Kapal</th>
                    <th className="p-4">Rute</th>
                    <th className="p-4">Waktu Keberangkatan & Tiba</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Aksi CRUD</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-sm">
                  {filteredSchedules.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-4 font-mono font-bold text-indigo-400">{s.scheduleCode}</td>
                      <td className="p-4 font-bold text-white">{s.shipName}</td>
                      <td className="p-4 text-slate-300">{s.routeName}</td>
                      <td className="p-4 text-slate-300">
                        <div>🛫 {s.departureTime}</div>
                        <div className="text-xs text-slate-400">🛬 {s.arrivalTime}</div>
                      </td>
                      <td className="p-4">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          {s.status}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button onClick={() => handleOpenEdit(s)} className="p-2 bg-slate-800 hover:bg-slate-700 text-blue-400 rounded-lg transition-colors"><Edit2 className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(s.id)} className="p-2 bg-slate-800 hover:bg-slate-700 text-rose-400 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

          </div>
        )}
      </div>

      {/* CRUD MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold text-white mb-4">
              {editingItem ? 'Edit Transaksi' : 'Tambah Transaksi'} ({subTab.toUpperCase()})
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              
              {/* BOOKING FORM */}
              {subTab === 'bookings' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Penumpang</label>
                    <select value={formData.passengerId || ''} onChange={e => setFormData({...formData, passengerId: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white">
                      {passengers.map(p => <option key={p.id} value={p.id}>{p.fullName} (NIK: {p.nik})</option>)}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">Rute</label>
                      <select value={formData.routeId || ''} onChange={e => setFormData({...formData, routeId: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white">
                        {routes.map(r => <option key={r.id} value={r.id}>{r.code} ({r.origin} - {r.destination})</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">Kapal</label>
                      <select value={formData.shipId || ''} onChange={e => setFormData({...formData, shipId: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white">
                        {ships.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">Kelas</label>
                      <select value={formData.ticketClass || 'Ekonomi'} onChange={e => setFormData({...formData, ticketClass: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white">
                        <option value="Ekonomi">Ekonomi</option>
                        <option value="Bisnis">Bisnis</option>
                        <option value="VIP">VIP</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">Kursi</label>
                      <input type="text" value={formData.seatNumber || ''} onChange={e => setFormData({...formData, seatNumber: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">Harga (Rp)</label>
                      <input type="number" value={formData.price || 0} onChange={e => setFormData({...formData, price: Number(e.target.value)})} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Status Tiket</label>
                    <select value={formData.status || 'Confirmed'} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white">
                      <option value="Confirmed">Confirmed</option>
                      <option value="Checked-in">Checked-in</option>
                      <option value="Pending">Pending</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </>
              )}

              {/* CARGO FORM */}
              {subTab === 'cargo' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">Nama Pengirim</label>
                      <input type="text" value={formData.consignorName || ''} onChange={e => setFormData({...formData, consignorName: e.target.value})} required className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">Kontak Pengirim</label>
                      <input type="text" value={formData.consignorPhone || ''} onChange={e => setFormData({...formData, consignorPhone: e.target.value})} required className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">Nama Penerima</label>
                      <input type="text" value={formData.consigneeName || ''} onChange={e => setFormData({...formData, consigneeName: e.target.value})} required className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">Kontak Penerima</label>
                      <input type="text" value={formData.consigneePhone || ''} onChange={e => setFormData({...formData, consigneePhone: e.target.value})} required className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Deskripsi Barang</label>
                    <input type="text" value={formData.itemDescription || ''} onChange={e => setFormData({...formData, itemDescription: e.target.value})} required className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white" />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">Berat (Ton)</label>
                      <input type="number" value={formData.weightTons || 0} onChange={e => setFormData({...formData, weightTons: Number(e.target.value)})} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">Volume (m³)</label>
                      <input type="number" value={formData.volumeM3 || 0} onChange={e => setFormData({...formData, volumeM3: Number(e.target.value)})} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">Biaya (Rp)</label>
                      <input type="number" value={formData.shippingCost || 0} onChange={e => setFormData({...formData, shippingCost: Number(e.target.value)})} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">Kapal Pengangkut</label>
                      <select value={formData.shipId || ''} onChange={e => setFormData({...formData, shipId: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white">
                        {ships.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">Status Kargo</label>
                      <select value={formData.status || 'Menunggu Muat'} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white">
                        <option value="Menunggu Muat">Menunggu Muat</option>
                        <option value="Dalam Pengiriman">Dalam Pengiriman</option>
                        <option value="Tiba di Pelabuhan">Tiba di Pelabuhan</option>
                        <option value="Selesai">Selesai</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              {/* SCHEDULE FORM */}
              {subTab === 'schedules' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">Kapal</label>
                      <select value={formData.shipId || ''} onChange={e => setFormData({...formData, shipId: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white">
                        {ships.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">Rute</label>
                      <select value={formData.routeId || ''} onChange={e => setFormData({...formData, routeId: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white">
                        {routes.map(r => <option key={r.id} value={r.id}>{r.code} ({r.origin} - {r.destination})</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">Waktu Berangkat</label>
                      <input type="text" value={formData.departureTime || ''} onChange={e => setFormData({...formData, departureTime: e.target.value})} placeholder="2026-09-20 08:00" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">Waktu Tiba</label>
                      <input type="text" value={formData.arrivalTime || ''} onChange={e => setFormData({...formData, arrivalTime: e.target.value})} placeholder="2026-09-21 14:00" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Status Jadwal</label>
                    <select value={formData.status || 'Dijadwalkan'} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white">
                      <option value="Dijadwalkan">Dijadwalkan</option>
                      <option value="Berangkat">Berangkat</option>
                      <option value="Tiba">Tiba</option>
                      <option value="Dibatalkan">Dibatalkan</option>
                    </select>
                  </div>
                </>
              )}

              <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-sm">Batal</button>
                <button type="submit" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-sm shadow-lg shadow-blue-600/30">Simpan Transaksi</button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
