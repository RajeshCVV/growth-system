/**
 * COMPONENTE: PlannerView
 * Calendario y cronograma de publicaciones en redes sociales.
 * Permite gestionar contenidos mensuales para cada empresa.
 */

import React, { useState } from 'react';
import { Plus, Edit2, Trash2, CalendarDays, Clock, PlayCircle, CheckCircle2, MoreVertical } from 'lucide-react';

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

    // Formulario para contenidos
    const [formData, setFormData] = useState({
        contenido: '',
        publicacion: '',
        formato: 'Reel',
        estado: 'Programado'
    });

    // SUBMIT: Crear o Editar en MongoDB
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
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

    // DELETE: Eliminar de MongoDB
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
            contenido: t.contenido,
            publicacion: t.publicacion,
            formato: t.formato,
            estado: t.estado
        });
        setShowModal(true);
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* CABECERA */}
            <div className="flex justify-between items-center sm:items-end">
                <div>
                    <h2 className="text-3xl font-black text-slate-800 flex items-center gap-3 tracking-tight">
                        <CalendarDays className="text-indigo-600" size={32} /> Planner de Contenidos
                    </h2>
                    <p className="text-slate-500 text-sm mt-1 uppercase font-bold tracking-widest italic tracking-tighter">Cronograma de Impacto Social</p>
                </div>
                <button
                    onClick={() => { setIsEditing(false); setFormData({ contenido: '', publicacion: '', formato: 'Reel', estado: 'Programado' }); setShowModal(true); }}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl text-xs font-black flex items-center gap-2 transition-all shadow-lg active:scale-95"
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
                                <th className="px-8 py-5">Contenido / Título</th>
                                <th className="px-6 py-5">Fecha / Hora</th>
                                <th className="px-6 py-5">Formato</th>
                                <th className="px-6 py-5">Estado</th>
                                <th className="px-8 py-5 text-right">Acción</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                            {mockData.planner.map((tarea: any) => (
                                <tr key={tarea.id} className="group hover:bg-indigo-50/30 transition-all duration-300">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500 shrink-0">
                                                <PlayCircle size={18} />
                                            </div>
                                            <p className="text-sm font-bold text-slate-800 uppercase tracking-tight truncate max-w-xs">{tarea.contenido}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                                            <Clock size={14} className="text-indigo-400" />
                                            {tarea.publicacion}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <Badge type="info">{tarea.formato}</Badge>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2">
                                            <CheckCircle2 size={14} className={tarea.estado === 'Publicado' ? 'text-emerald-500' : 'text-slate-300'} />
                                            <span className={`text-[11px] font-black uppercase ${tarea.estado === 'Publicado' ? 'text-emerald-600' : 'text-slate-500'}`}>
                                                {tarea.estado}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleEdit(tarea)} className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-indigo-600 shadow-sm border border-transparent hover:border-slate-100">
                                                <Edit2 size={14} />
                                            </button>
                                            <button onClick={() => handleDelete(tarea.id)} className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-red-500 shadow-sm border border-transparent hover:border-slate-100">
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {mockData.planner.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="py-20 text-center text-slate-400 font-mono text-xs">Aún no hay contenidos agendados.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* MODAL PARA CONTENIDOS */}
            {showModal && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4 z-[999] animate-in fade-in duration-300">
                    <Card className="p-8 w-full max-w-md shadow-2xl border-none ring-1 ring-white/20">
                        <h3 className="text-2xl font-black text-slate-800 mb-6 uppercase tracking-tight">
                            {isEditing ? 'Ajustar Publicación' : 'Nueva Salida'}
                        </h3>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Tema / Guion del Contenido</label>
                                <textarea
                                    required
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm focus:bg-white focus:ring-4 focus:ring-indigo-100 outline-none transition-all placeholder:italic"
                                    value={formData.contenido}
                                    onChange={e => setFormData({ ...formData, contenido: e.target.value })}
                                    placeholder="Ej: 5 errores al comprar tu primera casa en Villavicencio..."
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Fecha y Hora</label>
                                    <input
                                        required
                                        type="text"
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-200"
                                        value={formData.publicacion}
                                        onChange={e => setFormData({ ...formData, publicacion: e.target.value })}
                                        placeholder="Ej: Lunes 10:00 AM"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Formato</label>
                                    <select
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm outline-none"
                                        value={formData.formato}
                                        onChange={e => setFormData({ ...formData, formato: e.target.value })}
                                    >
                                        <option value="Reel">Reel 🎬</option>
                                        <option value="Post">Post 🖼️</option>
                                        <option value="Story">Story 🤳</option>
                                        <option value="Video Largo">Video 🎥</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Estado</label>
                                <div className="flex gap-2">
                                    {['Programado', 'Publicado'].map(s => (
                                        <button
                                            key={s}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, estado: s })}
                                            className={`flex-1 py-2 text-[10px] font-black uppercase rounded-xl transition-all ${formData.estado === s ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 mt-8">
                                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-3 text-xs font-black text-slate-500 hover:text-slate-800">CANCELAR</button>
                                <button type="submit" disabled={loading} className="bg-slate-900 text-white px-8 py-3 rounded-2xl text-xs font-black shadow-lg hover:bg-indigo-600 transition-all active:scale-95 disabled:opacity-50">
                                    {loading ? 'SINCRONIZANDO...' : 'CONFIRMAR AGENDAMIENTO'}
                                </button>
                            </div>
                        </form>
                    </Card>
                </div>
            )}
        </div>
    );
}
