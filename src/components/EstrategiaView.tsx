import React, { useState } from 'react';
import { Megaphone, Plus, Trash2, Edit2, Save, ChevronRight, LayoutGrid } from 'lucide-react';

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

export default function EstrategiaView({ currentEmpresa, mockData, refreshData }: any) {
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentCampaign, setCurrentCampaign] = useState<any>(null);

    const defaultCampaign = {
        empresaId: currentEmpresa.id,
        nombre: '',
        objetivo: 'Conversiones',
        conjuntos: [{
            nombre: 'Conjunto 1',
            anuncios: [{ nombre: 'Anuncio 1', formato: 'Reel', metodologia: 'AIDA', contenido: 'Hook + Problema', cpl: '$0' }]
        }]
    };

    const [formData, setFormData] = useState<any>(defaultCampaign);

    const strategies = mockData.estrategia.filter((s: any) => s.empresaId === currentEmpresa.id);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const url = '/api/estrategia';
            const method = isEditing ? 'PUT' : 'POST';
            const body = isEditing ? { ...formData, id: currentCampaign.id } : formData;

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            if (res.ok) {
                setShowModal(false);
                await refreshData();
            } else {
                alert('Error al guardar la estrategia');
            }
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('¿Eliminar esta campaña completa?')) return;
        setLoading(true);
        try {
            await fetch(`/api/estrategia?id=${id}`, { method: 'DELETE' });
            await refreshData();
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    const openEdit = (strat: any) => {
        setIsEditing(true);
        setCurrentCampaign(strat);
        setFormData(strat);
        setShowModal(true);
    };

    const resetForm = () => {
        setIsEditing(false);
        setCurrentCampaign(null);
        setFormData(defaultCampaign);
    };

    // Helpers para manejo de arrays anidados
    const addConjunto = () => {
        setFormData({
            ...formData,
            conjuntos: [...formData.conjuntos, { nombre: 'Nuevo Conjunto', anuncios: [] }]
        });
    };

    const addAnuncio = (cIndex: number) => {
        const nextConjuntos = [...formData.conjuntos];
        nextConjuntos[cIndex].anuncios.push({ nombre: 'Nuevo Anuncio', formato: 'Reel', metodologia: '', contenido: '', cpl: '$0' });
        setFormData({ ...formData, conjuntos: nextConjuntos });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Estrategia Meta Ads</h2>
                    <p className="text-slate-500 text-sm mt-1">Estructura publicitaria jerárquica para {currentEmpresa.nombre}</p>
                </div>
                <button
                    onClick={() => { resetForm(); setShowModal(true); }}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all shadow-sm"
                >
                    <Plus size={16} /> Nueva Campaña
                </button>
            </div>

            {strategies.length === 0 && (
                <div className="p-12 text-center border-2 border-dashed border-slate-200 rounded-xl bg-white">
                    <Megaphone size={48} className="mx-auto text-slate-300 mb-4" />
                    <h3 className="text-lg font-bold text-slate-700">Sin campañas activas</h3>
                    <p className="text-slate-500">Comienza estructurando tu primera campaña de Meta Ads.</p>
                </div>
            )}

            {strategies.map((strat: any) => (
                <Card key={strat.id} className="overflow-hidden mb-6 border-slate-200">
                    <div className="bg-slate-50 p-5 border-b border-slate-200 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                                <Megaphone size={20} />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Campaña</span>
                                    <Badge type="success">{strat.objetivo}</Badge>
                                </div>
                                <h3 className="text-lg font-bold text-slate-800">{strat.nombre}</h3>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => openEdit(strat)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-slate-100">
                                <Edit2 size={16} />
                            </button>
                            <button onClick={() => handleDelete(strat.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-slate-100">
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>

                    <div className="p-6 space-y-8">
                        {strat.conjuntos.map((conjunto: any, cIdx: number) => (
                            <div key={cIdx} className="relative pl-8">
                                {/* Línea conectora visual */}
                                <div className="absolute left-0 top-0 bottom-0 w-px bg-slate-200"></div>
                                <div className="absolute left-0 top-4 w-6 h-px bg-slate-200"></div>

                                <div className="flex items-center gap-2 mb-4">
                                    <LayoutGrid size={16} className="text-slate-400" />
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Conjunto</span>
                                    <h4 className="font-bold text-slate-700">{conjunto.nombre}</h4>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {conjunto.anuncios.map((ad: any, aIdx: number) => (
                                        <div key={aIdx} className="bg-slate-50 border border-slate-100 rounded-xl p-4 hover:border-indigo-200 transition-all hover:shadow-sm">
                                            <div className="flex justify-between items-start mb-3">
                                                <h5 className="font-bold text-sm text-slate-800">{ad.nombre}</h5>
                                                <Badge type="default">{ad.formato}</Badge>
                                            </div>
                                            <div className="space-y-2 mb-4">
                                                <div className="flex justify-between text-[11px]">
                                                    <span className="text-slate-400">Metodología:</span>
                                                    <span className="font-medium text-slate-700 font-mono">{ad.metodologia}</span>
                                                </div>
                                                <div className="text-[11px] bg-white p-2 rounded border border-slate-100 text-slate-600 italic">
                                                    "{ad.contenido}"
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between border-t border-slate-200 pt-3">
                                                <span className="text-[11px] text-slate-400">CPL Actual: <strong className="text-slate-900">{ad.cpl}</strong></span>
                                                <button className="text-indigo-600 text-xs font-semibold hover:underline">Ver Guion</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            ))}

            {/* MODAL ESTRATEGIA */}
            {showModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
                    <div className="bg-white rounded-2xl p-8 w-full max-w-4xl shadow-2xl my-8">
                        <h3 className="text-2xl font-bold text-slate-800 mb-6">{isEditing ? 'Editar Estrategia' : 'Nueva Estructura Meta Ads'}</h3>

                        <form onSubmit={handleSave} className="space-y-8">
                            {/* Nivel 1: General */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Nombre de Campaña</label>
                                    <input
                                        required
                                        className="w-full border border-slate-200 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500"
                                        value={formData.nombre}
                                        onChange={e => setFormData({ ...formData, nombre: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Objetivo</label>
                                    <select
                                        className="w-full border border-slate-200 rounded-lg px-4 py-2.5 outline-none"
                                        value={formData.objetivo}
                                        onChange={e => setFormData({ ...formData, objetivo: e.target.value })}
                                    >
                                        <option value="Conversiones">Conversiones / Leads</option>
                                        <option value="Tráfico">Tráfico</option>
                                        <option value="Interacción">Interacción</option>
                                        <option value="Ventas">Ventas Directas</option>
                                    </select>
                                </div>
                            </div>

                            {/* Nivel 2: Conjuntos y Anuncios */}
                            <div className="space-y-6">
                                <div className="flex justify-between items-center">
                                    <h4 className="text-sm font-bold text-slate-500 uppercase flex items-center gap-2">
                                        <LayoutGrid size={16} /> Estructura Interna
                                    </h4>
                                    <button type="button" onClick={addConjunto} className="text-indigo-600 text-xs font-bold hover:underline flex items-center gap-1">
                                        <Plus size={14} /> Nuevo Conjunto de Anuncios
                                    </button>
                                </div>

                                {formData.conjuntos.map((conj: any, cIdx: number) => (
                                    <div key={cIdx} className="border border-slate-100 rounded-xl p-6 bg-white shadow-sm relative">
                                        <div className="flex justify-between items-center mb-4">
                                            <input
                                                className="font-bold text-slate-800 border-b-2 border-transparent focus:border-indigo-500 outline-none px-1"
                                                value={conj.nombre}
                                                placeholder="Nombre del conjunto..."
                                                onChange={e => {
                                                    const next = [...formData.conjuntos];
                                                    next[cIdx].nombre = e.target.value;
                                                    setFormData({ ...formData, conjuntos: next });
                                                }}
                                            />
                                            <button type="button" onClick={() => addAnuncio(cIdx)} className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded text-[10px] font-bold uppercase hover:bg-emerald-100 transition-colors">
                                                + Agregar Anuncio
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {conj.anuncios.map((ad: any, aIdx: number) => (
                                                <div key={aIdx} className="border border-slate-50 rounded-lg p-4 bg-slate-50/50 space-y-3">
                                                    <input
                                                        placeholder="Nombre anuncio"
                                                        className="w-full font-bold text-xs bg-transparent border-b border-slate-200 outline-none p-1"
                                                        value={ad.nombre}
                                                        onChange={e => {
                                                            const next = [...formData.conjuntos];
                                                            next[cIdx].anuncios[aIdx].nombre = e.target.value;
                                                            setFormData({ ...formData, conjuntos: next });
                                                        }}
                                                    />
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <select
                                                            className="text-[10px] border border-slate-100 rounded px-1"
                                                            value={ad.formato}
                                                            onChange={e => {
                                                                const next = [...formData.conjuntos];
                                                                next[cIdx].anuncios[aIdx].formato = e.target.value;
                                                                setFormData({ ...formData, conjuntos: next });
                                                            }}
                                                        >
                                                            <option value="Reel">Reel</option>
                                                            <option value="Imagen">Imagen</option>
                                                            <option value="Carrusel">Carrusel</option>
                                                        </select>
                                                        <input
                                                            placeholder="AIDA / PAS..."
                                                            className="text-[10px] border border-slate-100 rounded px-1"
                                                            value={ad.metodologia}
                                                            onChange={e => {
                                                                const next = [...formData.conjuntos];
                                                                next[cIdx].anuncios[aIdx].metodologia = e.target.value;
                                                                setFormData({ ...formData, conjuntos: next });
                                                            }}
                                                        />
                                                    </div>
                                                    <textarea
                                                        className="w-full text-[10px] border border-slate-100 rounded p-1"
                                                        value={ad.contenido}
                                                        rows={2}
                                                        placeholder="Escribe el hook o idea..."
                                                        onChange={e => {
                                                            const next = [...formData.conjuntos];
                                                            next[cIdx].anuncios[aIdx].contenido = e.target.value;
                                                            setFormData({ ...formData, conjuntos: next });
                                                        }}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-end gap-3 mt-12 pt-6 border-t border-slate-100">
                                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-2.5 text-sm font-medium text-slate-500 hover:bg-slate-50 rounded-xl transition-colors">
                                    Cerrar
                                </button>
                                <button type="submit" disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-indigo-100 transition-all disabled:opacity-50">
                                    {loading ? 'Sincronizando...' : isEditing ? 'Actualizar Campaña' : 'Publicar Estrategia'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
