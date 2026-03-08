/**
 * COMPONENTE: DashboardView
 * Muestra el resumen ejecutivo de la empresa seleccionada.
 * Puedes cambiar los títulos de los KPIs o la lógica de filtrado aquí.
 */

import React from 'react';
import { Plus, UserCircle, Target, TrendingUp, BarChart3, Clock } from 'lucide-react';

// Sub-componente interno para Tarjetas (Cards) con efecto hover suave
const Card = ({ children, className = '' }: any) => (
    <div className={`bg-white rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-xl hover:shadow-indigo-500/5 ${className}`}>
        {children}
    </div>
);

// Sub-componente para Etiquetas (Badges) de estado con tipografía bold
const Badge = ({ children, type = 'default' }: any) => {
    const colors: Record<string, string> = {
        success: 'bg-emerald-100 text-emerald-800',
        warning: 'bg-amber-100 text-amber-800',
        info: 'bg-blue-100 text-blue-800',
        default: 'bg-slate-100 text-slate-800'
    };
    return (
        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${colors[type] || colors.default}`}>
            {children}
        </span>
    );
};

// Icono personalizado para Target (Objetivo)
const TargetIcon = ({ size }: { size: number }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>;

export default function DashboardView({ currentEmpresa, mockData, onNavigate }: any) {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* CABECERA DEL DASHBOARD */}
            <div className="flex justify-between items-center sm:items-end">
                <div>
                    <h2 className="text-3xl font-black text-slate-800 tracking-tight">Mando de Control</h2>
                    <p className="text-slate-500 text-sm mt-1">Sincronización estratégica con <span className="font-bold text-indigo-600">{currentEmpresa.nombre}</span></p>
                </div>
                {/* Este botón utiliza la función onNavigate definida en Page.tsx para cambiar de módulo */}
                <button
                    onClick={() => onNavigate('proyectos')}
                    className="bg-slate-900 hover:bg-indigo-600 text-white px-6 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all shadow-lg active:scale-95 hover:-translate-y-1"
                >
                    <Plus size={16} /> Gestionar Proyectos
                </button>
            </div>

            {/* --- KPIs PRINCIPALES ---
          Cambia los textos en 'title' para renombrar las métricas en la interfaz. 
      */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { title: 'Leads Totales', value: mockData.metricasGenerales.leads, trend: '+12%', icon: UserCircle, color: 'text-blue-500', bg: 'bg-blue-50' },
                    { title: 'CPL (Costo/Lead)', value: mockData.metricasGenerales.cplPromedio, trend: '-5%', icon: TargetIcon, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                    { title: 'Retorno ROI', value: mockData.metricasGenerales.roi, trend: '+24%', icon: TrendingUp, color: 'text-indigo-500', bg: 'bg-indigo-50' },
                    { title: 'Presupuesto Ads', value: mockData.metricasGenerales.inversion, trend: '+2%', icon: BarChart3, color: 'text-amber-500', bg: 'bg-amber-50' },
                ].map((kpi, i) => (
                    <Card key={i} className="p-6 border-none ring-1 ring-slate-100">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest">{kpi.title}</p>
                                <h3 className="text-2xl font-black text-slate-800 mt-2">{kpi.value}</h3>
                            </div>
                            <div className={`p-3 rounded-2xl ${kpi.bg} ${kpi.color}`}>
                                <kpi.icon size={22} />
                            </div>
                        </div>
                        <div className="mt-5 text-[10px] font-black text-emerald-500 flex items-center gap-1.5 p-2 bg-emerald-50/50 rounded-lg w-fit">
                            {kpi.trend} <span className="text-slate-400 font-bold uppercase">vs último mes</span>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* LISTADO DE PROYECTOS RECIENTES */}
                <Card className="lg:col-span-2 p-6 overflow-hidden">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <div className="w-1.5 h-6 bg-indigo-500 rounded-full"></div>
                            Proyectos en Ejecución
                        </h3>
                        <button onClick={() => onNavigate('proyectos')} className="text-indigo-600 text-xs font-bold hover:underline">Auditar todos →</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-slate-400 text-[10px] uppercase font-black tracking-widest border-b border-slate-50">
                                    <th className="pb-4">Nombre del Proyecto</th>
                                    <th className="pb-4">Estado</th>
                                    <th className="pb-4">Líder</th>
                                    <th className="pb-4 text-right">Ticket</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {mockData.proyectos.filter((p: any) => p.empresaId === currentEmpresa.id).slice(0, 5).map((p: any, i: number) => (
                                    <tr key={i} className="group hover:bg-slate-50/50 transition-colors cursor-default">
                                        <td className="py-4 text-sm font-bold text-slate-700">{p.nombre}</td>
                                        <td className="py-4">
                                            <Badge type={p.estado === 'En curso' ? 'info' : p.estado === 'Activo' ? 'success' : 'warning'}>
                                                {p.estado}
                                            </Badge>
                                        </td>
                                        <td className="py-4 text-xs text-slate-500 font-medium">{p.responsable}</td>
                                        <td className="py-4 text-sm font-black text-slate-800 text-right">{p.ticket}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>

                {/* VISTA RÁPIDA DEL PLANNER SEMANAL */}
                <Card className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <div className="w-1.5 h-6 bg-emerald-500 rounded-full"></div>
                            Próximas Salidas
                        </h3>
                        <button onClick={() => onNavigate('planner')} className="text-emerald-600 text-xs font-bold hover:underline">Full Planner</button>
                    </div>
                    <div className="space-y-5">
                        {mockData.planner.slice(0, 4).map((tarea: any, i: number) => (
                            <div key={i} className="flex gap-4 items-start group relative">
                                <div className="mt-1 w-2.5 h-2.5 rounded-full bg-indigo-500 ring-4 ring-indigo-50 group-hover:bg-emerald-500 group-hover:ring-emerald-50 transition-all shrink-0"></div>
                                <div className="flex-1 min-w-0 border-b border-slate-50 pb-4 group-last:border-0">
                                    <p className="text-sm font-bold text-slate-700 truncate group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{tarea.contenido}</p>
                                    <div className="flex items-center gap-3 mt-2">
                                        <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-tighter"><Clock size={12} strokeWidth={3} /> {tarea.publicacion}</span>
                                        <span className="text-[9px] px-2 py-0.5 bg-slate-100 text-slate-500 rounded-md font-black uppercase tracking-widest">{tarea.formato}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

            </div>
        </div>
    );
}
