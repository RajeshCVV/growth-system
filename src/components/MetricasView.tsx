import React from 'react';
import { BarChart3, TrendingUp, Users, DollarSign, Target, MousePointerClick } from 'lucide-react';

const Card = ({ children, className = '' }: any) => (
    <div className={`bg-white rounded-xl border border-slate-200 shadow-sm ${className}`}>
        {children}
    </div>
);

export default function MetricasView({ mockData }: any) {
    const metricas = mockData.metricasGenerales || { leads: 0, cplPromedio: '$0', roi: '0%', inversion: '$0' };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <BarChart3 className="text-indigo-600" /> Métricas y Resultados
                    </h2>
                    <p className="text-slate-500 text-sm mt-1">Análisis detallado de rendimiento global</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {/* KPI: Leads Totales */}
                <Card className="p-6 relative overflow-hidden">
                    <div className="absolute -right-4 -top-4 text-blue-50 opacity-50">
                        <Users size={120} />
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><Users size={20} /></div>
                            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Leads Totales</p>
                        </div>
                        <h3 className="text-4xl font-extrabold text-slate-800">{metricas.leads}</h3>
                        <p className="text-sm font-medium text-emerald-600 mt-2 flex items-center gap-1">
                            <TrendingUp size={16} /> +12% respecto al mes anterior
                        </p>
                    </div>
                </Card>

                {/* KPI: CPL Promedio */}
                <Card className="p-6 relative overflow-hidden">
                    <div className="absolute -right-4 -top-4 text-emerald-50 opacity-50">
                        <Target size={120} />
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg"><Target size={20} /></div>
                            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Costo Por Lead</p>
                        </div>
                        <h3 className="text-4xl font-extrabold text-slate-800">{metricas.cplPromedio}</h3>
                        <p className="text-sm font-medium text-emerald-600 mt-2 flex items-center gap-1">
                            <TrendingUp size={16} className="rotate-180" /> -5% más económico este mes
                        </p>
                    </div>
                </Card>

                {/* KPI: ROI */}
                <Card className="p-6 relative overflow-hidden">
                    <div className="absolute -right-4 -top-4 text-indigo-50 opacity-50">
                        <DollarSign size={120} />
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg"><TrendingUp size={20} /></div>
                            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Retorno (ROI)</p>
                        </div>
                        <h3 className="text-4xl font-extrabold text-slate-800">{metricas.roi}</h3>
                        <p className="text-sm font-medium text-emerald-600 mt-2 flex items-center gap-1">
                            <TrendingUp size={16} /> +24% eficiencia publicitaria
                        </p>
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                {/* Placeholder para un gráfico */}
                <Card className="p-6 h-[300px] flex flex-col justify-center items-center bg-slate-50 border-dashed border-2">
                    <BarChart3 size={48} className="text-slate-300 mb-4" />
                    <h4 className="text-lg font-bold text-slate-700">Gráfico de Conversiones</h4>
                    <p className="text-sm text-slate-500 text-center max-w-sm mt-2">
                        (Espacio reservado para integrar Recharts o Chart.js con la evolución histórica del ROI).
                    </p>
                </Card>

                <Card className="p-6">
                    <h4 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <MousePointerClick className="text-amber-600" size={20} />
                        Desglose de Inversión
                    </h4>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                            <span className="font-medium text-slate-700">Inversión Activa Total</span>
                            <span className="font-bold text-slate-900">{metricas.inversion}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-white border border-slate-100 rounded-lg">
                            <span className="text-sm text-slate-600">Presupuesto Ejecutado</span>
                            <span className="text-sm font-bold text-slate-800">85%</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2.5">
                            <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: '85%' }}></div>
                        </div>
                        <p className="text-xs text-slate-500 mt-4">
                            Estos datos provienen de la agregación de las campañas estructuradas en el módulo de Estrategia.
                        </p>
                    </div>
                </Card>
            </div>
        </div>
    );
}
