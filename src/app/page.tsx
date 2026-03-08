"use client";

import React, { useState, useEffect } from 'react';
import ProyectosView from '@/components/ProyectosView';
import PlannerView from '@/components/PlannerView';
import MetricasView from '@/components/MetricasView';
import IdentidadView from '@/components/IdentidadView';
import EstrategiaView from '@/components/EstrategiaView';
import DashboardView from '@/components/DashboardView';
import {
  LayoutDashboard,
  Fingerprint,
  FolderKanban,
  Megaphone,
  CalendarDays,
  BarChart3,
  Search,
  Bell,
  UserCircle
} from 'lucide-react';



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
      case 'dashboard': return <DashboardView currentEmpresa={currentEmpresa} mockData={mockData} onNavigate={setActiveModule} />;
      case 'identidad': return <IdentidadView currentEmpresa={currentEmpresa} mockData={mockData} refreshData={loadData} />;
      case 'estrategia': return <EstrategiaView currentEmpresa={currentEmpresa} mockData={mockData} refreshData={loadData} />;
      case 'proyectos': return <ProyectosView currentEmpresa={currentEmpresa} mockData={mockData} refreshData={loadData} />;
      case 'planner': return <PlannerView mockData={mockData} refreshData={loadData} />;
      case 'metricas': return <MetricasView mockData={mockData} />;
      default: return <DashboardView currentEmpresa={currentEmpresa} mockData={mockData} onNavigate={setActiveModule} />;
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
