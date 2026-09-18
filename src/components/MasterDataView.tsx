import React, { useEffect, useState } from 'react';
import { Ship, Route, Passenger, Crew } from '../types';
import { fetchEntities, createEntity, updateEntity, deleteEntity } from '../lib/api';
import { Ship as ShipIcon, MapPin, Users, UserCheck, Plus, Edit2, Trash2, Search, X, CheckCircle } from 'lucide-react';

export const MasterDataView: React.FC = () => {
  const [subTab, setSubTab] = useState<'ships' | 'routes' | 'passengers' | 'crew'>('ships');
  const [ships, setShips] = useState<Ship[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [passengers, setPassengers] = useState<Passenger[]>([]);
  const [crew, setCrew] = useState<Crew[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [s, r, p, c] = await Promise.all([
        fetchEntities<Ship>('/api/ships'),
        fetchEntities<Route>('/api/routes'),
        fetchEntities<Passenger>('/api/passengers'),
        fetchEntities<Crew>('/api/crew')
      ]);
      setShips(s);
      setRoutes(r);
      setPassengers(p);
      setCrew(c);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingItem(null);
    if (subTab === 'ships') {
      setFormData({ name: '', code: 'KLD-' + Math.floor(10 + Math.random() * 90), type: 'Passenger', capacityPassengers: 1000, capacityCargoTons: 300, captain: 'Capt. Baru', status: 'Beroperasi', speedKnots: 15, destination: 'Surabaya' });
    } else if (subTab === 'routes') {
      setFormData({ code: 'JKT-SBY', origin: 'Jakarta', destination: 'Surabaya', distanceNm: 400, estimatedHours: 24, baseFare: 500000, status: 'Aktif' });
    } else if (subTab === 'passengers') {
      setFormData({ nik: '31710' + Math.floor(1000000000 + Math.random() * 9000000000), fullName: '', phone: '08123456789', email: 'user@email.com', address: 'Jakarta', gender: 'Laki-laki' });
    } else if (subTab === 'crew') {
      setFormData({ name: '', position: 'Perwira', shipId: ships[0]?.id || '', phone: '0812345678', certification: 'ANT-II' });
    }
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setEditingItem(item);
    setFormData({ ...item });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus data ini?')) return;
    try {
      if (subTab === 'ships') await deleteEntity('/api/ships', id);
      else if (subTab === 'routes') await deleteEntity('/api/routes', id);
      else if (subTab === 'passengers') await deleteEntity('/api/passengers', id);
      else if (subTab === 'crew') await deleteEntity('/api/crew', id);
      loadAllData();
    } catch (err) {
      alert('Gagal menghapus data.');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let endpoint = '';
      if (subTab === 'ships') endpoint = '/api/ships';
      else if (subTab === 'routes') endpoint = '/api/routes';
      else if (subTab === 'passengers') endpoint = '/api/passengers';
      else if (subTab === 'crew') endpoint = '/api/crew';

      if (editingItem) {
        await updateEntity(endpoint, editingItem.id, formData);
      } else {
        await createEntity(endpoint, formData);
      }
      setIsModalOpen(false);
      loadAllData();
    } catch (err) {
      alert('Gagal menyimpan data.');
    }
  };

  // Filtered lists
  const filteredShips = ships.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.code.toLowerCase().includes(search.toLowerCase()));
  const filteredRoutes = routes.filter(r => r.code.toLowerCase().includes(search.toLowerCase()) || r.origin.toLowerCase().includes(search.toLowerCase()) || r.destination.toLowerCase().includes(search.toLowerCase()));
  const filteredPassengers = passengers.filter(p => p.fullName.toLowerCase().includes(search.toLowerCase()) || p.nik.includes(search));
  const filteredCrew = crew.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.position.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      
      {/* Header & Subtabs */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-lg">
        <div>
          <h2 className="text-xl font-bold text-white">Manajemen Master Data</h2>
          <p className="text-xs text-slate-400 mt-1">Kelola data kapal, rute pelayaran, penumpang, dan kru armada.</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => { setSubTab('ships'); setSearch(''); }}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${subTab === 'ships' ? 'bg-blue-600 text-white shadow' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
          >
            Kapal ({ships.length})
          </button>
          <button
            onClick={() => { setSubTab('routes'); setSearch(''); }}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${subTab === 'routes' ? 'bg-blue-600 text-white shadow' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
          >
            Rute ({routes.length})
          </button>
          <button
            onClick={() => { setSubTab('passengers'); setSearch(''); }}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${subTab === 'passengers' ? 'bg-blue-600 text-white shadow' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
          >
            Penumpang ({passengers.length})
          </button>
          <button
            onClick={() => { setSubTab('crew'); setSearch(''); }}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${subTab === 'crew' ? 'bg-blue-600 text-white shadow' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
          >
            Kru ({crew.length})
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
            placeholder="Cari data..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <button
          onClick={handleOpenAdd}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-blue-600/20 flex items-center justify-center space-x-2 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Data Baru</span>
        </button>
      </div>

      {/* Tables Content */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400">Memuat database...</div>
        ) : (
          <div className="overflow-x-auto">
            
            {/* SHIPS TABLE */}
            {subTab === 'ships' && (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/50 text-slate-400 text-xs uppercase tracking-wider">
                    <th className="p-4">Kapal & Kode</th>
                    <th className="p-4">Tipe</th>
                    <th className="p-4">Kapasitas Pax / Kargo</th>
                    <th className="p-4">Nakhoda</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Aksi CRUD</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-sm">
                  {filteredShips.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-white">{s.name}</div>
                        <div className="text-xs text-blue-400 font-mono">{s.code}</div>
                      </td>
                      <td className="p-4 text-slate-300">{s.type}</td>
                      <td className="p-4 text-slate-300">
                        <div>👥 {s.capacityPassengers} Penumpang</div>
                        <div className="text-xs text-slate-400">📦 {s.capacityCargoTons} Ton</div>
                      </td>
                      <td className="p-4 text-slate-300">{s.captain}</td>
                      <td className="p-4">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                          s.status === 'Beroperasi' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                          s.status === 'Dalam Perjalanan' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30' :
                          'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                        }`}>
                          {s.status}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button onClick={() => handleOpenEdit(s)} className="p-2 bg-slate-800 hover:bg-slate-700 text-blue-400 rounded-lg transition-colors" title="Edit">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(s.id)} className="p-2 bg-slate-800 hover:bg-slate-700 text-rose-400 rounded-lg transition-colors" title="Hapus">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* ROUTES TABLE */}
            {subTab === 'routes' && (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/50 text-slate-400 text-xs uppercase tracking-wider">
                    <th className="p-4">Kode Rute</th>
                    <th className="p-4">Asal & Tujuan</th>
                    <th className="p-4">Jarak (Mil Laut)</th>
                    <th className="p-4">Estimasi Waktu</th>
                    <th className="p-4">Tarif Dasar</th>
                    <th className="p-4 text-right">Aksi CRUD</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-sm">
                  {filteredRoutes.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-4 font-mono font-bold text-blue-400">{r.code}</td>
                      <td className="p-4">
                        <div className="text-white font-medium">{r.origin}</div>
                        <div className="text-xs text-slate-400">➔ {r.destination}</div>
                      </td>
                      <td className="p-4 text-slate-300">{r.distanceNm} NM</td>
                      <td className="p-4 text-slate-300">{r.estimatedHours} Jam</td>
                      <td className="p-4 text-emerald-400 font-semibold">Rp {r.baseFare.toLocaleString('id-ID')}</td>
                      <td className="p-4 text-right space-x-2">
                        <button onClick={() => handleOpenEdit(r)} className="p-2 bg-slate-800 hover:bg-slate-700 text-blue-400 rounded-lg transition-colors"><Edit2 className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(r.id)} className="p-2 bg-slate-800 hover:bg-slate-700 text-rose-400 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* PASSENGERS TABLE */}
            {subTab === 'passengers' && (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/50 text-slate-400 text-xs uppercase tracking-wider">
                    <th className="p-4">NIK & Nama</th>
                    <th className="p-4">Kontak</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Alamat</th>
                    <th className="p-4 text-right">Aksi CRUD</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-sm">
                  {filteredPassengers.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-white">{p.fullName}</div>
                        <div className="text-xs text-slate-400 font-mono">NIK: {p.nik}</div>
                      </td>
                      <td className="p-4 text-slate-300">{p.phone}</td>
                      <td className="p-4 text-blue-400">{p.email}</td>
                      <td className="p-4 text-slate-300 truncate max-w-xs">{p.address}</td>
                      <td className="p-4 text-right space-x-2">
                        <button onClick={() => handleOpenEdit(p)} className="p-2 bg-slate-800 hover:bg-slate-700 text-blue-400 rounded-lg transition-colors"><Edit2 className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(p.id)} className="p-2 bg-slate-800 hover:bg-slate-700 text-rose-400 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* CREW TABLE */}
            {subTab === 'crew' && (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/50 text-slate-400 text-xs uppercase tracking-wider">
                    <th className="p-4">Nama Kru</th>
                    <th className="p-4">Jabatan</th>
                    <th className="p-4">Sertifikasi</th>
                    <th className="p-4">Telepon</th>
                    <th className="p-4 text-right">Aksi CRUD</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-sm">
                  {filteredCrew.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-4 font-bold text-white">{c.name}</td>
                      <td className="p-4 text-blue-400">{c.position}</td>
                      <td className="p-4 text-slate-300">{c.certification}</td>
                      <td className="p-4 text-slate-300">{c.phone}</td>
                      <td className="p-4 text-right space-x-2">
                        <button onClick={() => handleOpenEdit(c)} className="p-2 bg-slate-800 hover:bg-slate-700 text-blue-400 rounded-lg transition-colors"><Edit2 className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(c.id)} className="p-2 bg-slate-800 hover:bg-slate-700 text-rose-400 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

          </div>
        )}
      </div>

      {/* CRUD MODAL FORM */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold text-white mb-4">
              {editingItem ? 'Edit Data' : 'Tambah Data Baru'} ({subTab.toUpperCase()})
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              
              {/* SHIP FORM */}
              {subTab === 'ships' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Nama Kapal</label>
                    <input type="text" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} required className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">Kode Kapal</label>
                      <input type="text" value={formData.code || ''} onChange={e => setFormData({...formData, code: e.target.value})} required className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">Tipe</label>
                      <select value={formData.type || 'Passenger'} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white">
                        <option value="Passenger">Passenger</option>
                        <option value="Cargo">Cargo</option>
                        <option value="Pelni Fast Ferry">Pelni Fast Ferry</option>
                        <option value="Container Ship">Container Ship</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">Kapasitas Penumpang</label>
                      <input type="number" value={formData.capacityPassengers || 0} onChange={e => setFormData({...formData, capacityPassengers: Number(e.target.value)})} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">Kapasitas Kargo (Ton)</label>
                      <input type="number" value={formData.capacityCargoTons || 0} onChange={e => setFormData({...formData, capacityCargoTons: Number(e.target.value)})} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Nakhoda</label>
                    <input type="text" value={formData.captain || ''} onChange={e => setFormData({...formData, captain: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Status</label>
                    <select value={formData.status || 'Beroperasi'} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white">
                      <option value="Beroperasi">Beroperasi</option>
                      <option value="Dalam Perjalanan">Dalam Perjalanan</option>
                      <option value="Maintenance">Maintenance</option>
                      <option value="Sandar">Sandar</option>
                    </select>
                  </div>
                </>
              )}

              {/* ROUTE FORM */}
              {subTab === 'routes' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">Kode Rute</label>
                      <input type="text" value={formData.code || ''} onChange={e => setFormData({...formData, code: e.target.value})} required className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">Tarif Dasar (Rp)</label>
                      <input type="number" value={formData.baseFare || 0} onChange={e => setFormData({...formData, baseFare: Number(e.target.value)})} required className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Pelabuhan Asal</label>
                    <input type="text" value={formData.origin || ''} onChange={e => setFormData({...formData, origin: e.target.value})} required className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Pelabuhan Tujuan</label>
                    <input type="text" value={formData.destination || ''} onChange={e => setFormData({...formData, destination: e.target.value})} required className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">Jarak (Mil Laut)</label>
                      <input type="number" value={formData.distanceNm || 0} onChange={e => setFormData({...formData, distanceNm: Number(e.target.value)})} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">Estimasi Jam</label>
                      <input type="number" value={formData.estimatedHours || 0} onChange={e => setFormData({...formData, estimatedHours: Number(e.target.value)})} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white" />
                    </div>
                  </div>
                </>
              )}

              {/* PASSENGER FORM */}
              {subTab === 'passengers' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">NIK (Nomor Induk Kependudukan)</label>
                    <input type="text" value={formData.nik || ''} onChange={e => setFormData({...formData, nik: e.target.value})} required className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Nama Lengkap</label>
                    <input type="text" value={formData.fullName || ''} onChange={e => setFormData({...formData, fullName: e.target.value})} required className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">No. Telepon / WhatsApp</label>
                      <input type="text" value={formData.phone || ''} onChange={e => setFormData({...formData, phone: e.target.value})} required className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">Gender</label>
                      <select value={formData.gender || 'Laki-laki'} onChange={e => setFormData({...formData, gender: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white">
                        <option value="Laki-laki">Laki-laki</option>
                        <option value="Perempuan">Perempuan</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Email</label>
                    <input type="email" value={formData.email || ''} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Alamat</label>
                    <textarea value={formData.address || ''} onChange={e => setFormData({...formData, address: e.target.value})} rows={2} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white" />
                  </div>
                </>
              )}

              {/* CREW FORM */}
              {subTab === 'crew' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Nama Kru</label>
                    <input type="text" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} required className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">Jabatan</label>
                      <input type="text" value={formData.position || ''} onChange={e => setFormData({...formData, position: e.target.value})} required className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">Sertifikasi</label>
                      <input type="text" value={formData.certification || ''} onChange={e => setFormData({...formData, certification: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">No. Telepon</label>
                    <input type="text" value={formData.phone || ''} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white" />
                  </div>
                </>
              )}

              <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-sm">Batal</button>
                <button type="submit" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-sm shadow-lg shadow-blue-600/30">Simpan Data</button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
