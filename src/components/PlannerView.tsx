/**
 * COMPONENTE: PlannerView (Calendario Mixto V3)
 * Centraliza publicaciones de marca, proyecto, campañas, fechas especiales.
 */

import React, { useState } from 'react';
import { Plus, Edit2, Trash2, CalendarDays, Clock, PlayCircle, CheckCircle2, AlertCircle, Building2, Ticket } from 'lucide-react';

const Card = ({ children, className = '' }: any) => (
    <div className={`bg-white rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-lg ${className}`}>
        {children}
    </div>
);

const Badge = ({ children, type = 'default' }: any) => {
    const colors: Record<string, string> = {
        success: 'bg-emerald-100 text-emerald-800',
        warning: 'bg-amber-100 text-amber-800',
        info: 'bg-blue-100 text-blue-800',
        danger: 'bg-red-100 text-red-800',
        violet: 'bg-violet-100 text-violet-800',
        default: 'bg-slate-100 text-slate-800'
    };
    return (
        <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${colors[type] || colors.default}`}>
            {children}
        </span>
    );
};

export default function PlannerView({ mockData, refreshData }: any) {
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentTareaId, setCurrentTareaId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // Formulario unificado para Calendario y Contenido Editorial base
    const [formData, setFormData] = useState({
        empresa_id: 'fortress',
        proyecto_id: '',
        tipo_contenido: 'Contenido de marca',
        tema: '',
        fecha: '',
        hora: '',
        formato: 'Reel',
        estado: 'Idea',
        responsable: ''
    });

    const ESTADOS = ['Idea', 'Brief', 'Copy', 'Guion', 'Grabación', 'Edición', 'Revisión', 'Aprobado', 'Programado', 'Publicado', 'Activo'];
    const TIPOS_CONTENIDO = ['Contenido de marca', 'Contenido de proyecto', 'Fecha especial', 'Expectativa', 'Entrega', 'Prueba social', 'Educativo', 'Lifestyle', 'Comunidad'];

    const getEstadoColor = (estado: string) => {
        if (['Publicado', 'Activo', 'Aprobado'].includes(estado)) return 'success';
        if (['Idea', 'Brief'].includes(estado)) return 'default';
        if (['Revisión'].includes(estado)) return 'warning';
        return 'info';
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Nota: En un backend real, esto crearía el EditorialContent y el Calendar
            const url = '/api/planner';
            const method = isEditing ? 'PUT' : 'POST';
            const body = isEditing ? { ...formData, id: currentTareaId } : formData;

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            if (res.ok) {
                setShowModal(false);
                await refreshData();
            }
        } catch (e) {
            console.error("Error en submit planner:", e);
        }
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('¿Eliminar esta tarea del calendario?')) return;
        setLoading(true);
        try {
            await fetch(`/api/planner?id=${id}`, { method: 'DELETE' });
            await refreshData();
        } catch (e) {
            console.error("Error eliminando tarea:", e);
        }
        setLoading(false);
    };

    const handleEdit = (t: any) => {
        setIsEditing(true);
        setCurrentTareaId(t.id);
        setFormData({
            empresa_id: t.empresa_id || 'fortress',
            proyecto_id: t.proyecto_id || '',
            tipo_contenido: t.tipo_contenido || 'Contenido de marca',
            tema: t.tema || t.contenido || '', // Fallback para data vieja
            fecha: t.fecha || t.publicacion?.split(' ')[0] || '',
            hora: t.hora || '',
            formato: t.formato || 'Reel',
            estado: t.estado || 'Idea',
            responsable: t.responsable || ''
        });
        setShowModal(true);
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* CABECERA */}
            <div className="flex justify-between items-center sm:items-end">
                <div>
                    <h2 className="text-3xl font-black text-slate-800 flex items-center gap-3 tracking-tight">
                        <CalendarDays className="text-violet-600" size={32} /> Calendario Mixto Editorial
                    </h2>
                    <p className="text-slate-500 text-sm mt-1 uppercase font-bold tracking-widest italic tracking-tighter">Control Centralizado: Organico, Comercial & Campañas</p>
                </div>
                <button
                    onClick={() => { setIsEditing(false); setFormData({ empresa_id: 'fortress', proyecto_id: '', tipo_contenido: 'Contenido de marca', tema: '', fecha: '', hora: '', formato: 'Reel', estado: 'Idea', responsable: '' }); setShowModal(true); }}
                    className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-3 rounded-2xl text-xs font-black flex items-center gap-2 transition-all shadow-lg active:scale-95"
                >
                    <Plus size={16} strokeWidth={3} /> AGENDAR PUBLICACIÓN
                </button>
            </div>

            {/* LISTADO TIPO TABLA PREMIUM */}
            <Card className="p-0 overflow-hidden border-none ring-1 ring-slate-100 shadow-xl shadow-slate-200/50">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-900">
                            <tr className="text-slate-300 text-[10px] uppercase font-black tracking-[0.2em]">
                                <th className="px-6 py-4">Contexto</th>
                                <th className="px-6 py-4">Tema / Contenido</th>
                                <th className="px-6 py-4">Fecha Programada</th>
                                <th className="px-6 py-4">Tipo & Formato</th>
                                <th className="px-6 py-4">Estado Prod.</th>
                                <th className="px-6 py-4 text-right">Acción</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                            {mockData.planner?.map((tarea: any) => (
                                <tr key={tarea.id} className="group hover:bg-violet-50/30 transition-all duration-300">
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-600 uppercase">
                                                <Building2 size={12} className="text-violet-400" /> {tarea.empresa_id || 'Fortress'}
                                            </div>
                                            {tarea.proyecto_id && (
                                                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase">
                                                    <Ticket size={12} className="text-blue-400" /> {tarea.proyecto_id}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center text-violet-500 shrink-0">
                                                <PlayCircle size={18} />
                                            </div>
                                            <p className="text-sm font-bold text-slate-800 uppercase tracking-tight truncate max-w-xs">{tarea.tema || tarea.contenido}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                                            <CalendarDays size={14} className="text-violet-400" />
                                            {tarea.fecha || tarea.publicacion}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 space-y-1">
                                        <Badge type="default">{tarea.tipo_contenido || 'Por definir'}</Badge>
                                        <Badge type="violet">{tarea.formato}</Badge>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <CheckCircle2 size={14} className={`text-${getEstadoColor(tarea.estado).split('-')[1]}-500`} />
                                            <span className={`text-[11px] font-black uppercase text-${getEstadoColor(tarea.estado).split('-')[1]}-600`}>
                                                {tarea.estado}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleEdit(tarea)} className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-violet-600 shadow-sm border border-transparent hover:border-slate-100">
                                                <Edit2 size={14} />
                                            </button>
                                            <button onClick={() => handleDelete(tarea.id)} className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-red-500 shadow-sm border border-transparent hover:border-slate-100">
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {(!mockData.planner || mockData.planner.length === 0) && (
                                <tr>
                                    <td colSpan={6} className="py-20 text-center text-slate-400 font-mono text-xs">El calendario mixto está vacío. Agende el primer contenido.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* MODAL PARA CONTENIDOS */}
            {showModal && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4 z-[999] animate-in fade-in duration-300">
                    <Card className="p-8 w-full max-w-2xl shadow-2xl border-none ring-1 ring-white/20">
                        <h3 className="text-2xl font-black text-slate-800 mb-6 uppercase tracking-tight flex items-center gap-2">
                            <CalendarDays className="text-violet-600" /> {isEditing ? 'Ajustar Pieza Editorial' : 'Nueva Pieza Editorial'}
                        </h3>

                        <form onSubmit={handleSubmit} className="space-y-6">

                            {/* Fila 1: Contexto */}
                            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Empresa (Obligatorio)</label>
                                    <select
                                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-violet-200"
                                        value={formData.empresa_id}
                                        onChange={e => setFormData({ ...formData, empresa_id: e.target.value })}
                                        required
                                    >
                                        <option value="fortress">Fortress Constructor</option>
                                        <option value="crescendo">Crescendo Mkt</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Proyecto (Opcional)</label>
                                    <select
                                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-violet-200"
                                        value={formData.proyecto_id}
                                        onChange={e => setFormData({ ...formData, proyecto_id: e.target.value })}
                                    >
                                        <option value="">-- Sin Proyecto (Contenido de Marca) --</option>
                                        <option value="boulevard">Boulevard el Parque</option>
                                        <option value="acuarela">Acuarela</option>
                                    </select>
                                </div>
                            </div>

                            {/* Fila 2: Clasificación */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Tipo de Contenido</label>
                                    <select
                                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm outline-none"
                                        value={formData.tipo_contenido}
                                        onChange={e => setFormData({ ...formData, tipo_contenido: e.target.value })}
                                    >
                                        {TIPOS_CONTENIDO.map(tc => <option key={tc} value={tc}>{tc}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Formato Visual</label>
                                    <select
                                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm outline-none"
                                        value={formData.formato}
                                        onChange={e => setFormData({ ...formData, formato: e.target.value })}
                                    >
                                        <option value="Reel">Reel 🎬</option>
                                        <option value="Carrusel">Carrusel 🖼️</option>
                                        <option value="Story">Story 🤳</option>
                                        <option value="Video Largo">Video YT 🎥</option>
                                        <option value="Imagen Fija">Imagen Fija 📷</option>
                                    </select>
                                </div>
                            </div>

                            {/* Fila 3: El Contenido */}
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Tema Principal / Hook</label>
                                <textarea
                                    required
                                    rows={2}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm focus:bg-white focus:ring-4 focus:ring-violet-100 outline-none transition-all placeholder:italic"
                                    value={formData.tema}
                                    onChange={e => setFormData({ ...formData, tema: e.target.value })}
                                    placeholder="Ej: 3 razones para invertir en Boulevard este mes..."
                                />
                            </div>

                            {/* Fila 4: Calendario y Estado */}
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Fecha (YYYY-MM-DD)</label>
                                    <input
                                        type="date"
                                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm outline-none"
                                        value={formData.fecha}
                                        onChange={e => setFormData({ ...formData, fecha: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Hora (HH:MM)</label>
                                    <input
                                        type="time"
                                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm outline-none"
                                        value={formData.hora}
                                        onChange={e => setFormData({ ...formData, hora: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Fase de Producción</label>
                                    <select
                                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm outline-none font-bold text-violet-700"
                                        value={formData.estado}
                                        onChange={e => setFormData({ ...formData, estado: e.target.value })}
                                    >
                                        {ESTADOS.map(es => <option key={es} value={es}>{es}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-slate-100">
                                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-3 text-xs font-black text-slate-500 hover:text-slate-800">CANCELAR</button>
                                <button type="submit" disabled={loading} className="bg-slate-900 text-white px-8 py-3 rounded-2xl text-xs font-black shadow-lg hover:bg-violet-600 transition-all active:scale-95 disabled:opacity-50">
                                    {loading ? 'GUARDANDO...' : 'GUARDAR PIEZA EDITORIAL'}
                                </button>
                            </div>
                        </form>
                    </Card>
                </div>
            )}
        </div>
    );
}
