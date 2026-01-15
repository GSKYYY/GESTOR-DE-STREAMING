import React, { useState, useEffect } from 'react';
import { Search, Plus, Filter, Edit, Trash2, Columns, X } from 'lucide-react';
import { Client, ClientStatus } from '../types';
import { useNotifications } from './Notifications';

interface ClientsProps {
  clients: Client[];
  setClients: React.Dispatch<React.SetStateAction<Client[]>>;
  logAction: (action: string, details: string, module: string) => void;
}

const Clients: React.FC<ClientsProps> = ({ clients, setClients, logAction }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<Partial<Client>>({});
  const [isEditing, setIsEditing] = useState(false);
  
  // Advanced Filters State
  const [showFilters, setShowFilters] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCountry, setFilterCountry] = useState<string>('all');

  // Column Visibility State
  const [visibleColumns, setVisibleColumns] = useState(() => {
    const saved = localStorage.getItem('clientsColumns');
    return saved ? JSON.parse(saved) : { name: true, contact: true, country: true, status: true, credit: true };
  });
  const [showColumnMenu, setShowColumnMenu] = useState(false);

  const { addNotification } = useNotifications();

  useEffect(() => {
    localStorage.setItem('clientsColumns', JSON.stringify(visibleColumns));
  }, [visibleColumns]);

  const toggleColumn = (col: string) => {
    setVisibleColumns((prev: any) => ({ ...prev, [col]: !prev[col] }));
  };

  const filteredClients = clients.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || c.status === filterStatus;
    const matchesCountry = filterCountry === 'all' || c.country === filterCountry;
    return matchesSearch && matchesStatus && matchesCountry;
  });

  const uniqueCountries = Array.from(new Set(clients.map(c => c.country)));

  const handleDelete = (id: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
      const clientName = clients.find(c => c.id === id)?.name;
      setClients(prev => prev.filter(c => c.id !== id));
      addNotification('Cliente Eliminado', 'El cliente ha sido eliminado permanentemente.', 'info');
      logAction('Eliminar Cliente', `Cliente ${clientName} (${id}) eliminado.`, 'Clientes');
    }
  };

  const handleEdit = (client: Client) => {
    setFormData(client);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleAddNew = () => {
    setFormData({ status: ClientStatus.ACTIVE, credit: 0, tags: [] });
    setIsEditing(false);
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      setClients(prev => prev.map(c => c.id === formData.id ? { ...c, ...formData } as Client : c));
      addNotification('Cliente Actualizado', 'La información del cliente ha sido guardada.', 'success');
      logAction('Editar Cliente', `Cliente ${formData.name} actualizado.`, 'Clientes');
    } else {
      const newClient: Client = {
        ...formData as Client,
        id: Math.random().toString(36).substr(2, 9),
        registeredAt: new Date().toISOString().split('T')[0],
      };
      setClients(prev => [newClient, ...prev]);
      addNotification('Nuevo Cliente', `${newClient.name} ha sido registrado exitosamente.`, 'success');
      logAction('Crear Cliente', `Nuevo cliente ${newClient.name} creado.`, 'Clientes');
    }
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Clientes</h2>
        <div className="flex w-full md:w-auto gap-2">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar clientes..."
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
            onClick={handleAddNew}
            className="flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            Nuevo
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
              {Object.values(ClientStatus).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">País</label>
             <select 
              value={filterCountry}
              onChange={(e) => setFilterCountry(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg p-2 text-sm text-slate-900 dark:text-white"
            >
              <option value="all">Todos</option>
              {uniqueCountries.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex items-end">
             <button 
               onClick={() => { setFilterStatus('all'); setFilterCountry('all'); }}
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
                {visibleColumns.name && <th className="px-6 py-4">Nombre</th>}
                {visibleColumns.contact && <th className="px-6 py-4">Contacto</th>}
                {visibleColumns.country && <th className="px-6 py-4">País</th>}
                {visibleColumns.status && <th className="px-6 py-4">Estado</th>}
                {visibleColumns.credit && <th className="px-6 py-4">Crédito</th>}
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {filteredClients.map((client) => (
                <tr key={client.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                  {visibleColumns.name && (
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900 dark:text-white">{client.name}</div>
                      <div className="text-xs text-slate-500">Reg: {client.registeredAt}</div>
                    </td>
                  )}
                  {visibleColumns.contact && (
                    <td className="px-6 py-4">
                      <div className="text-slate-600 dark:text-slate-300">{client.email}</div>
                      <div className="text-slate-500">{client.phone}</div>
                    </td>
                  )}
                  {visibleColumns.country && <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{client.country}</td>}
                  {visibleColumns.status && (
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold
                        ${client.status === ClientStatus.ACTIVE ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 
                          client.status === ClientStatus.SUSPENDED ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                          'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}>
                        {client.status}
                      </span>
                    </td>
                  )}
                  {visibleColumns.credit && <td className="px-6 py-4 font-medium text-slate-700 dark:text-slate-300">${client.credit.toFixed(2)}</td>}
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button onClick={() => handleEdit(client)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-slate-500 hover:text-primary-600">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDelete(client.id)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-slate-500 hover:text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-lg shadow-2xl border border-slate-200 dark:border-slate-700">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">
                {isEditing ? 'Editar Cliente' : 'Nuevo Cliente'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-500 hover:text-white"><XButton /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Nombre Completo</label>
                  <input type="text" required value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg p-2 text-slate-900 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Email</label>
                  <input type="email" required value={formData.email || ''} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg p-2 text-slate-900 dark:text-white" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Teléfono</label>
                  <input type="text" value={formData.phone || ''} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg p-2 text-slate-900 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">País</label>
                  <input type="text" value={formData.country || ''} onChange={e => setFormData({...formData, country: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg p-2 text-slate-900 dark:text-white" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Estado</label>
                  <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as ClientStatus})} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg p-2 text-slate-900 dark:text-white">
                    {Object.values(ClientStatus).map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Crédito ($)</label>
                  <input type="number" value={formData.credit || 0} onChange={e => setFormData({...formData, credit: Number(e.target.value)})} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg p-2 text-slate-900 dark:text-white" />
                </div>
              </div>
              <div className="pt-4 flex justify-end space-x-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border border-slate-600 rounded-lg text-slate-400 hover:bg-slate-700">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const XButton = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
)

export default Clients;