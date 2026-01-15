import React, { useState, useEffect } from 'react';
import { Search, Plus, ShoppingCart, Filter, X, Columns } from 'lucide-react';
import { Order, OrderStatus, Client, Product, ServiceType, AppSettings } from '../types';
import { useNotifications } from './Notifications';

interface OrdersProps {
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  clients: Client[];
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  settings: AppSettings;
  logAction: (action: string, details: string, module: string) => void;
}

const Orders: React.FC<OrdersProps> = ({ orders, setOrders, clients, products, setProducts, settings, logAction }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newOrder, setNewOrder] = useState<{
    clientId: string;
    productId: string;
    quantity: number;
    paymentMethod: string;
  }>({ clientId: '', productId: '', quantity: 1, paymentMethod: 'Transferencia' });

  // Filters and Columns
  const [showFilters, setShowFilters] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPayment, setFilterPayment] = useState<string>('all');
  
  const [visibleColumns, setVisibleColumns] = useState(() => {
    const saved = localStorage.getItem('ordersColumns');
    return saved ? JSON.parse(saved) : { id: true, client: true, products: true, date: true, method: true, total: true, status: true };
  });
  const [showColumnMenu, setShowColumnMenu] = useState(false);

  const { addNotification } = useNotifications();

  useEffect(() => {
    localStorage.setItem('ordersColumns', JSON.stringify(visibleColumns));
  }, [visibleColumns]);

  const toggleColumn = (col: string) => {
    setVisibleColumns((prev: any) => ({ ...prev, [col]: !prev[col] }));
  };

  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.clientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          o.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || o.status === filterStatus;
    const matchesPayment = filterPayment === 'all' || o.paymentMethod === filterPayment;
    return matchesSearch && matchesStatus && matchesPayment;
  });

  const uniquePaymentMethods = Array.from(new Set(orders.map(o => o.paymentMethod)));

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrder.clientId || !newOrder.productId) return;

    const client = clients.find(c => c.id === newOrder.clientId);
    const product = products.find(p => p.id === newOrder.productId);

    if (client && product) {
      // Check stock
      if (product.stock < newOrder.quantity) {
        addNotification('Error de Stock', `No hay suficiente stock. Disponibles: ${product.stock}`, 'error');
        return;
      }

      // Create Order
      const order: Order = {
        id: `ORD-${Math.floor(Math.random() * 10000)}`,
        clientId: client.id,
        clientName: client.name,
        items: [{
          productId: product.id,
          productName: product.name,
          quantity: newOrder.quantity,
          price: product.price
        }],
        total: product.price * newOrder.quantity,
        status: OrderStatus.PAID, // Auto paid for simplicity
        date: new Date().toISOString().split('T')[0],
        paymentMethod: newOrder.paymentMethod
      };

      // Update Inventory Stock
      const newStock = product.stock - newOrder.quantity;
      setProducts(prev => prev.map(p => 
        p.id === product.id ? { ...p, stock: newStock } : p
      ));

      setOrders(prev => [order, ...prev]);
      addNotification('Pedido Creado', `Pedido ${order.id} registrado exitosamente.`, 'success');
      logAction('Crear Pedido', `Pedido ${order.id} para ${client.name} creado. Total: $${order.total}`, 'Pedidos');

      // Trigger warning if stock gets low based on Config
      if (newStock < settings.lowStockThreshold) {
         addNotification('Stock Crítico', `El producto ${product.name} tiene un stock bajo (${newStock} restantes).`, 'warning');
      }

      setShowModal(false);
      setNewOrder({ clientId: '', productId: '', quantity: 1, paymentMethod: 'Transferencia' });
    }
  };

  const formatCurrency = (amount: number) => {
    if (settings.currency !== 'USD') {
       const localAmount = amount * settings.exchangeRate;
       return localAmount.toLocaleString('es-ES', { 
         style: 'currency', 
         currency: settings.currency 
       });
    }
    return `$${amount.toFixed(2)}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Pedidos</h2>
        <div className="flex w-full md:w-auto gap-2">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar pedido..."
              className="pl-10 pr-4 py-2 w-full border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
           <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors ${showFilters ? 'bg-primary-50 border-primary-200 text-primary-600' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'}`}
            title="Filtros Avanzados"
          >
            <Filter className="h-5 w-5" />
          </button>

          <div className="relative">
            <button 
              onClick={() => setShowColumnMenu(!showColumnMenu)}
              className="p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              title="Personalizar Columnas"
            >
              <Columns className="h-5 w-5" />
            </button>
            {showColumnMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 z-10 p-2">
                 <h4 className="text-xs font-bold text-slate-500 uppercase px-2 mb-2">Mostrar Columnas</h4>
                 {Object.keys(visibleColumns).map(col => (
                   <label key={col} className="flex items-center px-2 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-700 rounded cursor-pointer">
                     <input 
                       type="checkbox" 
                       checked={visibleColumns[col]} 
                       onChange={() => toggleColumn(col)}
                       className="rounded text-primary-600 focus:ring-primary-500 mr-2"
                     />
                     <span className="text-sm text-slate-700 dark:text-slate-300 capitalize">{col}</span>
                   </label>
                 ))}
              </div>
            )}
          </div>

          <button 
            onClick={() => setShowModal(true)}
            className="flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            Nuevo Pedido
          </button>
        </div>
      </div>

       {/* Advanced Filters Panel */}
       {showFilters && (
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in-down">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Estado</label>
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg p-2 text-sm text-slate-900 dark:text-white"
            >
              <option value="all">Todos</option>
              {Object.values(OrderStatus).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Método de Pago</label>
             <select 
              value={filterPayment}
              onChange={(e) => setFilterPayment(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg p-2 text-sm text-slate-900 dark:text-white"
            >
              <option value="all">Todos</option>
              {uniquePaymentMethods.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div className="flex items-end">
             <button 
               onClick={() => { setFilterStatus('all'); setFilterPayment('all'); }}
               className="text-sm text-primary-600 hover:text-primary-700 underline"
             >
               Limpiar Filtros
             </button>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-900/50 dark:text-slate-400">
              <tr>
                {visibleColumns.id && <th className="px-6 py-4">ID</th>}
                {visibleColumns.client && <th className="px-6 py-4">Cliente</th>}
                {visibleColumns.products && <th className="px-6 py-4">Productos</th>}
                {visibleColumns.date && <th className="px-6 py-4">Fecha</th>}
                {visibleColumns.method && <th className="px-6 py-4">Método</th>}
                {visibleColumns.total && <th className="px-6 py-4">Total</th>}
                {visibleColumns.status && <th className="px-6 py-4">Estado</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                  {visibleColumns.id && <td className="px-6 py-4 font-mono text-xs text-slate-500">{order.id}</td>}
                  {visibleColumns.client && <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{order.clientName}</td>}
                  {visibleColumns.products && (
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                      {order.items.map((item, idx) => (
                        <div key={idx}>{item.quantity}x {item.productName}</div>
                      ))}
                    </td>
                  )}
                  {visibleColumns.date && <td className="px-6 py-4 text-slate-500">{order.date}</td>}
                  {visibleColumns.method && <td className="px-6 py-4 text-slate-500">{order.paymentMethod}</td>}
                  {visibleColumns.total && (
                    <td className="px-6 py-4 font-bold text-slate-800 dark:text-white">
                      {formatCurrency(order.total)}
                      {settings.currency !== 'USD' && <span className="text-[10px] text-slate-400 block">${order.total}</span>}
                    </td>
                  )}
                  {visibleColumns.status && (
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold
                          ${order.status === 'Pagado' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 
                            order.status === 'Pendiente' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                            'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                          {order.status}
                        </span>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-lg shadow-2xl border border-slate-200 dark:border-slate-700">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">Nuevo Pedido</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-500 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleCreateOrder} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Cliente</label>
                <select 
                  required
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg p-2 text-slate-900 dark:text-white"
                  value={newOrder.clientId}
                  onChange={e => setNewOrder({...newOrder, clientId: e.target.value})}
                >
                  <option value="">Seleccionar Cliente</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Producto</label>
                <select 
                  required
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg p-2 text-slate-900 dark:text-white"
                  value={newOrder.productId}
                  onChange={e => setNewOrder({...newOrder, productId: e.target.value})}
                >
                  <option value="">Seleccionar Producto</option>
                  {products.filter(p => p.active && p.stock > 0).map(p => (
                    <option key={p.id} value={p.id}>{p.name} (${p.price}) - Stock: {p.stock}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Cantidad</label>
                  <input 
                    type="number" 
                    min="1"
                    required
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg p-2 text-slate-900 dark:text-white"
                    value={newOrder.quantity}
                    onChange={e => setNewOrder({...newOrder, quantity: parseInt(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Método de Pago</label>
                  <select 
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg p-2 text-slate-900 dark:text-white"
                    value={newOrder.paymentMethod}
                    onChange={e => setNewOrder({...newOrder, paymentMethod: e.target.value})}
                  >
                    <option value="Transferencia">Transferencia</option>
                    <option value="Tarjeta">Tarjeta</option>
                    <option value="PayPal">PayPal</option>
                    <option value="Cripto">Cripto</option>
                    <option value="Efectivo">Efectivo</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex justify-end space-x-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border border-slate-600 rounded-lg text-slate-400 hover:bg-slate-700">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg">Crear Pedido</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;