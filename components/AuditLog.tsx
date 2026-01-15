import React from 'react';
import { FileText } from 'lucide-react';
import { AuditLogEntry } from '../types';

interface AuditLogProps {
  logs: AuditLogEntry[];
}

const AuditLog: React.FC<AuditLogProps> = ({ logs }) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Auditoría y Registros</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Historial de actividad y cambios en el sistema.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-900/50 dark:text-slate-400">
              <tr>
                <th className="px-6 py-4">Fecha y Hora</th>
                <th className="px-6 py-4">Usuario</th>
                <th className="px-6 py-4">Módulo</th>
                <th className="px-6 py-4">Acción</th>
                <th className="px-6 py-4">Detalles</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {logs.length === 0 ? (
                 <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">No hay registros de actividad recientes.</td>
                 </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                    <td className="px-6 py-4 text-slate-500 font-mono text-xs">{log.timestamp}</td>
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{log.user}</td>
                    <td className="px-6 py-4">
                       <span className="px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs">
                         {log.module}
                       </span>
                    </td>
                    <td className="px-6 py-4 text-slate-800 dark:text-white font-medium">{log.action}</td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{log.details}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AuditLog;