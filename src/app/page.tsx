/**
 * ARCHIVO PRINCIPAL: Page.tsx (Layout V3)
 * Centro de control del Sisterma Inmobiliario V3 (Growth).
 */

"use client";

import React, { useState, useEffect } from 'react';
import ProyectosView from '@/components/ProyectosView';
import PlannerView from '@/components/PlannerView';
import MetricasView from '@/components/MetricasView';
import IdentidadView from '@/components/IdentidadView';
import EstrategiaView from '@/components/EstrategiaView';
import DashboardView from '@/components/DashboardView';
import IAView from '@/components/IAView'; // NUEVO MÓDULO IA
import {
  LayoutDashboard,
  Fingerprint,
  FolderKanban,
  Megaphone,
  CalendarDays,
  BarChart3,
  Search,
  Bell,
  UserCircle,
  Menu,
  X,
  Building2,
  BrainCircuit
} from 'lucide-react';

export default function Page() {
  // --- ESTADOS DE LA APLICACIÓN ---
  const [activeModule, setActiveModule] = useState('dashboard');
  const [currentEmpresaId, setCurrentEmpresaId] = useState<string | null>(null);
  const [mockData, setMockData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // --- FUNCIÓN PARA CARGAR DATOS ---
  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/data');
      if (res.ok) {
        const data = await res.json();
        setMockData(data);
        if (data.empresas && data.empresas.length > 0 && !currentEmpresaId) {
          setCurrentEmpresaId(data.empresas[0].id);
        }
      }
    } catch (e) {
      console.error("Error cargando datos:", e);
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
      console.error("Error en seed:", e);
    }
    setLoading(false);
  };

  if (loading) return <div className="p-8 flex items-center justify-center h-screen"><p className="text-slate-500 font-medium italic animate-pulse">Iniciando Motor Growth...</p></div>;

  if (!mockData || !mockData.empresas || mockData.empresas.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 text-center max-w-md">
          <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-500 to-indigo-500 mb-2">Base de datos vacía</h2>
          <p className="text-slate-500 text-sm mb-6">No hay datos en MongoDB. Haz clic en el botón para inicializar con los esquemas V3 de Fortress y Crescendo.</p>
          <button onClick={seedDatabase} className="bg-violet-600 text-white font-medium px-5 py-2.5 rounded-lg hover:bg-violet-700 transition shadow-lg shadow-violet-500/30">
            Inicializar Jerarquía V3
          </button>
        </div>
      </div>
    );
  }

  const currentEmpresa = mockData.empresas.find((e: any) => e.id === currentEmpresaId) || mockData.empresas[0];

  const modules = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'identidad', name: 'Identidad corporativa', icon: Fingerprint },
    { id: 'proyectos', name: 'Proyectos & Marcas', icon: FolderKanban },
    { id: 'estrategia', name: 'Central de Campañas', icon: Megaphone },
    { id: 'planner', name: 'Calendario Mixto', icon: CalendarDays },
    { id: 'ia', name: 'Motor IA', icon: BrainCircuit },
    { id: 'metricas', name: 'Panel Analítico', icon: BarChart3 },
  ];

  const renderModule = () => {
    switch (activeModule) {
      case 'dashboard': return <DashboardView currentEmpresa={currentEmpresa} mockData={mockData} onNavigate={setActiveModule} />;
      case 'identidad': return <IdentidadView currentEmpresa={currentEmpresa} mockData={mockData} refreshData={loadData} />;
      case 'estrategia': return <EstrategiaView currentEmpresa={currentEmpresa} mockData={mockData} refreshData={loadData} />;
      case 'proyectos': return <ProyectosView currentEmpresa={currentEmpresa} mockData={mockData} refreshData={loadData} />;
      case 'planner': return <PlannerView mockData={mockData} refreshData={loadData} />;
      case 'ia': return <IAView currentEmpresa={currentEmpresa} />;
      case 'metricas': return <MetricasView mockData={mockData} />;
      default: return <DashboardView currentEmpresa={currentEmpresa} mockData={mockData} onNavigate={setActiveModule} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden text-slate-900">

      {/* --- MENU LATERAL (SIDEBAR) --- */}
      {/* Overlay para móviles */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[40] lg:hidden transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-[50] w-64 bg-slate-900 text-slate-300 flex flex-col transition-transform duration-300 ease-in-out transform
        lg:translate-x-0 lg:static lg:inset-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>

        {/* LOGO Y BRANDING */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between lg:block">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-500 to-indigo-500 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-violet-500/20 shrink-0">
              M
            </div>
            <div>
              {/* BRANDING: Sistema CVV */}
              <h1 className="text-white text-lg font-bold tracking-tight leading-none bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">Growth System</h1>
              <span className="text-[10px] text-violet-400 font-bold uppercase tracking-[0.2em]">Crescendo / Fortress</span>
            </div>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 text-slate-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        {/* --- SELECTOR DE EMPRESA MÓVIL --- */}
        <div className="px-6 py-4 border-b border-white/5 lg:hidden bg-slate-950/30">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
            <Building2 size={12} /> Empresa en Gestión
          </p>
          <div className="flex flex-col gap-2">
            {mockData.empresas.map((emp: any) => (
              <button
                key={emp.id}
                onClick={() => {
                  setCurrentEmpresaId(emp.id);
                  // Opcional: Cerrar sidebar al cambiar? 
                  // No lo cerramos para que vea el cambio de contexto si quiere
                }}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold transition-all ${currentEmpresaId === emp.id
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-800/50 text-slate-400 hover:text-white'
                  }`}
              >
                {emp.nombre}
                {currentEmpresaId === emp.id && <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
              </button>
            ))}
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto pt-6">
          <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-4 px-2">Ecosistema Principal</div>
          {modules.map((mod) => {
            const Icon = mod.icon;
            const isActive = activeModule === mod.id;
            return (
              <button
                key={mod.id}
                onClick={() => {
                  setActiveModule(mod.id);
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all transform active:scale-95 ${isActive
                  ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/20 shadow-[-4px_0_0_0_#fff]'
                  : 'hover:bg-slate-800 hover:text-white'
                  }`}
              >
                <Icon size={18} className={isActive ? 'text-violet-200' : 'text-slate-400'} />
                <span className={isActive ? 'font-bold tracking-tight text-white' : ''}>{mod.name}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800 bg-slate-950/50">
          <button className="flex items-center gap-3 w-full hover:bg-slate-800 p-2 rounded-lg transition-colors group">
            <div className="relative">
              <UserCircle size={28} className="text-slate-400" />
            </div>
            <div className="text-left flex-1 min-w-0">
              {/* BRANDING: nombre del usuario */}
              <p className="text-sm font-bold text-white truncate">Caren Vargas</p>
              <p className="text-[10px] text-slate-500 uppercase font-black">Super Admin</p>
            </div>
          </button>
        </div>
      </aside>

      {/* --- CONTENIDO PRINCIPAL --- */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#fbfbfe]">

        {/* BARRA SUPERIOR (NAVBAR) */}
        <header className="h-16 lg:h-20 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 flex items-center justify-between px-4 lg:px-8 shrink-0 shadow-[0_4px_20px_-15px_rgba(0,0,0,0.05)] z-30">

          <div className="flex items-center gap-4 lg:gap-6">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 bg-slate-100 text-slate-600 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition-all"
            >
              <Menu size={20} />
            </button>

            <div className="hidden sm:block">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Empresa en Gestión</p>
              <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
                {mockData.empresas.map((emp: any) => (
                  <button
                    key={emp.id}
                    onClick={() => setCurrentEmpresaId(emp.id)}
                    className={`px-3 lg:px-5 py-1.5 text-[10px] lg:text-xs font-bold rounded-lg transition-all ${currentEmpresaId === emp.id
                      ? 'bg-white text-indigo-600 shadow-sm'
                      : 'text-slate-500 hover:text-slate-800'
                      }`}
                  >
                    {emp.nombre}
                  </button>
                ))}
              </div>
            </div>

            <div className="sm:hidden font-black text-indigo-600 text-xs uppercase tracking-tighter truncate max-w-[120px]">
              {currentEmpresa.nombre}
            </div>
          </div>

          <div className="flex items-center gap-2 lg:gap-5 text-slate-400">
            <div className="hidden md:flex items-center bg-slate-50 border border-slate-100 rounded-full px-4 py-2 group focus-within:border-violet-300 transition-all focus-within:ring-4 focus-within:ring-violet-50">
              <Search size={16} className="group-focus-within:text-violet-500" />
              <input placeholder="Buscar proyectos, fechas..." className="bg-transparent border-none outline-none text-xs px-2 w-24 lg:w-48 text-slate-700" />
            </div>
            <button className="hover:text-amber-500 transition-colors relative p-2 bg-slate-50 rounded-full">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white animate-bounce"></span>
            </button>
          </div>
        </header>

        {/* ÁREA DE TRABAJO SCROLLABLE */}
        <div className="flex-1 overflow-auto p-4 lg:p-8">
          <div className="max-w-7xl mx-auto pb-12">
            {renderModule()}
          </div>
        </div>

      </main>
    </div>
  );
}
