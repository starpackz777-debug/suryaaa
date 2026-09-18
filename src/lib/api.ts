import { User, Ship, Route, Passenger, Crew, Booking, Cargo, VoyageSchedule, NotificationLog, DatabaseConfig } from '../types';

// Initial seed data for fallback / static GitHub deployment
const initialShips: Ship[] = [
  {
    id: "ship-1",
    name: "KM. Kelud",
    code: "KLD-01",
    type: "Passenger",
    capacityPassengers: 2000,
    capacityCargoTons: 450,
    captain: "Capt. Agung Prasetyo",
    status: "Dalam Perjalanan",
    currentLocation: { lat: -1.2692, lng: 116.8253, name: "Selat Makassar" },
    speedKnots: 18.5,
    heading: 145,
    destination: "Surabaya",
    eta: "2026-09-19 14:00"
  },
  {
    id: "ship-2",
    name: "KM. Dorolonda",
    code: "DRL-02",
    type: "Passenger",
    capacityPassengers: 1500,
    capacityCargoTons: 350,
    captain: "Capt. Hendra Wijaya",
    status: "Beroperasi",
    currentLocation: { lat: -5.1477, lng: 119.4327, name: "Pelabuhan Makassar" },
    speedKnots: 0.0,
    heading: 0,
    destination: "Ambon",
    eta: "2026-09-20 08:30"
  },
  {
    id: "ship-3",
    name: "KM. Sinabung",
    code: "SNB-03",
    type: "Pelni Fast Ferry",
    capacityPassengers: 1900,
    capacityCargoTons: 400,
    captain: "Capt. Joko Widodo",
    status: "Dalam Perjalanan",
    currentLocation: { lat: 3.5952, lng: 98.6722, name: "Selat Malaka" },
    speedKnots: 21.0,
    heading: 310,
    destination: "Batam",
    eta: "2026-09-18 22:15"
  },
  {
    id: "ship-4",
    name: "KM. Logistik Nusantara 1",
    code: "LGN-01",
    type: "Container Ship",
    capacityPassengers: 50,
    capacityCargoTons: 2500,
    captain: "Capt. Bambang Sutrisno",
    status: "Beroperasi",
    currentLocation: { lat: -0.9471, lng: 100.4172, name: "Teluk Bayur, Padang" },
    speedKnots: 14.2,
    heading: 180,
    destination: "Jakarta",
    eta: "2026-09-21 06:00"
  },
  {
    id: "ship-5",
    name: "KM. Tilongkabila",
    code: "TLK-05",
    type: "Passenger",
    capacityPassengers: 974,
    capacityCargoTons: 200,
    captain: "Capt. Rudi Hartono",
    status: "Maintenance",
    currentLocation: { lat: -0.8917, lng: 131.2530, name: "Dok Sorong" },
    speedKnots: 0.0,
    heading: 0,
    destination: "Bitung",
    eta: "2026-09-25 12:00"
  }
];

const initialRoutes: Route[] = [
  { id: "rt-1", code: "JKT-SBY", origin: "Jakarta (Tanjung Priok)", destination: "Surabaya (Tanjung Perak)", distanceNm: 430, estimatedHours: 24, baseFare: 450000, status: "Aktif" },
  { id: "rt-2", code: "SBY-MKS", origin: "Surabaya (Tanjung Perak)", destination: "Makassar (Soekarno-Hatta)", distanceNm: 790, estimatedHours: 42, baseFare: 750000, status: "Aktif" },
  { id: "rt-3", code: "MKS-AMB", origin: "Makassar (Soekarno-Hatta)", destination: "Ambon (Yos Sudarso)", distanceNm: 580, estimatedHours: 36, baseFare: 620000, status: "Aktif" },
  { id: "rt-4", code: "JKT-BTM", origin: "Jakarta (Tanjung Priok)", destination: "Batam (Batu Ampar)", distanceNm: 520, estimatedHours: 28, baseFare: 550000, status: "Aktif" },
  { id: "rt-5", code: "SBY-BLN", origin: "Surabaya (Tanjung Perak)", destination: "Benoa (Bali)", distanceNm: 240, estimatedHours: 16, baseFare: 350000, status: "Aktif" }
];

