import React, { useState, useEffect } from 'react';
import { User, DatabaseConfig } from './types';
import { fetchDbConfig } from './lib/api';
import { Navbar } from './components/Navbar';
import { Sidebar, ActiveTab } from './components/Sidebar';
import { LoginModal } from './components/LoginModal';
import { DashboardView } from './components/DashboardView';
import { MasterDataView } from './components/MasterDataView';
import { TransactionsView } from './components/TransactionsView';
import { TrackingView } from './components/TrackingView';
import { ReportsView } from './components/ReportsView';
import { DatabaseConfigView } from './components/DatabaseConfigView';
import { NotificationsView } from './components/NotificationsView';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [dbConfig, setDbConfig] = useState<DatabaseConfig>({
    provider: 'supabase',
    isConnected: true
  });
  const [unreadNotifications, setUnreadNotifications] = useState(2);

  useEffect(() => {
    loadDbStatus();
  }, []);

  const loadDbStatus = async () => {
    try {
      const config = await fetchDbConfig();
      setDbConfig(config);
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) {
    return <LoginModal onLoginSuccess={(u) => setUser(u)} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* Top Navbar */}
      <Navbar
        user={user}
        dbConfig={dbConfig}
        onLogout={() => setUser(null)}
        onOpenDbConfig={() => setActiveTab('database')}
        onOpenNotifications={() => {
          setActiveTab('notifications');
          setUnreadNotifications(0);
        }}
        unreadNotificationsCount={unreadNotifications}
      />

      {/* Main Layout */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-950">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'dashboard' && <DashboardView />}
            {activeTab === 'master' && <MasterDataView />}
            {activeTab === 'transactions' && <TransactionsView />}
            {activeTab === 'tracking' && <TrackingView />}
            {activeTab === 'reports' && <ReportsView />}
            {activeTab === 'database' && <DatabaseConfigView />}
            {activeTab === 'notifications' && <NotificationsView />}
          </div>
        </main>

      </div>

    </div>
  );
}
