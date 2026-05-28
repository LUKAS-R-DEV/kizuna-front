import { useState, useEffect } from "react";
import MainLayout from "@/layouts/MainLayout";
import { 
  TrendingUp, CheckCircle2, Package, ClipboardList, 
  Activity, Gauge, Loader2, ShieldCheck, Box, BarChart3
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { dataApi } from "@/lib/api";
import EagleSpinner from "@/components/EagleSpinner";

// Data Service DTOs (Strictly DashboardController)
interface ProductionMetrics {
  totalOrders: number;
  StartedOrders: number;
  finishedOrders: number;
}

interface InventoryMetrics {
  totalItems: number;
  lowStockItems: number;
}

interface QualityMetrics {
  aprovedOrders: number;
  rejectedOrders: number;
}

export default function Dashboard() {
  const [prodMetrics, setProdMetrics] = useState<ProductionMetrics | null>(null);
  const [invMetrics, setInvMetrics] = useState<InventoryMetrics | null>(null);
  const [qualMetrics, setQualMetrics] = useState<QualityMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [pMetRes, iMetRes, qMetRes] = await Promise.all([
        dataApi.get<ProductionMetrics>("/dashboard/production"),
        dataApi.get<InventoryMetrics>("/dashboard/inventory"),
        dataApi.get<QualityMetrics>("/dashboard/quality")
      ]);
      
      setProdMetrics(pMetRes.data);
      setInvMetrics(iMetRes.data);
      setQualMetrics(qMetRes.data);
    } catch (error) {
      console.error("Failed to fetch metrics from DashboardController", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="h-[calc(100vh-80px)] flex flex-col items-center justify-center bg-[#050505]">
          <EagleSpinner size={80} className="mb-8" />
          <p className="text-[12px] font-black text-red-500 uppercase tracking-[0.5em] animate-pulse italic mt-4">Syncing Dashboard Cluster...</p>
        </div>
      </MainLayout>
    );
  }

  const kpis = [
    { label: "Total Orders", value: prodMetrics?.totalOrders ?? 0, icon: ClipboardList, color: "text-blue-500", glow: "shadow-[0_0_20px_rgba(59,130,246,0.15)]" },
    { label: "Production Load", value: prodMetrics?.StartedOrders ?? 0, icon: Activity, color: "text-red-500", glow: "shadow-[0_0_20px_rgba(220,38,38,0.15)]" },
    { label: "Low Inventory", value: invMetrics?.lowStockItems ?? 0, icon: Box, color: "text-amber-500", glow: "shadow-[0_0_20px_rgba(245,158,11,0.15)]" },
    { label: "Quality Pass", value: qualMetrics?.aprovedOrders ?? 0, icon: ShieldCheck, color: "text-emerald-500", glow: "shadow-[0_0_20px_rgba(16,185,129,0.15)]" },
  ];

  return (
    <MainLayout>
      <div className="px-8 pb-12 space-y-8 pt-4 bg-[#050505] min-h-[calc(100vh-80px)] relative overflow-hidden">
        
        {/* Background technical grid pattern */}
        <div className="absolute inset-0 bg-tech-grid opacity-[0.4] pointer-events-none scale-125" />

        {/* HEADER PADRONIZADO CYBERPUNK */}
        <div className="flex items-end justify-between border-l-[6px] border-red-600 pl-5 mb-8 relative z-10">
          <div className="flex flex-col text-left">
            <span className="text-[10px] font-black text-red-500 uppercase tracking-[0.4em] mb-1 drop-shadow-[0_0_8px_rgba(220,38,38,0.5)]">
              Operational Metrics
            </span>
            <div className="flex items-baseline gap-2">
              <h1 className="text-4xl font-black text-white tracking-tighter leading-none drop-shadow-[0_0_15px_rgba(255,255,255,0.4)] uppercase">
               Dashboard
              </h1>
              <span className="text-4xl font-black text-red-600 tracking-tighter uppercase leading-none drop-shadow-[0_4px_14px_rgba(220,38,38,0.4)] italic">
                Terminal
              </span>
            </div>
          </div>
        </div>

        {/* 1. HUD KPI PANELS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
          {kpis.map((kpi, i) => (
            <Card key={i} className={`p-6 flex flex-col justify-between min-h-[145px] hover:-translate-y-1 transition-all duration-300 group border-white/5 bg-white/[0.02] backdrop-blur-md rounded-xl ${kpi.glow}`}>
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-white/[0.03] border border-white/5 shadow-inner">
                  <kpi.icon className={`w-5 h-5 ${kpi.color}`} strokeWidth={2.5} />
                </div>
                <TrendingUp size={14} className="text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="text-left mt-3">
                <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-0.5 group-hover:text-slate-400 transition-colors italic">{kpi.label}</p>
                <h3 className="text-4xl font-mono font-black text-white tracking-tighter leading-none">{(kpi.value || 0).toString().padStart(2, '0')}</h3>
              </div>
            </Card>
          ))}
        </div>

        {/* 2. OPERATIONAL METRIC GRIDS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
          
          {/* PRODUCTION INTEL */}
          <Card className="p-8 bg-gradient-to-br from-blue-900/10 to-black/60 border border-blue-500/20 rounded-2xl relative overflow-hidden backdrop-blur-2xl shadow-[0_8px_32px_rgba(37,99,235,0.1)]">
             {/* Subtle glow orb */}
             <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px] pointer-events-none" />
             
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-blue-400 mb-8 flex items-center gap-3">
              <Activity size={18} /> Executive Production Summary
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
               <div className="space-y-6 relative z-10">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Order Volume</p>
                    <div className="flex items-baseline gap-2">
                       <span className="text-5xl font-black text-white tracking-tight">{prodMetrics?.totalOrders || 0}</span>
                       <span className="text-xs text-blue-500 font-bold tracking-widest uppercase">Units</span>
                    </div>
                  </div>
                  
                  <div className="h-px w-full bg-gradient-to-r from-blue-500/20 to-transparent" />

                  <div className="grid grid-cols-2 gap-6">
                     <div>
                        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">In Progress</p>
                        <span className="text-2xl font-black text-amber-400">{prodMetrics?.StartedOrders || 0}</span>
                     </div>
                     <div>
                        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Completed</p>
                        <span className="text-2xl font-black text-emerald-400">{prodMetrics?.finishedOrders || 0}</span>
                     </div>
                  </div>
               </div>

               <div className="flex flex-col items-center justify-center relative z-10">
                  <div className="relative w-40 h-40 flex items-center justify-center">
                     {/* Outer Ring */}
                     <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
                        <circle 
                           cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="6" 
                           strokeDasharray={283} 
                           strokeDashoffset={283 - (283 * (prodMetrics?.totalOrders ? (prodMetrics.finishedOrders / prodMetrics.totalOrders) : 0))}
                           className="text-blue-500 drop-shadow-[0_0_12px_rgba(59,130,246,0.6)] transition-all duration-1000 ease-out" 
                           strokeLinecap="round" 
                        />
                     </svg>
                     <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-black text-white">
                           {prodMetrics?.totalOrders ? Math.round((prodMetrics.finishedOrders / prodMetrics.totalOrders) * 100) : 0}
                           <span className="text-lg text-blue-500 ml-1">%</span>
                        </span>
                        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">Completion Rate</span>
                     </div>
                  </div>
               </div>
            </div>
          </Card>

          {/* INVENTORY & QUALITY INTEL */}
          <Card className="p-8 bg-white/[0.01] border-white/5 rounded-2xl relative overflow-hidden backdrop-blur-xl border-t-2 border-t-red-600/30">
            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-slate-500 mb-10 flex items-center gap-3">
              <BarChart3 size={18} className="text-red-500" /> Operational Health
            </h2>
            <div className="space-y-8">
               <div className="flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-lg bg-red-600/10 flex items-center justify-center border border-red-500/20">
                        <Box size={20} className="text-red-500" />
                     </div>
                     <div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Inventory Delta</p>
                        <h4 className="text-lg font-black text-white italic">Low Stock Criticality</h4>
                     </div>
                  </div>
                  <div className="text-right">
                     <span className="text-3xl font-mono font-black text-red-600 drop-shadow-[0_0_10px_rgba(220,38,38,0.3)]">{invMetrics?.lowStockItems || 0}</span>
                     <p className="text-[8px] font-bold text-slate-600 uppercase tracking-widest mt-1 italic">Nodes at Risk</p>
                  </div>
               </div>

               <div className="flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-lg bg-emerald-600/10 flex items-center justify-center border border-emerald-500/20">
                        <ShieldCheck size={20} className="text-emerald-500" />
                     </div>
                     <div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Audit Stability</p>
                        <h4 className="text-lg font-black text-white italic">Quality Exceptions</h4>
                     </div>
                  </div>
                  <div className="text-right">
                     <span className="text-3xl font-mono font-black text-emerald-500 drop-shadow-[0_0_10px_rgba(16,185,129,0.3)]">{qualMetrics?.rejectedOrders || 0}</span>
                     <p className="text-[8px] font-bold text-slate-600 uppercase tracking-widest mt-1 italic">Rejection Total</p>
                  </div>
               </div>
            </div>
          </Card>

        </div>

      </div>
    </MainLayout>
  );
}