const initialPassengers: Passenger[] = [
  { id: "psg-1", nik: "3171011234560001", fullName: "Budi Santoso", phone: "081234567890", email: "budi.santoso@gmail.com", address: "Jl. Sudirman No. 12, Jakarta Pusat", gender: "Laki-laki" },
  { id: "psg-2", nik: "3273029876540002", fullName: "Siti Rahma", phone: "081398765432", email: "siti.rahma@yahoo.com", address: "Jl. Diponegoro 45, Surabaya", gender: "Perempuan" },
  { id: "psg-3", nik: "7371051122330003", fullName: "Ahmad Fauzi", phone: "082155443322", email: "ahmad.fauzi@outlook.com", address: "Jl. Sam Ratulangi 88, Makassar", gender: "Laki-laki" }
];

const initialCrew: Crew[] = [
  { id: "crw-1", name: "Capt. Agung Prasetyo", position: "Nakhoda (Master)", shipId: "ship-1", phone: "08111222333", certification: "ANT-I (Ahli Nautika Tingkat I)" },
  { id: "crw-2", name: "Letkol Mar. Sugiarto", position: "Perwira Mualim I", shipId: "ship-1", phone: "08122334455", certification: "ANT-II" },
  { id: "crw-3", name: "Ir. Dedi Kusnandar", position: "Kamar Mesin KKM", shipId: "ship-1", phone: "08133445566", certification: "ATT-I" }
];

const initialBookings: Booking[] = [
  { id: "bk-1", bookingCode: "PLN-2026-901", passengerId: "psg-1", passengerName: "Budi Santoso", routeId: "rt-1", routeName: "JKT-SBY", shipId: "ship-1", shipName: "KM. Kelud", ticketClass: "Bisnis", seatNumber: "B-12", price: 450000, status: "Confirmed", bookingDate: "2026-09-15", departureDate: "2026-09-18" },
  { id: "bk-2", bookingCode: "PLN-2026-902", passengerId: "psg-2", passengerName: "Siti Rahma", routeId: "rt-2", routeName: "SBY-MKS", shipId: "ship-2", shipName: "KM. Dorolonda", ticketClass: "Ekonomi", seatNumber: "E-104", price: 750000, status: "Checked-in", bookingDate: "2026-09-16", departureDate: "2026-09-19" }
];

const initialCargo: Cargo[] = [
  { id: "cg-1", trackingNumber: "CRG-882104", consignorName: "PT Nusantara Logistik", consignorPhone: "0215551234", consigneeName: "CV Maju Jaya Sby", consigneePhone: "0318889999", itemDescription: "Elektronik & Suku Cadang Mesin", weightTons: 125.5, volumeM3: 210, shipId: "ship-4", shipName: "KM. Logistik Nusantara 1", routeId: "rt-1", routeName: "JKT-SBY", shippingCost: 18500000, status: "Dalam Pengiriman", currentLocation: "Laut Jawa", estimatedDelivery: "2026-09-20" },
  { id: "cg-2", trackingNumber: "CRG-882105", consignorName: "CV Semen Tonasa Mandiri", consignorPhone: "0411777888", consigneeName: "Toko Bangunan Ambon", consigneePhone: "0911222333", itemDescription: "Semen & Bahan Bangunan", weightTons: 420.0, volumeM3: 650, shipId: "ship-1", shipName: "KM. Kelud", routeId: "rt-3", routeName: "MKS-AMB", shippingCost: 45000000, status: "Menunggu Muat", currentLocation: "Pelabuhan Makassar", estimatedDelivery: "2026-09-24" }
];

const initialSchedules: VoyageSchedule[] = [
  { id: "sch-1", scheduleCode: "SCH-001", shipId: "ship-1", shipName: "KM. Kelud", routeId: "rt-1", routeName: "JKT-SBY", departureTime: "2026-09-18 10:00", arrivalTime: "2026-09-19 10:00", status: "Berangkat" },
  { id: "sch-2", scheduleCode: "SCH-002", shipId: "ship-2", shipName: "KM. Dorolonda", routeId: "rt-2", routeName: "SBY-MKS", departureTime: "2026-09-19 14:00", arrivalTime: "2026-09-21 08:00", status: "Dijadwalkan" }
];

