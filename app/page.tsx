"use client";
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, ShoppingBag, ChefHat, Package, 
  TrendingUp, AlertTriangle, Clock, Zap,
  ArrowUpRight, Quote, GitCommit, Layers, Menu, X, CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// --- UTILS ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- MOCK DATA ---
const resumenMetricas = {
  ventasDia: 185000,
  docenasVendidas: 42,
  mermaEstimada: "3.5%",
  pedidosPendientes: 5
};

const pedidosIniciales = [
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

// --- COMPONENTE PRINCIPAL ---
export default function SistemaSandwichesUltimate() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [pedidos, setPedidos] = useState(pedidosIniciales);
  const [toast, setToast] = useState<{msg: string, visible: boolean} | null>(null);

  // Función para simular proceso
  const procesarPedido = (id: number) => {
    setPedidos(prev => prev.map(p => p.id === id ? {...p, estado: 'En Producción'} : p));
    showToast("Pedido enviado a cocina y stock descontado");
  };

  const showToast = (msg: string) => {
    setToast({ msg, visible: true });
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="flex h-screen bg-zinc-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900 via-black to-black font-sans text-zinc-200 overflow-hidden">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 right-4 z-50 bg-green-500 text-black font-bold px-6 py-3 rounded-full shadow-[0_0_20px_rgba(34,197,94,0.4)] flex items-center gap-2"
          >
            <CheckCircle2 size={20}/> {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar Desktop */}
      <aside className="hidden md:flex w-64 bg-black/50 backdrop-blur-xl border-r border-zinc-800 flex-col z-20 relative">
        <LogoArea />
        <NavLinks activeTab={activeTab} setActiveTab={setActiveTab} />
        <UserProfile />
      </aside>

      {/* Mobile Header & Menu Overlay */}
      <div className="md:hidden fixed top-0 left-0 w-full z-30 bg-black/80 backdrop-blur-lg border-b border-zinc-800 p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
           <div className="h-8 w-8 bg-amber-500 rounded-lg flex items-center justify-center"><Zap size={18} className="text-black"/></div>
           <span className="font-bold text-white">NEXUS</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white p-2">
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-20 bg-zinc-950 pt-20 px-6 md:hidden"
          >
            <NavLinks activeTab={activeTab} setActiveTab={(t) => { setActiveTab(t); setIsMobileMenuOpen(false); }} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 pt-24 md:pt-8 relative scrollbar-hide">
        <Header activeTab={activeTab} />
        
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'dashboard' && <DashboardBento />}
            {activeTab === 'pedidos' && <PedidosBento pedidos={pedidos} onProcess={procesarPedido} />}
            {activeTab === 'produccion' && <ProduccionBento />}
            {activeTab === 'stock' && <StockBento />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function LogoArea() {
  return (
    <div className="p-6 flex items-center gap-3">
      <div className="h-8 w-8 bg-gradient-to-br from-amber-300 to-amber-600 rounded-lg shadow-[0_0_15px_rgba(251,191,36,0.5)] flex items-center justify-center">
        <Zap size={18} className="text-black" fill="currentColor"/>
      </div>
      <h1 className="text-xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">
        NEXUS<span className="text-zinc-500 font-thin">FOOD</span>
      </h1>
    </div>
  );
}

function NavLinks({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (t: string) => void }) {
  return (
    <nav className="flex-1 px-4 space-y-2 mt-4">
      <NavButton active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={<LayoutDashboard />} label="Tablero de Mando" />
      <NavButton active={activeTab === 'pedidos'} onClick={() => setActiveTab('pedidos')} icon={<ShoppingBag />} label="Flujo de Pedidos" />
      <NavButton active={activeTab === 'produccion'} onClick={() => setActiveTab('produccion')} icon={<ChefHat />} label="Núcleo Producción" />
      <NavButton active={activeTab === 'stock'} onClick={() => setActiveTab('stock')} icon={<Package />} label="Control Activos" />
    </nav>
  );
}

function UserProfile() {
  return (
    <div className="p-4">
      <div className="bg-zinc-900/80 border border-zinc-800 p-3 rounded-2xl flex items-center gap-3 hover:border-amber-500/30 transition-colors cursor-pointer">
        <div className="h-10 w-10 rounded-full bg-zinc-800 border border-amber-500/30 flex items-center justify-center text-amber-500 font-bold">AD</div>
        <div>
          <p className="text-sm font-bold text-zinc-300">Admin</p>
          <p className="text-xs text-amber-500 font-mono flex items-center gap-1"><span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Online</p>
        </div>
      </div>
    </div>
  );
}

function Header({ activeTab }: { activeTab: string }) {
  return (
    <header className="mb-6 md:mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
      <div>
        <motion.h2 
          key={activeTab}
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          className="text-3xl md:text-5xl font-black text-white tracking-tight uppercase leading-none"
        >
          {activeTab === 'dashboard' ? <><span className="text-amber-500">Visión</span> Global</> : 
           activeTab === 'pedidos' ? <>Flujo de <span className="text-amber-500">Entrada</span></> :
           activeTab === 'produccion' ? <>Master <span className="text-amber-500">Plan</span> 07:00</> : 
           <>Niveles de <span className="text-amber-500">Inventario</span></>}
        </motion.h2>
        <p className="text-zinc-500 font-mono text-xs md:text-sm mt-2 flex items-center gap-2">
          <Clock size={14}/> Actualizado en tiempo real via WebSocket Secure
        </p>
      </div>
    </header>
  );
}

// --- BENTO MODULES ---

function DashboardBento() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 md:gap-6 auto-rows-[minmax(100px,auto)] pb-20">
      <BentoCard colSpan="lg:col-span-8" className="relative overflow-hidden flex flex-col justify-between min-h-[200px] md:min-h-[250px]">
        <div className="absolute top-0 right-0 p-4 opacity-10 md:opacity-20 pointer-events-none">
          <TrendingUp size={100} className="text-amber-500" />
        </div>
        <div>
           <h3 className="text-zinc-400 font-mono uppercase tracking-wider mb-2 text-xs md:text-sm">Facturación del día</h3>
           <div className="text-5xl md:text-7xl font-black text-white flex items-baseline gap-2">
            <span className="text-amber-500 text-3xl">$</span>
            <AnimatedCounter value={resumenMetricas.ventasDia} />
           </div>
        </div>
        <div className="flex items-center gap-2 text-amber-400 mt-4 font-mono bg-amber-500/10 w-fit px-3 py-1 rounded-full border border-amber-500/20 text-xs md:text-sm">
          <ArrowUpRight size={16} /> +12.5% vs Ayer
        </div>
      </BentoCard>

      <BentoCard colSpan="lg:col-span-4" className="bg-gradient-to-br from-zinc-900 to-black border-amber-500/20 group hover:border-amber-500/50">
         <div className="h-12 w-12 bg-amber-500/20 rounded-2xl flex items-center justify-center mb-4 text-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.2)] group-hover:scale-110 transition-transform duration-300">
            <ShoppingBag size={24} />
         </div>
         <div className="text-4xl font-bold text-white"><AnimatedCounter value={resumenMetricas.docenasVendidas} /></div>
         <div className="text-zinc-400 font-mono text-sm uppercase mt-1">Docenas Despachadas</div>
      </BentoCard>

      <BentoCard colSpan="lg:col-span-7" title="Cadencia de Ventas" className="min-h-[200px]">
        <div className="flex items-end justify-between h-32 md:h-40 gap-1 md:gap-2 mt-4 pt-4 border-t border-zinc-800/50">
          {[35, 60, 30, 85, 45, 95, 65, 40, 75, 50].map((h, i) => (
            <motion.div 
              initial={{ height: 0 }} animate={{ height: `${h}%` }} transition={{ delay: i * 0.05, duration: 0.5 }}
              key={i} className="flex-1 relative group h-full flex items-end"
            >
              <div className="w-full bg-gradient-to-t from-zinc-800 via-amber-900/50 to-amber-500 rounded-t-sm opacity-80 group-hover:opacity-100 transition-all relative overflow-hidden h-full"></div>
            </motion.div>
          ))}
        </div>
      </BentoCard>

      <BentoCard colSpan="lg:col-span-5" className="bg-red-900/10 border-red-900/30 hover:border-red-500/50 flex flex-col justify-center relative overflow-hidden">
         <div className="absolute -right-6 -top-6 text-red-500/10"><AlertTriangle size={120} /></div>
         <div className="relative z-10">
          <div className="flex items-center gap-2 text-red-400 mb-2 font-mono uppercase tracking-wider text-xs md:text-sm">
            <AlertTriangle size={16} /> Alerta de Merma
          </div>
          <div className="text-4xl md:text-5xl font-bold text-white">{resumenMetricas.mermaEstimada}</div>
          <p className="text-zinc-400 text-xs md:text-sm mt-2">El desperdicio supera el umbral del 3%. Revisar estación de corte.</p>
        </div>
      </BentoCard>
    </div>
  );
}

