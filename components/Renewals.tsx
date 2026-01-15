import React from 'react';
import { RefreshCw, Calendar, Mail, MessageCircle, AlertCircle } from 'lucide-react';
import { Renewal, ServiceType, AppSettings } from '../types';
import { useNotifications } from './Notifications';

interface RenewalsProps {
  renewals: Renewal[];
  setRenewals: React.Dispatch<React.SetStateAction<Renewal[]>>;
  settings: AppSettings;
}

const Renewals: React.FC<RenewalsProps> = ({ renewals, setRenewals, settings }) => {
  const { addNotification } = useNotifications();

  const getDaysRemaining = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getStatusColor = (days: number) => {
    if (days < 0) return 'bg-red-500/10 text-red-500 border-red-500/20';
    if (days <= 3) return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
    if (days <= 7) return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
    return 'bg-green-500/10 text-green-500 border-green-500/20';
  };

  const handleRenew = (id: string) => {
    if(confirm('¿Confirmar renovación por 30 días adicionales?')) {
      setRenewals(prev => prev.map(r => {
        if (r.id === id) {
          const currentExpiry = new Date(r.expiryDate);
          const newExpiry = new Date(currentExpiry.setDate(currentExpiry.getDate() + 30));
          addNotification('Suscripción Renovada', `Se han añadido 30 días a la suscripción. Vence: ${newExpiry.toISOString().split('T')[0]}`, 'success');
          return {
            ...r,
            lastRenewalDate: new Date().toISOString().split('T')[0],
            expiryDate: newExpiry.toISOString().split('T')[0]
          };
        }
        return r;
      }));
    }
  };

  const handleSendReminder = (clientName: string, method: 'Email' | 'WhatsApp') => {
    addNotification('Recordatorio Enviado', `Mensaje enviado a ${clientName} por ${method} exitosamente.`, 'info');
  };
  
  const handleMassReminders = () => {
    addNotification('Proceso Iniciado', 'Enviando recordatorios a 5 clientes con vencimiento próximo...', 'info');
  };

  const calculateLocalPrice = (usdPrice: number) => {
    if (settings.currency === 'USD') return null;
    return (usdPrice * settings.exchangeRate).toLocaleString('es-ES', { 
      style: 'currency', 
      currency: settings.currency 
    });
  };

  const sortedRenewals = [...renewals].sort((a, b) => 
    new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime()
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Renovaciones</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Gestiona suscripciones próximas a vencer y notificaciones.</p>
        </div>
        <div className="flex gap-2">
           <button 
             onClick={handleMassReminders}
             className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-white text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
           >
             Enviar Recordatorios Masivos
           </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-900/50 dark:text-slate-400">
              <tr>
                <th className="px-6 py-4">Cliente</th>
                <th className="px-6 py-4">Servicio</th>
                <th className="px-6 py-4">Monto</th>
                <th className="px-6 py-4">Vencimiento</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {sortedRenewals.map((renewal) => {
                const daysLeft = getDaysRemaining(renewal.expiryDate);
                const statusStyle = getStatusColor(daysLeft);
                const localAmount = calculateLocalPrice(renewal.amount);
                
                return (
                  <tr key={renewal.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900 dark:text-white">{renewal.clientName}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <span className="w-2 h-2 rounded-full bg-primary-500 mr-2"></span>
                        <span className="text-slate-600 dark:text-slate-300">{renewal.service}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-800 dark:text-white">${renewal.amount}</span>
                        {localAmount && <span className="text-xs text-slate-400">{localAmount}</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-slate-600 dark:text-slate-300">
                        <Calendar className="w-4 h-4 mr-2 opacity-70" />
                        {renewal.expiryDate}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusStyle}`}>
                        {daysLeft < 0 ? 'Vencido' : `${daysLeft} Días Restantes`}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button 
                          onClick={() => handleSendReminder(renewal.clientName, 'Email')}
                          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-500" 
                          title="Enviar Correo"
                        >
                          <Mail className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleSendReminder(renewal.clientName, 'WhatsApp')}
                          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-green-600" 
                          title="Enviar WhatsApp"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleRenew(renewal.id)}
                          className="flex items-center px-3 py-1 bg-primary-600 hover:bg-primary-700 text-white rounded text-xs ml-2 transition-colors"
                        >
                          <RefreshCw className="w-3 h-3 mr-1" />
                          Renovar
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Renewals;