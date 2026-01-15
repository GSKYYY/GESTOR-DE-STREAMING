import React, { useState } from 'react';
import { Search, Plus, Ticket as TicketIcon, MessageSquare, CheckCircle, XCircle, X } from 'lucide-react';
import { Ticket, TicketStatus, TicketPriority, Client } from '../types';
import { useNotifications } from './Notifications';

interface TicketsProps {
  tickets: Ticket[];
  setTickets: React.Dispatch<React.SetStateAction<Ticket[]>>;
  clients: Client[];
}

const Tickets: React.FC<TicketsProps> = ({ tickets, setTickets, clients }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newTicket, setNewTicket] = useState<Partial<Ticket>>({ priority: TicketPriority.MEDIUM, status: TicketStatus.OPEN });

  const { addNotification } = useNotifications();

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    const client = clients.find(c => c.id === newTicket.clientId);
    if (!client) return;

    const ticket: Ticket = {
      id: `TCK-${Math.floor(Math.random() * 10000)}`,
      clientId: client.id,
      clientName: client.name,
      subject: newTicket.subject || 'Sin Asunto',
      category: newTicket.category || 'General',
      priority: newTicket.priority || TicketPriority.MEDIUM,
      status: TicketStatus.OPEN,
      createdAt: new Date().toISOString().split('T')[0],
      lastUpdate: new Date().toISOString().split('T')[0]
    };

    setTickets([ticket, ...tickets]);
    addNotification('Ticket Creado', `Nuevo ticket #${ticket.id} para ${client.name}.`, 'success');
    setShowModal(false);
    setNewTicket({ priority: TicketPriority.MEDIUM, status: TicketStatus.OPEN });
  };

  const updateStatus = (id: string, status: TicketStatus) => {
    setTickets(tickets.map(t => t.id === id ? { ...t, status, lastUpdate: new Date().toISOString().split('T')[0] } : t));
    addNotification('Estado Actualizado', `El ticket ha sido marcado como ${status}.`, 'info');
  };

  const getPriorityColor = (priority: TicketPriority) => {
    switch(priority) {
      case TicketPriority.HIGH: return 'text-red-500 bg-red-100 dark:bg-red-900/20';
      case TicketPriority.MEDIUM: return 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/20';
      case TicketPriority.LOW: return 'text-green-500 bg-green-100 dark:bg-green-900/20';
      default: return 'text-slate-500';
    }
  };

  const filteredTickets = tickets.filter(t => 
    t.clientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Soporte y Tickets</h2>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium"
        >
          <Plus className="h-5 w-5 mr-2" />
          Nuevo Ticket
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredTickets.map(ticket => (
          <div key={ticket.id} className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-lg ${getPriorityColor(ticket.priority)}`}>
                <TicketIcon className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-lg text-slate-800 dark:text-white">{ticket.subject}</h3>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 border border-slate-200 dark:border-slate-600">
                    {ticket.id}
                  </span>
                </div>
                <div className="flex flex-wrap items-center text-sm text-slate-500 gap-4">
                  <span className="flex items-center"><MessageSquare className="w-4 h-4 mr-1" /> {ticket.clientName}</span>
                  <span>Categoría: {ticket.category}</span>
                  <span>Actualizado: {ticket.lastUpdate}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end md:self-center">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider
                ${ticket.status === TicketStatus.OPEN ? 'bg-blue-100 text-blue-700' :
                  ticket.status === TicketStatus.IN_PROGRESS ? 'bg-purple-100 text-purple-700' :
                  'bg-gray-100 text-gray-600'}`}>
                {ticket.status}
              </span>
              
              {ticket.status !== TicketStatus.CLOSED && ticket.status !== TicketStatus.RESOLVED && (
                <button 
                  onClick={() => updateStatus(ticket.id, TicketStatus.RESOLVED)}
                  className="p-2 hover:bg-green-50 dark:hover:bg-green-900/20 text-green-600 rounded-lg transition-colors"
                  title="Marcar como Resuelto"
                >
                  <CheckCircle className="w-5 h-5" />
                </button>
              )}
               {ticket.status !== TicketStatus.CLOSED && (
                <button 
                  onClick={() => updateStatus(ticket.id, TicketStatus.CLOSED)}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 rounded-lg transition-colors"
                   title="Cerrar Ticket"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

       {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-lg shadow-2xl border border-slate-200 dark:border-slate-700">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">Nuevo Ticket</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-500 hover:text-white"><X className="w-6 h-6"/></button>
            </div>
            <form onSubmit={handleCreateTicket} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Cliente</label>
                <select 
                  required
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg p-2 text-slate-900 dark:text-white"
                  value={newTicket.clientId || ''}
                  onChange={e => setNewTicket({...newTicket, clientId: e.target.value})}
                >
                  <option value="">Seleccionar Cliente</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Asunto</label>
                <input 
                  type="text"
                  required
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg p-2 text-slate-900 dark:text-white"
                  value={newTicket.subject || ''}
                  onChange={e => setNewTicket({...newTicket, subject: e.target.value})}
                />
              </div>

               <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Categoría</label>
                  <select 
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg p-2 text-slate-900 dark:text-white"
                    value={newTicket.category || 'General'}
                    onChange={e => setNewTicket({...newTicket, category: e.target.value})}
                  >
                    <option value="General">General</option>
                    <option value="Técnico">Técnico</option>
                    <option value="Facturación">Facturación</option>
                    <option value="Acceso">Problema de Acceso</option>
                  </select>
                </div>
                 <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Prioridad</label>
                  <select 
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg p-2 text-slate-900 dark:text-white"
                    value={newTicket.priority}
                    onChange={e => setNewTicket({...newTicket, priority: e.target.value as TicketPriority})}
                  >
                    <option value={TicketPriority.LOW}>Baja</option>
                    <option value={TicketPriority.MEDIUM}>Media</option>
                    <option value={TicketPriority.HIGH}>Alta</option>
                  </select>
                </div>
               </div>

              <div className="pt-4 flex justify-end space-x-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border border-slate-600 rounded-lg text-slate-400 hover:bg-slate-700">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg">Crear Ticket</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tickets;