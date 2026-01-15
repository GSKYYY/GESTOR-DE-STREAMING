export enum UserRole {
  ADMIN = 'ADMIN',
  SELLER = 'VENDEDOR',
  SUPPORT = 'SOPORTE'
}

export enum ClientStatus {
  ACTIVE = 'Activo',
  INACTIVE = 'Inactivo',
  SUSPENDED = 'Suspendido'
}

export enum ServiceType {
  NETFLIX = 'Netflix',
  HBO = 'HBO Max',
  PRIME = 'Amazon Prime',
  DISNEY = 'Disney+',
  SPOTIFY = 'Spotify',
  YOUTUBE = 'YouTube Premium',
  CRUNCHYROLL = 'Crunchyroll',
  OTHER = 'Otro'
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  status: ClientStatus;
  credit: number;
  registeredAt: string;
  tags: string[];
}

export interface Product {
  id: string;
  service: ServiceType;
  name: string;
  description: string;
  cost: number;
  price: number;
  durationDays: number;
  stock: number;
  totalStock: number;
  active: boolean;
}

export enum OrderStatus {
  PENDING = 'Pendiente',
  PAID = 'Pagado',
  CANCELLED = 'Cancelado'
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  clientId: string;
  clientName: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  date: string;
  paymentMethod: string;
}

export interface Renewal {
  id: string;
  clientId: string;
  clientName: string;
  service: ServiceType;
  expiryDate: string;
  lastRenewalDate: string;
  amount: number;
}

export enum TicketPriority {
  LOW = 'Baja',
  MEDIUM = 'Media',
  HIGH = 'Alta'
}

export enum TicketStatus {
  OPEN = 'Abierto',
  IN_PROGRESS = 'En Progreso',
  RESOLVED = 'Resuelto',
  CLOSED = 'Cerrado'
}

export interface Ticket {
  id: string;
  clientId: string;
  clientName: string;
  subject: string;
  category: string;
  priority: TicketPriority;
  status: TicketStatus;
  createdAt: string;
  lastUpdate: string;
}

export interface DashboardStats {
  totalClients: number;
  activeInventory: number;
  expiringSoon: number;
  monthlyRevenue: number;
  openTickets: number;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  read: boolean;
  timestamp: Date;
}

export interface AppSettings {
  // General
  companyName: string;
  taxId: string; // NIT, RUT, CIF, etc.
  supportEmail: string;
  website: string;
  
  // Regional & Currency
  language: string;
  timezone: string;
  dateFormat: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD';
  currency: string;
  exchangeRate: number;
  
  // Appearance
  tableDensity: 'compact' | 'normal' | 'comfortable';
  
  // Finance
  taxRate: number; // Porcentaje de impuestos por defecto
  enableInvoicing: boolean;

  // Notifications
  emailNotifications: boolean;
  whatsappNotifications: boolean;
  telegramNotifications: boolean;
  
  // Automation & Inventory
  autoRenewalReminder: number;
  lowStockThreshold: number;
  
  // Security
  sessionTimeout: number; // minutes
  require2FA: boolean;
}

export interface AuditLogEntry {
  id: string;
  action: string;
  details: string;
  user: string;
  timestamp: string;
  module: string;
}