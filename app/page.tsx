"use client";
import React, { useState } from 'react';
import { 
  LayoutDashboard, ShoppingBag, ChefHat, Package, 
  TrendingUp, AlertTriangle, Clock, Zap,
  ArrowUpRight, Quote, GitCommit, Layers
} from 'lucide-react';

// --- MOCK DATA ---
const resumenMetricas = {
  ventasDia: 185000,
  docenasVendidas: 42,
  mermaEstimada: "3.5%",
  pedidosPendientes: 5
};

const pedidosEntrantes = [
  { id: 1, cliente: "Maxikiosco El Sol", tipo: "Mayorista", origen: "Bot WhatsApp", items: "10 Doc. J&Q, 5 Doc. Surtido", estado: "Pendiente", hora: "06:45:32" },
  { id: 2, cliente: "Juan Pérez", tipo: "Particular", origen: "Web", items: "1 Doc. Pan Árabe", estado: "Confirmado", hora: "07:10:15" },
  { id: 3, cliente: "Estación YPF Centro", tipo: "Mayorista", origen: "Bot WhatsApp", items: "20 Doc. Miga J&Q", estado: "En Producción", hora: "07:15:00" },
  { id: 4, cliente: "Buffet Club Central", tipo: "Mayorista", origen: "Bot WhatsApp", items: "15 Doc. Pebete", estado: "Pendiente", hora: "07:30:45" },
];

const produccionConsolidada = [
  { variedad: "Miga Jamón y Queso", cantidad: 45, unidad: "Doc", estado: 80, priority: "high" },
  { variedad: "Pan Árabe Primavera", cantidad: 12, unidad: "Doc", estado: 30, priority: "medium" },
  { variedad: "Pebete Salamín y Queso", cantidad: 8, unidad: "Doc", estado: 5, priority: "low" },
];

const stockInsumos = [
  { insumo: "Jamón Cocido Premium", cantidad: "15 kg", estado: "Optimo", nivel: 80 },
  { insumo: "Queso Tybo Barra", cantidad: "4 kg", estado: "Crítico", nivel: 15 },
  { insumo: "Pan de Miga (Planchas)", cantidad: "50 paq", estado: "Medio", nivel: 45 },
  { insumo: "Mayonesa Industrial", cantidad: "10 lts", estado: "Optimo", nivel: 90 },
];

// --- LAYOUT PRINCIPAL ---
export default function SistemaSandwichesBento() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    // Fondo Negro con gradiente
    <div className="flex h-screen bg-zinc-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900 via-black to-black font-sans text-zinc-200 selection:bg-amber-500/30 selection:text-amber-900">
      
      {/* Sidebar Disruptivo */}
      <aside className="w-20 md:w-64 bg-black/50 backdrop-blur-xl border-r border-zinc-800 flex flex-col transition-all duration-300">
        <div className="p-6 flex items-center gap-2 md:gap-4">
          <div className="h-8 w-8 bg-gradient-to-br from-amber-300 to-amber-600 rounded-lg shadow-[0_0_15px_rgba(251,191,36,0.5)] flex items-center justify-center">
            <Zap size={18} className="text-black" fill="currentColor"/>
          </div>
          <h1 className="hidden md:block text-xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">
            NAMASTÉ<span className="text-zinc-500 font-thin">SANDWICHES</span>
          </h1>
        </div>
        
        <nav className="flex-1 px-2 md:px-4 space-y-3 mt-4">
          <NavButton active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={<LayoutDashboard />} label="Tablero de Mando" />
          <NavButton active={activeTab === 'pedidos'} onClick={() => setActiveTab('pedidos')} icon={<ShoppingBag />} label="Flujo de Pedidos" />
          <NavButton active={activeTab === 'produccion'} onClick={() => setActiveTab('produccion')} icon={<ChefHat />} label="Núcleo de Producción" />
          <NavButton active={activeTab === 'stock'} onClick={() => setActiveTab('stock')} icon={<Package />} label="Control de Activos" />
        </nav>

        <div className="p-4 md:block hidden">
           <div className="bg-zinc-900/80 border border-zinc-800 p-3 rounded-2xl flex items-center gap-3">
             <div className="h-10 w-10 rounded-full bg-zinc-800 border border-amber-500/30 flex items-center justify-center">AD</div>
             <div>
               <p className="text-sm font-bold text-zinc-300">Admin</p>
               <p className="text-xs text-amber-500 font-mono">Online</p>
             </div>
           </div>
        </div>
      </aside>

      {/* Área Principal Scrollable */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 relative">
        {/* Header dinámico */}
        <header className="mb-8 flex justify-between items-end">
          <div>
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight uppercase">
              {activeTab === 'dashboard' ? <><span className="text-amber-500">Visión</span> Global</> : 
               activeTab === 'pedidos' ? <>Flujo de <span className="text-amber-500">Entrada</span></> :
               activeTab === 'produccion' ? <>Master <span className="text-amber-500">Plan</span> 07:00</> : 
               <>Niveles de <span className="text-amber-500">Inventario</span></>}
            </h2>
            <p className="text-zinc-500 font-mono text-sm mt-2 flex items-center gap-2">
              <Clock size={14}/> Actualizado en tiempo real via WebSocket
            </p>
          </div>
        </header>
        
        {/* Renderizado de Módulos */}
        <div className="transition-all duration-500 ease-in-out">
          {activeTab === 'dashboard' && <DashboardBento />}
          {activeTab === 'pedidos' && <PedidosBento />}
          {activeTab === 'produccion' && <ProduccionBento />}
          {activeTab === 'stock' && <StockBento />}
        </div>
      </main>
    </div>
  );
}

