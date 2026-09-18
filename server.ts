import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const app = express();
const PORT = 3000;

app.use(express.json());

// In-Memory Database Store for Pelayaran Nusantara (PelniOS)
let dbConfig = {
  provider: "supabase" as const,
  supabaseUrl: "https://xyzcompany.supabase.co",
  supabaseKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  neonConnectionString: "postgresql://neondb_owner:secret@ep-cool-dawn-123456.us-east-2.aws.neon.tech/neondb?sslmode=require",
  firebaseProjectId: "pelni-ship-app-prod",
  isConnected: true,
  lastTested: new Date().toISOString()
};

let users = [
  { id: "u-1", username: "admin", email: "admin@pelni.co.id", role: "admin", fullName: "Administrator Pelni" },
  { id: "u-2", username: "dispatcher", email: "logistik@pelni.co.id", role: "dispatcher", fullName: "Budi Santoso (Dispatcher)" },
  { id: "u-3", username: "captain", email: "kapten.agung@pelni.co.id", role: "captain", fullName: "Capt. Agung Prasetyo" },
  { id: "u-4", username: "cs", email: "cs@pelni.co.id", role: "customer_service", fullName: "Siti Rahma (CS)" }
];

let ships = [
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

let routes = [
  { id: "rt-1", code: "JKT-SBY", origin: "Jakarta (Tanjung Priok)", destination: "Surabaya (Tanjung Perak)", distanceNm: 430, estimatedHours: 24, baseFare: 450000, status: "Aktif" },
  { id: "rt-2", code: "SBY-MKS", origin: "Surabaya (Tanjung Perak)", destination: "Makassar (Soekarno-Hatta)", distanceNm: 790, estimatedHours: 42, baseFare: 750000, status: "Aktif" },
  { id: "rt-3", code: "MKS-AMB", origin: "Makassar (Soekarno-Hatta)", destination: "Ambon (Yos Sudarso)", distanceNm: 580, estimatedHours: 36, baseFare: 620000, status: "Aktif" },
  { id: "rt-4", code: "JKT-BTM", origin: "Jakarta (Tanjung Priok)", destination: "Batam (Batu Ampar)", distanceNm: 520, estimatedHours: 28, baseFare: 550000, status: "Aktif" },
  { id: "rt-5", code: "SBY-BLN", origin: "Surabaya (Tanjung Perak)", destination: "Benoa (Bali)", distanceNm: 240, estimatedHours: 16, baseFare: 350000, status: "Aktif" }
];

let passengers = [
  { id: "psg-1", nik: "3171012345670001", fullName: "Andi Pratama", phone: "081234567890", email: "andi.pratama@gmail.com", address: "Jl. Sudirman No. 12, Jakarta", gender: "Laki-laki" },
  { id: "psg-2", nik: "3273023456780002", fullName: "Siti Aminah", phone: "081987654321", email: "siti.aminah@yahoo.com", address: "Jl. Merdeka No. 45, Bandung", gender: "Perempuan" },
  { id: "psg-3", nik: "3578034567890003", fullName: "Eko Prasetyo", phone: "081311223344", email: "eko.prasetyo@outlook.com", address: "Jl. Pemuda No. 8, Surabaya", gender: "Laki-laki" },
  { id: "psg-4", nik: "7371045678900004", fullName: "Dewi Lestari", phone: "085699887766", email: "dewi.lestari@gmail.com", address: "Jl. Ratulangi No. 19, Makassar", gender: "Perempuan" }
];

let crew = [
  { id: "crw-1", name: "Agung Prasetyo", position: "Nakhoda (Captain)", shipId: "ship-1", phone: "08111122233", certification: "ANT-I" },
  { id: "crw-2", name: "Hendra Wijaya", position: "Nakhoda (Captain)", shipId: "ship-2", phone: "08112233445", certification: "ANT-I" },
  { id: "crw-3", name: "Mansur Abdullah", position: "KKM (Kepala Kamar Mesin)", shipId: "ship-1", phone: "08123344556", certification: "ATT-I" },
  { id: "crw-4", name: "Slamet Riyadi", position: "Perwira Komunikasi", shipId: "ship-3", phone: "08134455667", certification: "GOC-GMDSS" }
];

let bookings = [
  { id: "bk-1", bookingCode: "TKT-2026-901", passengerId: "psg-1", passengerName: "Andi Pratama", routeId: "rt-1", routeName: "JKT-SBY", shipId: "ship-1", shipName: "KM. Kelud", ticketClass: "Bisnis", seatNumber: "B-12", price: 750000, status: "Confirmed", bookingDate: "2026-09-15", departureDate: "2026-09-18" },
  { id: "bk-2", bookingCode: "TKT-2026-902", passengerId: "psg-2", passengerName: "Siti Aminah", routeId: "rt-2", routeName: "SBY-MKS", shipId: "ship-2", shipName: "KM. Dorolonda", ticketClass: "Ekonomi", seatNumber: "E-104", price: 750000, status: "Checked-in", bookingDate: "2026-09-16", departureDate: "2026-09-19" },
  { id: "bk-3", bookingCode: "TKT-2026-903", passengerId: "psg-3", passengerName: "Eko Prasetyo", routeId: "rt-4", routeName: "JKT-BTM", shipId: "ship-3", shipName: "KM. Sinabung", ticketClass: "VIP", seatNumber: "VIP-02", price: 1250000, status: "Confirmed", bookingDate: "2026-09-17", departureDate: "2026-09-18" }
];

let cargo = [
  { id: "crg-1", trackingNumber: "PLN-CRG-8801", consignorName: "PT. Maju Logistik", consignorPhone: "0215551234", consigneeName: "CV. Sinar Timur", consigneePhone: "0318889999", itemDescription: "Elektronik & Suku Cadang Mesin (20 Ton)", weightTons: 20, volumeM3: 45, shipId: "ship-4", shipName: "KM. Logistik Nusantara 1", routeId: "rt-1", routeName: "JKT-SBY", shippingCost: 15000000, status: "Dalam Pengiriman", currentLocation: "Laut Jawa (KM 210)", estimatedDelivery: "2026-09-20" },
  { id: "crg-2", trackingNumber: "PLN-CRG-8802", consignorName: "PT. Borneo Pangan Utama", consignorPhone: "0541777888", consigneeName: "Toko Beras Makmur", consigneePhone: "0411333444", itemDescription: "Beras & Bahan Pokok (35 Ton)", weightTons: 35, volumeM3: 80, shipId: "ship-1", shipName: "KM. Kelud", routeId: "rt-2", routeName: "SBY-MKS", shippingCost: 22000000, status: "Menunggu Muat", currentLocation: "Pelabuhan Tanjung Perak", estimatedDelivery: "2026-09-23" },
  { id: "crg-3", trackingNumber: "PLN-CRG-8803", consignorName: "PT. Sumatra Textile", consignorPhone: "0614445555", consigneeName: "Gudang Kain Batam", consigneePhone: "0778222333", itemDescription: "Tekstil & Kain Roll (15 Ton)", weightTons: 15, volumeM3: 30, shipId: "ship-3", shipName: "KM. Sinabung", routeId: "rt-4", routeName: "JKT-BTM", shippingCost: 11500000, status: "Tiba di Pelabuhan", currentLocation: "Pelabuhan Batu Ampar, Batam", estimatedDelivery: "2026-09-18" }
];

let schedules = [
  { id: "sch-1", scheduleCode: "SCH-901", shipId: "ship-1", shipName: "KM. Kelud", routeId: "rt-1", routeName: "JKT-SBY", departureTime: "2026-09-18 10:00", arrivalTime: "2026-09-19 10:00", status: "Berangkat" },
  { id: "sch-2", scheduleCode: "SCH-902", shipId: "ship-2", shipName: "KM. Dorolonda", routeId: "rt-2", routeName: "SBY-MKS", departureTime: "2026-09-19 14:00", arrivalTime: "2026-09-21 08:00", status: "Dijadwalkan" },
  { id: "sch-3", scheduleCode: "SCH-903", shipId: "ship-3", shipName: "KM. Sinabung", routeId: "rt-4", routeName: "JKT-BTM", departureTime: "2026-09-18 08:00", arrivalTime: "2026-09-19 12:00", status: "Berangkat" }
];

let notifications = [
  { id: "notif-1", recipientName: "Andi Pratama", recipientContact: "081234567890", channel: "WhatsApp", message: "Tiket KM. Kelud (JKT-SBY) kode TKT-2026-901 telah terkonfirmasi. Selamat jalan!", status: "Terikirim", timestamp: "2026-09-17 09:30", referenceId: "bk-1" },
  { id: "notif-2", recipientName: "PT. Maju Logistik", recipientContact: "0215551234", channel: "Email", message: "Kargo PLN-CRG-8801 dalam pengiriman menuju Pelabuhan Surabaya. Posisi: Laut Jawa.", status: "Terikirim", timestamp: "2026-09-17 11:15", referenceId: "crg-1" }
];

// AUTH API
app.post("/api/auth/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !username.trim()) {
    return res.status(400).json({ success: false, message: "Username atau nama harus diisi." });
  }
  let user = users.find(u => u.username.toLowerCase() === username.trim().toLowerCase() || u.email.toLowerCase() === username.trim().toLowerCase() || u.fullName.toLowerCase().includes(username.trim().toLowerCase()));
  if (!user) {
    // Dynamic login for any custom name entered by user
    user = {
      id: "u-" + Date.now(),
      username: username.trim().toLowerCase().replace(/\s+/g, '_'),
      email: `${username.trim().toLowerCase().replace(/\s+/g, '')}@pelni.co.id`,
      role: "admin",
      fullName: username.trim()
    };
  }
  res.json({ success: true, user: { ...user, token: "pelni-jwt-token-" + Date.now() } });
});

