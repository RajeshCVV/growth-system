import React, { useState } from 'react';
import { Fingerprint, UserCircle, Plus, Edit2, Save, Trash2 } from 'lucide-react';

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

export default function IdentidadView({ currentEmpresa, mockData, refreshData }: any) {
    const rawId = mockData.identidad[currentEmpresa.id];
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState(rawId || {
        base: { queEs: '', nicho: '', propuesta: '', tono: '' },
        personas: []
    });

    if (!rawId && !isEditing) {
        return (
            <div className="p-12 text-center border-2 border-dashed border-slate-200 rounded-xl">
                <Fingerprint size={48} className="mx-auto text-slate-300 mb-4" />
                <h3 className="text-lg font-bold text-slate-700">Sin Identidad de Marca</h3>
                <p className="text-slate-500 mb-6">Esta empresa no tiene configurada su identidad estratégica.</p>
                <button onClick={() => setIsEditing(true)} className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition">
                    Empezar Configuración
                </button>
            </div>
        );
    }

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
                await refreshData();
            } else {
                alert('Error al guardar');
            }
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    const addPersona = () => {
        setFormData({
            ...formData,
            personas: [...formData.personas, { nombre: '', edad: '', problema: '', deseo: '', objecion: '' }]
        });
    };

    const updatePersona = (index: number, field: string, value: string) => {
        const nextPersonas = [...formData.personas];
        nextPersonas[index] = { ...nextPersonas[index], [field]: value };
        setFormData({ ...formData, personas: nextPersonas });
    };

    const removePersona = (index: number) => {
        setFormData({
            ...formData,
            personas: formData.personas.filter((_: any, i: number) => i !== index)
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <Fingerprint className="text-indigo-600" /> Identidad de Marca
                    </h2>
                    <p className="text-slate-500 text-sm mt-1">Biblioteca estratégica de {currentEmpresa.nombre}</p>
                </div>
                {!isEditing ? (
                    <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 text-indigo-600 font-medium hover:underline">
                        <Edit2 size={16} /> Editar Estrategia
                    </button>
                ) : (
                    <div className="flex gap-3">
                        <button onClick={() => setIsEditing(false)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                            Cancelar
                        </button>
                        <button onClick={handleSave} disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors disabled:opacity-50">
                            {loading ? 'Guardando...' : <><Save size={16} /> Guardar Cambios</>}
                        </button>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Core de Marca */}
                <div className={`bg-white rounded-xl border p-6 transition-all ${isEditing ? 'border-indigo-300 shadow-md ring-2 ring-indigo-50' : 'border-slate-200'}`}>
                    <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <Fingerprint className="text-indigo-600" size={20} />
                        Core de Marca
                    </h3>
                    <div className="space-y-5">
                        {[
                            { label: '¿Qué es la marca?', field: 'queEs', multiline: true },
                            { label: 'Nicho / Mercado Objetivo', field: 'nicho', multiline: false },
                            { label: 'Propuesta de Valor (Lo más importante)', field: 'propuesta', multiline: true, highlight: true },
                            { label: 'Tono de Comunicación', field: 'tono', multiline: false },
                        ].map((input) => (
                            <div key={input.field}>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">{input.label}</label>
                                {isEditing ? (
                                    input.multiline ? (
                                        <textarea
                                            value={formData.base[input.field]}
                                            onChange={e => setFormData({ ...formData, base: { ...formData.base, [input.field]: e.target.value } })}
                                            className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                            rows={3}
                                        />
                                    ) : (
                                        <input
                                            type="text"
                                            value={formData.base[input.field]}
                                            onChange={e => setFormData({ ...formData, base: { ...formData.base, [input.field]: e.target.value } })}
                                            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                        />
                                    )
                                ) : (
                                    <p className={`text-sm ${input.highlight ? 'font-medium text-indigo-700 bg-indigo-50 p-3 rounded-lg border border-indigo-100' : 'text-slate-700'}`}>
                                        {formData.base[input.field] || 'Pendiente de definir...'}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Personas */}
                <div className={`bg-white rounded-xl border p-6 transition-all ${isEditing ? 'border-emerald-300 shadow-md ring-2 ring-emerald-50' : 'border-slate-200'}`}>
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <UserCircle className="text-emerald-600" size={20} />
                            Buyer Personas
                        </h3>
                        {isEditing && (
                            <button onClick={addPersona} className="text-xs font-bold text-emerald-600 hover:text-emerald-700 uppercase flex items-center gap-1">
                                <Plus size={14} /> Nueva Persona
                            </button>
                        )}
                    </div>

                    <div className="space-y-4">
                        {formData.personas.map((persona: any, index: number) => (
                            <div key={index} className="relative group border border-slate-100 rounded-xl p-4 bg-slate-50/50">
                                {isEditing && (
                                    <button onClick={() => removePersona(index)} className="absolute top-2 right-2 text-slate-300 hover:text-red-500 transition-colors">
                                        <Trash2 size={16} />
                                    </button>
                                )}

                                {isEditing ? (
                                    <div className="space-y-3">
                                        <div className="grid grid-cols-2 gap-3">
                                            <input
                                                placeholder="Nombre / Perfil"
                                                className="text-sm font-bold bg-white border border-slate-200 rounded px-2 py-1 outline-none focus:ring-2 focus:ring-emerald-500"
                                                value={persona.nombre}
                                                onChange={e => updatePersona(index, 'nombre', e.target.value)}
                                            />
                                            <input
                                                placeholder="Edad"
                                                className="text-xs font-medium bg-white border border-slate-200 rounded px-2 py-1 outline-none focus:ring-2 focus:ring-emerald-500"
                                                value={persona.edad}
                                                onChange={e => updatePersona(index, 'edad', e.target.value)}
                                            />
                                        </div>
                                        {['problema', 'deseo', 'objecion'].map(f => (
                                            <div key={f} className="flex gap-2 items-center">
                                                <span className="text-[10px] uppercase font-bold text-slate-400 w-16">{f}:</span>
                                                <input
                                                    className="flex-1 text-xs bg-white border border-slate-100 rounded px-2 py-1"
                                                    value={persona[f]}
                                                    onChange={e => updatePersona(index, f, e.target.value)}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-bold text-slate-800">{persona.nombre}</h4>
                                            <Badge type="info">Rango: {persona.edad}</Badge>
                                        </div>
                                        <div className="space-y-1.5 mt-3 text-sm">
                                            <p><span className="font-medium text-slate-700">Problema:</span> <span className="text-slate-600">{persona.problema}</span></p>
                                            <p><span className="font-medium text-slate-700">Deseo:</span> <span className="text-slate-600">{persona.deseo}</span></p>
                                            <p><span className="font-medium text-slate-700">Objeciones:</span> <span className="text-slate-600">{persona.objecion}</span></p>
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