// --- COMPONENTES BENTO ---

function DashboardBento() {
  return (
    // CSS Grid de 12 columnas para el patrón Bento
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 auto-rows-[minmax(100px,auto)]">
      
      {/* Hero Box - Span 8 columnas */}
      <BentoCard colSpan="md:col-span-8" className="relative overflow-hidden flex flex-col justify-between min-h-[250px]">
        <div className="absolute top-0 right-0 p-4 opacity-20">
          <TrendingUp size={120} className="text-amber-500" />
        </div>
        <div>
           <h3 className="text-zinc-400 font-mono uppercase tracking-wider mb-2">Facturación del día</h3>
           <div className="text-5xl md:text-7xl font-black text-white flex items-baseline gap-2">
            <span className="text-amber-500 text-3xl">$</span>
            {resumenMetricas.ventasDia.toLocaleString()}
           </div>
        </div>
        <div className="flex items-center gap-2 text-amber-400 mt-4 font-mono bg-amber-500/10 w-fit px-3 py-1 rounded-full border border-amber-500/20">
          <ArrowUpRight size={16} /> +12.5% vs Ayer
        </div>
      </BentoCard>

      {/* KPI Box 1 - Span 4 */}
      <BentoCard colSpan="md:col-span-4" className="bg-gradient-to-br from-zinc-900 to-black border-amber-500/20 relative group hover:border-amber-500/50 transition-all">
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 mix-blend-overlay"></div>
         <div className="h-12 w-12 bg-amber-500/20 rounded-2xl flex items-center justify-center mb-4 text-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.2)] group-hover:scale-110 transition-transform">
            <ShoppingBag size={24} />
         </div>
         <div className="text-4xl font-bold text-white">{resumenMetricas.docenasVendidas}</div>
         <div className="text-zinc-400 font-mono text-sm uppercase mt-1">Docenas Despachadas</div>
      </BentoCard>

      {/* Visualizador Gráfico (Fake) - Span 7 */}
      <BentoCard colSpan="md:col-span-7" title="Cadencia de Ventas (Tiempo Real)">
        <div className="flex items-end justify-between h-40 gap-1 mt-4 pt-4 border-t border-zinc-800">
          {[35, 60, 30, 85, 45, 95, 65, 40, 75, 50].map((h, i) => (
            <div key={i} className="flex-1 relative group h-full flex items-end">
               {/* Barra brillante */}
              <div style={{ height: `${h}%` }} className="w-full bg-gradient-to-t from-zinc-800 via-amber-900/50 to-amber-500 rounded-t-sm opacity-80 group-hover:opacity-100 transition-all relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/20 animate-pulse"></div>
              </div>
               {/* Reflejo inferior */}
              <div style={{ height: `${h/3}%` }} className="absolute -bottom-1 w-full bg-amber-500/20 blur-md rounded-t-full mx-1"></div>
            </div>
          ))}
        </div>
      </BentoCard>

      {/* Alerta Box - Span 5 */}
      <BentoCard colSpan="md:col-span-5" className="bg-red-950/20 border-red-900/50 hover:border-red-500/50 flex flex-col justify-center relative overflow-hidden">
         <div className="absolute -right-10 -top-10 text-red-800/20"><AlertTriangle size={150} /></div>
         <div className="relative z-10">
          <div className="flex items-center gap-2 text-red-400 mb-2 font-mono uppercase tracking-wider">
            <AlertTriangle size={18} /> Alerta de Merma
          </div>
          <div className="text-5xl font-bold text-white">{resumenMetricas.mermaEstimada}</div>
          <p className="text-zinc-400 text-sm mt-2">El desperdicio supera el umbral del 3%. Revisar estación de corte de fiambre.</p>
        </div>
      </BentoCard>
       {/* Quote Box - Span 12 */}
       <BentoCard colSpan="md:col-span-12" className="flex items-center gap-4 bg-zinc-800/30">
         <Quote className="text-zinc-600 rotate-180" size={40} />
         <p className="text-lg text-zinc-300 italic font-medium">"Lo que no se define no se puede medir. Lo que no se mide, no se puede mejorar." <span className="text-amber-500 not-italic font-bold ml-2">- Peter Drucker</span></p>
       </BentoCard>
    </div>
  );
}

