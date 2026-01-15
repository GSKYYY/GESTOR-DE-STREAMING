import React, { useState } from 'react';
import { Save, Globe, Bell, DollarSign, Shield, Layout, Smartphone, Mail, CreditCard, Clock, Building } from 'lucide-react';
import { useNotifications } from './Notifications';
import { AppSettings } from '../types';

interface SettingsProps {
  config: AppSettings;
  setConfig: React.Dispatch<React.SetStateAction<AppSettings>>;
}

const Settings: React.FC<SettingsProps> = ({ config, setConfig }) => {
  const { addNotification } = useNotifications();
  const [activeTab, setActiveTab] = useState('general');

  const handleChange = (key: keyof AppSettings, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    // Here you would typically save to a backend
    addNotification('Configuración Guardada', 'Todos los cambios han sido aplicados al sistema.', 'success');
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Building },
    { id: 'finance', label: 'Finanzas y Moneda', icon: DollarSign },
    { id: 'appearance', label: 'Visualización', icon: Layout },
    { id: 'notifications', label: 'Notificaciones', icon: Bell },
    { id: 'security', label: 'Seguridad', icon: Shield },
    { id: 'integrations', label: 'Integraciones', icon: Smartphone },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row gap-6">
        
        {/* Settings Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6 px-2">Ajustes</h2>
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium transition-colors border-l-4
                    ${activeTab === tab.id 
                      ? 'bg-primary-50 dark:bg-primary-900/10 text-primary-600 border-primary-500' 
                      : 'text-slate-600 dark:text-slate-400 border-transparent hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
            
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center">
                {tabs.find(t => t.id === activeTab)?.label}
              </h3>
              <button 
                onClick={handleSave}
                className="flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm rounded-lg font-medium shadow-md shadow-primary-500/20 transition-all"
              >
                <Save className="w-4 h-4 mr-2" />
                Guardar Cambios
              </button>
            </div>

            <div className="p-6 space-y-8">
              
              {/* GENERAL TAB */}
              {activeTab === 'general' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-medium text-slate-500 mb-1">Nombre de la Empresa / Marca</label>
                    <input 
                      type="text" 
                      value={config.companyName}
                      onChange={(e) => handleChange('companyName', e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg p-2.5 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-500 mb-1">ID Fiscal (NIT/RUT/CIF)</label>
                    <input 
                      type="text" 
                      value={config.taxId}
                      onChange={(e) => handleChange('taxId', e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg p-2.5 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-500 mb-1">Sitio Web</label>
                    <input 
                      type="text" 
                      value={config.website}
                      onChange={(e) => handleChange('website', e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg p-2.5 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-medium text-slate-500 mb-1">Email de Soporte</label>
                    <input 
                      type="email" 
                      value={config.supportEmail}
                      onChange={(e) => handleChange('supportEmail', e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg p-2.5 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              )}

              {/* FINANCE TAB */}
              {activeTab === 'finance' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-500 mb-1">Moneda Principal</label>
                      <select 
                        value={config.currency}
                        onChange={(e) => handleChange('currency', e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg p-2.5 text-slate-900 dark:text-white"
                      >
                        <option value="USD">USD - Dólar Estadounidense ($)</option>
                        <option value="ARS">ARS - Peso Argentino ($)</option>
                        <option value="BOB">BOB - Boliviano (Bs)</option>
                        <option value="BRL">BRL - Real Brasileño (R$)</option>
                        <option value="CLP">CLP - Peso Chileno ($)</option>
                        <option value="COP">COP - Peso Colombiano ($)</option>
                        <option value="CRC">CRC - Colón Costarricense (₡)</option>
                        <option value="DOP">DOP - Peso Dominicano (RD$)</option>
                        <option value="EUR">EUR - Euro (€)</option>
                        <option value="MXN">MXN - Peso Mexicano ($)</option>
                        <option value="PEN">PEN - Sol Peruano (S/)</option>
                        <option value="PYG">PYG - Guaraní Paraguayo (₲)</option>
                        <option value="UYU">UYU - Peso Uruguayo ($)</option>
                        <option value="VES">VES - Bolívar Venezolano (Bs)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-500 mb-1">
                        Tasa de Cambio Manual (1 USD a {config.currency})
                      </label>
                      <input 
                        type="number" 
                        step="0.01"
                        disabled={config.currency === 'USD'}
                        value={config.exchangeRate}
                        onChange={(e) => handleChange('exchangeRate', Number(e.target.value))}
                        className={`w-full border border-slate-300 dark:border-slate-600 rounded-lg p-2.5 text-slate-900 dark:text-white ${config.currency === 'USD' ? 'bg-slate-100 dark:bg-slate-800 opacity-50' : 'bg-slate-50 dark:bg-slate-900'}`}
                      />
                    </div>
                  </div>
                  
                  <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
                    <h4 className="text-md font-semibold text-slate-800 dark:text-white mb-4">Impuestos y Facturación</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-slate-500 mb-1">Tasa de Impuesto (%)</label>
                        <input 
                          type="number" 
                          value={config.taxRate}
                          onChange={(e) => handleChange('taxRate', Number(e.target.value))}
                          className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg p-2.5 text-slate-900 dark:text-white"
                        />
                      </div>
                      <div className="flex items-center h-full pt-6">
                        <label className="flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={config.enableInvoicing}
                            onChange={(e) => handleChange('enableInvoicing', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                          <span className="ml-3 text-sm font-medium text-slate-700 dark:text-slate-300">Habilitar módulo de Facturación</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* APPEARANCE TAB */}
              {activeTab === 'appearance' && (
                <div className="space-y-6">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-500 mb-1">Idioma del Sistema</label>
                      <select 
                        value={config.language}
                        onChange={(e) => handleChange('language', e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg p-2.5 text-slate-900 dark:text-white"
                      >
                        <option value="es">Español</option>
                        <option value="en">English</option>
                        <option value="pt">Português</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-500 mb-1">Zona Horaria</label>
                      <select 
                        value={config.timezone}
                        onChange={(e) => handleChange('timezone', e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg p-2.5 text-slate-900 dark:text-white"
                      >
                         <option value="UTC-5">América/Bogotá (UTC-5)</option>
                         <option value="UTC-4">América/Caracas (UTC-4)</option>
                         <option value="UTC-3">América/Argentina/Buenos_Aires (UTC-3)</option>
                         <option value="UTC-6">América/Mexico_City (UTC-6)</option>
                         <option value="UTC+1">Europa/Madrid (UTC+1)</option>
                      </select>
                    </div>
                     <div>
                      <label className="block text-sm font-medium text-slate-500 mb-1">Formato de Fecha</label>
                      <select 
                        value={config.dateFormat}
                        onChange={(e) => handleChange('dateFormat', e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg p-2.5 text-slate-900 dark:text-white"
                      >
                         <option value="DD/MM/YYYY">DD/MM/YYYY (31/12/2023)</option>
                         <option value="MM/DD/YYYY">MM/DD/YYYY (12/31/2023)</option>
                         <option value="YYYY-MM-DD">YYYY-MM-DD (2023-12-31)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-500 mb-1">Densidad de Tablas</label>
                      <select 
                        value={config.tableDensity}
                        onChange={(e) => handleChange('tableDensity', e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg p-2.5 text-slate-900 dark:text-white"
                      >
                         <option value="compact">Compacta (Más datos)</option>
                         <option value="normal">Normal</option>
                         <option value="comfortable">Cómoda (Más espacio)</option>
                      </select>
                    </div>
                   </div>
                </div>
              )}

              {/* NOTIFICATIONS TAB */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-500 mb-1">Recordatorio de Renovación (Días)</label>
                      <input 
                        type="number" 
                        value={config.autoRenewalReminder}
                        onChange={(e) => handleChange('autoRenewalReminder', Number(e.target.value))}
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg p-2.5 text-slate-900 dark:text-white"
                      />
                      <p className="text-xs text-slate-400 mt-1">Días antes del vencimiento para generar alertas.</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-500 mb-1">Umbral de Stock Bajo</label>
                      <input 
                        type="number" 
                        value={config.lowStockThreshold}
                        onChange={(e) => handleChange('lowStockThreshold', Number(e.target.value))}
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg p-2.5 text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
                    <h4 className="text-md font-semibold text-slate-800 dark:text-white mb-4">Canales de Notificación</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                        <div className="flex items-center">
                          <Mail className="w-5 h-5 text-slate-400 mr-3" />
                          <span className="text-slate-700 dark:text-slate-300">Email (SMTP)</span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" checked={config.emailNotifications} onChange={(e) => handleChange('emailNotifications', e.target.checked)} className="sr-only peer" />
                          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                        <div className="flex items-center">
                          <Smartphone className="w-5 h-5 text-green-500 mr-3" />
                          <span className="text-slate-700 dark:text-slate-300">WhatsApp API</span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" checked={config.whatsappNotifications} onChange={(e) => handleChange('whatsappNotifications', e.target.checked)} className="sr-only peer" />
                          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                        </label>
                      </div>

                       <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                        <div className="flex items-center">
                          <Layout className="w-5 h-5 text-blue-500 mr-3" />
                          <span className="text-slate-700 dark:text-slate-300">Telegram Bot</span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" checked={config.telegramNotifications} onChange={(e) => handleChange('telegramNotifications', e.target.checked)} className="sr-only peer" />
                          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SECURITY TAB */}
               {activeTab === 'security' && (
                <div className="space-y-6">
                  <div className="p-4 border border-amber-200 bg-amber-50 dark:bg-amber-900/10 rounded-lg flex items-start gap-3">
                    <Shield className="w-6 h-6 text-amber-500 flex-shrink-0" />
                    <div>
                      <h4 className="font-bold text-amber-800 dark:text-amber-300">Zona de Seguridad</h4>
                      <p className="text-sm text-amber-700 dark:text-amber-400">
                        Los cambios en esta sección pueden afectar el acceso de los usuarios. Asegúrate de comunicar cualquier cambio importante.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-500 mb-1">Tiempo de Sesión (Minutos)</label>
                      <select 
                        value={config.sessionTimeout}
                        onChange={(e) => handleChange('sessionTimeout', Number(e.target.value))}
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg p-2.5 text-slate-900 dark:text-white"
                      >
                         <option value="15">15 Minutos</option>
                         <option value="30">30 Minutos</option>
                         <option value="60">1 Hora</option>
                         <option value="240">4 Horas</option>
                         <option value="1440">24 Horas</option>
                      </select>
                    </div>
                    
                    <div className="flex items-center h-full pt-6">
                         <label className="flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={config.require2FA}
                            onChange={(e) => handleChange('require2FA', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                          <span className="ml-3 text-sm font-medium text-slate-700 dark:text-slate-300">Requerir 2FA para Admins</span>
                        </label>
                    </div>
                  </div>
                </div>
              )}
              
              {/* INTEGRATIONS TAB (Placeholder) */}
              {activeTab === 'integrations' && (
                <div className="text-center py-12">
                   <Layout className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                   <h3 className="text-lg font-bold text-slate-800 dark:text-white">API y Webhooks</h3>
                   <p className="text-slate-500 mb-6">Conecta StreamMaster con herramientas externas como Zapier, Stripe o tu propio CRM.</p>
                   <button className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-white rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">
                     Ver Documentación API
                   </button>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;