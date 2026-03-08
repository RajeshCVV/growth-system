import React from 'react';
import { Plus, UserCircle, Target, TrendingUp, BarChart3, Clock } from 'lucide-react';

const Card = ({ children, className = '' }: any) => (
    <div className={`bg-white rounded-xl border border-slate-200 shadow-sm ${className}`}>
        {children}
    </div>
);

const Badge = ({ children, type = 'default' }: any) => {
    const colors: Record<string, string> = {
        success: 'bg-emerald-100 text-emerald-800',
        warning: 'bg-amber-100 text-amber-800',
        info: 'bg-blue-100 text-blue-800',
        default: 'bg-slate-100 text-slate-800'
    };
    return (
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${colors[type] || colors.default}`}>
            {children}
        </span>
    );
};

const TargetIcon = ({ size }: { size: number }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>;

export default function DashboardView({ currentEmpresa, mockData, onNavigate }: any) {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Dashboard General</h2>
                    <p className="text-slate-500 text-sm mt-1">Resumen de operaciones para {currentEmpresa.nombre}</p>
                </div>
                <button
                    onClick={() => onNavigate('proyectos')}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
                >
                    <Plus size={16} /> Gestionar Proyectos
                </button>
            </div>

            {/* KPIs Rápidos */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { title: 'Leads Captados', value: mockData.metricasGenerales.leads, trend: '+12%', icon: UserCircle, color: 'text-blue-600' },
                    { title: 'CPL Promedio', value: mockData.metricasGenerales.cplPromedio, trend: '-5%', icon: TargetIcon, color: 'text-emerald-600' },
                    { title: 'ROI Global', value: mockData.metricasGenerales.roi, trend: '+24%', icon: TrendingUp, color: 'text-indigo-600' },
                    { title: 'Inversión Activa', value: mockData.metricasGenerales.inversion, trend: '+2%', icon: BarChart3, color: 'text-amber-600' },
                ].map((kpi, i) => (
                    <Card key={i} className="p-5">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-slate-500 text-sm font-medium">{kpi.title}</p>
                                <h3 className="text-2xl font-bold text-slate-800 mt-1">{kpi.value}</h3>
                            </div>
                            <div className={`p-2 rounded-lg bg-slate-50 ${kpi.color}`}>
                                <kpi.icon size={20} />
                            </div>
                        </div>
                        <div className="mt-4 text-xs font-medium text-emerald-600 flex items-center gap-1">
                            {kpi.trend} <span className="text-slate-400 font-normal">vs mes anterior</span>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Proyectos Activos */}
                <Card className="col-span-2 p-5">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-slate-800">Proyectos Activos</h3>
                        <button onClick={() => onNavigate('proyectos')} className="text-indigo-600 text-sm font-medium hover:underline">Ver todos</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-200 text-slate-500 text-sm">
                                    <th className="pb-3 font-medium">Nombre del Proyecto</th>
                                    <th className="pb-3 font-medium">Estado</th>
                                    <th className="pb-3 font-medium">Responsable</th>
                                    <th className="pb-3 font-medium">Ticket</th>
                                </tr>
                            </thead>
                            <tbody>
                                {mockData.proyectos.filter((p: any) => p.empresaId === currentEmpresa.id).slice(0, 5).map((p: any, i: number) => (
                                    <tr key={i} className="border-b border-slate-100 last:border-0">
                                        <td className="py-3 text-sm font-medium text-slate-800">{p.nombre}</td>
                                        <td className="py-3">
                                            <Badge type={p.estado === 'En curso' ? 'info' : p.estado === 'Activo' ? 'success' : 'warning'}>
                                                {p.estado}
                                            </Badge>
                                        </td>
                                        <td className="py-3 text-sm text-slate-600">{p.responsable}</td>
                                        <td className="py-3 text-sm font-medium text-slate-800">{p.ticket}</td>
                                    </tr>
                                ))}
                                {mockData.proyectos.filter((p: any) => p.empresaId === currentEmpresa.id).length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="py-8 text-center text-sm text-slate-500">No hay proyectos activos para esta empresa.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>

                {/* Planner Semanal Mini */}
                <Card className="p-5">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-slate-800">Planner Semanal</h3>
                        <button onClick={() => onNavigate('planner')} className="text-indigo-600 text-sm font-medium hover:underline">Ir a Planner</button>
                    </div>
                    <div className="space-y-4">
                        {mockData.planner.slice(0, 5).map((tarea: any, i: number) => (
                            <div key={i} className="flex gap-3 items-start border-l-2 border-indigo-500 pl-3">
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-slate-800">{tarea.contenido}</p>
                                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                                        <span className="flex items-center gap-1"><Clock size={12} /> {tarea.publicacion}</span>
                                        <span>•</span>
                                        <span>{tarea.formato}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {mockData.planner.length === 0 && (
                            <p className="text-sm text-slate-500">No hay tareas esta semana.</p>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
}