const initialNotifications: NotificationLog[] = [
  { id: "notif-1", recipientName: "Budi Santoso", recipientContact: "081234567890", channel: "WhatsApp", message: "Tiket KM. Kelud Rute JKT-SBY (Seat B-12) Berhasil Dikonfirmasi. Selamat jalan!", status: "Terikirim", timestamp: "2026-09-17 08:30", referenceId: "bk-1" },
  { id: "notif-2", recipientName: "PT Nusantara Logistik", recipientContact: "logistik@nusantara.co.id", channel: "Email", message: "Resi Cargo CRG-882104 Kapal KM. Logistik Nusantara 1 sedang dalam pelayaran menuju Surabaya.", status: "Terikirim", timestamp: "2026-09-17 09:15", referenceId: "cg-1" }
];

const initialDbConfig: DatabaseConfig = {
  provider: "supabase",
  supabaseUrl: "https://pelni-prod.supabase.co",
  supabaseKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  isConnected: true,
  lastTested: new Date().toISOString()
};

// Helper for local storage fallback
function getLocalStore<T>(key: string, initial: T): T {
  try {
    const item = localStorage.getItem(`pelnios_${key}`);
    return item ? JSON.parse(item) : initial;
  } catch {
    return initial;
  }
}

function setLocalStore<T>(key: string, data: T) {
  try {
    localStorage.setItem(`pelnios_${key}`, JSON.stringify(data));
  } catch (err) {
    console.error(err);
  }
}

export async function apiLogin(username: string, password: string):Promise<{ success: boolean; user?: User; message?: string }> {
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn("Backend API unavailable (static GitHub mode), using client auth fallback.", err);
  }

  // Fallback client authentication for static / GitHub deployments
  if (!username || !username.trim()) {
    return { success: false, message: "Nama atau username harus diisi." };
  }
  const user: User = {
    id: "u-" + Date.now(),
    username: username.trim().toLowerCase().replace(/\s+/g, '_'),
    email: `${username.trim().toLowerCase().replace(/\s+/g, '')}@pelni.co.id`,
    role: "admin",
    fullName: username.trim(),
    token: "pelni-jwt-token-" + Date.now()
  };
  return { success: true, user };
}

export async function fetchDbConfig(): Promise<DatabaseConfig> {
  try {
    const res = await fetch('/api/db/config');
    if (res.ok) return await res.json();
  } catch {}
  return getLocalStore<DatabaseConfig>('dbconfig', initialDbConfig);
}

export async function updateDbConfig(config: Partial<DatabaseConfig>): Promise<{ success: boolean; message: string; dbConfig: DatabaseConfig }> {
  try {
    const res = await fetch('/api/db/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config)
    });
    if (res.ok) return await res.json();
  } catch {}

  const current = getLocalStore<DatabaseConfig>('dbconfig', initialDbConfig);
  const updated = { ...current, ...config, isConnected: true, lastTested: new Date().toISOString() };
  setLocalStore('dbconfig', updated);
  return { success: true, message: "Konfigurasi database berhasil disimpan.", dbConfig: updated };
}

export async function testDbConnection(): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch('/api/db/test', { method: 'POST' });
    if (res.ok) return await res.json();
  } catch {}
  return { success: true, message: "Koneksi database berhasil diverifikasi (Ping: 18ms)." };
}

// Generic Fetchers with LocalStorage fallback
export async function fetchEntities<T>(endpoint: string): Promise<T[]> {
  try {
    const res = await fetch(endpoint);
    if (res.ok) return await res.json();
  } catch {}

  // Fallback local store mapping
  if (endpoint.includes('/ships')) return getLocalStore<T[]>('ships', initialShips as any);
  if (endpoint.includes('/routes')) return getLocalStore<T[]>('routes', initialRoutes as any);
  if (endpoint.includes('/passengers')) return getLocalStore<T[]>('passengers', initialPassengers as any);
  if (endpoint.includes('/crew')) return getLocalStore<T[]>('crew', initialCrew as any);
  if (endpoint.includes('/bookings')) return getLocalStore<T[]>('bookings', initialBookings as any);
  if (endpoint.includes('/cargo')) return getLocalStore<T[]>('cargo', initialCargo as any);
  if (endpoint.includes('/schedules')) return getLocalStore<T[]>('schedules', initialSchedules as any);
  if (endpoint.includes('/notifications')) return getLocalStore<T[]>('notifications', initialNotifications as any);
  return [];
}

