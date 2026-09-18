import { User, Ship, Route, Passenger, Crew, Booking, Cargo, VoyageSchedule, NotificationLog, DatabaseConfig } from '../types';

export async function apiLogin(username: string, password: string):Promise<{ success: boolean; user?: User; message?: string }> {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  return res.json();
}

export async function fetchDbConfig(): Promise<DatabaseConfig> {
  const res = await fetch('/api/db/config');
  return res.json();
}

export async function updateDbConfig(config: Partial<DatabaseConfig>): Promise<{ success: boolean; message: string; dbConfig: DatabaseConfig }> {
  const res = await fetch('/api/db/config', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(config)
  });
  return res.json();
}

export async function testDbConnection(): Promise<{ success: boolean; message: string }> {
  const res = await fetch('/api/db/test', { method: 'POST' });
  return res.json();
}

// Generic Fetchers
export async function fetchEntities<T>(endpoint: string): Promise<T[]> {
  const res = await fetch(endpoint);
  return res.json();
}

export async function createEntity<T>(endpoint: string, data: Partial<T>): Promise<{ success: boolean; data: T }> {
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function updateEntity<T>(endpoint: string, id: string, data: Partial<T>): Promise<{ success: boolean; data: T }> {
  const res = await fetch(`${endpoint}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function deleteEntity(endpoint: string, id: string): Promise<{ success: boolean }> {
  const res = await fetch(`${endpoint}/${id}`, {
    method: 'DELETE'
  });
  return res.json();
}

export async function fetchAnalytics() {
  const res = await fetch('/api/analytics');
  return res.json();
}

export async function fetchAiAdvice() {
  const res = await fetch('/api/ai/recommendation', { method: 'POST' });
  return res.json();
}

export async function sendNotification(data: { recipientName: string; recipientContact: string; channel: string; message: string; referenceId?: string }) {
  const res = await fetch('/api/notifications/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}
