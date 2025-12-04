"use client";
import React, { useState } from 'react';
import { 
  LayoutDashboard, ShoppingBag, ChefHat, Package, 
  TrendingUp, AlertCircle, Activity, Menu, X, 
  Search, Filter, Plus, MessageCircle, Globe, Check, Trash2, Clock, ArrowRight, Utensils
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// --- UTILS ---
function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }

// --- CONFIGURACIÓN VISUAL ---
const BG_IMAGE = "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=2072&auto=format&fit=crop";
const SANDWICH_HERO = "https://images.unsplash.com/photo-1554433607-66b5efe9d304?q=80&w=1000&auto=format&fit=crop";

// --- MOCK DATA GLOBAL ---
const kpis = { ventas: 185000, produccion: 85 };
const stockAlerts = [{ item: "Jamón Cocido", level: 15 }, { item: "Queso Danbo", level: 25 }];

// --- MOCK DATA PEDIDOS ---
const initialOrders = [
  { id: 101, client: "Maxikiosco El Sol", type: "Mayorista", source: "whatsapp", items: ["10 Doc. Jamón y Queso", "5 Doc. Surtidas"], total: 45000, time: "08:15", status: "pending" },
  { id: 102, client: "Juan Pérez", type: "Particular", source: "web", items: ["1 Doc. Pan Árabe Primavera"], total: 5500, time: "08:20", status: "pending" },
  { id: 103, client: "Estación Shell Norte", type: "Mayorista", source: "whatsapp", items: ["20 Doc. Pebetes", "10 Doc. Miga J&Q"], total: 82000, time: "08:35", status: "production" },
  { id: 104, client: "Buffet Club Central", type: "Mayorista", source: "whatsapp", items: ["15 Doc. Triples Surtidos"], total: 52000, time: "08:45", status: "pending" },
  { id: 105, client: "Ana María (Eventos)", type: "Particular", source: "manual", items: ["3 Doc. Miga Especial"], total: 18000, time: "09:00", status: "pending" },
];