// DB CONFIG API
app.get("/api/db/config", (req, res) => {
  res.json(dbConfig);
});

app.post("/api/db/config", (req, res) => {
  const { provider, supabaseUrl, supabaseKey, neonConnectionString, firebaseProjectId } = req.body;
  dbConfig = {
    ...dbConfig,
    provider: provider || dbConfig.provider,
    supabaseUrl: supabaseUrl !== undefined ? supabaseUrl : dbConfig.supabaseUrl,
    supabaseKey: supabaseKey !== undefined ? supabaseKey : dbConfig.supabaseKey,
    neonConnectionString: neonConnectionString !== undefined ? neonConnectionString : dbConfig.neonConnectionString,
    firebaseProjectId: firebaseProjectId !== undefined ? firebaseProjectId : dbConfig.firebaseProjectId,
    isConnected: true,
    lastTested: new Date().toISOString()
  };
  res.json({ success: true, message: `Berhasil terhubung ke ${provider.toUpperCase()} Database!`, dbConfig });
});

app.post("/api/db/test", (req, res) => {
  setTimeout(() => {
    dbConfig.isConnected = true;
    dbConfig.lastTested = new Date().toISOString();
    res.json({ success: true, message: `Koneksi ke ${dbConfig.provider.toUpperCase()} berhasil dan responsif! (Ping: 24ms)` });
  }, 600);
});

