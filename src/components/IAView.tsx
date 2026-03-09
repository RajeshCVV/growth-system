/**
 * COMPONENTE: IAView (Motor IA V3)
 * Centro de control para automatizaciones y generación con Inteligencia Artificial.
 */

import React, { useState } from 'react';
import { BrainCircuit, Sparkles, Wand2, RefreshCw, Zap, Video, Type, Image as ImageIcon } from 'lucide-react';

const Card = ({ children, className = '' }: any) => (
    <div className={`bg-white rounded-3xl border border-slate-100 shadow-sm transition-all hover:shadow-xl ${className}`}>
        {children}
    </div>
);

const Badge = ({ children, type = 'default' }: any) => {
    const colors: Record<string, string> = {
        success: 'bg-emerald-100 text-emerald-800',
        warning: 'bg-amber-100 text-amber-800',
        info: 'bg-blue-100 text-blue-800',
        violet: 'bg-violet-100 text-violet-800',
        default: 'bg-slate-100 text-slate-800'
    };
    return (
        <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${colors[type] || colors.default}`}>
            {children}
        </span>
    );
};

export default function IAView({ currentEmpresa }: any) {
    const [isGenerating, setIsGenerating] = useState(false);
    const [selectedAction, setSelectedAction] = useState<string | null>(null);

    const ACTIONS = [
        {
            id: 'campaign',
            title: 'Auto-Estructurar Campaña',
            desc: 'Analiza el histórico y crea los 3 conjuntos de anuncios optimizados.',
            icon: Zap,
            color: 'text-amber-500',
            bg: 'bg-amber-50'
        },
        {
            id: 'hooks',
            title: 'Generador de Hooks (Ads)',
            desc: 'Crea 10 ángulos visuales disruptivos para los creativos Base.',
            icon: Sparkles,
            color: 'text-violet-500',
            bg: 'bg-violet-50'
        },
        {
            id: 'content',
            title: 'Planificador de Contenido 30D',
            desc: 'Genera todo el calendario editorial orgánico del mes en base a los pilares.',
            icon: Wand2,
            color: 'text-emerald-500',
            bg: 'bg-emerald-50'
        },
        {
            id: 'scripts',
            title: 'Guiones de Reels',
            desc: 'Estructura gancho, cuerpo y llamado a la acción para formato corto.',
            icon: Video,
            color: 'text-blue-500',
            bg: 'bg-blue-50'
        }
    ];

    const handleGenerate = (id: string) => {
        setIsGenerating(true);
        setSelectedAction(id);
        // Simulamos la generación por unos segundos
        setTimeout(() => {
            setIsGenerating(false);
            alert('¡Generación completada para el módulo seleccionado! (Funcionalidad Simulada V1)');
        }, 3500);
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">

            {/* CABECERA */}
            <div className="flex justify-between items-center sm:items-end">
                <div>
                    <h2 className="text-3xl font-black text-slate-800 flex items-center gap-3 tracking-tight">
                        <BrainCircuit className="text-violet-600" size={32} /> Cónsola Motor IA
                    </h2>
                    <p className="text-slate-500 text-sm mt-1 uppercase font-bold tracking-widest italic">{currentEmpresa.nombre} - Inteligencia Artificial</p>
                </div>
            </div>

            {/* GRID DE ACCIONES IA */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {ACTIONS.map((action) => {
                    const Icon = action.icon;
                    return (
                        <Card key={action.id} className="p-8 group cursor-pointer hover:border-violet-200" onClick={() => handleGenerate(action.id)}>
                            <div className="flex gap-6 items-start">
                                <div className={`w-16 h-16 rounded-3xl ${action.bg} ${action.color} flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform`}>
                                    <Icon size={32} />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-black text-slate-800 mb-2">{action.title}</h3>
                                    <p className="text-sm text-slate-500 font-medium leading-relaxed">{action.desc}</p>

                                    <div className="mt-6 flex items-center gap-3">
                                        <button className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${isGenerating && selectedAction === action.id
                                                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                                : `bg-slate-50 ${action.color} hover:bg-slate-100 shadow-sm`
                                            }`}>
                                            {isGenerating && selectedAction === action.id ? (
                                                <><RefreshCw size={14} className="animate-spin" /> PROCESANDO...</>
                                            ) : (
                                                <>EJECUTAR MODELO <Zap size={14} /></>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    );
                })}
            </div>

            {/* ESTADO DEL SISTEMA */}
            <Card className="p-8 bg-gradient-to-br from-slate-900 to-slate-800 text-white mt-8 overflow-hidden relative">
                <div className="absolute top-0 right-0 p-12 opacity-10">
                    <BrainCircuit size={200} />
                </div>
                <div className="relative z-10 flex flex-col md:flex-row gap-8 justify-between items-center">
                    <div>
                        <Badge type="violet">ESTADO DEL MOTOR</Badge>
                        <h3 className="text-2xl font-black mt-3 mb-1">Modelos GPT-4o / Claude 3 Opus</h3>
                        <p className="text-slate-400 text-sm font-medium">El ecosistema de IA está conectado y listo para procesar Prompts del sistema corporativo.</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700 backdrop-blur-sm text-center min-w-[120px]">
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Tokens Hoy</p>
                            <p className="text-2xl font-black text-violet-400">12.5K</p>
                        </div>
                        <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700 backdrop-blur-sm text-center min-w-[120px]">
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Generaciones</p>
                            <p className="text-2xl font-black text-emerald-400">42</p>
                        </div>
                    </div>
                </div>
            </Card>

        </div>
    );
}
