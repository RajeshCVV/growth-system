/**
 * COMPONENTE: EstrategiaView (Módulo de Campañas V3)
 * Define la estructura de campañas de Meta Ads (Facebook/Instagram).
 * Obliga a tener 3 conjuntos: Abierto, Advantage+, Profesiones.
 */

import React, { useState } from 'react';
import { Plus, Megaphone, Edit2, Trash2, Layout, PlayCircle, Layers, Save, X, Target, Zap, Users } from 'lucide-react';

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

    // Tipos Fijos Requeridos por el Motor IA
    const ADSET_TYPES = ['Abierto', 'Advantage+', 'Profesiones'];

    // Estado local para la campaña
    const defaultCampaign = {
        nombre: 'Campaña ' + new Date().toLocaleString('es', { month: 'long' }),
        objetivo: 'Generación de Clientes Potenciales (Leads)',
        presupuesto: 2000000,
        estado: 'Borrador',
        conjuntos: ADSET_TYPES.map(tipo => ({
            nombre: `[${tipo}] Audiencia Principal`,
            tipo_segmento: tipo,
            presupuesto: 0,
            estado: 'Borrador',
            anuncios: [
                { nombre: `Ad 1 - ${tipo}`, formato: 'Reel', objetivo: 'Gancho Visual', estado: 'Borrador', hook: '¿Cansado de pagar arriendo?' },
                { nombre: `Ad 2 - ${tipo}`, formato: 'Carrusel', objetivo: 'Educativo', estado: 'Borrador', hook: '5 Razones...' }
            ]
        }))
    };

    const campaign = mockData.estrategia?.[0] || defaultCampaign;
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

    // Forzar la creación de los 3 conjuntos obligatorios
    const generarConjuntosAuto = () => {
        setFormData({
            ...formData,
            conjuntos: ADSET_TYPES.map(tipo => ({
                nombre: `[${tipo}] Plantilla Automática IA`,
                tipo_segmento: tipo,
                presupuesto: Math.floor(Number(formData.presupuesto) / 3) || 0,
                estado: 'Borrador',
                anuncios: [
                    { nombre: `Ad 1 (Base)`, formato: 'Reel', objetivo: 'Generar Lead', estado: 'Idea', hook: '' },
                    { nombre: `Ad 2 (Social Proof)`, formato: 'Carrusel', objetivo: 'Confianza', estado: 'Idea', hook: '' },
                    { nombre: `Ad 3 (Educativo)`, formato: 'Imagen', objetivo: 'Autoridad', estado: 'Idea', hook: '' },
                    { nombre: `Ad 4 (Oferta)`, formato: 'Reel', objetivo: 'Urgencia', estado: 'Idea', hook: '' }
                ]
            }))
        });
    };

    // Agregar nuevo Anuncio a un conjunto específico (Máx 5 sugerido)
    const addAnuncio = (conjuntoIdx: number) => {
        const nextConjuntos = [...formData.conjuntos];
        if (nextConjuntos[conjuntoIdx].anuncios.length >= 5) {
            alert('El sistema sugiere un máximo de 5 anuncios por conjunto para optimizar el presupuesto en Meta Ads.');
        }
        nextConjuntos[conjuntoIdx].anuncios.push({
            nombre: 'Nuevo Anuncio',
            formato: 'Reel',
            objetivo: 'Descubrimiento',
            estado: 'Idea',
            hook: '...'
        });
        setFormData({ ...formData, conjuntos: nextConjuntos });
    };

    const getAdSetIcon = (tipo: string) => {
        if (tipo === 'Abierto') return <Target size={16} className="text-blue-500" />;
        if (tipo === 'Advantage+') return <Zap size={16} className="text-amber-500" />;
        if (tipo === 'Profesiones') return <Users size={16} className="text-violet-500" />;
        return <Layers size={16} />;
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">

            {/* CABECERA */}
            <div className="flex justify-between items-center sm:items-end">
                <div>
                    <h2 className="text-3xl font-black text-slate-800 flex items-center gap-3 tracking-tight">
                        <Megaphone className="text-blue-600" size={32} /> Central de Campañas Ads
                    </h2>
                    <p className="text-slate-500 text-sm mt-1 uppercase font-bold tracking-widest italic">{currentEmpresa.nombre} - Motor de Pauta</p>
                </div>

                {!isEditing ? (
                    <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 bg-slate-100 hover:bg-blue-50 text-blue-700 px-5 py-2.5 rounded-2xl text-[10px] font-black transition-all hover:scale-105 active:scale-95 shadow-sm uppercase tracking-widest border border-slate-200">
                        <Edit2 size={16} /> REESTRUCTURAR CAMPAÑA
                    </button>
                ) : (
                    <div className="flex gap-3">
                        <button onClick={() => setIsEditing(false)} className="px-5 py-2.5 text-xs font-black text-slate-400 hover:text-slate-600 tracking-widest">DESCARTAR</button>
                        <button onClick={handleSave} disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-2xl text-xs font-black shadow-lg shadow-blue-600/20 active:scale-95 transition-all disabled:opacity-50">
                            {loading ? 'SINCRONIZANDO ESTRUCTURA...' : <><Save size={16} className="mr-1" /> APROBAR ESTRUCTURA</>}
                        </button>
                    </div>
                )}
            </div>

            {/* ÁRBOL DE CAMPAÑA */}
            <div className="relative">
                {/* NIVEL 1: LA CAMPAÑA */}
                <Card className={`p-8 mb-8 border-l-8 border-l-blue-600 ${isEditing ? 'ring-4 ring-blue-50 border-blue-200' : ''}`}>
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-inner">
                            <Megaphone size={32} />
                        </div>
                        <div className="flex-1">
                            {isEditing ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input
                                        className="text-2xl font-black text-slate-800 bg-slate-50 border-none rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-200"
                                        value={formData.nombre}
                                        onChange={e => setFormData({ ...formData, nombre: e.target.value })}
                                        placeholder="Nombre de la Campaña"
                                    />
                                    <input
                                        className="text-sm font-bold bg-slate-50 border-none rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-200 text-blue-600"
                                        value={formData.objetivo}
                                        onChange={e => setFormData({ ...formData, objetivo: e.target.value })}
                                        placeholder="Objetivo (Ej. Leads)"
                                    />
                                </div>
                            ) : (
                                <>
                                    <Badge type="info">Objetivo Meta: {formData.objetivo}</Badge>
                                    <h3 className="text-2xl font-black text-slate-800 mt-1 uppercase tracking-tight">{formData.nombre}</h3>
                                </>
                            )}
                        </div>
                        <div className="text-right hidden sm:block">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Presupuesto Global</p>
                            <input
                                disabled={!isEditing}
                                type="number"
                                className={`text-xl font-black text-slate-800 text-right bg-transparent border-none w-48 ${isEditing ? 'focus:ring-2 focus:ring-blue-100 rounded-lg bg-slate-50 px-2' : ''}`}
                                value={formData.presupuesto}
                                onChange={e => setFormData({ ...formData, presupuesto: e.target.value })}
                            />
                        </div>
                    </div>
                </Card>

                {/* BOTÓN MÁGICO GENERADOR DE IA */}
                {isEditing && formData.conjuntos.length === 0 && (
                    <div className="flex justify-center mb-8">
                        <button
                            onClick={generarConjuntosAuto}
                            className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-8 py-4 rounded-3xl font-black text-sm shadow-xl flex items-center gap-3 hover:scale-105 active:scale-95 transition-all"
                        >
                            <Zap size={20} /> GENERAR ESTRUCTURA OPTIMIZADA POR IA
                        </button>
                    </div>
                )}

                {/* NIVEL 2: CONJUNTOS DE ANUNCIOS */}
                <div className="pl-12 space-y-12 relative">
                    {formData.conjuntos.length > 0 && (
                        <div className="absolute left-6 top-0 bottom-0 w-px bg-slate-200 -z-10"></div>
                    )}

                    {formData.conjuntos.map((conjunto: any, cIdx: number) => (
                        <div key={cIdx} className="relative">
                            {/* Conector horizontal */}
                            <div className="absolute -left-6 top-6 w-6 h-px bg-slate-200"></div>

                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-white border border-slate-200 rounded-xl flex items-center justify-center shadow-sm">
                                        {getAdSetIcon(conjunto.tipo_segmento)}
                                    </div>
                                    {isEditing ? (
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[10px] font-black text-slate-400 uppercase ml-1">CBO: ${conjunto.presupuesto} - Tipo: {conjunto.tipo_segmento}</span>
                                            <input
                                                className="font-black text-slate-800 bg-slate-50 rounded-lg px-3 py-1 outline-none text-sm uppercase tracking-tight min-w-[300px]"
                                                value={conjunto.nombre}
                                                onChange={e => {
                                                    const next = [...formData.conjuntos];
                                                    next[cIdx].nombre = e.target.value;
                                                    setFormData({ ...formData, conjuntos: next });
                                                }}
                                            />
                                        </div>
                                    ) : (
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black text-slate-400 uppercase">CBO: ${conjunto.presupuesto} - Tipo: {conjunto.tipo_segmento}</span>
                                            <h4 className="font-black text-slate-700 text-base uppercase tracking-tight">{conjunto.nombre}</h4>
                                        </div>
                                    )}
                                </div>
                                {isEditing && conjunto.tipo_segmento === 'Personalizado' && (
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
                                    <Card key={aIdx} className={`p-6 border-none ring-1 ring-slate-100 relative group overflow-hidden ${isEditing ? 'hover:ring-blue-300' : 'hover:ring-blue-100'}`}>
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                                <PlayCircle size={20} />
                                            </div>
                                            <Badge type="info">{ad.formato}</Badge>
                                        </div>

                                        {isEditing ? (
                                            <div className="space-y-3">
                                                <input className="w-full font-black text-xs text-slate-800 bg-slate-100/50 rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-blue-100" value={ad.nombre} onChange={e => {
                                                    const next = [...formData.conjuntos];
                                                    next[cIdx].anuncios[aIdx].nombre = e.target.value;
                                                    setFormData({ ...formData, conjuntos: next });
                                                }} placeholder="Nombre del Creativo" />

                                                <textarea className="w-full text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-xl p-3 min-h-[60px] outline-none focus:ring-2 focus:ring-blue-100" value={ad.hook} onChange={e => {
                                                    const next = [...formData.conjuntos];
                                                    next[cIdx].anuncios[aIdx].hook = e.target.value;
                                                    setFormData({ ...formData, conjuntos: next });
                                                }} placeholder="Hook / Concepto Inicial..." />

                                                <select className="w-full text-[10px] font-bold text-slate-500 bg-slate-50 border border-slate-200 rounded-lg p-2 outline-none" value={ad.estado} onChange={e => {
                                                    const next = [...formData.conjuntos];
                                                    next[cIdx].anuncios[aIdx].estado = e.target.value;
                                                    setFormData({ ...formData, conjuntos: next });
                                                }}>
                                                    <option value="Idea">Idea</option>
                                                    <option value="Guion">Guion</option>
                                                    <option value="Edición">Edición</option>
                                                    <option value="Aprobado">Aprobado</option>
                                                    <option value="Activo">Activo MetaAds</option>
                                                </select>
                                            </div>
                                        ) : (
                                            <>
                                                <h5 className="font-black text-slate-800 text-sm mb-3 uppercase tracking-tighter">{ad.nombre}</h5>
                                                <div className="bg-slate-50/50 rounded-2xl p-4 space-y-3">
                                                    <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-slate-400">
                                                        <span>Hook / Concepto</span>
                                                    </div>
                                                    <p className="text-[11px] text-slate-700 leading-relaxed italic line-clamp-3 font-medium">"{ad.hook || 'Sin concepto definido'}"</p>
                                                </div>
                                                <div className="mt-4 pt-4 border-t border-slate-50 flex justify-between items-center px-1">
                                                    <span className="text-[10px] font-black text-slate-400 uppercase">Estado</span>
                                                    <Badge type={ad.estado === 'Activo' ? 'success' : 'warning'}>{ad.estado}</Badge>
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
                                                className="absolute bottom-2 right-2 p-1.5 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                    </Card>
                                ))}

                                {/* Botón Agregar Anuncio */}
                                {isEditing && (
                                    <button
                                        onClick={() => addAnuncio(cIdx)}
                                        className="border-2 border-dashed border-slate-200 rounded-3xl p-8 flex flex-col items-center justify-center text-slate-400 hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50/30 transition-all group"
                                    >
                                        <Plus size={32} className="mb-2 transition-transform group-hover:rotate-90" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-center mt-2">Agregar<br />Creativo Base</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}

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