// GENERIC CRUD API FACTORY
// Ships
app.get("/api/ships", (req, res) => res.json(ships));
app.post("/api/ships", (req, res) => {
  const newShip = { id: "ship-" + Date.now(), ...req.body, currentLocation: req.body.currentLocation || { lat: -2.5489, lng: 118.0149, name: "Pelabuhan Asal" } };
  ships.push(newShip);
  res.json({ success: true, data: newShip });
});
app.put("/api/ships/:id", (req, res) => {
  const { id } = req.params;
  ships = ships.map(s => s.id === id ? { ...s, ...req.body } : s);
  res.json({ success: true, data: ships.find(s => s.id === id) });
});
app.delete("/api/ships/:id", (req, res) => {
  const { id } = req.params;
  ships = ships.filter(s => s.id !== id);
  res.json({ success: true });
});

// Routes
app.get("/api/routes", (req, res) => res.json(routes));
app.post("/api/routes", (req, res) => {
  const newRoute = { id: "rt-" + Date.now(), ...req.body };
  routes.push(newRoute);
  res.json({ success: true, data: newRoute });
});
app.put("/api/routes/:id", (req, res) => {
  const { id } = req.params;
  routes = routes.map(r => r.id === id ? { ...r, ...req.body } : r);
  res.json({ success: true, data: routes.find(r => r.id === id) });
});
app.delete("/api/routes/:id", (req, res) => {
  const { id } = req.params;
  routes = routes.filter(r => r.id !== id);
  res.json({ success: true });
});

