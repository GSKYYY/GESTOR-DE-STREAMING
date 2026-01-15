import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';
import { Order, Client, Renewal } from '../types';

interface ReportsProps {
  orders: Order[];
  clients: Client[];
  renewals: Renewal[];
}

const Reports: React.FC<ReportsProps> = ({ orders, clients, renewals }) => {
  // Compute dummy data based on props for visualization
  const revenueData = [
    { name: 'Ene', total: 1200 },
    { name: 'Feb', total: 1900 },
    { name: 'Mar', total: 1500 },
    { name: 'Abr', total: 2100 },
    { name: 'May', total: 2400 },
    { name: 'Jun', total: orders.reduce((acc, curr) => acc + curr.total, 0) + 2000 },
  ];

  const clientGrowth = [
    { name: 'Semana 1', users: 10 },
    { name: 'Semana 2', users: 15 },
    { name: 'Semana 3', users: 22 },
    { name: 'Semana 4', users: clients.length + 25 },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Reportes y Análisis</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Crecimiento de Ingresos (Semestral)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                <Tooltip 
                   contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                />
                <Area type="monotone" dataKey="total" stroke="#0ea5e9" fillOpacity={1} fill="url(#colorTotal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Adquisición de Clientes (Mes Actual)</h3>
          <div className="h-72">
             <ResponsiveContainer width="100%" height="100%">
              <BarChart data={clientGrowth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip 
                   contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                   cursor={{fill: '#334155', opacity: 0.2}}
                />
                <Bar dataKey="users" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
            <h4 className="text-sm font-medium text-slate-500 mb-2">Ingreso Promedio por Usuario (ARPU)</h4>
            <div className="text-3xl font-bold text-slate-800 dark:text-white">$12.50</div>
            <div className="text-xs text-green-500 mt-1">+5.2% vs mes pasado</div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
            <h4 className="text-sm font-medium text-slate-500 mb-2">Tasa de Renovación</h4>
            <div className="text-3xl font-bold text-slate-800 dark:text-white">88%</div>
            <div className="text-xs text-red-500 mt-1">-1.2% vs mes pasado</div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
            <h4 className="text-sm font-medium text-slate-500 mb-2">Ticket Promedio</h4>
            <div className="text-3xl font-bold text-slate-800 dark:text-white">$8.40</div>
            <div className="text-xs text-green-500 mt-1">+0.5% vs mes pasado</div>
        </div>
      </div>
    </div>
  );
};

export default Reports;