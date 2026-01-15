import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line 
} from 'recharts';
import { Users, Package, AlertTriangle, DollarSign, Ticket } from 'lucide-react';
import { DashboardStats, Renewal, Order, AppSettings } from '../types';

interface DashboardProps {
  stats: DashboardStats;
  recentOrders: Order[];
  expiringRenewals: Renewal[];
  settings: AppSettings;
}

const dataService = [
  { name: 'Netflix', value: 400 },
  { name: 'HBO', value: 300 },
  { name: 'Prime', value: 300 },
  { name: 'Spotify', value: 200 },
];
const COLORS = ['#0ea5e9', '#8b5cf6', '#10b981', '#f59e0b'];

const dataSales = [
  { name: 'Lun', sales: 400 },
  { name: 'Mar', sales: 300 },
  { name: 'Mié', sales: 600 },
  { name: 'Jue', sales: 400 },
  { name: 'Vie', sales: 700 },
  { name: 'Sáb', sales: 800 },
  { name: 'Dom', sales: 500 },
];

const StatCard = ({ title, value, icon: Icon, color, subtext }: any) => (
  <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <span className="text-2xl font-bold text-slate-800 dark:text-white">{value}</span>
    </div>
    <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium">{title}</h3>
    <p className="text-xs text-green-500 mt-1 font-medium">{subtext}</p>
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({ stats, recentOrders, expiringRenewals, settings }) => {
  
  const formatCurrency = (amount: number) => {
    if (settings.currency !== 'USD') {
       const localAmount = amount * settings.exchangeRate;
       return localAmount.toLocaleString('es-ES', { 
         style: 'currency', 
         currency: settings.currency,
         minimumFractionDigits: 0,
         maximumFractionDigits: 2
       });
    }
    return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Clientes" 
          value={stats.totalClients} 
          icon={Users} 
          color="bg-blue-500" 
          subtext="+12% vs mes anterior"
        />
        <StatCard 
          title="Ingresos Mensuales" 
          value={formatCurrency(stats.monthlyRevenue)} 
          icon={DollarSign} 
          color="bg-emerald-500" 
          subtext={`+8% (${settings.currency})`}
        />
        <StatCard 
          title="Vencen Pronto" 
          value={stats.expiringSoon} 
          icon={AlertTriangle} 
          color="bg-amber-500" 
          subtext="Próximos 7 días"
        />
        <StatCard 
          title="Tickets Abiertos" 
          value={stats.openTickets} 
          icon={Ticket} 
          color="bg-purple-500" 
          subtext="2 urgentes"
        />
      </div>

      {/* Urgent Alerts Section */}
      {stats.expiringSoon > 0 && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/50 rounded-xl p-4 flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-amber-800 dark:text-amber-300">Acción Requerida</h4>
            <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
              Tienes {stats.expiringSoon} cuentas que vencen en los próximos 7 días. Revisa la pestaña de renovaciones para evitar interrupciones en el servicio.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Tendencia de Ingresos</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dataSales}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                  formatter={(value: number) => [`$${value}`, 'Ventas']}
                />
                <Line type="monotone" dataKey="sales" stroke="#0ea5e9" strokeWidth={3} dot={{ r: 4, fill: '#0ea5e9' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Distribution Pie Chart */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Distribución de Servicios</h3>
          <div className="h-64 w-full flex items-center justify-center">
             <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dataService}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {dataService.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                  />
                </PieChart>
             </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-2 justify-center mt-4">
             {dataService.map((entry, index) => (
               <div key={entry.name} className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                 <span className="w-2 h-2 rounded-full mr-1" style={{backgroundColor: COLORS[index]}}></span>
                 {entry.name}
               </div>
             ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="p-6 border-b border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Pedidos Recientes</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-900/50 dark:text-slate-400">
                <tr>
                  <th className="px-6 py-3">ID</th>
                  <th className="px-6 py-3">Cliente</th>
                  <th className="px-6 py-3">Total</th>
                  <th className="px-6 py-3">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {recentOrders.map(order => (
                  <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{order.id}</td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{order.clientName}</td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                      {formatCurrency(order.total)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold
                        ${order.status === 'Pagado' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 
                          order.status === 'Pendiente' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                          'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Expiring Soon Table */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
           <div className="p-6 border-b border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Renovaciones Próximas</h3>
          </div>
          <div className="overflow-x-auto">
             <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-900/50 dark:text-slate-400">
                <tr>
                  <th className="px-6 py-3">Cliente</th>
                  <th className="px-6 py-3">Servicio</th>
                  <th className="px-6 py-3">Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {expiringRenewals.map(renewal => (
                  <tr key={renewal.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{renewal.clientName}</td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{renewal.service}</td>
                    <td className="px-6 py-4 text-red-500 font-medium">{renewal.expiryDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;