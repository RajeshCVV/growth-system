/**
 * COMPONENTE: ProyectosView
 * Permite el registro y control de proyectos inmobiliarios.
 * Conectado directamente a MongoDB para CRUD completo.
 */

import React, { useState } from 'react';
import { Plus, Edit2, Trash2, LayoutGrid, User, Ticket, CheckCircle2 } from 'lucide-react';

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
        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${colors[type] || colors.default}`}>
            {children}
        </span>
    );
};

export default function ProyectosView({ currentEmpresa, mockData, refreshData }: any) {
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentProyectoId, setCurrentProyectoId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // Estado del formulario
    const [formData, setFormData] = useState({
        nombre: '',
        estado: 'Activo',
        responsable: '',
        ticket: '',
        empresaId: currentEmpresa.id
    });

    const proyectos = mockData.proyectos.filter((p: any) => p.empresaId === currentEmpresa.id);

    // FUNCIÓN PARA CREAR O EDITAR
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const url = '/api/proyectos';
            const method = isEditing ? 'PUT' : 'POST';
            const body = isEditing ? { ...formData, id: currentProyectoId } : formData;

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            if (res.ok) {
                setShowModal(false);
                await refreshData(); // Recarga la lista desde MongoDB
            }
        } catch (e) {
            console.error("Error en submit proyectos:", e);
        }
        setLoading(false);
    };

    // FUNCIÓN PARA ELIMINAR
    const handleDelete = async (id: string) => {
        if (!confirm('¿Seguro que deseas eliminar este proyecto? Los datos no se podrán recuperar.')) return;
        setLoading(true);
        try {
            await fetch(`/api/proyectos?id=${id}`, { method: 'DELETE' });
            await refreshData();
        } catch (e) {
            console.error("Error eliminando proyecto:", e);
        }
        setLoading(false);
    };

    // Abrir modal en modo edición
    const handleEdit = (p: any) => {
        setIsEditing(true);
        setCurrentProyectoId(p.id);
        setFormData({
            nombre: p.nombre,
            estado: p.estado,
            responsable: p.responsable,
            ticket: p.ticket,
            empresaId: p.empresaId
        });
        setShowModal(true);
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* CABECERA */}
            <div className="flex justify-between items-center sm:items-end">
                <div>
                    <h2 className="text-3xl font-black text-slate-800 flex items-center gap-3 tracking-tight">
                        <FolderKanban className="text-indigo-600" size={32} /> Gestión de Proyectos
                    </h2>
                    <p className="text-slate-500 text-sm mt-1 uppercase font-bold tracking-widest italic">{currentEmpresa.nombre}</p>
                </div>
                <button
                    onClick={() => { setIsEditing(false); setFormData({ ...formData, nombre: '', responsable: '', ticket: '' }); setShowModal(true); }}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl text-xs font-black flex items-center gap-2 transition-all shadow-lg active:scale-95"
                >
                    <Plus size={16} strokeWidth={3} /> REGISTRAR NUEVO
                </button>
            </div>

            {/* LISTADO DE PROYECTOS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {proyectos.map((p: any) => (
                    <Card key={p.id} className="p-6 relative group border-none ring-1 ring-slate-100">
                        <div className="absolute top-4 right-4 flex gap-1 transform translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                            <button
                                onClick={() => handleEdit(p)}
                                className="p-2 bg-white text-slate-400 hover:text-indigo-600 rounded-lg shadow-sm border border-slate-50 transition-colors"
                                title="Editar Proyecto"
                            >
                                <Edit2 size={14} />
                            </button>
                            <button
                                onClick={() => handleDelete(p.id)}
                                className="p-2 bg-white text-slate-400 hover:text-red-500 rounded-lg shadow-sm border border-slate-50 transition-colors"
                                title="Eliminar Proyecto"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>

                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 bg-slate-50 rounded-2xl text-indigo-500">
                                <LayoutGrid size={20} />
                            </div>
                            <div className="min-w-0">
                                <h3 className="font-black text-slate-800 truncate uppercase tracking-tight">{p.nombre}</h3>
                                <Badge type={p.estado === 'Activo' ? 'success' : 'warning'}>{p.estado}</Badge>
                            </div>
                        </div>

                        <div className="space-y-3 mt-6 pt-6 border-t border-slate-50">
                            <div className="flex items-center gap-3 text-xs">
                                <User size={14} className="text-slate-400" />
                                <span className="text-slate-500 font-bold uppercase tracking-widest">Líder:</span>
                                <span className="text-slate-800 font-medium">{p.responsable}</span>
                            </div>
                            <div className="flex items-center gap-3 text-xs">
                                <Ticket size={14} className="text-slate-400" />
                                <span className="text-slate-500 font-bold uppercase tracking-widest">Valor:</span>
                                <span className="text-indigo-600 font-black">{p.ticket}</span>
                            </div>
                        </div>
                    </Card>
                ))}

                {proyectos.length === 0 && (
                    <div className="col-span-full py-20 text-center bg-white rounded-3xl border-2 border-dashed border-slate-100">
                        <p className="text-slate-400 font-medium font-mono">No se encontraron proyectos para esta cuenta.</p>
                    </div>
                )}
            </div>

            {/* --- MODAL DE REGISTRO / EDICIÓN --- */}
            {showModal && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4 z-[999] animate-in fade-in duration-300">
                    <Card className="p-8 w-full max-w-md shadow-2xl border-none ring-1 ring-white/20">
                        <h3 className="text-2xl font-black text-slate-800 mb-2 uppercase tracking-tight">
                            {isEditing ? 'Actualizar Registro' : 'Nuevo Proyecto'}
                        </h3>
                        <p className="text-slate-500 text-xs mb-8 uppercase font-bold tracking-widest italic">{currentEmpresa.nombre}</p>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Nombre Comercial</label>
                                <input
                                    required
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-300 outline-none transition-all"
                                    value={formData.nombre}
                                    onChange={e => setFormData({ ...formData, nombre: e.target.value })}
                                    placeholder="Eje: Edificio Aurora"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Estado Operativo</label>
                                    <select
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm outline-none"
                                        value={formData.estado}
                                        onChange={e => setFormData({ ...formData, estado: e.target.value })}
                                    >
                                        <option value="Activo">Activo ✅</option>
                                        <option value="Pausado">Pausado ⏳</option>
                                        <option value="Cerrado">Cerrado 🏁</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Líder de Proyecto</label>
                                    <input
                                        required
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm outline-none focus:ring-4 focus:ring-indigo-100"
                                        value={formData.responsable}
                                        onChange={e => setFormData({ ...formData, responsable: e.target.value })}
                                        placeholder="Ej: Laura"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Ticket Promedio (USD)</label>
                                <input
                                    required
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm outline-none focus:ring-4 focus:ring-indigo-100"
                                    value={formData.ticket}
                                    onChange={e => setFormData({ ...formData, ticket: e.target.value })}
                                    placeholder="Ej: $150,000"
                                />
                            </div>

                            <div className="flex justify-end gap-3 mt-8">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-6 py-3 text-xs font-black text-slate-500 hover:bg-slate-100 rounded-2xl transition-all"
                                >
                                    CANCELAR
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-2xl text-xs font-black shadow-lg shadow-indigo-600/20 active:scale-95 transition-all disabled:opacity-50"
                                >
                                    {loading ? 'SINCRONIZANDO...' : isEditing ? 'GUARDAR CAMBIOS' : 'REGISTRAR'}
                                </button>
                            </div>
                        </form>
                    </Card>
                </div>
            )}
        </div>
    );
}
import { FolderKanban } from 'lucide-react';
