import MainLayout from "@/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Download, 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Activity, 
  ShieldCheck, 
  Boxes,
  CalendarDays
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line 
} from "recharts";

// Mock de dados para os gráficos
const PERFORMANCE_DATA = [
  { name: "Jan", production: 240, planned: 300 },
  { name: "Feb", production: 310, planned: 300 },
  { name: "Mar", production: 160, planned: 300 },
];

export default function AnalyticsReports() {
  return (
    <MainLayout>
      <div className="px-8 pb-8 space-y-6 mt-[-14px]">
        
        {/* HEADER INDUSTRIAL */}
        <div className="flex items-end justify-between border-l-[6px] border-red-700 pl-5 py-4 bg-white/40 backdrop-blur-sm">
          <div className="flex flex-col text-left">
            <span className="text-[10px] font-black text-red-600 uppercase tracking-[0.4em] mb-1">
              Data Intelligence & ROI
            </span>
            <div className="flex items-baseline gap-2">
              <h1 className="text-4xl font-black text-slate-900 tracking-tighter leading-none uppercase">
                System
              </h1>
              <span className="text-3xl font-thin text-slate-300 tracking-tighter uppercase leading-none">
                Analytics
              </span>
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" className="text-[10px] font-black uppercase tracking-widest border-slate-200 h-11 px-6 gap-2 hover:bg-slate-100">
              <CalendarDays size={14} /> Last 90 Days
            </Button>
            <Button className="bg-slate-900 hover:bg-slate-800 text-[10px] font-black text-white uppercase tracking-widest h-11 px-6 gap-2">
              <Download size={14} /> Export PDF Report
            </Button>
          </div>
        </div>

        {/* SELEÇÃO DE MÓDULOS (KPI CATEGORIES) */}
        <div className="grid grid-cols-3 gap-4">
          <button className="flex items-center gap-4 p-4 rounded-xl border-2 border-blue-600 bg-blue-50/50 text-left transition-all">
            <div className="w-12 h-12 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <Activity size={24} />
            </div>
            <div>
              <p className="text-[11px] font-black text-blue-600 uppercase">Production Performance</p>
              <p className="text-xs text-slate-500 font-medium text-pretty">Efficiency and OEE trends</p>
            </div>
          </button>

          <button className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 bg-white text-left hover:border-slate-300 transition-all group">
            <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-colors">
              <ShieldCheck size={24} />
            </div>
            <div>
              <p className="text-[11px] font-black text-slate-900 uppercase">Quality Analytics</p>
              <p className="text-xs text-slate-500 font-medium">Rejection rate & Inspection ROI</p>
            </div>
          </button>

          <button className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 bg-white text-left hover:border-slate-300 transition-all group">
            <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-purple-100 group-hover:text-purple-600 transition-colors">
              <Boxes size={24} />
            </div>
            <div>
              <p className="text-[11px] font-black text-slate-900 uppercase">Inventory Insights</p>
              <p className="text-xs text-slate-500 font-medium">Turnover & Stock Valuation</p>
            </div>
          </button>
        </div>

        {/* MAIN ANALYTICS VIEW */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex justify-between items-center">
             <div className="flex items-center gap-2">
                <BarChart3 className="text-red-600" size={18} />
                <h2 className="font-black uppercase tracking-tighter text-slate-800">Production vs Planned (Q1 2026)</h2>
             </div>
             <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none font-black text-[9px]">SYSTEM NOMINAL</Badge>
          </div>

          <div className="p-6">
            {/* KPI GRID */}
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Completed (Q1)</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-slate-900 tracking-tighter">699</span>
                  <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5">
                    <TrendingUp size={10} /> 15%
                  </span>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Planned Orders (Q1)</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-slate-900 tracking-tighter">900</span>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Completion Rate</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-slate-900 tracking-tighter">77.7%</span>
                  <span className="text-[10px] font-bold text-red-500 flex items-center gap-0.5">
                    <TrendingDown size={10} /> 5%
                  </span>
                </div>
              </div>
            </div>

            {/* CHART CONTAINER */}
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={PERFORMANCE_DATA}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fontWeight: 'bold', fill: '#94a3b8' }} 
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fontWeight: 'bold', fill: '#94a3b8' }} 
                  />
                  <Tooltip 
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Bar dataKey="production" fill="#94a3b8" radius={[4, 4, 0, 0]} barSize={60} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* FOOTER ANALYTICS */}
          <div className="bg-slate-900 p-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">
                Real-time Data Sync Active <span className="text-slate-700">//</span> Kizuna Intelligence Unit
              </p>
            </div>
            <p className="text-[9px] font-bold text-slate-500 italic">
              Last updated: March 13, 2026 - 15:55
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}