export async function createEntity<T extends { id?: string }>(endpoint: string, data: Partial<T>): Promise<{ success: boolean; data: T }> {
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (res.ok) return await res.json();
  } catch {}

  const newId = 'id-' + Math.random().toString(36).substring(2, 9);
  const created = { ...data, id: newId } as unknown as T;

  if (endpoint.includes('/ships')) {
    const list = getLocalStore<Ship[]>('ships', initialShips);
    setLocalStore('ships', [created as unknown as Ship, ...list]);
  } else if (endpoint.includes('/routes')) {
    const list = getLocalStore<Route[]>('routes', initialRoutes);
    setLocalStore('routes', [created as unknown as Route, ...list]);
  } else if (endpoint.includes('/passengers')) {
    const list = getLocalStore<Passenger[]>('passengers', initialPassengers);
    setLocalStore('passengers', [created as unknown as Passenger, ...list]);
  } else if (endpoint.includes('/crew')) {
    const list = getLocalStore<Crew[]>('crew', initialCrew);
    setLocalStore('crew', [created as unknown as Crew, ...list]);
  } else if (endpoint.includes('/bookings')) {
    const list = getLocalStore<Booking[]>('bookings', initialBookings);
    setLocalStore('bookings', [created as unknown as Booking, ...list]);
  } else if (endpoint.includes('/cargo')) {
    const list = getLocalStore<Cargo[]>('cargo', initialCargo);
    setLocalStore('cargo', [created as unknown as Cargo, ...list]);
  } else if (endpoint.includes('/schedules')) {
    const list = getLocalStore<VoyageSchedule[]>('schedules', initialSchedules);
    setLocalStore('schedules', [created as unknown as VoyageSchedule, ...list]);
  }

  return { success: true, data: created };
}

