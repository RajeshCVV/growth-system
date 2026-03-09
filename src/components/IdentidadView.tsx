/**
 * COMPONENTE: IdentidadView
 * Gestiona el Core de Marca y los Buyer Personas.
 * Permite editar la estrategia de comunicación de cada empresa.
 */

import React, { useState } from 'react';
import { Fingerprint, UserCircle, Plus, Edit2, Save, Trash2 } from 'lucide-react';

// Etiqueta pequeña para categorías
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

export default function IdentidadView({ currentEmpresa, mockData, refreshData }: any) {
    const rawId = mockData?.identidad?.[currentEmpresa?.id] || null;
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);

    // Estado local para el formulario
    const [formData, setFormData] = useState(rawId || {
        base: { queEs: '', nicho: '', propuesta: '', tono: '' },
        personas: []
    });

    // Vista de "Estado Vacío" si no hay datos y no se está editando
    if (!rawId && !isEditing) {
        return (
            <div className="p-12 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-white/50 animate-in fade-in zoom-in duration-500">
                <Fingerprint size={48} className="mx-auto text-slate-300 mb-4" />
                <h3 className="text-xl font-black text-slate-700">Identidad No Configurada</h3>
                <p className="text-slate-500 mb-8 max-w-xs mx-auto text-sm">Esta empresa aún no tiene definida su base estratégica de marca.</p>
                <button onClick={() => setIsEditing(true)} className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-600/20 active:scale-95">
                    Configurar Identidad
                </button>
            </div>
        );
    }

    // FUNCIÓN PARA GUARDAR: Envía datos a la API /api/identidad
    const handleSave = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/identidad', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ empresaId: currentEmpresa.id, ...formData })
            });
            if (res.ok) {
                setIsEditing(false);
                await refreshData(); // Recarga los datos globales en Page.tsx
            } else {
                alert('Error al sincronizar con MongoDB');
            }
        } catch (e) { console.error("Error guardando identidad:", e); }
        setLoading(false);
    };

    // Agregar un nuevo perfil de comprador (Buyer Persona)
    const addPersona = () => {
        setFormData({
            ...formData,
            personas: [...formData.personas, { nombre: '', edad: '', problema: '', deseo: '', objecion: '' }]
        });
    };

    // Actualizar un campo específico de una Persona
    const updatePersona = (index: number, field: string, value: string) => {
        const nextPersonas = [...formData.personas];
        nextPersonas[index] = { ...nextPersonas[index], [field]: value };
        setFormData({ ...formData, personas: nextPersonas });
    };

    // Eliminar una Persona del array
    const removePersona = (index: number) => {
        setFormData({
            ...formData,
            personas: formData.personas.filter((_: any, i: number) => i !== index)
        });
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* CABECERA */}
            <div className="flex justify-between items-center sm:items-end">
                <div>
                    <h2 className="text-3xl font-black text-slate-800 flex items-center gap-3 tracking-tight">
                        <Fingerprint className="text-indigo-600" size={32} /> Identidad de Marca
                    </h2>
                    <p className="text-slate-500 text-sm mt-1 uppercase font-bold tracking-widest">ADN Estratégico de {currentEmpresa.nombre}</p>
                </div>

                {/* Lógica de botones para Editar / Guardar / Cancelar */}
                {!isEditing ? (
                    <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 bg-slate-100 hover:bg-indigo-50 text-indigo-700 px-4 py-2 rounded-xl text-xs font-black transition-all hover:scale-105">
                        <Edit2 size={16} /> EDITAR ESTRATEGIA
                    </button>
                ) : (
                    <div className="flex gap-3">
                        <button onClick={() => setIsEditing(false)} className="px-5 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-200 rounded-xl transition-all">
                            CANCELAR
                        </button>
                        <button onClick={handleSave} disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 transition-all shadow-lg disabled:opacity-50">
                            {loading ? 'SINCRONIZANDO...' : <><Save size={16} /> GUARDAR ADN</>}
                        </button>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* --- SECCIÓN 1: CORE DE MARCA --- */}
                <div className={`bg-white rounded-3xl border p-8 transition-all ${isEditing ? 'border-indigo-400 shadow-2xl ring-4 ring-indigo-50' : 'border-slate-100 shadow-sm'}`}>
                    <h3 className="text-xl font-black text-slate-800 mb-8 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                        Core Estratégico
                    </h3>
                    <div className="space-y-6">
                        {[
                            { label: '¿Qué es la marca?', field: 'queEs', multiline: true, placeholder: 'Define la esencia de la empresa...' },
                            { label: 'Nicho / Mercado Objetivo', field: 'nicho', multiline: false, placeholder: 'Ej: Inmobiliarias de lujo' },
                            { label: 'Propuesta Única de Valor', field: 'propuesta', multiline: true, highlight: true, placeholder: '¿Por qué elegirte a ti?' },
                            { label: 'Tono de Comunicación', field: 'tono', multiline: false, placeholder: 'Ej: Profesional, cercano, disruptivo' },
                        ].map((input) => (
                            <div key={input.field} className="relative group">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">{input.label}</label>
                                {isEditing ? (
                                    input.multiline ? (
                                        <textarea
                                            placeholder={input.placeholder}
                                            value={formData.base[input.field]}
                                            onChange={e => setFormData({ ...formData, base: { ...formData.base, [input.field]: e.target.value } })}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-medium focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-300 outline-none transition-all placeholder:text-slate-300 min-h-[100px]"
                                        />
                                    ) : (
                                        <input
                                            type="text"
                                            placeholder={input.placeholder}
                                            value={formData.base[input.field]}
                                            onChange={e => setFormData({ ...formData, base: { ...formData.base, [input.field]: e.target.value } })}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-medium focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-300 outline-none transition-all placeholder:text-slate-300"
                                        />
                                    )
                                ) : (
                                    <div className={`p-4 rounded-2xl border transition-colors ${input.highlight ? 'bg-indigo-50/50 border-indigo-100' : 'bg-slate-50/30 border-transparent hover:bg-slate-50'}`}>
                                        <p className={`text-sm leading-relaxed ${input.highlight ? 'font-bold text-indigo-800' : 'text-slate-600'}`}>
                                            {formData.base[input.field] || <span className="text-slate-300 italic">Estrategia pendiente de definir...</span>}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* --- SECCIÓN 2: BUYER PERSONAS --- */}
                <div className={`bg-white rounded-3xl border p-8 transition-all ${isEditing ? 'border-emerald-400 shadow-2xl ring-4 ring-emerald-50' : 'border-slate-100 shadow-sm'}`}>
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                            Buyer Personas
                        </h3>
                        {isEditing && (
                            <button onClick={addPersona} className="text-[10px] font-black text-emerald-600 hover:text-emerald-700 uppercase tracking-widest bg-emerald-50 px-3 py-1.5 rounded-lg flex items-center gap-1.5 active:scale-95 transition-all">
                                <Plus size={14} strokeWidth={3} /> NUEVO PERFIL
                            </button>
                        )}
                    </div>

                    <div className="space-y-6">
                        {formData.personas.map((persona: any, index: number) => (
                            <div key={index} className="relative group border border-slate-100 rounded-2xl p-6 bg-slate-50/50 transition-all hover:bg-white hover:shadow-lg hover:shadow-emerald-500/5">
                                {isEditing && (
                                    <button onClick={() => removePersona(index)} className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors bg-white p-1.5 rounded-lg shadow-sm">
                                        <Trash2 size={16} />
                                    </button>
                                )}

                                {isEditing ? (
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-[9px] font-black text-slate-400 uppercase mb-1 block">Nombre del Perfil</label>
                                                <input
                                                    className="w-full font-bold text-sm bg-white border border-slate-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
                                                    value={persona.nombre}
                                                    onChange={e => updatePersona(index, 'nombre', e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[9px] font-black text-slate-400 uppercase mb-1 block">Rango de Edad</label>
                                                <input
                                                    className="w-full text-xs font-bold bg-white border border-slate-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
                                                    value={persona.edad}
                                                    onChange={e => updatePersona(index, 'edad', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        {['problema', 'deseo', 'objecion'].map(f => (
                                            <div key={f}>
                                                <label className="text-[9px] font-black text-slate-400 uppercase mb-1 block">{f}</label>
                                                <input
                                                    className="w-full text-xs bg-white border border-slate-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
                                                    value={persona[f]}
                                                    onChange={e => updatePersona(index, f, e.target.value)}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex justify-between items-start mb-4">
                                            <h4 className="font-black text-slate-800 text-lg">{persona.nombre}</h4>
                                            <Badge type="info">Rango: {persona.edad}</Badge>
                                        </div>
                                        <div className="space-y-3 mt-4 text-sm divide-y divide-slate-100">
                                            <p className="pt-2"><span className="text-[10px] font-black text-slate-400 uppercase w-20 inline-block">Miedo:</span> <span className="text-slate-600 font-medium italic">{persona.problema}</span></p>
                                            <p className="pt-2"><span className="text-[10px] font-black text-slate-400 uppercase w-20 inline-block">Anhelo:</span> <span className="text-slate-600 font-medium italic">{persona.deseo}</span></p>
                                            <p className="pt-2"><span className="text-[10px] font-black text-slate-400 uppercase w-20 inline-block">Barrera:</span> <span className="text-slate-600 font-medium italic">{persona.objecion}</span></p>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
