import MainLayout from "@/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { MOCK_PRODUCTION_STATS } from "@/mocks/reports";
import { 
  FileBarChart, 
  TrendingUp, 
  ShieldCheck, 
  Boxes, 
  Download, 
  ArrowUpRight, 
  ArrowDownRight 
} from "lucide-react";

export default function ReportsPage() {
  const { totalCompleted, plannedOrders, completionRate, trends } = MOCK_PRODUCTION_STATS;

  return (
    <MainLayout>
      <div className="px-8 pb-8 space-y-6 mt-[-14px]">
        
        {/* HEADER KIZUNA STANDARD */}
        <div className="flex items-end justify-between border-l-[6px] border-red-700 pl-5 py-4 bg-white/40 backdrop-blur-sm">
          <div className="flex flex-col text-left">
            <span className="text-[10px] font-black text-red-600 uppercase tracking-[0.4em] mb-1">
              Analytics & Performance Data
            </span>
            <div className="flex items-baseline gap-2">
              <h1 className="text-4xl font-black text-slate-900 tracking-tighter leading-none uppercase">
                System
              </h1>
              <span className="text-3xl font-thin text-slate-300 tracking-tighter uppercase leading-none">
                Reports
              </span>
            </div>
          </div>
        </div>

        {/* REPORT SELECTOR (TOP CARDS) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button className="flex items-center gap-4 p-6 bg-white border-2 border-red-600 rounded-xl shadow-lg shadow-red-900/10 text-left transition-all">
            <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center text-white shadow-md">
              <TrendingUp size={24} />
            </div>
            <div>
              <h3 className="text-[11px] font-black uppercase text-slate-900 tracking-wider">Production Report</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Performance and trends</p>
            </div>
          </button>

          <button className="flex items-center gap-4 p-6 bg-white border border-slate-100 rounded-xl hover:border-red-200 text-left transition-all opacity-60 hover:opacity-100">
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h3 className="text-[11px] font-black uppercase text-slate-900 tracking-wider">Quality Report</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Inspection results</p>
            </div>
          </button>

          <button className="flex items-center gap-4 p-6 bg-white border border-slate-100 rounded-xl hover:border-red-200 text-left transition-all opacity-60 hover:opacity-100">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">
              <Boxes size={24} />
            </div>
            <div>
              <h3 className="text-[11px] font-black uppercase text-slate-900 tracking-wider">Inventory Report</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Stock levels & movements</p>
            </div>
          </button>
        </div>

        {/* MAIN CONTENT AREA */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
            <div className="flex items-center gap-3">
              <FileBarChart className="text-red-700" size={20} />
              <h2 className="text-xs font-black uppercase tracking-[0.1em] text-slate-800">Production Performance Report</h2>
            </div>
            <Button className="bg-slate-900 hover:bg-black text-white text-[10px] font-black uppercase tracking-widest px-6 h-10 gap-2">
              <Download size={14} /> Export to PDF
            </Button>
          </div>

          <div className="p-8 space-y-10">
            {/* KPI GRID */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Completed (Q1)</p>
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-black text-slate-900 tracking-tighter">{totalCompleted}</span>
                  <span className="flex items-center text-[10px] font-black text-emerald-500 uppercase">
                    <ArrowUpRight size={14} /> {trends.completed}
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Planned Orders (Q1)</p>
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-black text-slate-900 tracking-tighter">{plannedOrders}</span>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Completion Rate</p>
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-black text-slate-900 tracking-tighter">{completionRate}%</span>
                  <span className="flex items-center text-[10px] font-black text-red-500 uppercase">
                    <ArrowDownRight size={14} /> {trends.rate}
                  </span>
                </div>
              </div>
            </div>

            {/* CHART PLACEHOLDER */}
            <div className="space-y-4">
              <h3 className="text-[11px] font-black uppercase text-slate-500 tracking-widest">Production vs Planned (Q1 2026)</h3>
              <div className="h-72 w-full bg-slate-50 rounded-xl border border-dashed border-slate-200 flex items-end justify-around p-8 relative">
                
                {/* Y-Axis mock labels */}
                <div className="absolute left-4 h-full flex flex-col justify-between py-8 text-[9px] font-black text-slate-300">
                  <span>320</span><span>240</span><span>160</span><span>80</span><span>0</span>
                </div>

                {/* Simulated Bars based on image */}
                <div className="flex flex-col items-center gap-3 w-32">
                  <div className="w-full bg-slate-400/40 rounded-t-sm transition-all hover:bg-red-600/40" style={{ height: '180px' }}></div>
                  <span className="text-[10px] font-black text-slate-400 uppercase">Jan</span>
                </div>
                <div className="flex flex-col items-center gap-3 w-32">
                  <div className="w-full bg-slate-400/40 rounded-t-sm transition-all hover:bg-red-600/40" style={{ height: '240px' }}></div>
                  <span className="text-[10px] font-black text-slate-400 uppercase">Feb</span>
                </div>
                <div className="flex flex-col items-center gap-3 w-32">
                  <div className="w-full bg-slate-400/40 rounded-t-sm transition-all hover:bg-red-600/40" style={{ height: '140px' }}></div>
                  <span className="text-[10px] font-black text-slate-400 uppercase">Mar</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER SYSTEM STATUS */}
        <div className="bg-slate-900 p-4 flex justify-between items-center rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em]">
              Data Refresh: 100% Sync <span className="text-slate-800 mx-2">//</span> Kizuna Analytics Engine
            </p>
          </div>
          <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest italic">
            Reference: {new Date().getFullYear()}-Q1-PERF
          </p>
        </div>
      </div>
    </MainLayout>
  );
}