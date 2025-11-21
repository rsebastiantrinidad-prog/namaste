"use client";
import React, { useState } from 'react';
import { 
  LayoutDashboard, ShoppingBag, ChefHat, Package, 
  TrendingUp, AlertCircle, Activity, Menu, X, 
  ArrowRight, Sparkles, Timer, Utensils
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// --- UTILS ---
function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }

// --- CONFIGURACIÓN VISUAL ---
const BG_IMAGE = "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=2072&auto=format&fit=crop";
const SANDWICH_HERO = "https://images.unsplash.com/photo-1554433607-66b5efe9d304?q=80&w=1000&auto=format&fit=crop";

// --- MOCK DATA (SOLO DASHBOARD) ---
const kpis = {
  ventas: 185000,
  produccion: 85 // % del objetivo
};

const activeOrders = [
  { id: 1, client: "Confitería Las Delicias", items: "20 Doc. J&Q", status: "cooking" },
  { id: 2, client: "Shell Norte", items: "15 Doc. Pebetes", status: "pending" },
  { id: 3, client: "Juan Pérez", items: "2 Doc. Surtidas", status: "pending" },
];

const stockAlerts = [
  { item: "Jamón Cocido", level: 15 },
  { item: "Queso Danbo", level: 25 },
];

// --- COMPONENTE PRINCIPAL ---
export default function SandwichAppModular() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [menuOpen, setMenuOpen] = useState(false);

  // Lógica para renderizar el módulo correcto
  const renderModule = () => {
    switch(activeTab) {
      case 'dashboard': return <DashboardModule />;
      case 'pedidos': return <PlaceholderModule title="Módulo de Pedidos" icon={<ShoppingBag size={40}/>} />;
      case 'produccion': return <PlaceholderModule title="Módulo de Cocina" icon={<ChefHat size={40}/>} />;
      case 'stock': return <PlaceholderModule title="Módulo de Stock" icon={<Package size={40}/>} />;
      default: return <DashboardModule />;
    }
  };

  return (
    <div className="relative flex h-screen w-full overflow-hidden bg-zinc-950 text-zinc-100 font-sans">
      
      {/* FONDO GLOBAL */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-zinc-950/90 z-10" />
        <div 
          className="absolute inset-0 z-0 opacity-40 blur-[2px] scale-105 grayscale"
          style={{ backgroundImage: `url(${BG_IMAGE})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        />
      </div>

      {/* SIDEBAR DE NAVEGACIÓN */}
      <aside className={cn(
        "fixed left-4 top-4 bottom-4 w-20 z-30 flex flex-col items-center py-8 rounded-3xl backdrop-blur-xl border border-white/5 bg-black/40 shadow-2xl transition-all duration-500",
        menuOpen ? "translate-x-0" : "-translate-x-[150%] md:translate-x-0"
      )}>
        <div className="mb-10 p-3 bg-orange-500/20 rounded-2xl border border-orange-500/20">
           <Activity className="text-orange-400" size={24} />
        </div>

        <nav className="flex-1 flex flex-col gap-6 w-full px-2">
          <NavIcon active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={<LayoutDashboard />} label="Tablero" />
          <NavIcon active={activeTab === 'pedidos'} onClick={() => setActiveTab('pedidos')} icon={<ShoppingBag />} label="Pedidos" />
          <NavIcon active={activeTab === 'produccion'} onClick={() => setActiveTab('produccion')} icon={<Utensils />} label="Cocina" />
          <NavIcon active={activeTab === 'stock'} onClick={() => setActiveTab('stock')} icon={<Package />} label="Stock" />
        </nav>

        <div className="mt-auto">
          <div className="h-10 w-10 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center font-bold text-xs">AD</div>
        </div>
      </aside>

      {/* ÁREA PRINCIPAL */}
      <main className="relative z-20 flex-1 ml-0 md:ml-28 p-4 md:p-8 overflow-y-auto">
        {/* Header Móvil */}
        <div className="md:hidden flex justify-between items-center mb-6">
          <h1 className="text-lg font-bold text-white">NEXUS<span className="text-orange-500">FOOD</span></h1>
          <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 text-zinc-300"><Menu /></button>
        </div>

        {/* Transición suave entre módulos */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            {renderModule()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

// --- MÓDULO 1: DASHBOARD (TABLERO) ---
function DashboardModule() {
  return (
    <div className="space-y-8">
      {/* Header del Módulo */}
      <header className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <p className="text-orange-400 font-medium text-xs uppercase mb-2 tracking-wider">Resumen Ejecutivo</p>
          <h1 className="text-4xl md:text-5xl font-light text-white leading-none">
            Visión <span className="font-bold">Global</span>
          </h1>
        </div>
        <div className="text-right hidden md:block">
          <p className="text-2xl font-light text-white">08:42 <span className="text-sm font-bold text-zinc-500">AM</span></p>
        </div>
      </header>

      {/* Estructura de Islas */}
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* COLUMNA IZQUIERDA (60%) */}
        <div className="flex-1 space-y-6">
          
          {/* Tarjeta Principal: Producción */}
          <GlassCard className="relative overflow-hidden min-h-[280px] flex flex-col justify-center p-8 group">
            <div className="absolute right-0 top-0 w-1/2 h-full">
              <div className="absolute inset-0 bg-gradient-to-l from-transparent to-zinc-950/90 z-10" />
              <img src={SANDWICH_HERO} alt="Sandwich" className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700" />
            </div>
            
            <div className="relative z-20 max-w-[60%]">
              <span className="px-3 py-1 rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-400 text-xs font-bold uppercase mb-4 inline-block">
                En Curso
              </span>
              <h2 className="text-3xl font-bold text-white mb-2">Producción Mañana</h2>
              <p className="text-zinc-400 text-sm mb-6">Lote #402 (Jamón y Queso). Ritmo óptimo detectado.</p>
              
              <div className="flex items-end gap-4">
                <div>
                  <span className="text-5xl font-light text-white">{kpis.produccion}%</span>
                  <span className="text-xs text-zinc-500 block uppercase mt-1">Completado</span>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Lista Rápida de Pedidos */}
          <div className="space-y-3">
             <h3 className="text-zinc-500 text-xs font-bold uppercase tracking-widest ml-1">Cola de Pedidos (Live)</h3>
             {activeOrders.map((order, i) => (
               <GlassCard key={i} className="flex items-center justify-between p-4 hover:bg-white/5 border-l-2 border-l-transparent hover:border-l-orange-500 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-500 text-sm font-bold">{order.id}</div>
                    <div>
                      <h4 className="text-white font-medium text-sm">{order.client}</h4>
                      <p className="text-xs text-zinc-500">{order.items}</p>
                    </div>
                  </div>
                  <span className={cn("text-[10px] font-bold px-2 py-1 rounded", 
                    order.status === 'cooking' ? "text-orange-400 bg-orange-400/10" : "text-zinc-500 bg-zinc-900"
                  )}>
                    {order.status === 'cooking' ? 'COCINANDO' : 'ESPERA'}
                  </span>
               </GlassCard>
             ))}
          </div>
        </div>

        {/* COLUMNA DERECHA (40%) */}
        <div className="lg:w-[380px] space-y-6">
          {/* KPI Ventas */}
          <GlassCard className="p-6 border-t border-white/10 bg-gradient-to-br from-zinc-900 to-black">
             <div className="flex justify-between mb-8">
               <div className="p-2 bg-zinc-800 rounded-lg"><TrendingUp size={18} className="text-white"/></div>
             </div>
             <div>
               <p className="text-zinc-500 text-xs font-medium uppercase">Ventas Hoy</p>
               <h3 className="text-4xl font-light text-white mt-1 flex items-start">
                 <span className="text-lg mt-1 mr-1">$</span>{kpis.ventas.toLocaleString()}
               </h3>
             </div>
          </GlassCard>

          {/* Alertas Stock */}
          <GlassCard className="p-6">
            <h3 className="text-white font-medium mb-4 flex items-center gap-2 text-sm">
              <AlertCircle size={16} className="text-red-400"/> Alertas de Stock
            </h3>
            <div className="space-y-4">
              {stockAlerts.map((alert, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-300">{alert.item}</span>
                    <span className="text-red-400 font-bold">{alert.level}%</span>
                  </div>
                  <div className="w-full bg-zinc-800 h-1 rounded-full">
                    <div className="bg-red-500 h-1 rounded-full" style={{width: `${alert.level}%`}}></div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}

// --- COMPONENTE PLACEHOLDER (Para módulos futuros) ---
function PlaceholderModule({ title, icon }: { title: string, icon: React.ReactNode }) {
  return (
    <div className="h-[60vh] flex flex-col items-center justify-center text-zinc-500 space-y-4 border-2 border-dashed border-zinc-800 rounded-3xl">
      <div className="p-6 bg-zinc-900 rounded-full opacity-50">{icon}</div>
      <h2 className="text-xl font-medium text-zinc-400">{title}</h2>
      <p className="text-sm">Seleccionaste este módulo. Trabajaremos aquí en el siguiente paso.</p>
    </div>
  );
}

// --- COMPONENTES UI BASE ---
function GlassCard({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={cn("backdrop-blur-md bg-zinc-900/60 border border-white/5 shadow-xl rounded-3xl", className)}>
      {children}
    </div>
  );
}

function NavIcon({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "group relative w-12 h-12 flex items-center justify-center rounded-2xl transition-all duration-300",
        active ? "bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.2)]" : "text-zinc-500 hover:text-white hover:bg-white/10"
      )}
    >
      <div className="absolute left-14 bg-white text-black text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-lg">
        {label}
      </div>
      {React.cloneElement(icon as React.ReactElement, { size: 20 })}
    </button>
  );
}