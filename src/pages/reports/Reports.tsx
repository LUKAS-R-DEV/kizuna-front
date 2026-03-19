import MainLayout from "@/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MOCK_PRODUCTION_STATS } from "@/mocks/reports";
import { 
  FileBarChart, 
  TrendingUp, 
  ShieldCheck, 
  Boxes, 
  Download, 
  ArrowUpRight, 
  ArrowDownRight,
  Activity
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
              <span className="text-4xl font-black text-red-600 tracking-tighter leading-none uppercase">
                Reports
              </span>
            </div>
          </div>
        </div>

        {/* REPORT SELECTOR (TOP CARDS) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 flex-row items-center gap-4 cursor-pointer border-2 border-red-600 shadow-red-900/10 hover:shadow-lg transition-all hover:-translate-y-1">
            <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center text-white shadow-md">
              <TrendingUp size={24} />
            </div>
            <div>
              <h3 className="text-[11px] font-black uppercase text-slate-900 tracking-wider">Production Report</h3>
              <p className="text-[10px] font-bold text-slate-800 uppercase tracking-tight">Performance and trends</p>
            </div>
          </Card>

          <Card className="p-6 flex-row items-center gap-4 cursor-pointer border-slate-200/60 hover:border-slate-400 opacity-60 hover:opacity-100 transition-all hover:-translate-y-1">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h3 className="text-[11px] font-black uppercase text-slate-900 tracking-wider">Quality Report</h3>
              <p className="text-[10px] font-bold text-slate-800 uppercase tracking-tight">Inspection results</p>
            </div>
          </Card>

          <Card className="p-6 flex-row items-center gap-4 cursor-pointer border-slate-200/60 hover:border-slate-400 opacity-60 hover:opacity-100 transition-all hover:-translate-y-1">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600">
              <Boxes size={24} />
            </div>
            <div>
              <h3 className="text-[11px] font-black uppercase text-slate-900 tracking-wider">Inventory Report</h3>
              <p className="text-[10px] font-bold text-slate-800 uppercase tracking-tight">Stock levels & movements</p>
            </div>
          </Card>
        </div>

        {/* MAIN CONTENT AREA */}
        <Card className="p-0 border-slate-200/60 overflow-hidden flex flex-col bg-white">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
                <FileBarChart size={16} />
              </div>
              <h2 className="text-xs font-black uppercase tracking-[0.1em] text-slate-800">Production Performance Report</h2>
            </div>
            <Button variant="default">
              <Download size={14} /> Export to PDF
            </Button>
          </div>

          <div className="p-8 grid grid-cols-1 lg:grid-cols-4 gap-8 bg-slate-50/20">
            
            {/* KPI COLUMN */}
            <div className="col-span-1 flex flex-col gap-5">
              <Card className="p-5 border-slate-200/60 shadow-sm bg-white hover:border-slate-300">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Completed</p>
                  <Activity size={14} className="text-slate-700" />
                </div>
                <div className="flex items-end gap-3">
                  <span className="text-4xl font-black text-slate-900 tracking-tighter leading-none">{totalCompleted}</span>
                  <Badge variant="success" className="mb-1">
                    <ArrowUpRight size={10} className="mr-1" /> {trends.completed}
                  </Badge>
                </div>
              </Card>

              <Card className="p-5 border-slate-200/60 shadow-sm bg-white hover:border-slate-300">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Planned</p>
                  <FileBarChart size={14} className="text-slate-700" />
                </div>
                <div className="flex items-end gap-3 mt-1">
                  <span className="text-4xl font-black text-slate-900 tracking-tighter leading-none">{plannedOrders}</span>
                </div>
              </Card>

              <Card className="p-5 border-slate-200/60 shadow-sm bg-white hover:border-slate-300">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Efficiency</p>
                  <TrendingUp size={14} className="text-slate-700" />
                </div>
                <div className="flex items-end gap-3 mt-1">
                  <span className="text-4xl font-black text-slate-900 tracking-tighter leading-none">{completionRate}%</span>
                  <Badge variant="destructive" className="mb-1">
                    <ArrowDownRight size={10} className="mr-1" /> {trends.rate}
                  </Badge>
                </div>
              </Card>
            </div>

            {/* MAIN CHART AREA */}
            <Card className="col-span-3 p-8 border-slate-200/60 shadow-sm bg-white flex flex-col">
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-[11px] font-black uppercase text-slate-700 tracking-widest">Production vs Planned <span className="text-slate-700 mx-2">|</span> Q1 2026</h3>
                <Badge variant="outline" className="opacity-70">Quarterly View</Badge>
              </div>
              
              <div className="flex-1 w-full bg-slate-50/50 rounded-xl border border-dashed border-slate-200 flex items-end justify-around my-2 relative">
                {/* Y-Axis Grid Lines & Labels */}
                <div className="absolute inset-0 flex flex-col justify-between py-6 px-4">
                  {[320, 240, 160, 80, 0].map((val) => (
                    <div key={val} className="flex items-center w-full gap-4">
                      <span className="text-[9px] font-black text-slate-700 w-6 text-right">{val}</span>
                      <div className="flex-1 border-b border-dashed border-slate-200/80"></div>
                    </div>
                  ))}
                </div>

                {/* Bars */}
                <div className="flex flex-col items-center gap-4 z-10 w-24">
                  <div className="w-16 bg-slate-800 rounded-t-md transition-all hover:bg-red-600 shadow-md" style={{ height: '180px' }}></div>
                  <span className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">Jan</span>
                </div>
                <div className="flex flex-col items-center gap-4 z-10 w-24">
                  <div className="w-16 bg-slate-800 rounded-t-md transition-all hover:bg-red-600 shadow-md" style={{ height: '240px' }}></div>
                  <span className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">Feb</span>
                </div>
                <div className="flex flex-col items-center gap-4 z-10 w-24">
                  <div className="w-16 bg-slate-800 rounded-t-md transition-all hover:bg-red-600 shadow-md" style={{ height: '140px' }}></div>
                  <span className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">Mar</span>
                </div>
              </div>
            </Card>
          </div>
        </Card>

        {/* FOOTER SYSTEM STATUS */}
        <Card className="bg-slate-900 p-4 px-6 flex-row justify-between items-center border-none">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
            <p className="text-[9px] font-black text-slate-800 uppercase tracking-[0.3em]">
              Data Refresh: 100% Sync <span className="text-slate-700 mx-2">//</span> Kizuna Analytics Engine
            </p>
          </div>
          <p className="text-[9px] font-bold text-slate-700 uppercase tracking-widest italic">
            Reference: {new Date().getFullYear()}-Q1-PERF
          </p>
        </Card>

      </div>
    </MainLayout>
  );
}