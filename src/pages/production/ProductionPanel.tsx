import { useState } from "react";
import MainLayout from "@/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Play, Pause, CheckCircle2, Info, Timer, Box, ListOrdered } from "lucide-react";
import { ACTIVE_ORDER_MOCK, NEXT_IN_LINE_MOCK } from "@/mocks/productionPanel";

export default function ProductionPanel() {
  const [activeOrder] = useState(ACTIVE_ORDER_MOCK);
  const progressPercent = (activeOrder.producedQuantity / activeOrder.plannedQuantity) * 100;

  return (
    <MainLayout>
      <div className="px-8 pb-8 space-y-6 mt-[-14px]">
        
        {/* HEADER */}
        <div className="flex items-end justify-between border-l-[6px] border-red-700 pl-5 py-4 bg-white/40 backdrop-blur-sm">
          <div className="flex flex-col text-left">
            <span className="text-[10px] font-black text-red-600 uppercase tracking-[0.4em] mb-1">
              Real-time Monitoring
            </span>
            <div className="flex items-baseline gap-2">
              <h1 className="text-4xl font-black text-slate-900 tracking-tighter leading-none uppercase">
                Production
              </h1>
              <span className="text-4xl font-black text-red-600 tracking-tighter leading-none uppercase">
                Panel
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* COLUNA ESQUERDA: ORDEM ATIVA (70%) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-slate-100 rounded-xl p-8 shadow-sm relative overflow-hidden">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <span className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Active Production Order</span>
                  <h2 className="text-3xl font-black text-slate-900 italic tracking-tighter">{activeOrder.id}</h2>
                </div>
                <Badge className="bg-slate-100 text-slate-800 font-black uppercase text-[10px] px-3">{activeOrder.status}</Badge>
              </div>

              <div className="grid grid-cols-2 gap-y-8 gap-x-12 mb-10">
                <div className="space-y-1">
                  <span className="text-[9px] font-black text-slate-800 uppercase">Product Name</span>
                  <p className="text-lg font-bold text-slate-700 tracking-tight">{activeOrder.product}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] font-black text-slate-800 uppercase">Priority Level</span>
                  <div>
                    <Badge className="bg-red-50 text-red-700 border-red-100 font-black uppercase text-[10px]">{activeOrder.priority}</Badge>
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] font-black text-slate-800 uppercase">Planned vs Produced</span>
                  <p className="text-lg font-bold text-slate-700 tracking-tight">
                    {activeOrder.plannedQuantity} <span className="text-slate-700 mx-1">/</span> <span className="text-blue-600">{activeOrder.producedQuantity} units</span>
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] font-black text-slate-800 uppercase">Started At</span>
                  <div className="flex items-center gap-2 text-slate-800 font-bold italic text-sm">
                    <Timer size={14} /> {activeOrder.startedAt}
                  </div>
                </div>
              </div>

              {/* PROGRESSO */}
              <div className="space-y-3 mb-10">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Production Progress</span>
                  <span className="text-xl font-black text-slate-900 tracking-tighter">{progressPercent.toFixed(1)}%</span>
                </div>
                <Progress value={progressPercent} className="h-4 bg-slate-100" />
              </div>

              {/* CONTROLES */}
              <div className="grid grid-cols-3 gap-4">
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase tracking-widest py-8 gap-3">
                  <Play size={20} fill="currentColor" /> Start Production
                </Button>
                <Button variant="outline" className="border-slate-200 text-slate-800 font-black uppercase tracking-widest py-8 gap-3">
                  <Pause size={20} fill="currentColor" /> Pause
                </Button>
                <Button variant="outline" className="border-slate-200 text-slate-800 font-black uppercase tracking-widest py-8 gap-3">
                  <CheckCircle2 size={20} /> Finish
                </Button>
              </div>
            </div>

            {/* INSTRUÇÕES */}
            <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-6 flex items-start gap-4">
              <Info className="text-blue-500 mt-1" size={20} />
              <div className="space-y-1">
                <h4 className="text-[10px] font-black text-blue-700 uppercase tracking-widest">Operational Instructions</h4>
                <p className="text-xs font-bold text-blue-600/80 leading-relaxed italic">
                  Follow standard operating procedures for this product. Update quantity as you complete each batch. Ensure quality checks are performed throughout the production process.
                </p>
              </div>
            </div>
          </div>

          {/* COLUNA DIREITA: FILA E RESUMO (30%) */}
          <div className="space-y-6">
            {/* NEXT IN LINE */}
            <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-6 border-b border-slate-50 pb-4">
                <ListOrdered size={18} className="text-slate-800" />
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-tighter">Production Queue</h3>
              </div>
              
              <div className="space-y-4">
                {NEXT_IN_LINE_MOCK.map((item, idx) => (
                  <div key={item.id} className="flex items-center gap-4 p-3 rounded-lg border border-slate-50 hover:border-slate-200 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-800">
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] font-black text-blue-600 italic tracking-tighter">{item.id}</p>
                      <p className="text-xs font-bold text-slate-700 truncate">{item.product}</p>
                    </div>
                    <Badge variant="outline" className="text-[8px] font-black uppercase">{item.priority}</Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* TODAY'S SUMMARY */}
            <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm">
               <div className="flex items-center gap-2 mb-6 border-b border-slate-50 pb-4">
                <Box size={18} className="text-slate-800" />
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-tighter">Today's Summary</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-lg">
                  <span className="text-[10px] font-black text-emerald-700 uppercase">Completed</span>
                  <span className="text-sm font-black text-emerald-700">3 Orders</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="text-[10px] font-black text-blue-700 uppercase">In Progress</span>
                  <span className="text-sm font-black text-blue-700">1 Order</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                  <span className="text-[10px] font-black text-slate-700 uppercase">Pending</span>
                  <span className="text-sm font-black text-slate-700">3 Orders</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </MainLayout>
  );
}