"use client";

import React, { useState, useEffect } from 'react';
import ProyectosView from '@/components/ProyectosView';
import PlannerView from '@/components/PlannerView';
import MetricasView from '@/components/MetricasView';
import IdentidadView from '@/components/IdentidadView';
import {
  LayoutDashboard,
  Building2,
  Fingerprint,
  FolderKanban,
  Megaphone,
  BarChart3,
  CalendarDays,
  TrendingUp,
  Plus,
  Search,
  Bell,
  UserCircle,
  ChevronRight,
  MoreVertical,
  PlayCircle,
  CheckCircle2,
  Clock
} from 'lucide-react';

const Target = ({ size }: { size: number }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>;

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

const DashboardView = ({ currentEmpresa, mockData }: any) => (
  <div className="space-y-6">
    <div className="flex justify-between items-end">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Dashboard General</h2>
        <p className="text-slate-500 text-sm mt-1">Resumen de operaciones para {currentEmpresa.nombre}</p>
      </div>
      <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
        <Plus size={16} /> Nuevo Proyecto
      </button>
    </div>

    {/* KPIs Rápidos */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {[
        { title: 'Leads Captados', value: mockData.metricasGenerales.leads, trend: '+12%', icon: UserCircle, color: 'text-blue-600' },
        { title: 'CPL Promedio', value: mockData.metricasGenerales.cplPromedio, trend: '-5%', icon: Target, color: 'text-emerald-600' },
        { title: 'ROI Global', value: mockData.metricasGenerales.roi, trend: '+24%', icon: TrendingUp, color: 'text-indigo-600' },
        { title: 'Inversión Activa', value: mockData.metricasGenerales.inversion, trend: '+2%', icon: BarChart3, color: 'text-amber-600' },
      ].map((kpi, i) => (
        <Card key={i} className="p-5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-500 text-sm font-medium">{kpi.title}</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">{kpi.value}</h3>
            </div>
            <div className={`p-2 rounded-lg bg-slate-50 ${kpi.color}`}>
              <kpi.icon size={20} />
            </div>
          </div>
          <div className="mt-4 text-xs font-medium text-emerald-600 flex items-center gap-1">
            {kpi.trend} <span className="text-slate-400 font-normal">vs mes anterior</span>
          </div>
        </Card>
      ))}
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Proyectos Activos */}
      <Card className="col-span-2 p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-slate-800">Proyectos Activos</h3>
          <button className="text-indigo-600 text-sm font-medium hover:underline">Ver todos</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 text-sm">
                <th className="pb-3 font-medium">Nombre del Proyecto</th>
                <th className="pb-3 font-medium">Estado</th>
                <th className="pb-3 font-medium">Responsable</th>
                <th className="pb-3 font-medium">Ticket</th>
              </tr>
            </thead>
            <tbody>
              {mockData.proyectos.filter((p: any) => p.empresaId === currentEmpresa.id).map((p: any, i: number) => (
                <tr key={i} className="border-b border-slate-100 last:border-0">
                  <td className="py-3 text-sm font-medium text-slate-800">{p.nombre}</td>
                  <td className="py-3">
                    <Badge type={p.estado === 'En curso' ? 'info' : p.estado === 'Activo' ? 'success' : 'warning'}>
                      {p.estado}
                    </Badge>
                  </td>
                  <td className="py-3 text-sm text-slate-600">{p.responsable}</td>
                  <td className="py-3 text-sm font-medium text-slate-800">{p.ticket}</td>
                </tr>
              ))}
              {mockData.proyectos.filter((p: any) => p.empresaId === currentEmpresa.id).length === 0 && (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-sm text-slate-500">No hay proyectos activos para esta empresa.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Planner Semanal Mini */}
      <Card className="p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-slate-800">Planner Semanal</h3>
        </div>
        <div className="space-y-4">
          {mockData.planner.map((tarea: any, i: number) => (
            <div key={i} className="flex gap-3 items-start border-l-2 border-indigo-500 pl-3">
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-800">{tarea.contenido}</p>
                <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                  <span className="flex items-center gap-1"><Clock size={12} /> {tarea.publicacion}</span>
                  <span>•</span>
                  <span>{tarea.formato}</span>
                </div>
              </div>
            </div>
          ))}
          {mockData.planner.length === 0 && (
            <p className="text-sm text-slate-500">No hay tareas esta semana.</p>
          )}
        </div>
      </Card>
    </div>
  </div>
);

// IdentidadView moved to @/components/IdentidadView

const EstrategiaView = ({ mockData }: any) => {
  const campaña = mockData.estrategia[0];

  if (!campaña) return <div className="p-8 text-slate-500">No hay estrategias configuradas.</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Estrategia Meta Ads</h2>
          <p className="text-slate-500 text-sm mt-1">Estructura publicitaria jerárquica</p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
          <Plus size={16} /> Nueva Campaña
        </button>
      </div>

      {/* Árbol de Meta Ads Simulado */}
      <Card className="p-0 overflow-hidden">
        {/* Nivel 1: Campaña */}
        <div className="bg-slate-50 p-5 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
              <Megaphone size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400 uppercase">Campaña</span>
                <Badge type="success">{campaña.objetivo}</Badge>
              </div>
              <h3 className="text-lg font-bold text-slate-800">{campaña.nombre}</h3>
            </div>
          </div>
        </div>

        {/* Nivel 2: Conjuntos */}
        <div className="p-5 pl-12 bg-white border-b border-slate-200">
          {campaña.conjuntos.map((conjunto: any, idx: number) => (
            <div key={idx} className="relative">
              {/* Línea conectora visual */}
              <div className="absolute -left-6 top-0 bottom-0 w-px bg-slate-200"></div>

              <div className="relative">
                <div className="absolute -left-6 top-4 w-4 h-px bg-slate-200"></div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs font-bold text-slate-400 uppercase">Conjunto de Anuncios</span>
                  <h4 className="text-md font-bold text-slate-700">{conjunto.nombre}</h4>
                </div>

                {/* Nivel 3: Anuncios */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-4">
                  {conjunto.anuncios.map((ad: any, i: number) => (
                    <div key={i} className="border border-slate-200 rounded-lg p-4 hover:border-indigo-300 transition-colors bg-slate-50/50">
                      <div className="flex justify-between items-start mb-3">
                        <h5 className="font-bold text-sm text-slate-800">{ad.nombre}</h5>
                        <Badge type="default">{ad.formato}</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                        <div className="bg-white border border-slate-100 p-2 rounded">
                          <span className="block text-slate-400 mb-1">Metodología</span>
                          <span className="font-medium text-slate-700">{ad.metodologia}</span>
                        </div>
                        <div className="bg-white border border-slate-100 p-2 rounded">
                          <span className="block text-slate-400 mb-1">Contenido</span>
                          <span className="font-medium text-slate-700">{ad.contenido}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between border-t border-slate-200 pt-3 mt-2">
                        <span className="text-xs text-slate-500">CPL Actual: <strong className="text-slate-800">{ad.cpl}</strong></span>
                        <button className="text-indigo-600 text-xs font-medium hover:underline">Ver Guion</button>
                      </div>
                    </div>
                  ))}

                  {/* Botón agregar anuncio */}
                  <button className="border-2 border-dashed border-slate-200 rounded-lg p-4 flex flex-col items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-300 transition-colors min-h-[140px]">
                    <Plus size={24} className="mb-2" />
                    <span className="text-sm font-medium">Agregar Anuncio</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};


export default function Page() {
  const [activeModule, setActiveModule] = useState('dashboard');
  const [currentEmpresaId, setCurrentEmpresaId] = useState<string | null>(null);
  const [mockData, setMockData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Cargar datos
  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/data');
      if (res.ok) {
        const data = await res.json();
        setMockData(data);
        if (data.empresas && data.empresas.length > 0) {
          setCurrentEmpresaId(data.empresas[0].id);
        }
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const seedDatabase = async () => {
    try {
      setLoading(true);
      await fetch('/api/seed', { method: 'POST' });
      await loadData();
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  if (loading) return <div className="p-8 flex items-center justify-center h-screen"><p className="text-slate-500 font-medium">Cargando base de datos...</p></div>;

  if (!mockData || mockData.empresas.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 text-center max-w-md">
          <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-emerald-500 mb-2">Base de datos vacía</h2>
          <p className="text-slate-500 text-sm mb-6">No hay datos en MongoDB. Haz clic en el botón para inicializar con los datos de prueba.</p>
          <button onClick={seedDatabase} className="bg-indigo-600 text-white font-medium px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition">
            Inicializar Base de Datos (Seed)
          </button>
        </div>
      </div>
    );
  }

  const currentEmpresa = mockData.empresas.find((e: any) => e.id === currentEmpresaId) || mockData.empresas[0];

  const modules = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'identidad', name: 'Identidad de Marca', icon: Fingerprint },
    { id: 'proyectos', name: 'Proyectos', icon: FolderKanban },
    { id: 'estrategia', name: 'Estrategia (Meta Ads)', icon: Megaphone },
    { id: 'planner', name: 'Planner Contenidos', icon: CalendarDays },
    { id: 'metricas', name: 'Métricas & Resultados', icon: BarChart3 },
  ];

  const renderModule = () => {
    switch (activeModule) {
      case 'dashboard': return <DashboardView currentEmpresa={currentEmpresa} mockData={mockData} />;
      case 'identidad': return <IdentidadView currentEmpresa={currentEmpresa} mockData={mockData} refreshData={loadData} />;
      case 'estrategia': return <EstrategiaView currentEmpresa={currentEmpresa} mockData={mockData} refreshData={loadData} />;
      case 'proyectos': return <ProyectosView currentEmpresa={currentEmpresa} mockData={mockData} refreshData={loadData} />;
      case 'planner': return <PlannerView mockData={mockData} refreshData={loadData} />;
      case 'metricas': return <MetricasView mockData={mockData} />;
      default: return <DashboardView currentEmpresa={currentEmpresa} mockData={mockData} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden text-slate-900">

      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col transition-all duration-300">
        <div className="p-6">
          <h1 className="text-white text-xl font-bold flex items-center gap-2 tracking-tight">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-sm">G</div>
            GrowthSystem
          </h1>
          <p className="text-slate-500 text-xs mt-1 font-medium tracking-wider">MULTIVELA STUDIO</p>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 mt-4 px-2">Módulos Principales</div>
          {modules.map((mod) => {
            const Icon = mod.icon;
            const isActive = activeModule === mod.id;
            return (
              <button
                key={mod.id}
                onClick={() => setActiveModule(mod.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive
                  ? 'bg-indigo-600 text-white'
                  : 'hover:bg-slate-800 hover:text-white'
                  }`}
              >
                <Icon size={18} className={isActive ? 'text-indigo-200' : 'text-slate-400'} />
                {mod.name}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button className="flex items-center gap-3 w-full hover:bg-slate-800 p-2 rounded-lg transition-colors">
            <UserCircle size={24} className="text-slate-400" />
            <div className="text-left flex-1">
              <p className="text-sm font-medium text-white">Johan Planner</p>
              <p className="text-xs text-slate-500">Admin</p>
            </div>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* TOP NAVBAR */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold text-slate-500">Viendo datos de:</span>
            <div className="flex bg-slate-100 p-1 rounded-lg">
              {mockData.empresas.map((emp: any) => (
                <button
                  key={emp.id}
                  onClick={() => setCurrentEmpresaId(emp.id)}
                  className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${currentEmpresaId === emp.id
                    ? 'bg-white text-slate-800 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                    }`}
                >
                  {emp.nombre}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4 text-slate-500">
            <button className="hover:text-slate-800 transition-colors"><Search size={20} /></button>
            <button className="hover:text-slate-800 transition-colors relative">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
          </div>
        </header>

        {/* SCROLLABLE VIEW PORT */}
        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-6xl mx-auto">
            {renderModule()}
          </div>
        </div>

      </main>
    </div>
  );
}