function PedidosBento({ pedidos, onProcess }: { pedidos: any[], onProcess: (id: number) => void }) {
  return (
    <div className="grid grid-cols-1 gap-4 pb-20">
      <div className="bg-black/40 p-3 rounded-lg border border-zinc-800 font-mono text-[10px] md:text-xs text-amber-500 flex justify-between mb-2">
        <span>$ watching orders...</span>
        <span className="animate-pulse">● LIVE</span>
      </div>
      {pedidos.map((p, i) => (
        <motion.div 
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
          key={p.id} 
        >
          <BentoCard className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-l-4 border-l-transparent hover:border-l-amber-500">
            <div className="flex items-start gap-4">
              <div className="bg-zinc-900 p-3 rounded-2xl border border-zinc-800 shadow-lg shadow-black/50 shrink-0">
                {p.origen.includes('WhatsApp') ? <Zap className="text-green-500" size={20}/> : <Layers className="text-blue-500" size={20}/>}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="font-bold text-lg text-white">{p.cliente}</h4>
                  <span className={cn("px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest", 
                    p.tipo === 'Mayorista' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50' : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                  )}>
                    {p.tipo}
                  </span>
                </div>
                <p className="text-zinc-400 font-mono text-sm mt-1">{p.items}</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between md:justify-end gap-4 mt-4 md:mt-0 pl-14 md:pl-0 w-full md:w-auto">
              <div className="text-right hidden md:block">
                 <div className="font-mono text-xs text-zinc-500">{p.hora}</div>
                 <div className={cn("text-xs font-bold mt-1", p.estado === 'Pendiente' ? 'text-amber-400 animate-pulse' : 'text-blue-400')}>
                   {p.estado.toUpperCase()}
                 </div>
              </div>
              <button 
                onClick={() => onProcess(p.id)}
                disabled={p.estado !== 'Pendiente'}
                className={cn("flex-1 md:flex-none px-4 py-2 rounded-lg text-sm font-bold transition-all border shadow-[0_0_10px_rgba(0,0,0,0.5)]",
                  p.estado === 'Pendiente' 
                    ? "bg-zinc-800 hover:bg-amber-600 hover:text-black text-zinc-200 border-zinc-700 hover:border-amber-500" 
                    : "bg-zinc-900 text-zinc-600 border-zinc-800 cursor-not-allowed"
                )}
              >
                {p.estado === 'Pendiente' ? 'PROCESAR >' : 'EN COCINA'}
              </button>
            </div>
          </BentoCard>
        </motion.div>
      ))}
    </div>
  );
}

function ProduccionBento() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
      {produccionConsolidada.map((item, idx) => (
        <motion.div 
          key={idx} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.1 }}
        >
          <BentoCard className="relative overflow-hidden flex flex-col justify-between min-h-[200px]">
            <div className="absolute -right-4 -bottom-8 text-9xl font-black text-zinc-800/20 z-0 select-none">#{idx + 1}</div>
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-black text-xl text-white max-w-[70%] leading-tight">{item.variedad}</h3>
                {item.priority === 'high' && <span className="bg-red-500/20 text-red-400 text-[10px] px-2 py-1 rounded-full font-bold border border-red-500/50 animate-pulse">PRIORIDAD</span>}
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-amber-400">{item.cantidad}</span>
                <span className="text-zinc-500 font-mono uppercase">{item.unidad}</span>
              </div>
            </div>
            <div className="relative z-10 mt-6">
              <div className="flex justify-between text-xs text-zinc-400 font-mono mb-1"><span>Progreso Real</span><span>{item.estado}%</span></div>
              <div className="w-full bg-black/50 rounded-full h-3 p-0.5 border border-zinc-800 backdrop-blur-sm">
                <motion.div 
                  initial={{ width: 0 }} animate={{ width: `${item.estado}%` }} transition={{ duration: 1.5, delay: 0.5 }}
                  className="h-full rounded-full bg-gradient-to-r from-amber-600 to-amber-400 relative"
                >
                  <div className="absolute right-0 top-0 h-full w-2 bg-white/50 blur-[2px] animate-pulse"></div>
                </motion.div>
              </div>
            </div>
          </BentoCard>
        </motion.div>
      ))}
    </div>
  );
}

