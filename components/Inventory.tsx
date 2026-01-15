import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Package, X, Filter, Columns } from 'lucide-react';
import { Product, ServiceType, AppSettings } from '../types';
import { useNotifications } from './Notifications';

interface InventoryProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  settings: AppSettings;
  logAction: (action: string, details: string, module: string) => void;
}

const Inventory: React.FC<InventoryProps> = ({ products, setProducts, settings, logAction }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<Partial<Product>>({});
  const [isEditing, setIsEditing] = useState(false);
  
  // Filters and Columns
  const [showFilters, setShowFilters] = useState(false);
  const [filterService, setFilterService] = useState<string>('all');
  const [filterStock, setFilterStock] = useState<string>('all'); // all, low, out
  
  const { addNotification } = useNotifications();
  
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.service.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesService = filterService === 'all' || p.service === filterService;
    let matchesStock = true;
    if (filterStock === 'low') matchesStock = p.stock < 10 && p.stock > 0;
    if (filterStock === 'out') matchesStock = p.stock === 0;

    return matchesSearch && matchesService && matchesStock;
  });

  const handleDelete = (id: string) => {
    if(confirm('¿Seguro que deseas eliminar este producto?')) {
      const prodName = products.find(p => p.id === id)?.name;
      setProducts(prev => prev.filter(p => p.id !== id));
      addNotification('Producto Eliminado', 'El producto ha sido removido del inventario.', 'info');
      logAction('Eliminar Producto', `Producto ${prodName} (${id}) eliminado.`, 'Inventario');
    }
  };

  const handleEdit = (product: Product) => {
    setFormData(product);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleAddNew = () => {
    setFormData({ 
      active: true, 
      stock: 0, 
      totalStock: 0, 
      service: ServiceType.OTHER 
    });
    setIsEditing(false);
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      setProducts(prev => prev.map(p => p.id === formData.id ? { ...p, ...formData } as Product : p));
      addNotification('Producto Actualizado', `Los datos de ${formData.name} han sido guardados.`, 'success');
      logAction('Editar Producto', `Producto ${formData.name} actualizado.`, 'Inventario');
    } else {
      const newProduct: Product = {
        ...formData as Product,
        id: Math.random().toString(36).substr(2, 9),
      };
      setProducts(prev => [newProduct, ...prev]);
      addNotification('Producto Creado', `${newProduct.name} añadido al inventario correctamente.`, 'success');
      logAction('Crear Producto', `Nuevo producto ${newProduct.name} creado.`, 'Inventario');
    }
    setShowModal(false);
  };

  const calculateLocalPrice = (usdPrice: number) => {
    if (settings.currency === 'USD') return null;
    return (usdPrice * settings.exchangeRate).toLocaleString('es-ES', { 
      style: 'currency', 
      currency: settings.currency 
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Inventario y Productos</h2>
        <div className="flex w-full md:w-auto gap-2">
           <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar productos..."
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
          <button 
            onClick={handleAddNew}
            className="flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium"
          >
            <Plus className="h-5 w-5 mr-2" />
            Añadir Producto
          </button>
        </div>
      </div>

       {/* Advanced Filters Panel */}
       {showFilters && (
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in-down">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Servicio</label>
            <select 
              value={filterService}
              onChange={(e) => setFilterService(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg p-2 text-sm text-slate-900 dark:text-white"
            >
              <option value="all">Todos</option>
              {Object.values(ServiceType).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Estado de Stock</label>
             <select 
              value={filterStock}
              onChange={(e) => setFilterStock(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg p-2 text-sm text-slate-900 dark:text-white"
            >
              <option value="all">Todos</option>
              <option value="low">Stock Bajo (&lt; 10)</option>
              <option value="out">Sin Stock (0)</option>
            </select>
          </div>
          <div className="flex items-end">
             <button 
               onClick={() => { setFilterService('all'); setFilterStock('all'); }}
               className="text-sm text-primary-600 hover:text-primary-700 underline"
             >
               Limpiar Filtros
             </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map(product => {
           const localCost = calculateLocalPrice(product.cost);
           const localPrice = calculateLocalPrice(product.price);

           return (
            <div key={product.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-xl">
                  <Package className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                </div>
                <span className={`px-2 py-1 text-xs rounded-full font-semibold ${product.active ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700'}`}>
                  {product.active ? 'Activo' : 'Inactivo'}
                </span>
              </div>
              
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">{product.name}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{product.description}</p>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <span className="text-xs text-slate-500 block">Costo</span>
                  <div className="flex flex-col">
                    <span className="font-mono font-medium dark:text-slate-300">${product.cost}</span>
                    {localCost && <span className="text-xs text-slate-400">{localCost}</span>}
                  </div>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">Precio</span>
                  <div className="flex flex-col">
                    <span className="font-mono font-bold text-lg text-primary-600">${product.price}</span>
                    {localPrice && <span className="text-xs text-primary-600/70">{localPrice}</span>}
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-500">Disponibilidad</span>
                  <span className={`font-medium ${product.stock < 10 ? 'text-red-500' : 'text-slate-700 dark:text-slate-300'}`}>
                    {product.stock} / {product.totalStock}
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${product.stock < 10 ? 'bg-red-500' : 'bg-green-500'}`}
                    style={{ width: `${(product.stock / product.totalStock) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-700 space-x-2">
                <button 
                  onClick={() => handleEdit(product)}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-500 transition-colors"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => handleDelete(product.id)}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-500 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
           );
        })}
      </div>

       {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-lg shadow-2xl border border-slate-200 dark:border-slate-700">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">
                {isEditing ? 'Editar Producto' : 'Nuevo Producto'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-500 hover:text-white"><X className="w-6 h-6"/></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Nombre</label>
                  <input type="text" required value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg p-2 text-slate-900 dark:text-white" />
                </div>
                 <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Servicio</label>
                  <select value={formData.service} onChange={e => setFormData({...formData, service: e.target.value as ServiceType})} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg p-2 text-slate-900 dark:text-white">
                    {Object.values(ServiceType).map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div>
                 <label className="block text-sm font-medium text-slate-400 mb-1">Descripción</label>
                 <input type="text" value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg p-2 text-slate-900 dark:text-white" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Costo (USD)</label>
                  <input type="number" step="0.01" required value={formData.cost || 0} onChange={e => setFormData({...formData, cost: Number(e.target.value)})} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg p-2 text-slate-900 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Precio Venta (USD)</label>
                  <input type="number" step="0.01" required value={formData.price || 0} onChange={e => setFormData({...formData, price: Number(e.target.value)})} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg p-2 text-slate-900 dark:text-white" />
                </div>
              </div>
               <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Stock Actual</label>
                  <input type="number" required value={formData.stock || 0} onChange={e => setFormData({...formData, stock: Number(e.target.value)})} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg p-2 text-slate-900 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Stock Total (Capacidad)</label>
                  <input type="number" required value={formData.totalStock || 0} onChange={e => setFormData({...formData, totalStock: Number(e.target.value)})} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg p-2 text-slate-900 dark:text-white" />
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

export default Inventory;