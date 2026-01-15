import { Client, ClientStatus, Product, ServiceType, Order, OrderStatus, Ticket, TicketStatus, TicketPriority, Renewal } from './types';

export const MOCK_CLIENTS: Client[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com', phone: '+1234567890', country: 'EE. UU.', status: ClientStatus.ACTIVE, credit: 0, registeredAt: '2023-10-15', tags: ['VIP'] },
  { id: '2', name: 'Maria Garcia', email: 'maria@example.com', phone: '+1987654321', country: 'España', status: ClientStatus.ACTIVE, credit: 5, registeredAt: '2023-11-02', tags: ['Regular'] },
  { id: '3', name: 'Ahmed Khan', email: 'ahmed@example.com', phone: '+97150123456', country: 'EAU', status: ClientStatus.SUSPENDED, credit: 0, registeredAt: '2023-09-20', tags: [] },
  { id: '4', name: 'Sophie Martin', email: 'sophie@example.com', phone: '+33612345678', country: 'Francia', status: ClientStatus.ACTIVE, credit: 10, registeredAt: '2023-12-01', tags: ['Nuevo'] },
  { id: '5', name: 'Carlos Ruiz', email: 'carlos@example.com', phone: '+525512345678', country: 'México', status: ClientStatus.INACTIVE, credit: 0, registeredAt: '2023-08-15', tags: ['Revendedor'] },
];

export const MOCK_INVENTORY: Product[] = [
  { id: '101', service: ServiceType.NETFLIX, name: 'Netflix 4K Privada', description: '1 Perfil, 4K UHD', cost: 3, price: 5, durationDays: 30, stock: 45, totalStock: 50, active: true },
  { id: '102', service: ServiceType.NETFLIX, name: 'Netflix Estándar', description: 'Cuenta compartida', cost: 1, price: 2.5, durationDays: 30, stock: 120, totalStock: 150, active: true },
  { id: '103', service: ServiceType.HBO, name: 'HBO Max Anual', description: 'Cuenta completa', cost: 30, price: 50, durationDays: 365, stock: 10, totalStock: 20, active: true },
  { id: '104', service: ServiceType.PRIME, name: 'Prime Video 6 Meses', description: 'Correo privado', cost: 12, price: 20, durationDays: 180, stock: 5, totalStock: 15, active: true },
  { id: '105', service: ServiceType.SPOTIFY, name: 'Spotify Individual', description: 'Actualiza tu propia cuenta', cost: 2, price: 4, durationDays: 30, stock: 200, totalStock: 200, active: true },
];

export const MOCK_ORDERS: Order[] = [
  { id: 'ORD-001', clientId: '1', clientName: 'John Doe', items: [{ productId: '101', productName: 'Netflix 4K Privada', quantity: 1, price: 5 }], total: 5, status: OrderStatus.PAID, date: '2023-12-20', paymentMethod: 'Tarjeta de Crédito' },
  { id: 'ORD-002', clientId: '2', clientName: 'Maria Garcia', items: [{ productId: '105', productName: 'Spotify Individual', quantity: 2, price: 4 }], total: 8, status: OrderStatus.PAID, date: '2023-12-22', paymentMethod: 'PayPal' },
  { id: 'ORD-003', clientId: '3', clientName: 'Ahmed Khan', items: [{ productId: '102', productName: 'Netflix Estándar', quantity: 1, price: 2.5 }], total: 2.5, status: OrderStatus.CANCELLED, date: '2023-12-25', paymentMethod: 'Cripto' },
  { id: 'ORD-004', clientId: '1', clientName: 'John Doe', items: [{ productId: '103', productName: 'HBO Max Anual', quantity: 1, price: 50 }], total: 50, status: OrderStatus.PENDING, date: '2024-01-02', paymentMethod: 'Transferencia' },
];

const today = new Date();
const addDays = (days: number) => {
  const date = new Date(today);
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
};

export const MOCK_RENEWALS: Renewal[] = [
  { id: 'REN-001', clientId: '1', clientName: 'John Doe', service: ServiceType.NETFLIX, expiryDate: addDays(2), lastRenewalDate: addDays(-28), amount: 5 },
  { id: 'REN-002', clientId: '4', clientName: 'Sophie Martin', service: ServiceType.SPOTIFY, expiryDate: addDays(5), lastRenewalDate: addDays(-25), amount: 4 },
  { id: 'REN-003', clientId: '2', clientName: 'Maria Garcia', service: ServiceType.DISNEY, expiryDate: addDays(12), lastRenewalDate: addDays(-18), amount: 6 },
  { id: 'REN-004', clientId: '5', clientName: 'Carlos Ruiz', service: ServiceType.PRIME, expiryDate: addDays(-2), lastRenewalDate: addDays(-182), amount: 20 }, // Expired
];

export const MOCK_TICKETS: Ticket[] = [
  { id: 'TCK-1001', clientId: '1', clientName: 'John Doe', subject: 'Contraseña no funciona', category: 'Problema de Acceso', priority: TicketPriority.HIGH, status: TicketStatus.OPEN, createdAt: '2024-01-02', lastUpdate: '2024-01-02' },
  { id: 'TCK-1002', clientId: '2', clientName: 'Maria Garcia', subject: '¿Cómo renovar?', category: 'Renovación', priority: TicketPriority.LOW, status: TicketStatus.RESOLVED, createdAt: '2023-12-28', lastUpdate: '2023-12-29' },
  { id: 'TCK-1003', clientId: '5', clientName: 'Carlos Ruiz', subject: '¿Requiere VPN?', category: 'Técnico', priority: TicketPriority.MEDIUM, status: TicketStatus.IN_PROGRESS, createdAt: '2024-01-01', lastUpdate: '2024-01-02' },
];