function StockBento() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
      {stockInsumos.map((insumo, idx) => (
        <BentoCard key={idx} className={cn("flex items-center gap-6", insumo.nivel < 20 && 'border-red-900/60 bg-red-950/10')}>
          <div className="relative h-16 w-16 md:h-20 md:w-20 flex-shrink-0">
             <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                <path className="text-zinc-800" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <motion.path 
                  initial={{ strokeDasharray: "0, 100" }} animate={{ strokeDasharray: `${insumo.nivel}, 100` }} transition={{ duration: 1.5, ease: "easeOut" }}
                  className={cn("transition-all", insumo.nivel < 20 ? 'text-red-500' : insumo.nivel < 50 ? 'text-amber-500' : 'text-green-500')}
                  strokeWidth="3" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                />
             </svg>
             <div className="absolute inset-0 flex items-center justify-center font-black text-sm md:text-lg text-white">{insumo.nivel}%</div>
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-lg text-white mb-1">{insumo.insumo}</h4>
            <div className="flex flex-wrap justify-between items-center gap-2">
               <p className="text-xs md:text-sm text-zinc-400 font-mono bg-zinc-900/50 px-2 py-1 rounded border border-zinc-800">Stock: <span className="text-white">{insumo.cantidad}</span></p>
               {insumo.nivel < 20 && <span className="flex items-center gap-1 text-[10px] font-bold text-red-500 bg-red-500/10 px-2 py-1 rounded-full border border-red-500/20 animate-pulse">REPONER</span>}
            </div>
          </div>
        </BentoCard>
      ))}
    </div>
  );
}

