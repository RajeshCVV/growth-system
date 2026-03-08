/**
 * COMPONENTE: EstrategiaView
 * Define la estructura de campañas de Meta Ads (Facebook/Instagram).
 * Permite crear una jerarquía: Campaña > Conjunto de Anuncios > Anuncios.
 */

import React, { useState } from 'react';
import { Plus, Megaphone, Edit2, Trash2, Layout, PlayCircle, Layers, Save, X } from 'lucide-react';

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
        default: 'bg-slate-100 text-slate-800'
    };
    return (
        <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${colors[type] || colors.default}`}>
            {children}
        </span>
    );
};

export default function EstrategiaView({ currentEmpresa, mockData, refreshData }: any) {
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);

    // Estado local para la estrategia
    const campaign = mockData.estrategia[0] || {
        nombre: 'Nueva Campaña de Growth',
        objetivo: 'Generación de Leads',
        presupuesto: '$0',
        conjuntos: []
    };

    const [formData, setFormData] = useState(campaign);

    // GUARDAR: Sincroniza la estrategia con MongoDB
    const handleSave = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/estrategia', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ empresaId: currentEmpresa.id, ...formData })
            });
            if (res.ok) {
                setIsEditing(false);
                await refreshData();
            }
        } catch (e) { console.error("Error guardando estrategia:", e); }
        setLoading(false);
    };

    // Agregar nuevo Conjunto de Anuncios
    const addConjunto = () => {
        setFormData({
            ...formData,
            conjuntos: [...formData.conjuntos, { nombre: 'Nuevo Conjunto', anuncios: [] }]
        });
    };

    // Agregar nuevo Anuncio a un conjunto específico
    const addAnuncio = (conjuntoIdx: number) => {
        const nextConjuntos = [...formData.conjuntos];
        nextConjuntos[conjuntoIdx].anuncios.push({
            nombre: 'Anuncio Nuevo',
            formato: 'Reel',
            metodologia: 'AIDA',
            contenido: 'Gancho disruptivo...',
            cpl: '$0'
        });
        setFormData({ ...formData, conjuntos: nextConjuntos });
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">

            {/* CABECERA */}
            <div className="flex justify-between items-center sm:items-end">
                <div>
                    <h2 className="text-3xl font-black text-slate-800 flex items-center gap-3 tracking-tight">
                        <Megaphone className="text-indigo-600" size={32} /> Estrategia Meta Ads
                    </h2>
                    <p className="text-slate-500 text-sm mt-1 uppercase font-bold tracking-widest italic">{currentEmpresa.nombre} - Embudo de Ventas</p>
                </div>

                {!isEditing ? (
                    <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 bg-slate-100 hover:bg-indigo-50 text-indigo-700 px-5 py-2.5 rounded-2xl text-[10px] font-black transition-all hover:scale-105 active:scale-95 shadow-sm uppercase tracking-widest border border-slate-200">
                        <Edit2 size={16} /> REDISEÑAR EMBUDO
                    </button>
                ) : (
                    <div className="flex gap-3">
                        <button onClick={() => setIsEditing(false)} className="px-5 py-2.5 text-xs font-black text-slate-400 hover:text-slate-600 tracking-widest">DESCARTAR</button>
                        <button onClick={handleSave} disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-2xl text-xs font-black shadow-lg shadow-indigo-600/20 active:scale-95 transition-all disabled:opacity-50">
                            {loading ? 'CONFIRMANDO ESTRATEGIA...' : <><Save size={16} className="mr-1" /> PUBLICAR ESTRATEGIA</>}
                        </button>
                    </div>
                )}
            </div>

            {/* ÁRBOL DE CAMPAÑA */}
            <div className="relative">
                {/* NIVEL 1: LA CAMPAÑA */}
                <Card className={`p-8 mb-8 border-l-8 border-l-indigo-600 ${isEditing ? 'ring-4 ring-indigo-50 border-indigo-200' : ''}`}>
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-inner">
                            <Megaphone size={32} />
                        </div>
                        <div className="flex-1">
                            {isEditing ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input
                                        className="text-2xl font-black bg-slate-50 border-none rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-200"
                                        value={formData.nombre}
                                        onChange={e => setFormData({ ...formData, nombre: e.target.value })}
                                    />
                                    <input
                                        className="text-sm font-bold bg-slate-50 border-none rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-200 text-indigo-600"
                                        value={formData.objetivo}
                                        onChange={e => setFormData({ ...formData, objetivo: e.target.value })}
                                    />
                                </div>
                            ) : (
                                <>
                                    <Badge type="info">Objetivo: {formData.objetivo}</Badge>
                                    <h3 className="text-2xl font-black text-slate-800 mt-1 uppercase tracking-tight">{formData.nombre}</h3>
                                </>
                            )}
                        </div>
                        <div className="text-right hidden sm:block">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Inversión Sugerida</p>
                            <input
                                disabled={!isEditing}
                                className={`text-xl font-black text-slate-800 text-right bg-transparent border-none w-32 ${isEditing ? 'focus:ring-2 focus:ring-indigo-100 rounded-lg' : ''}`}
                                value={formData.presupuesto}
                                onChange={e => setFormData({ ...formData, presupuesto: e.target.value })}
                            />
                        </div>
                    </div>
                </Card>

                {/* NIVEL 2: CONJUNTOS DE ANUNCIOS */}
                <div className="pl-12 space-y-12 relative">
                    <div className="absolute left-6 top-0 bottom-0 w-px bg-slate-200 -z-10"></div>

                    {formData.conjuntos.map((conjunto: any, cIdx: number) => (
                        <div key={cIdx} className="relative">
                            {/* Conector horizontal */}
                            <div className="absolute -left-6 top-6 w-6 h-px bg-slate-200"></div>

                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-600 shadow-sm">
                                        <Layers size={16} />
                                    </div>
                                    {isEditing ? (
                                        <input
                                            className="font-black text-slate-700 bg-slate-50 rounded-lg px-3 py-1 outline-none text-sm uppercase tracking-tight"
                                            value={conjunto.nombre}
                                            onChange={e => {
                                                const next = [...formData.conjuntos];
                                                next[cIdx].nombre = e.target.value;
                                                setFormData({ ...formData, conjuntos: next });
                                            }}
                                        />
                                    ) : (
                                        <h4 className="font-black text-slate-700 text-sm uppercase tracking-tight">{conjunto.nombre}</h4>
                                    )}
                                </div>
                                {isEditing && (
                                    <button
                                        onClick={() => {
                                            const next = formData.conjuntos.filter((_: any, i: number) => i !== cIdx);
                                            setFormData({ ...formData, conjuntos: next });
                                        }}
                                        className="text-red-400 hover:text-red-600 transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                )}
                            </div>

                            {/* NIVEL 3: ANUNCIOS (ADS) */}
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {conjunto.anuncios.map((ad: any, aIdx: number) => (
                                    <Card key={aIdx} className={`p-6 border-none ring-1 ring-slate-100 relative group overflow-hidden ${isEditing ? 'hover:ring-indigo-300' : 'hover:ring-indigo-100'}`}>
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-indigo-500 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                                <PlayCircle size={20} />
                                            </div>
                                            <Badge type="default">{ad.formato}</Badge>
                                        </div>

                                        {isEditing ? (
                                            <div className="space-y-3">
                                                <input className="w-full font-black text-xs text-slate-800 bg-slate-100/50 rounded-lg px-2 py-1" value={ad.nombre} onChange={e => {
                                                    const next = [...formData.conjuntos];
                                                    next[cIdx].anuncios[aIdx].nombre = e.target.value;
                                                    setFormData({ ...formData, conjuntos: next });
                                                }} />
                                                <textarea className="w-full text-[10px] text-slate-600 bg-slate-50 border-none rounded-lg p-2 min-h-[60px]" value={ad.contenido} onChange={e => {
                                                    const next = [...formData.conjuntos];
                                                    next[cIdx].anuncios[aIdx].contenido = e.target.value;
                                                    setFormData({ ...formData, conjuntos: next });
                                                }} />
                                            </div>
                                        ) : (
                                            <>
                                                <h5 className="font-black text-slate-800 text-sm mb-4 uppercase tracking-tighter">{ad.nombre}</h5>
                                                <div className="bg-slate-50/50 rounded-2xl p-4 space-y-3">
                                                    <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-slate-400">
                                                        <span>Metodología</span>
                                                        <span className="text-indigo-600">{ad.metodologia}</span>
                                                    </div>
                                                    <p className="text-[11px] text-slate-600 leading-relaxed italic line-clamp-3">"{ad.contenido}"</p>
                                                </div>
                                                <div className="mt-4 pt-4 border-t border-slate-50 flex justify-between items-center px-1">
                                                    <span className="text-[10px] font-black text-slate-400 uppercase">CPL Actual</span>
                                                    <span className="text-sm font-black text-emerald-600 tracking-tight">{ad.cpl}</span>
                                                </div>
                                            </>
                                        )}

                                        {isEditing && (
                                            <button
                                                onClick={() => {
                                                    const next = [...formData.conjuntos];
                                                    next[cIdx].anuncios = next[cIdx].anuncios.filter((_: any, i: number) => i !== aIdx);
                                                    setFormData({ ...formData, conjuntos: next });
                                                }}
                                                className="absolute bottom-2 right-2 text-red-300 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        )}
                                    </Card>
                                ))}

                                {/* Botón Agregar Anuncio */}
                                {isEditing && (
                                    <button
                                        onClick={() => addAnuncio(cIdx)}
                                        className="border-2 border-dashed border-slate-200 rounded-3xl p-8 flex flex-col items-center justify-center text-slate-400 hover:border-indigo-400 hover:text-indigo-500 hover:bg-indigo-50/30 transition-all group"
                                    >
                                        <Plus size={32} className="mb-2 transition-transform group-hover:rotate-90" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Inyectar Anuncio</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}

                    {/* Botón Agregar Conjunto */}
                    {isEditing && (
                        <button
                            onClick={addConjunto}
                            className="w-full py-4 border-2 border-dashed border-indigo-200 rounded-2xl text-indigo-400 font-black text-xs uppercase tracking-[0.2em] hover:bg-white hover:shadow-lg hover:border-indigo-500 hover:text-indigo-600 transition-all"
                        >
                            + Expandir Conjuntos de Públicos
                        </button>
                    )}

                    {formData.conjuntos.length === 0 && !isEditing && (
                        <div className="py-20 text-center bg-white rounded-3xl border border-slate-100 shadow-sm">
                            <Megaphone size={40} className="mx-auto text-slate-200 mb-4" />
                            <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Aún no hay conjuntos definidos</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