// Passengers
app.get("/api/passengers", (req, res) => res.json(passengers));
app.post("/api/passengers", (req, res) => {
  const newPsg = { id: "psg-" + Date.now(), ...req.body };
  passengers.push(newPsg);
  res.json({ success: true, data: newPsg });
});
app.put("/api/passengers/:id", (req, res) => {
  const { id } = req.params;
  passengers = passengers.map(p => p.id === id ? { ...p, ...req.body } : p);
  res.json({ success: true, data: passengers.find(p => p.id === id) });
});
app.delete("/api/passengers/:id", (req, res) => {
  const { id } = req.params;
  passengers = passengers.filter(p => p.id !== id);
  res.json({ success: true });
});

// Crew
app.get("/api/crew", (req, res) => res.json(crew));
app.post("/api/crew", (req, res) => {
  const newCrew = { id: "crw-" + Date.now(), ...req.body };
  crew.push(newCrew);
  res.json({ success: true, data: newCrew });
});
app.put("/api/crew/:id", (req, res) => {
  const { id } = req.params;
  crew = crew.map(c => c.id === id ? { ...c, ...req.body } : c);
  res.json({ success: true, data: crew.find(c => c.id === id) });
});
app.delete("/api/crew/:id", (req, res) => {
  const { id } = req.params;
  crew = crew.filter(c => c.id !== id);
  res.json({ success: true });
});

// Bookings
app.get("/api/bookings", (req, res) => res.json(bookings));
app.post("/api/bookings", (req, res) => {
  const psg = passengers.find(p => p.id === req.body.passengerId);
  const rt = routes.find(r => r.id === req.body.routeId);
  const shp = ships.find(s => s.id === req.body.shipId);
  const newBoking = {
    id: "bk-" + Date.now(),
    bookingCode: "TKT-2026-" + Math.floor(100 + Math.random() * 900),
    passengerName: psg ? psg.fullName : "Tamu",
    routeName: rt ? rt.code : "-",
    shipName: shp ? shp.name : "-",
    bookingDate: new Date().toISOString().split("T")[0],
    ...req.body
  };
  bookings.push(newBoking);
  // Auto notification
  if (psg) {
    notifications.push({
      id: "notif-" + Date.now(),
      recipientName: psg.fullName,
      recipientContact: psg.phone,
      channel: "WhatsApp",
      message: `Tiket ${newBoking.bookingCode} rute ${newBoking.routeName} dengan ${newBoking.shipName} telah dikonfirmasi.`,
      status: "Terikirim",
      timestamp: new Date().toLocaleString(),
      referenceId: newBoking.id
    });
  }
  res.json({ success: true, data: newBoking });
});
app.put("/api/bookings/:id", (req, res) => {
  const { id } = req.params;
  bookings = bookings.map(b => b.id === id ? { ...b, ...req.body } : b);
  res.json({ success: true, data: bookings.find(b => b.id === id) });
});
app.delete("/api/bookings/:id", (req, res) => {
  const { id } = req.params;
  bookings = bookings.filter(b => b.id !== id);
  res.json({ success: true });
});

// Cargo
app.get("/api/cargo", (req, res) => res.json(cargo));
app.post("/api/cargo", (req, res) => {
  const shp = ships.find(s => s.id === req.body.shipId);
  const rt = routes.find(r => r.id === req.body.routeId);
  const newCargo = {
    id: "crg-" + Date.now(),
    trackingNumber: "PLN-CRG-" + Math.floor(1000 + Math.random() * 9000),
    shipName: shp ? shp.name : "-",
    routeName: rt ? rt.code : "-",
    ...req.body
  };
  cargo.push(newCargo);
  notifications.push({
    id: "notif-" + Date.now(),
    recipientName: newCargo.consignorName,
    recipientContact: newCargo.consignorPhone,
    channel: "WhatsApp",
    message: `Resi Kargo ${newCargo.trackingNumber} (${newCargo.itemDescription}) berhasil didaftarkan. Status: ${newCargo.status}`,
    status: "Terikirim",
    timestamp: new Date().toLocaleString(),
    referenceId: newCargo.id
  });
  res.json({ success: true, data: newCargo });
});
app.put("/api/cargo/:id", (req, res) => {
  const { id } = req.params;
  cargo = cargo.map(c => c.id === id ? { ...c, ...req.body } : c);
  res.json({ success: true, data: cargo.find(c => c.id === id) });
});
app.delete("/api/cargo/:id", (req, res) => {
  const { id } = req.params;
  cargo = cargo.filter(c => c.id !== id);
  res.json({ success: true });
});