// --- GENERIC UI ---

function BentoCard({ children, className, colSpan = "", title }: { children: React.ReactNode, className?: string, colSpan?: string, title?: string }) {
  return (
    <div className={cn(colSpan, "bg-zinc-900/40 backdrop-blur-md border border-zinc-800/80 p-4 md:p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300", className)}>
      {title && <h3 className="text-zinc-400 font-mono uppercase tracking-wider mb-4 text-xs md:text-sm">{title}</h3>}
      {children}
    </div>
  );
}

function NavButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={cn("w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 group relative overflow-hidden", 
        active ? 'text-amber-400 bg-zinc-900 shadow-[0_0_20px_-5px_rgba(251,191,36,0.3)] border border-amber-500/20' : 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900/50'
      )}
    >
      {active && <div className="absolute left-0 top-0 h-full w-1 bg-amber-400 shadow-[0_0_10px_#fbbf24]"></div>}
      <div className={cn("transition-colors", active ? 'text-amber-400 drop-shadow-[0_0_5px_rgba(251,191,36,0.5)]' : 'group-hover:text-white')}>
        {React.cloneElement(icon as React.ReactElement<any>, { size: 20, strokeWidth: active ? 2.5 : 2 })}
      </div>
      <span className={cn("text-sm hidden md:block", active ? 'font-bold' : 'font-medium')}>{label}</span>
      <span className={cn("text-sm md:hidden block", active ? 'font-bold' : 'font-medium')}>{label}</span>
    </button>
  );
}

function AnimatedCounter({ value }: { value: number }) {
  return <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{value.toLocaleString()}</motion.span>;
}