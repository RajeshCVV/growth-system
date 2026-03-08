import React, { useState } from 'react';
import { Plus, CalendarDays, Clock, Trash2, Edit2 } from 'lucide-react';

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

export default function PlannerView({ mockData, refreshData }: any) {
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        proyecto: mockData.proyectos[0]?.nombre || '',
        contenido: '',
        formato: 'Reel',
        grabacion: '',
        publicacion: '',
        responsable: '',
        estado: 'Por grabar'
    });
    const [loading, setLoading] = useState(false);

    const plannerTasks = mockData.planner || [];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const url = '/api/planner';
            const method = isEditing ? 'PUT' : 'POST';
            const body = isEditing ? { ...formData, id: currentId } : formData;

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            if (res.ok) {
                setShowModal(false);
                resetForm();
                await refreshData();
            } else {
                alert('Error al procesar la tarea');
            }
        } catch (error) {
            console.error(error);
            alert('Error de red');
        }
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('¿Estás seguro de eliminar esta tarea?')) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/planner?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                await refreshData();
            } else {
                alert('Error al eliminar');
            }
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    };

    const handleEdit = (task: any) => {
        setIsEditing(true);
        setCurrentId(task.id);
        setFormData({
            proyecto: task.proyecto,
            contenido: task.contenido,
            formato: task.formato,
            grabacion: task.grabacion,
            publicacion: task.publicacion,
            responsable: task.responsable,
            estado: task.estado
        });
        setShowModal(true);
    };

    const resetForm = () => {
        setIsEditing(false);
        setCurrentId(null);
        setFormData({
            proyecto: mockData.proyectos[0]?.nombre || '',
            contenido: '',
            formato: 'Reel',
            grabacion: '',
            publicacion: '',
            responsable: '',
            estado: 'Por grabar'
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <CalendarDays className="text-indigo-600" /> Planner de Contenidos
                    </h2>
                    <p className="text-slate-500 text-sm mt-1">Gestión de piezas audiovisuales y publicaciones</p>
                </div>
                <button
                    onClick={() => { resetForm(); setShowModal(true); }}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
                >
                    <Plus size={16} /> Agregar Tarea
                </button>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-200 text-slate-500 text-sm">
                                <th className="pb-3 font-medium">Contenido / Título</th>
                                <th className="pb-3 font-medium">Proyecto Asignado</th>
                                <th className="pb-3 font-medium">Formato</th>
                                <th className="pb-3 font-medium">Fechas (Grab/Pub)</th>
                                <th className="pb-3 font-medium">Responsable</th>
                                <th className="pb-3 font-medium">Estado</th>
                                <th className="pb-3 font-medium text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {plannerTasks.map((t: any, i: number) => (
                                <tr key={i} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors group">
                                    <td className="py-4 text-sm font-medium text-slate-800">{t.contenido}</td>
                                    <td className="py-4 text-sm text-slate-600">{t.proyecto}</td>
                                    <td className="py-4 text-sm text-slate-600">{t.formato}</td>
                                    <td className="py-4 text-sm text-slate-500 flex flex-col gap-1">
                                        <span className="flex items-center gap-1"><Clock size={12} /> G: {t.grabacion}</span>
                                        <span className="flex items-center gap-1 text-indigo-600"><Clock size={12} /> P: {t.publicacion}</span>
                                    </td>
                                    <td className="py-4 text-sm text-slate-600">{t.responsable}</td>
                                    <td className="py-4">
                                        <Badge type={t.estado === 'Publicado' || t.estado === 'Programado' ? 'success' : t.estado === 'En edición' ? 'warning' : 'info'}>
                                            {t.estado}
                                        </Badge>
                                    </td>
                                    <td className="py-4 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleEdit(t)} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors">
                                                <Edit2 size={16} />
                                            </button>
                                            <button onClick={() => handleDelete(t.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {plannerTasks.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="py-8 text-center text-sm text-slate-500">No hay tareas creadas en el planner.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-xl">
                        <h3 className="text-lg font-bold text-slate-800 mb-4">{isEditing ? 'Editar Tarea' : 'Nueva Tarea de Contenido'}</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Título del Contenido</label>
                                <input
                                    required type="text"
                                    value={formData.contenido}
                                    onChange={e => setFormData({ ...formData, contenido: e.target.value })}
                                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                    placeholder="Ej: Video explicativo del servicio"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Proyecto Asignado</label>
                                    <select
                                        value={formData.proyecto}
                                        onChange={e => setFormData({ ...formData, proyecto: e.target.value })}
                                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                                    >
                                        {mockData.proyectos.map((p: any) => (
                                            <option key={p.id} value={p.nombre}>{p.nombre}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Formato</label>
                                    <select
                                        value={formData.formato}
                                        onChange={e => setFormData({ ...formData, formato: e.target.value })}
                                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                                    >
                                        <option value="Reel">Reel / TikTok</option>
                                        <option value="Carrusel">Carrusel</option>
                                        <option value="Post Estático">Post Estático</option>
                                        <option value="Historia">Historia</option>
                                        <option value="Video Youtube">Video YouTube</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Grabación</label>
                                    <input
                                        type="text"
                                        value={formData.grabacion}
                                        onChange={e => setFormData({ ...formData, grabacion: e.target.value })}
                                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                                        placeholder="Ej: 2024-11-20"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Publicación</label>
                                    <input
                                        type="text"
                                        value={formData.publicacion}
                                        onChange={e => setFormData({ ...formData, publicacion: e.target.value })}
                                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                                        placeholder="Ej: 2024-11-25"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Responsable</label>
                                    <input
                                        type="text"
                                        value={formData.responsable}
                                        onChange={e => setFormData({ ...formData, responsable: e.target.value })}
                                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                                        placeholder="Ej: Editor 1"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Estado</label>
                                    <select
                                        value={formData.estado}
                                        onChange={e => setFormData({ ...formData, estado: e.target.value })}
                                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                                    >
                                        <option value="Por Grabar">Por Grabar</option>
                                        <option value="En Edición">En Edición</option>
                                        <option value="En Aprobación">En Aprobación</option>
                                        <option value="Programado">Programado</option>
                                        <option value="Publicado">Publicado</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                                >
                                    {loading ? 'Procesando...' : isEditing ? 'Actualizar' : 'Guardar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