function PedidosBento() {
  return (
    <div className="grid grid-cols-1 gap-4">
      {/* Encabezado estilo terminal */}
      <div className="bg-black/40 p-3 rounded-lg border border-zinc-800 font-mono text-xs text-amber-500 flex justify-between mb-2">
        <span>$ conexión establecida &gt; escuchando puerto 8080 (WhatsApp & Web)</span>
        <span className="animate-pulse">● LIVE</span>
      </div>
      {pedidosEntrantes.map((p) => (
        <BentoCard key={p.id} className="flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:bg-zinc-900/80 transition-all border-l-4 border-l-transparent hover:border-l-amber-500">
          <div className="flex items-start gap-4">
            <div className="bg-zinc-900 p-3 rounded-2xl border border-zinc-800 group-hover:border-amber-500/30 shadow-lg shadow-black/50">
              {p.origen.includes('WhatsApp') ? <Zap className="text-green-500" size={20}/> : <Layers className="text-blue-500" size={20}/>}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-lg text-white">{p.cliente}</h4>
                <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${p.tipo === 'Mayorista' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50' : 'bg-zinc-800 text-zinc-400 border border-zinc-700'}`}>
                  {p.tipo}
                </span>
              </div>
              <p className="text-zinc-400 font-mono text-sm mt-1">{p.items}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 pl-14 md:pl-0">
            <div className="text-right">
               <div className="font-mono text-xs text-zinc-500">{p.hora}</div>
               <div className={`text-xs font-bold mt-1 ${p.estado === 'Pendiente' ? 'text-amber-400 animate-pulse' : 'text-blue-400'}`}>{p.estado.toUpperCase()}</div>
            </div>
            <button className="bg-zinc-800 hover:bg-amber-600 hover:text-black text-zinc-200 px-4 py-2 rounded-lg text-sm font-bold transition-colors border border-zinc-700 hover:border-amber-500 shadow-[0_0_10px_rgba(0,0,0,0.5)]">
              PROCESAR &gt;
            </button>
          </div>
        </BentoCard>
      ))}
    </div>
  );
}

function ProduccionBento() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {produccionConsolidada.map((item, idx) => (
        <BentoCard key={idx} className="relative overflow-hidden flex flex-col justify-between min-h-[200px]">
          {/* Fondo con número gigante */}
          <div className="absolute -right-4 -bottom-8 text-9xl font-black text-zinc-800/20 z-0 select-none">
            #{idx + 1}
          </div>
          
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-black text-xl text-white max-w-[70%] leading-tight">{item.variedad}</h3>
               {item.priority === 'high' && <span className="bg-red-500/20 text-red-400 text-xs px-2 py-1 rounded-full font-bold border border-red-500/50 animate-pulse">PRIORIDAD ALTA</span>}
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black text-amber-400">{item.cantidad}</span>
              <span className="text-zinc-500 font-mono uppercase">{item.unidad}</span>
            </div>
          </div>

          <div className="relative z-10 mt-6">
            <div className="flex justify-between text-xs text-zinc-400 font-mono mb-1">
              <span>Progreso Real</span>
              <span>{item.estado}%</span>
            </div>
            <div className="w-full bg-black/50 rounded-full h-3 p-0.5 border border-zinc-800 backdrop-blur-sm">
              <div 
                className="h-full rounded-full transition-all duration-1000 ease-out bg-gradient-to-r from-amber-600 to-amber-400 relative"
                style={{ width: `${item.estado}%` }}
              >
                <div className="absolute right-0 top-0 h-full w-2 bg-white/50 blur-[2px] animate-pulse"></div>
              </div>
            </div>
          </div>
        </BentoCard>
      ))}
    </div>
  );
}