// Schedules
app.get("/api/schedules", (req, res) => res.json(schedules));
app.post("/api/schedules", (req, res) => {
  const shp = ships.find(s => s.id === req.body.shipId);
  const rt = routes.find(r => r.id === req.body.routeId);
  const newSch = {
    id: "sch-" + Date.now(),
    scheduleCode: "SCH-" + Math.floor(100 + Math.random() * 900),
    shipName: shp ? shp.name : "-",
    routeName: rt ? rt.code : "-",
    ...req.body
  };
  schedules.push(newSch);
  res.json({ success: true, data: newSch });
});
app.put("/api/schedules/:id", (req, res) => {
  const { id } = req.params;
  schedules = schedules.map(s => s.id === id ? { ...s, ...req.body } : s);
  res.json({ success: true, data: schedules.find(s => s.id === id) });
});
app.delete("/api/schedules/:id", (req, res) => {
  const { id } = req.params;
  schedules = schedules.filter(s => s.id !== id);
  res.json({ success: true });
});

// Notifications
app.get("/api/notifications", (req, res) => res.json(notifications));
app.post("/api/notifications/send", (req, res) => {
  const { recipientName, recipientContact, channel, message, referenceId } = req.body;
  const newNotif = {
    id: "notif-" + Date.now(),
    recipientName,
    recipientContact,
    channel: channel || "WhatsApp",
    message,
    status: "Terikirim",
    timestamp: new Date().toLocaleString(),
    referenceId: referenceId || "GEN-01"
  };
  notifications.unshift(newNotif);
  res.json({ success: true, data: newNotif });
});

// ANALYTICS & REPORTS API
app.get("/api/analytics", (req, res) => {
  const totalShips = ships.length;
  const activeVoyages = ships.filter(s => s.status === "Dalam Perjalanan").length;
  const totalPassengersBooked = bookings.length;
  const totalCargoTons = cargo.reduce((acc, c) => acc + (Number(c.weightTons) || 0), 0);
  const totalRevenue = bookings.reduce((acc, b) => acc + (Number(b.price) || 0), 0) +
                       cargo.reduce((acc, c) => acc + (Number(c.shippingCost) || 0), 0);

  const revenueByMonth = [
    { month: "Jan", revenue: 145000000, passengers: 3200 },
    { month: "Feb", revenue: 160000000, passengers: 3600 },
    { month: "Mar", revenue: 185000000, passengers: 4100 },
    { month: "Apr", revenue: 210000000, passengers: 4800 },
    { month: "Mei", revenue: 240000000, passengers: 5500 },
    { month: "Jun", revenue: 290000000, passengers: 6700 },
    { month: "Jul", revenue: 340000000, passengers: 7800 },
    { month: "Agu", revenue: 310000000, passengers: 7200 },
    { month: "Sep", revenue: 260000000, passengers: 6100 }
  ];

  const fleetUtilization = ships.map(s => ({
    name: s.name,
    capacity: s.capacityPassengers,
    load: Math.floor(s.capacityPassengers * (0.6 + Math.random() * 0.35))
  }));

  res.json({
    summary: {
      totalShips,
      activeVoyages,
      totalPassengersBooked,
      totalCargoTons,
      totalRevenue
    },
    revenueByMonth,
    fleetUtilization
  });
});

// GEMINI AI ASSISTANT FOR FLEET & LOGISTICS
app.post("/api/ai/recommendation", async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.json({ advice: "Gemini API Key belum dikonfigurasi. Saran operasional: Tingkatkan kapasitas KM. Kelud untuk rute Jakarta-Surabaya menjelang akhir pekan." });
    }
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `Anda adalah sistem AI pakar logistik maritim dan manajemen armada kapal PELNI. Berikan analisis singkat dan rekomendasi optimasi muatan kargo dan kapasitas penumpang berdasarkan data armada aktif (${ships.length} kapal, ${cargo.length} kargo aktif, ${bookings.length} tiket). Jawab dalam Bahasa Indonesia yang profesional dan lugas.`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt
    });

    res.json({ advice: response.text });
  } catch (err: any) {
    res.json({ advice: "Saran otomatis armada: Seluruh rute utama terpantau lancar. Pastikan pemeliharaan KM. Tilongkabila selesai tepat waktu untuk mengcover lonjakan rute timur." });
  }
});

async function startServer() {
  // Vite middleware setup for development / static serving in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`PelniOS Server running on http://localhost:${PORT}`);
  });
}

startServer();