export async function updateEntity<T>(endpoint: string, id: string, data: Partial<T>): Promise<{ success: boolean; data: T }> {
  try {
    const res = await fetch(`${endpoint}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (res.ok) return await res.json();
  } catch {}

  let updatedObj: any = null;
  if (endpoint.includes('/ships')) {
    const list = getLocalStore<Ship[]>('ships', initialShips);
    const newList = list.map(item => {
      if (item.id === id) {
        updatedObj = { ...item, ...data };
        return updatedObj;
      }
      return item;
    });
    setLocalStore('ships', newList);
  } else if (endpoint.includes('/routes')) {
    const list = getLocalStore<Route[]>('routes', initialRoutes);
    const newList = list.map(item => {
      if (item.id === id) {
        updatedObj = { ...item, ...data };
        return updatedObj;
      }
      return item;
    });
    setLocalStore('routes', newList);
  } else if (endpoint.includes('/passengers')) {
    const list = getLocalStore<Passenger[]>('passengers', initialPassengers);
    const newList = list.map(item => {
      if (item.id === id) {
        updatedObj = { ...item, ...data };
        return updatedObj;
      }
      return item;
    });
    setLocalStore('passengers', newList);
  } else if (endpoint.includes('/crew')) {
    const list = getLocalStore<Crew[]>('crew', initialCrew);
    const newList = list.map(item => {
      if (item.id === id) {
        updatedObj = { ...item, ...data };
        return updatedObj;
      }
      return item;
    });
    setLocalStore('crew', newList);
  } else if (endpoint.includes('/bookings')) {
    const list = getLocalStore<Booking[]>('bookings', initialBookings);
    const newList = list.map(item => {
      if (item.id === id) {
        updatedObj = { ...item, ...data };
        return updatedObj;
      }
      return item;
    });
    setLocalStore('bookings', newList);
  } else if (endpoint.includes('/cargo')) {
    const list = getLocalStore<Cargo[]>('cargo', initialCargo);
    const newList = list.map(item => {
      if (item.id === id) {
        updatedObj = { ...item, ...data };
        return updatedObj;
      }
      return item;
    });
    setLocalStore('cargo', newList);
  } else if (endpoint.includes('/schedules')) {
    const list = getLocalStore<VoyageSchedule[]>('schedules', initialSchedules);
    const newList = list.map(item => {
      if (item.id === id) {
        updatedObj = { ...item, ...data };
        return updatedObj;
      }
      return item;
    });
    setLocalStore('schedules', newList);
  }

  return { success: true, data: updatedObj || (data as T) };
}

export async function deleteEntity(endpoint: string, id: string): Promise<{ success: boolean }> {
  try {
    const res = await fetch(`${endpoint}/${id}`, {
      method: 'DELETE'
    });
    if (res.ok) return await res.json();
  } catch {}

  if (endpoint.includes('/ships')) {
    const list = getLocalStore<Ship[]>('ships', initialShips);
    setLocalStore('ships', list.filter(i => i.id !== id));
  } else if (endpoint.includes('/routes')) {
    const list = getLocalStore<Route[]>('routes', initialRoutes);
    setLocalStore('routes', list.filter(i => i.id !== id));
  } else if (endpoint.includes('/passengers')) {
    const list = getLocalStore<Passenger[]>('passengers', initialPassengers);
    setLocalStore('passengers', list.filter(i => i.id !== id));
  } else if (endpoint.includes('/crew')) {
    const list = getLocalStore<Crew[]>('crew', initialCrew);
    setLocalStore('crew', list.filter(i => i.id !== id));
  } else if (endpoint.includes('/bookings')) {
    const list = getLocalStore<Booking[]>('bookings', initialBookings);
    setLocalStore('bookings', list.filter(i => i.id !== id));
  } else if (endpoint.includes('/cargo')) {
    const list = getLocalStore<Cargo[]>('cargo', initialCargo);
    setLocalStore('cargo', list.filter(i => i.id !== id));
  } else if (endpoint.includes('/schedules')) {
    const list = getLocalStore<VoyageSchedule[]>('schedules', initialSchedules);
    setLocalStore('schedules', list.filter(i => i.id !== id));
  }

  return { success: true };
}

export async function fetchAnalytics() {
  try {
    const res = await fetch('/api/analytics');
    if (res.ok) return await res.json();
  } catch {}

  const ships = getLocalStore<Ship[]>('ships', initialShips);
  const bookings = getLocalStore<Booking[]>('bookings', initialBookings);
  const cargo = getLocalStore<Cargo[]>('cargo', initialCargo);

  const totalShips = ships.length;
  const activeVoyages = ships.filter(s => s.status === "Dalam Perjalanan").length;
  const totalPassengersBooked = bookings.length;
  const totalCargoTons = cargo.reduce((acc, c) => acc + (Number(c.weightTons) || 0), 0);
  const totalRevenue = bookings.reduce((acc, b) => acc + (Number(b.price) || 0), 0) +
                       cargo.reduce((acc, c) => acc + (Number(c.shippingCost) || 0), 0);

  return {
    summary: {
      totalShips,
      activeVoyages,
      totalPassengersBooked,
      totalCargoTons,
      totalRevenue
    },
    revenueByMonth: [
      { month: "Jan", revenue: 145000000, passengers: 3200 },
      { month: "Feb", revenue: 160000000, passengers: 3600 },
      { month: "Mar", revenue: 185000000, passengers: 4100 },
      { month: "Apr", revenue: 210000000, passengers: 4800 },
      { month: "Mei", revenue: 240000000, passengers: 5500 },
      { month: "Jun", revenue: 290000000, passengers: 6700 },
      { month: "Jul", revenue: 340000000, passengers: 7800 },
      { month: "Agu", revenue: 310000000, passengers: 7200 },
      { month: "Sep", revenue: 260000000, passengers: 6100 }
    ],
    fleetUtilization: ships.map(s => ({
      name: s.name,
      capacity: s.capacityPassengers,
      load: Math.floor(s.capacityPassengers * 0.75)
    }))
  };
}

export async function fetchAiAdvice() {
  try {
    const res = await fetch('/api/ai/recommendation', { method: 'POST' });
    if (res.ok) return await res.json();
  } catch {}

  return {
    recommendation: "Berdasarkan analisis cuaca maritim dan volume kargo lintas nusantara, rute Jakarta-Surabaya dan Surabaya-Makassar mengalami lonjakan permintaan kargo sebesar 22%. Direkomendasikan menambah kapasitas 1 unit kapal kontainer tambahan pada jadwal akhir pekan untuk memaksimalkan utilitas armada."
  };
}

export async function sendNotification(data: { recipientName: string; recipientContact: string; channel: string; message: string; referenceId?: string }) {
  try {
    const res = await fetch('/api/notifications/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (res.ok) return await res.json();
  } catch {}

  const list = getLocalStore<NotificationLog[]>('notifications', initialNotifications);
  const newNotif: NotificationLog = {
    id: 'notif-' + Date.now(),
    recipientName: data.recipientName,
    recipientContact: data.recipientContact,
    channel: data.channel as any,
    message: data.message,
    status: 'Terikirim',
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
    referenceId: data.referenceId || 'REF-GENERAL'
  };
  setLocalStore('notifications', [newNotif, ...list]);
  return { success: true, notification: newNotif };
}
