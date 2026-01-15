import React from 'react';
import { LayoutDashboard, Users, Package, RefreshCw, ShoppingCart, Ticket, Settings, BarChart, Shield, LogOut, Tv, X, ChevronLeft, ChevronRight, FileText } from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onChangeView: (view: string) => void;
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  isCollapsed: boolean;
  toggleCollapse: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  currentView, 
  onChangeView, 
  isOpen, 
  onClose, 
  onLogout,
  isCollapsed,
  toggleCollapse
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Panel Principal', icon: LayoutDashboard },
    { id: 'clients', label: 'Clientes', icon: Users },
    { id: 'inventory', label: 'Inventario', icon: Package },
    { id: 'renewals', label: 'Renovaciones', icon: RefreshCw },
    { id: 'orders', label: 'Pedidos', icon: ShoppingCart },
    { id: 'tickets', label: 'Soporte', icon: Ticket },
    { id: 'reports', label: 'Reportes', icon: BarChart },
    { id: 'audit', label: 'Auditoría', icon: FileText },
    { id: 'settings', label: 'Configuración', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      <aside 
        className={`fixed lg:static top-0 left-0 z-50 h-screen bg-slate-900 border-r border-slate-800 transform transition-all duration-300 ease-in-out flex flex-col
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} 
          ${isCollapsed ? 'lg:w-20' : 'lg:w-64'}
        `}
      >
        <div className={`p-6 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Tv className="w-5 h-5 text-white" />
            </div>
            {!isCollapsed && (
              <span className="text-lg font-bold text-white tracking-tight truncate">StreamMaster</span>
            )}
          </div>
          <button onClick={onClose} className="lg:hidden text-slate-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto overflow-x-hidden">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onChangeView(item.id);
                  if (window.innerWidth < 1024) onClose();
                }}
                title={isCollapsed ? item.label : ''}
                className={`w-full flex items-center py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                  isCollapsed ? 'justify-center px-0' : 'px-4'
                } ${
                  isActive 
                    ? 'bg-primary-600/10 text-primary-400' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className={`h-5 w-5 flex-shrink-0 ${isActive ? 'text-primary-400' : 'text-slate-500'} ${isCollapsed ? '' : 'mr-3'}`} />
                {!isCollapsed && <span className="truncate">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Collapse Toggle Button (Desktop only) */}
        <div className="hidden lg:flex justify-center py-2 border-t border-slate-800">
           <button 
             onClick={toggleCollapse}
             className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
           >
             {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
           </button>
        </div>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={onLogout}
            title={isCollapsed ? "Cerrar Sesión" : ""}
            className={`w-full flex items-center py-3 text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl transition-colors ${isCollapsed ? 'justify-center px-0' : 'px-4'}`}
          >
            <LogOut className={`h-5 w-5 flex-shrink-0 ${isCollapsed ? '' : 'mr-3'}`} />
            {!isCollapsed && "Cerrar Sesión"}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;