// --- COMPONENTE PRINCIPAL ---
export default function SandwichApp() {
  const [activeTab, setActiveTab] = useState('pedidos'); 
  const [menuOpen, setMenuOpen] = useState(false);

  const renderModule = () => {
    switch(activeTab) {
      case 'dashboard': return <DashboardModule />;
      case 'pedidos': return <PedidosModule />;
      case 'produccion': return <PlaceholderModule title="Módulo de Cocina" icon={<ChefHat size={40}/>} />;
      case 'stock': return <PlaceholderModule title="Módulo de Stock" icon={<Package size={40}/>} />;
      default: return <DashboardModule />;
    }
  };

  return (
    <div className="relative flex h-screen w-full overflow-hidden bg-zinc-950 text-zinc-100 font-sans">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-zinc-950/90 z-10" />
        <div className="absolute inset-0 z-0 opacity-40 blur-[2px] scale-105 grayscale" style={{ backgroundImage: `url(${BG_IMAGE})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
      </div>

      <aside className={cn("fixed left-4 top-4 bottom-4 w-20 z-30 flex flex-col items-center py-8 rounded-3xl backdrop-blur-xl border border-white/5 bg-black/40 shadow-2xl transition-all duration-500", menuOpen ? "translate-x-0" : "-translate-x-[150%] md:translate-x-0")}>
        <div className="mb-10 p-3 bg-orange-500/20 rounded-2xl border border-orange-500/20"><Activity className="text-orange-400" size={24} /></div>
        <nav className="flex-1 flex flex-col gap-6 w-full px-2">
          <NavIcon active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={<LayoutDashboard />} label="Tablero" />
          <NavIcon active={activeTab === 'pedidos'} onClick={() => setActiveTab('pedidos')} icon={<ShoppingBag />} label="Pedidos" />
          <NavIcon active={activeTab === 'produccion'} onClick={() => setActiveTab('produccion')} icon={<Utensils />} label="Cocina" />
          <NavIcon active={activeTab === 'stock'} onClick={() => setActiveTab('stock')} icon={<Package />} label="Stock" />
        </nav>
        <div className="mt-auto"><div className="h-10 w-10 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center font-bold text-xs">AD</div></div>
      </aside>

      <main className="relative z-20 flex-1 ml-0 md:ml-28 p-4 md:p-8 overflow-y-auto">
        <div className="md:hidden flex justify-between items-center mb-6">
          <h1 className="text-lg font-bold text-white">NEXUS<span className="text-orange-500">FOOD</span></h1>
          <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 text-zinc-300"><Menu /></button>
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="h-full">
            {renderModule()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

// ==============================================
// MÓDULO 2: GESTIÓN DE PEDIDOS (ACTIVO)
// ==============================================
function PedidosModule() {
  const [orders, setOrders] = useState(initialOrders);
  const [filter, setFilter] = useState<'all' | 'pending' | 'production'>('all');

  const filteredOrders = orders.filter(o => filter === 'all' ? true : o.status === filter);

  const handleProcess = (id: number) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'production' } : o));
  };

  const handleDelete = (id: number) => {
    setOrders(prev => prev.filter(o => o.id !== id));
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-end gap-4 pb-4 border-b border-white/5">
        <div>
          <h1 className="text-3xl md:text-4xl font-light text-white">Buzón de <span className="font-bold text-orange-400">Pedidos</span></h1>
          <p className="text-zinc-500 text-sm mt-1 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"/> Sincronización con WhatsApp Business activa
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
            <input type="text" placeholder="Buscar cliente..." className="bg-zinc-900/50 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-orange-500/50 transition-all w-48 md:w-64 placeholder:text-zinc-600" />
          </div>
          <button className="bg-white text-black px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-zinc-200 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.1)]">
            <Plus size={16} /> Nuevo
          </button>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
        {[
          { id: 'all', label: 'Todos' },
          { id: 'pending', label: 'Pendientes', count: orders.filter(o => o.status === 'pending').length },
          { id: 'production', label: 'En Cocina', count: orders.filter(o => o.status === 'production').length },
        ].map((tab) => (
          <button 
            key={tab.id}
            onClick={() => setFilter(tab.id as any)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium border transition-all whitespace-nowrap flex items-center gap-2",
              filter === tab.id 
                ? "bg-orange-500/10 border-orange-500/30 text-orange-400" 
                : "bg-zinc-900/40 border-white/5 text-zinc-500 hover:bg-zinc-800"
            )}
          >
            {tab.label}
            {tab.count !== undefined && tab.count > 0 && (
              <span className="bg-zinc-800 text-zinc-300 text-[10px] px-1.5 py-0.5 rounded-md">{tab.count}</span>
            )}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto pb-20 pr-2">
        <AnimatePresence>
          {filteredOrders.map((order) => (
            <motion.div
              key={order.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <GlassCard className={cn(
                "p-0 overflow-hidden group border-l-4 transition-all hover:-translate-y-1",
                order.type === 'Mayorista' ? "border-l-purple-500" : "border-l-sky-500",
                order.status === 'production' && "opacity-70 grayscale-[0.5]"
              )}>
                <div className="p-5 pb-3 flex justify-between items-start">
                  <div className="flex gap-3">
                    <div className={cn(
                      "h-10 w-10 rounded-xl flex items-center justify-center border shadow-inner",
                      order.source === 'whatsapp' ? "bg-green-900/20 border-green-800/30 text-green-500" : 
                      order.source === 'web' ? "bg-blue-900/20 border-blue-800/30 text-blue-500" :
                      "bg-zinc-800 border-zinc-700 text-zinc-400"
                    )}>
                      {order.source === 'whatsapp' ? <MessageCircle size={18} /> : order.source === 'web' ? <Globe size={18} /> : <Plus size={18} />}
                    </div>
                    <div>
                      <h3 className="font-bold text-white leading-tight">{order.client}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={cn("text-[10px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded border", 
                           order.type === 'Mayorista' ? "bg-purple-500/10 border-purple-500/20 text-purple-400" : "bg-sky-500/10 border-sky-500/20 text-sky-400"
                        )}>
                          {order.type}
                        </span>
                        <span className="text-zinc-500 text-xs flex items-center gap-1"><Clock size={10}/> {order.time}</span>
                      </div>
                    </div>
                  </div>
                  {order.status === 'production' && (
                    <span className="text-[10px] font-bold bg-zinc-800 text-zinc-400 px-2 py-1 rounded-md border border-zinc-700 uppercase">
                      En cocina
                    </span>
                  )}
                </div>

                <div className="px-5 py-2 space-y-2">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="text-sm text-zinc-300 pb-2 border-b border-white/5 last:border-0 font-medium">
                      {item}
                    </div>
                  ))}
                </div>

                <div className="bg-black/20 p-4 flex items-center justify-between mt-2">
                  <div className="font-mono text-zinc-400 text-sm">
                    Total: <span className="text-white font-bold">${order.total.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex gap-2">
                    {order.status === 'pending' && (
                      <>
                        <button onClick={() => handleDelete(order.id)} className="p-2 rounded-lg text-zinc-500 hover:bg-red-500/10 hover:text-red-400 transition-colors">
                          <Trash2 size={18} />
                        </button>
                        <button 
                          onClick={() => handleProcess(order.id)}
                          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-black px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-[0_0_10px_rgba(249,115,22,0.3)]"
                        >
                          Procesar <ArrowRight size={16} />
                        </button>
                      </>
                    )}
                     {order.status === 'production' && (
                       <button disabled className="flex items-center gap-2 text-zinc-500 px-4 py-2 text-sm font-medium cursor-default">
                         <Utensils size={16} /> Produciendo...
                       </button>
                     )}
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {filteredOrders.length === 0 && (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-zinc-500 opacity-50">
             <Filter size={48} className="mb-4"/>
             <p>No hay pedidos con este estado.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// --- MÓDULO DASHBOARD (COMPLETO) ---
function DashboardModule() {
  const activeOrders = [{ id: 1, client: "Confitería Las Delicias", items: "20 Doc. J&Q", status: "cooking" }];
  return (
      <div className="space-y-8">
      <header className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <p className="text-orange-400 font-medium text-xs uppercase mb-2 tracking-wider">Resumen Ejecutivo</p>
          <h1 className="text-4xl md:text-5xl font-light text-white leading-none"><span className="font-bold">NAMASTÉ</span></h1>
        </div>
        <div className="text-right hidden md:block">
          <p className="text-2xl font-light text-white">08:42 <span className="text-sm font-bold text-zinc-500">AM</span></p>
        </div>
      </header>
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 space-y-6">
          <GlassCard className="relative overflow-hidden min-h-[280px] flex flex-col justify-center p-8 group">
            <div className="absolute right-0 top-0 w-1/2 h-full">
               <div className="absolute inset-0 bg-gradient-to-l from-transparent to-zinc-950/90 z-10" />
               <img src={SANDWICH_HERO} className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700" />
            </div>
            <div className="relative z-20 max-w-[60%]">
              <span className="px-3 py-1 rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-400 text-xs font-bold uppercase mb-4 inline-block">En Curso</span>
              <h2 className="text-3xl font-bold text-white mb-2">Producción Mañana</h2>
              <p className="text-zinc-400 text-sm mb-6">Lote #402 (Jamón y Queso). Ritmo óptimo detectado.</p>
              <div className="flex items-end gap-4">
                <div><span className="text-5xl font-light text-white">85%</span><span className="text-xs text-zinc-500 block uppercase mt-1">Completado</span></div>
              </div>
            </div>
          </GlassCard>
           <div className="space-y-3">
             <h3 className="text-zinc-500 text-xs font-bold uppercase tracking-widest ml-1">Cola de Pedidos (Live)</h3>
             {activeOrders.map((order, i) => (
               <GlassCard key={i} className="flex items-center justify-between p-4 hover:bg-white/5 border-l-2 border-l-transparent hover:border-l-orange-500 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-500 text-sm font-bold">{order.id}</div>
                    <div><h4 className="text-white font-medium text-sm">{order.client}</h4><p className="text-xs text-zinc-500">{order.items}</p></div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-1 rounded text-orange-400 bg-orange-400/10">COCINANDO</span>
               </GlassCard>
             ))}
          </div>
        </div>
        <div className="lg:w-[380px] space-y-6">
          <GlassCard className="p-6 bg-gradient-to-br from-zinc-900 to-black border-t border-white/10">
             <div className="flex justify-between mb-8"><div className="p-2 bg-zinc-800 rounded-lg"><TrendingUp size={18} className="text-white"/></div></div>
             <div><p className="text-zinc-500 text-xs font-medium uppercase">Ventas Hoy</p><h3 className="text-4xl font-light text-white mt-1 flex items-start"><span className="text-lg mt-1 mr-1">$</span>185,000</h3></div>
          </GlassCard>
          <GlassCard className="p-6">
            <h3 className="text-white font-medium mb-4 flex items-center gap-2 text-sm"><AlertCircle size={16} className="text-red-400"/> Alertas de Stock</h3>
            <div className="space-y-4">
              {[{ item: "Jamón Cocido", level: 15 }, { item: "Queso Danbo", level: 25 }].map((alert, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-xs"><span className="text-zinc-300">{alert.item}</span><span className="text-red-400 font-bold">{alert.level}%</span></div>
                  <div className="w-full bg-zinc-800 h-1 rounded-full"><div className="bg-red-500 h-1 rounded-full" style={{width: `${alert.level}%`}}></div></div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  )
}

// --- HELPERS ---
function PlaceholderModule({ title, icon }: { title: string, icon: React.ReactNode }) {
  return (
    <div className="h-[60vh] flex flex-col items-center justify-center text-zinc-500 space-y-4 border-2 border-dashed border-zinc-800 rounded-3xl">
      <div className="p-6 bg-zinc-900 rounded-full opacity-50">{icon}</div>
      <h2 className="text-xl font-medium text-zinc-400">{title}</h2>
    </div>
  );
}

function GlassCard({ children, className }: { children: React.ReactNode, className?: string }) {
  return <div className={cn("backdrop-blur-md bg-zinc-900/60 border border-white/5 shadow-xl rounded-3xl", className)}>{children}</div>;
}

function NavIcon({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button onClick={onClick} className={cn("group relative w-12 h-12 flex items-center justify-center rounded-2xl transition-all duration-300", active ? "bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.2)]" : "text-zinc-500 hover:text-white hover:bg-white/10")}>
      <div className="absolute left-14 bg-white text-black text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-lg">{label}</div>
      {/* CORRECCIÓN APLICADA AQUÍ ABAJO */}
      {React.cloneElement(icon as React.ReactElement<any>, { size: 20 })}
    </button>
  );
}
