import React, { useState } from 'react';
import { Plus, FolderKanban, Trash2, Edit2 } from 'lucide-react';

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

export default function ProyectosView({ currentEmpresa, mockData, refreshData }: any) {
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        nombre: '',
        estado: 'Planificación',
        ticket: '',
        fechaCierre: '',
        responsable: ''
    });
    const [loading, setLoading] = useState(false);

    const activeProjects = mockData.proyectos.filter((p: any) => p.empresaId === currentEmpresa.id);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const url = '/api/proyectos';
            const method = isEditing ? 'PUT' : 'POST';
            const body = isEditing ? { ...formData, id: currentId } : { ...formData, empresaId: currentEmpresa.id };

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
                alert('Error al procesar el proyecto');
            }
        } catch (error) {
            console.error(error);
            alert('Error de red');
        }
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('¿Estás seguro de eliminar este proyecto?')) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/proyectos?id=${id}`, { method: 'DELETE' });
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

    const handleEdit = (project: any) => {
        setIsEditing(true);
        setCurrentId(project.id);
        setFormData({
            nombre: project.nombre,
            estado: project.estado,
            ticket: project.ticket,
            fechaCierre: project.fechaCierre,
            responsable: project.responsable
        });
        setShowModal(true);
    };

    const resetForm = () => {
        setIsEditing(false);
        setCurrentId(null);
        setFormData({ nombre: '', estado: 'Planificación', ticket: '', fechaCierre: '', responsable: '' });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <FolderKanban className="text-indigo-600" /> Proyectos
                    </h2>
                    <p className="text-slate-500 text-sm mt-1">Gestión de proyectos para {currentEmpresa.nombre}</p>
                </div>
                <button
                    onClick={() => { resetForm(); setShowModal(true); }}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
                >
                    <Plus size={16} /> Nuevo Proyecto
                </button>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-200 text-slate-500 text-sm">
                                <th className="pb-3 font-medium">Nombre del Proyecto</th>
                                <th className="pb-3 font-medium">Estado</th>
                                <th className="pb-3 font-medium">Responsable</th>
                                <th className="pb-3 font-medium">Ticket</th>
                                <th className="pb-3 font-medium">Fecha Cierre</th>
                                <th className="pb-3 font-medium text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {activeProjects.map((p: any, i: number) => (
                                <tr key={i} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors group">
                                    <td className="py-4 text-sm font-medium text-slate-800">{p.nombre}</td>
                                    <td className="py-4">
                                        <Badge type={p.estado === 'En curso' ? 'info' : p.estado === 'Activo' ? 'success' : 'warning'}>
                                            {p.estado}
                                        </Badge>
                                    </td>
                                    <td className="py-4 text-sm text-slate-600">{p.responsable}</td>
                                    <td className="py-4 text-sm font-medium text-slate-800">{p.ticket}</td>
                                    <td className="py-4 text-sm text-slate-500">{p.fechaCierre}</td>
                                    <td className="py-4 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleEdit(p)} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors">
                                                <Edit2 size={16} />
                                            </button>
                                            <button onClick={() => handleDelete(p.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {activeProjects.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="py-8 text-center text-sm text-slate-500">No hay proyectos activos para esta empresa.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
                        <h3 className="text-lg font-bold text-slate-800 mb-4">{isEditing ? 'Editar Proyecto' : 'Crear Nuevo Proyecto'}</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Nombre del Proyecto</label>
                                <input
                                    required type="text"
                                    value={formData.nombre}
                                    onChange={e => setFormData({ ...formData, nombre: e.target.value })}
                                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                    placeholder="Ej: Lanzamiento B2B"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Estado</label>
                                    <select
                                        value={formData.estado}
                                        onChange={e => setFormData({ ...formData, estado: e.target.value })}
                                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                                    >
                                        <option value="Planificación">Planificación</option>
                                        <option value="En curso">En curso</option>
                                        <option value="Activo">Activo</option>
                                        <option value="Pausado">Pausado</option>
                                        <option value="Completado">Completado</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Responsable</label>
                                    <input
                                        required type="text"
                                        value={formData.responsable}
                                        onChange={e => setFormData({ ...formData, responsable: e.target.value })}
                                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                                        placeholder="Ej: Ana"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Ticket Promedio</label>
                                    <input
                                        required type="text"
                                        value={formData.ticket}
                                        onChange={e => setFormData({ ...formData, ticket: e.target.value })}
                                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                                        placeholder="Ej: $1,500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Fecha de Cierre</label>
                                    <input
                                        type="text"
                                        value={formData.fechaCierre}
                                        onChange={e => setFormData({ ...formData, fechaCierre: e.target.value })}
                                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                                        placeholder="Ej: 2024-12-31"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
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
