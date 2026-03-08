/**
 * COMPONENTE: MetricasView
 * Visualización de resultados de campañas y rendimiento.
 * Muestra gráficos y KPIs de conversión.
 */

import React from 'react';
import { BarChart3, TrendingUp, Users, Target, Zap, ArrowUpRight, ArrowDownRight } from 'lucide-react';

// Tarjetas de métricas con borde de color
const MetricCard = ({ title, value, sub, trend, isPositive, color }: any) => (
    <div className={`bg-white p-6 rounded-3xl border-b-4 ${color} shadow-sm transition-all hover:shadow-xl hover:-translate-y-1`}>
        <div className="flex justify-between items-start mb-4">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{title}</p>
            {isPositive ? <ArrowUpRight className="text-emerald-500" size={18} /> : <ArrowDownRight className="text-red-500" size={18} />}
        </div>
        <h3 className="text-3xl font-black text-slate-800 tracking-tighter">{value}</h3>
        <div className="flex items-center gap-2 mt-4">
            <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg ${isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                {trend}
            </span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{sub}</span>
        </div>
    </div>
);

export default function MetricasView({ mockData }: any) {
    // Lógica de simulación para gráficos (barras de altura variable)
    const chartData = [40, 70, 55, 90, 65, 80, 50, 85, 95, 60, 75, 100];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">

            {/* CABECERA */}
            <div className="flex justify-between items-center sm:items-end">
                <div>
                    <h2 className="text-3xl font-black text-slate-800 flex items-center gap-3 tracking-tight">
                        <BarChart3 className="text-indigo-600" size={32} /> Rendimiento de Campaña
                    </h2>
                    <p className="text-slate-500 text-sm mt-1 uppercase font-bold tracking-widest italic">Análisis de ROI y Optimización</p>
                </div>
            </div>

            {/* KPIs DE RENDIMIENTO */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                    title="Leads Registrados"
                    value="1.240"
                    sub="últimos 30 días"
                    trend="+18.4%"
                    isPositive={true}
                    color="border-indigo-500"
                />
                <MetricCard
                    title="CTR (Interés)"
                    value="4.82%"
                    sub="Promedio Global"
                    trend="+0.5%"
                    isPositive={true}
                    color="border-emerald-500"
                />
                <MetricCard
                    title="Costo por Lead"
                    value="$2.4"
                    sub="Mejor optimización"
                    trend="-12.1%"
                    isPositive={true}
                    color="border-amber-500"
                />
                <MetricCard
                    title="Inversión"
                    value="$3.000"
                    sub="Ejecutado"
                    trend="+5.0%"
                    isPositive={false}
                    color="border-slate-800"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* GRÁFICO DE BARRAS SIMULADO */}
                <div className="lg:col-span-2 bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-20 text-white">
                        <BarChart3 size={120} />
                    </div>
                    <div className="relative z-10">
                        <h4 className="text-white font-black uppercase text-[10px] tracking-[0.3em] mb-8 text-indigo-400">Fluctuación de Conversión (Leads/Día)</h4>
                        <div className="flex items-end justify-between h-48 gap-3 sm:gap-6 px-2">
                            {chartData.map((h, i) => (
                                <div key={i} className="flex-1 group relative">
                                    <div
                                        className="w-full bg-gradient-to-t from-indigo-600 to-indigo-100 rounded-lg transition-all duration-500 hover:from-emerald-400 hover:to-emerald-100 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(79,70,229,0.3)]"
                                        style={{ height: `${h}%` }}
                                    ></div>
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white text-slate-900 text-[10px] font-black px-2 py-1 rounded shadow-lg pointer-events-none">
                                        {Math.floor(h * 1.5)} L
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between mt-6 px-1">
                            {['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'].map(m => (
                                <span key={m} className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{m}</span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* TOP FUENTES DE TRÁFICO */}
                <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
                    <h4 className="text-slate-800 font-bold mb-8 flex items-center gap-2">
                        <Zap size={18} className="text-amber-500" /> Fuentes de Escala
                    </h4>
                    <div className="space-y-6">
                        {[
                            { name: 'Instagram Reels', color: 'bg-pink-500', val: '45%' },
                            { name: 'Facebook Feed', color: 'bg-blue-600', val: '30%' },
                            { name: 'WhatsApp Direct', color: 'bg-emerald-500', val: '15%' },
                            { name: 'Referidos / Otros', color: 'bg-slate-400', val: '10%' },
                        ].map(f => (
                            <div key={f.name}>
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2">
                                    <span className="text-slate-500">{f.name}</span>
                                    <span className="text-slate-800">{f.val}</span>
                                </div>
                                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <div className={`h-full ${f.color} rounded-full`} style={{ width: f.val }}></div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 p-6 bg-indigo-50 rounded-2xl border border-indigo-100">
                        <p className="text-[10px] font-black text-indigo-800 uppercase tracking-widest mb-2 italic">Insight de Multivela:</p>
                        <p className="text-xs text-indigo-600 font-medium leading-relaxed">
                            "El tráfico proveniente de Reels tiene un 40% más de retención. Recomendamos escalar presupuesto en el Conjunto A."
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}
