export type UserRole = 'admin' | 'dispatcher' | 'captain' | 'customer_service';

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  fullName: string;
  token?: string;
}

export interface Ship {
  id: string;
  name: string;
  code: string;
  type: 'Passenger' | 'Cargo' | 'Pelni Fast Ferry' | 'Container Ship';
  capacityPassengers: number;
  capacityCargoTons: number;
  captain: string;
  status: 'Beroperasi' | 'Maintenance' | 'Sandar' | 'Dalam Perjalanan';
  currentLocation: { lat: number; lng: number; name: string };
  speedKnots: number;
  heading: number;
  destination: string;
  eta: string;
}

export interface Route {
  id: string;
  code: string;
  origin: string;
  destination: string;
  distanceNm: number;
  estimatedHours: number;
  baseFare: number;
  status: 'Aktif' | 'Non-Aktif';
}

export interface Passenger {
  id: string;
  nik: string;
  fullName: string;
  phone: string;
  email: string;
  address: string;
  gender: 'Laki-laki' | 'Perempuan';
}

export interface Crew {
  id: string;
  name: string;
  position: string;
  shipId: string;
  phone: string;
  certification: string;
}

export interface Booking {
  id: string;
  bookingCode: string;
  passengerId: string;
  passengerName?: string;
  routeId: string;
  routeName?: string;
  shipId: string;
  shipName?: string;
  ticketClass: 'Ekonomi' | 'Bisnis' | 'VIP';
  seatNumber: string;
  price: number;
  status: 'Confirmed' | 'Pending' | 'Checked-in' | 'Cancelled';
  bookingDate: string;
  departureDate: string;
}

export interface Cargo {
  id: string;
  trackingNumber: string;
  consignorName: string;
  consignorPhone: string;
  consigneeName: string;
  consigneePhone: string;
  itemDescription: string;
  weightTons: number;
  volumeM3: number;
  shipId: string;
  shipName?: string;
  routeId: string;
  routeName?: string;
  shippingCost: number;
  status: 'Menunggu Muat' | 'Dalam Pengiriman' | 'Tiba di Pelabuhan' | 'Selesai';
  currentLocation: string;
  estimatedDelivery: string;
}

export interface VoyageSchedule {
  id: string;
  scheduleCode: string;
  shipId: string;
  shipName?: string;
  routeId: string;
  routeName?: string;
  departureTime: string;
  arrivalTime: string;
  status: 'Dijadwalkan' | 'Berangkat' | 'Tiba' | 'Dibatalkan';
}

export interface NotificationLog {
  id: string;
  recipientName: string;
  recipientContact: string;
  channel: 'WhatsApp' | 'Email' | 'SMS';
  message: string;
  status: 'Terikirim' | 'Gagal' | 'Pending';
  timestamp: string;
  referenceId: string;
}

export interface DatabaseConfig {
  provider: 'supabase' | 'neon' | 'firebase' | 'local';
  supabaseUrl?: string;
  supabaseKey?: string;
  neonConnectionString?: string;
  firebaseProjectId?: string;
  firebaseApiKey?: string;
  isConnected: boolean;
  lastTested?: string;
}
