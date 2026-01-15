import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import Dashboard from './components/Dashboard';
import Clients from './components/Clients';
import Inventory from './components/Inventory';
import Renewals from './components/Renewals';
import Orders from './components/Orders';
import Tickets from './components/Tickets';
import Reports from './components/Reports';
import Settings from './components/Settings';
import AuditLog from './components/AuditLog';
import { NotificationProvider, useNotifications } from './components/Notifications';
import { MOCK_CLIENTS, MOCK_INVENTORY, MOCK_ORDERS, MOCK_RENEWALS, MOCK_TICKETS } from './constants';
import { Client, Product, Order, Renewal, Ticket, DashboardStats, AppSettings, AuditLogEntry } from './types';

// Create a wrapper component to use the hook inside the provider
const AppContent = () => {
  // --- State ---
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');
  
  // Data State
  const [clients, setClients] = useState<Client[]>(MOCK_CLIENTS);
  const [products, setProducts] = useState<Product[]>(MOCK_INVENTORY);
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [renewals, setRenewals] = useState<Renewal[]>(MOCK_RENEWALS);
  const [tickets, setTickets] = useState<Ticket[]>(MOCK_TICKETS);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);

  // Global Settings State
  const [settings, setSettings] = useState<AppSettings>({
    companyName: 'StreamMaster Pro',
    supportEmail: 'admin@streammaster.com',
    website: 'https://streammaster.com',
    taxId: '',
    
    currency: 'USD',
    exchangeRate: 36.5, // Default for VES context but adjustable
    language: 'es',
    timezone: 'UTC-4',
    dateFormat: 'DD/MM/YYYY',
    
    tableDensity: 'normal',
    
    taxRate: 0,
    enableInvoicing: false,
    
    emailNotifications: true,
    whatsappNotifications: false,
    telegramNotifications: false,
    
    autoRenewalReminder: 3, 
    lowStockThreshold: 5,
    
    sessionTimeout: 60,
    require2FA: false
  });
  
  const { addNotification } = useNotifications();

  // Helper for Logging
  const logAction = (action: string, details: string, module: string) => {
    const newLog: AuditLogEntry = {
      id: Math.random().toString(36).substr(2, 9),
      action,
      details,
      module,
      user: 'Admin', // Hardcoded for demo
      timestamp: new Date().toLocaleString()
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // --- Effects ---
  useEffect(() => {
    // Theme initialization
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // --- Automatic System Checks ---
  useEffect(() => {
    // 1. Check for Expiring Renewals
    const expiringCount = renewals.filter(r => {
      const today = new Date();
      const expiry = new Date(r.expiryDate);
      const diff = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return diff >= 0 && diff <= settings.autoRenewalReminder;
    }).length;

    if (expiringCount > 0) {
      addNotification(
        'Renovaciones Urgentes',
        `Tienes ${expiringCount} suscripciones que vencen en los próximos ${settings.autoRenewalReminder} días.`,
        'warning'
      );
    }

    // 2. Check for Low Stock (Dynamic Threshold)
    const lowStockItems = products.filter(p => p.active && p.stock < settings.lowStockThreshold).length;
    if (lowStockItems > 0) {
      addNotification(
        'Stock Bajo',
        `Atención: ${lowStockItems} productos están por debajo del stock mínimo (${settings.lowStockThreshold}).`,
        'error'
      );
    }
    
    // Welcome message
    addNotification('Bienvenido', `Sistema listo. Moneda activa: ${settings.currency}`, 'info');
  }, []); // Run once on mount

  // --- Computed Stats ---
  const stats: DashboardStats = {
    totalClients: clients.length,
    activeInventory: products.reduce((acc, curr) => acc + curr.stock, 0),
    expiringSoon: renewals.filter(r => {
      const today = new Date();
      const expiry = new Date(r.expiryDate);
      const diff = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return diff >= 0 && diff <= 7;
    }).length,
    monthlyRevenue: orders.reduce((acc, curr) => acc + curr.total, 0),
    openTickets: tickets.filter(t => t.status !== 'Cerrado' && t.status !== 'Resuelto').length
  };

  const handleLogout = () => {
    addNotification('Acceso Denegado', 'El cierre de sesión está desactivado en modo Demo.', 'error');
  };
  
  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard stats={stats} recentOrders={orders.slice(0, 5)} expiringRenewals={renewals.slice(0, 5)} settings={settings} />;
      case 'clients':
        return <Clients clients={clients} setClients={setClients} logAction={logAction} />;
      case 'inventory':
        return <Inventory products={products} setProducts={setProducts} settings={settings} logAction={logAction} />;
      case 'renewals':
        return <Renewals renewals={renewals} setRenewals={setRenewals} settings={settings} />;
      case 'orders':
        return <Orders orders={orders} setOrders={setOrders} clients={clients} products={products} setProducts={setProducts} settings={settings} logAction={logAction} />;
      case 'tickets':
        return <Tickets tickets={tickets} setTickets={setTickets} clients={clients} />;
      case 'reports':
        return <Reports orders={orders} clients={clients} renewals={renewals} />;
      case 'settings':
        return <Settings config={settings} setConfig={setSettings} />;
      case 'audit':
        return <AuditLog logs={auditLogs} />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-96 text-slate-500">
            <h2 className="text-2xl font-bold mb-2">Próximamente</h2>
            <p>El módulo {currentView} está en desarrollo.</p>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-dark-bg text-gray-900 dark:text-dark-text transition-colors duration-200">
      <Sidebar 
        currentView={currentView} 
        onChangeView={setCurrentView} 
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={handleLogout}
        isCollapsed={isSidebarCollapsed}
        toggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar 
          isDarkMode={isDarkMode} 
          toggleTheme={toggleTheme} 
          onMenuClick={() => setSidebarOpen(true)}
          userEmail={settings.supportEmail}
        />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {renderView()}
          </div>
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <NotificationProvider>
      <AppContent />
    </NotificationProvider>
  );
}

export default App;