function StockBento() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {stockInsumos.map((insumo, idx) => (
        <BentoCard key={idx} className={`flex items-center gap-6 ${insumo.nivel < 20 ? 'border-red-900/60 bg-red-950/10 hover:border-red-500/50' : ''}`}>
          {/* Indicador Circular */}
          <div className="relative h-20 w-20 flex-shrink-0">
             <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                <path className="text-zinc-800" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path 
                  className={`${insumo.nivel < 20 ? 'text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]' : insumo.nivel < 50 ? 'text-amber-500 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]' : 'text-green-500 drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]'} transition-all duration-1000`}
                  strokeWidth="3" strokeDasharray={`${insumo.nivel}, 100`} strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                />
             </svg>
             <div className="absolute inset-0 flex items-center justify-center font-black text-lg text-white">
                {insumo.nivel}%
             </div>
          </div>
          
          <div className="flex-1">
            <h4 className="font-bold text-lg text-white mb-1">{insumo.insumo}</h4>
            <div className="flex justify-between items-center">
               <p className="text-sm text-zinc-400 font-mono bg-zinc-900/50 px-2 py-1 rounded border border-zinc-800">
                 Stock: <span className="text-white">{insumo.cantidad}</span>
               </p>
               {insumo.nivel < 20 && (
                 <span className="flex items-center gap-1 text-xs font-bold text-red-500 bg-red-500/10 px-2 py-1 rounded-full border border-red-500/20 animate-pulse">
                   <GitCommit size={12}/> REPONER URGENTE
                 </span>
               )}
            </div>
          </div>
        </BentoCard>
      ))}
    </div>
  );
}

// --- COMPONENTES UI GENÉRICOS ---

function BentoCard({ children, className = "", colSpan = "", title }: { children: React.ReactNode; className?: string; colSpan?: string; title?: string }) {
  return (
    <div className={`${colSpan} bg-zinc-900/40 backdrop-blur-md border border-zinc-800/80 p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:border-amber-500/30 hover:bg-zinc-900/60 transition-all duration-300 group ${className}`}>
      {title && <h3 className="text-zinc-400 font-mono uppercase tracking-wider mb-4 text-sm">{title}</h3>}
      {children}
    </div>
  );
}

function NavButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 md:px-4 py-3 rounded-2xl transition-all duration-200 group relative overflow-hidden ${
        active 
          ? 'text-amber-400 bg-zinc-900 shadow-[0_0_20px_-5px_rgba(251,191,36,0.3)] border border-amber-500/20' 
          : 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900/50'
      }`}
    >
      {active && <div className="absolute left-0 top-0 h-full w-1 bg-amber-400 shadow-[0_0_10px_#fbbf24]"></div>}
      
      <div className={`${active ? 'text-amber-400 drop-shadow-[0_0_5px_rgba(251,191,36,0.5)]' : 'group-hover:text-white'} transition-colors`}>
        {/* CORRECCIÓN AQUÍ: Agregamos <any> para decirle a TS que confíe en nosotros */}
        {React.cloneElement(icon as React.ReactElement<any>, { size: 20, strokeWidth: active ? 2.5 : 2 })}
      </div>
      <span className={`font-bold text-sm hidden md:block ${active ? '' : 'font-medium'}`}>{label}</span>
    </button>
  );
}