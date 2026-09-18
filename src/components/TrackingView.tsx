import React, { useEffect, useState, useRef } from 'react';
import { Ship, Cargo } from '../types';
import { fetchEntities } from '../lib/api';
import { Navigation, Compass, Gauge, MapPin, Anchor, RefreshCw } from 'lucide-react';
import L from 'leaflet';

export const TrackingView: React.FC = () => {
  const [ships, setShips] = useState<Ship[]>([]);
  const [cargoList, setCargoList] = useState<Cargo[]>([]);
  const [selectedShip, setSelectedShip] = useState<Ship | null>(null);
  const [loading, setLoading] = useState(true);
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [s, c] = await Promise.all([
        fetchEntities<Ship>('/api/ships'),
        fetchEntities<Cargo>('/api/cargo')
      ]);
      setShips(s);
      setCargoList(c);
      if (s.length > 0 && !selectedShip) {
        setSelectedShip(s[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!mapRef.current) return;

    if (!leafletMapRef.current) {
      // Initialize Leaflet Map centered around Indonesia
      const map = L.map(mapRef.current, {
        center: [-1.5, 118.0],
        zoom: 5,
        zoomControl: true
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      leafletMapRef.current = map;
    }

    const map = leafletMapRef.current;

    // Clear existing markers if any
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    // Add Ship markers
    ships.forEach((ship) => {
      if (ship.currentLocation) {
        const marker = L.marker([ship.currentLocation.lat, ship.currentLocation.lng]).addTo(map);
        marker.bindPopup(`
          <div style="font-family: sans-serif; padding: 4px;">
            <b style="color: #1e3a8a; font-size: 14px;">${ship.name}</b><br/>
            <span style="font-size: 12px; color: #475569;">Kode: ${ship.code}</span><br/>
            <hr style="margin: 4px 0; border: 0; border-top: 1px solid #cbd5e1;"/>
            <b>Status:</b> ${ship.status}<br/>
            <b>Posisi:</b> ${ship.currentLocation.name}<br/>
            <b>Kecepatan:</b> ${ship.speedKnots} Knot<br/>
            <b>Tujuan:</b> ${ship.destination} (ETA: ${ship.eta})
          </div>
        `);

        marker.on('click', () => {
          setSelectedShip(ship);
        });
      }
    });

  }, [ships]);

  const handleSelectShip = (ship: Ship) => {
    setSelectedShip(ship);
    if (leafletMapRef.current && ship.currentLocation) {
      leafletMapRef.current.setView([ship.currentLocation.lat, ship.currentLocation.lng], 7, { animate: true });
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-lg">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Navigation className="w-5 h-5 text-blue-400" />
            <span>Pelacakan Armada & Kargo Realtime</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">Pemantauan posisi kapal, kecepatan, arah haluan, dan ETA via integrasi peta digital maritim.</p>
        </div>
        <button
          onClick={loadData}
          className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-2 border border-slate-700 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Perbarui Posisi GPS</span>
        </button>
      </div>

      {/* Main Grid: Map & Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left / Top: Leaflet Map */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl overflow-hidden flex flex-col">
          <div className="h-[480px] w-full rounded-2xl overflow-hidden relative z-0 border border-slate-800">
            <div ref={mapRef} className="w-full h-full z-0" />
          </div>
        </div>

        {/* Right / Bottom: Selected Ship Telemetry */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-white">Telemetri Armada</h3>
              <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full font-medium">
                Live GPS
              </span>
            </div>

            {selectedShip ? (
              <div className="space-y-4">
                <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/60">
                  <h4 className="text-base font-bold text-white flex items-center gap-2">
                    <Anchor className="w-4 h-4 text-blue-400" />
                    <span>{selectedShip.name}</span>
                  </h4>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">Kode: {selectedShip.code} • {selectedShip.type}</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-800/50 p-3.5 rounded-xl border border-slate-700/40">
                    <p className="text-[11px] font-semibold text-slate-400 uppercase">Kecepatan</p>
                    <p className="text-lg font-bold text-white mt-1 flex items-center gap-1.5">
                      <Gauge className="w-4 h-4 text-blue-400" /> {selectedShip.speedKnots} <span className="text-xs text-slate-400">Knot</span>
                    </p>
                  </div>
                  <div className="bg-slate-800/50 p-3.5 rounded-xl border border-slate-700/40">
                    <p className="text-[11px] font-semibold text-slate-400 uppercase">Haluan (Heading)</p>
                    <p className="text-lg font-bold text-white mt-1 flex items-center gap-1.5">
                      <Compass className="w-4 h-4 text-emerald-400" /> {selectedShip.heading}°
                    </p>
                  </div>
                </div>

                <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/40 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Posisi Saat Ini:</span>
                    <span className="text-white font-medium">{selectedShip.currentLocation?.name}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Koordinat:</span>
                    <span className="text-blue-400 font-mono">{selectedShip.currentLocation?.lat}, {selectedShip.currentLocation?.lng}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Tujuan Pelabuhan:</span>
                    <span className="text-white font-medium">{selectedShip.destination}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Estimasi Tiba (ETA):</span>
                    <span className="text-emerald-400 font-medium">{selectedShip.eta}</span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-slate-400 text-sm">Pilih kapal dari daftar untuk melihat telemetri.</p>
            )}
          </div>

          {/* Quick Ship Selector */}
          <div className="mt-6 pt-4 border-t border-slate-800">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Pilih Kapal:</p>
            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
              {ships.map(s => (
                <button
                  key={s.id}
                  onClick={() => handleSelectShip(s)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-medium flex items-center justify-between transition-colors ${
                    selectedShip?.id === s.id ? 'bg-blue-600 text-white font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <span>{s.name}</span>
                  <span className="text-[10px] uppercase opacity-80">{s.status}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Cargo Tracking Checkpoints */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <h3 className="text-lg font-bold text-white mb-4">Status Pengiriman Kargo Pelanggan</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {cargoList.map(c => (
            <div key={c.id} className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-mono font-bold text-amber-400">{c.trackingNumber}</span>
                <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2.5 py-0.5 rounded-full font-semibold">{c.status}</span>
              </div>
              <p className="text-sm font-bold text-white mb-1">{c.itemDescription}</p>
              <p className="text-xs text-slate-400">Penerima: {c.consigneeName}</p>
              <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-rose-400" /> Lokasi: {c.currentLocation}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
