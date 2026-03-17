import MainLayout from "@/layouts/MainLayout";
import { 
  TrendingUp, Activity, TriangleAlert, CheckCircle2, 
  Clock, ChevronRight, PackageSearch, ShieldCheck,
  Users, FileText, ClipboardList, BarChart3,
  History, Inbox, ArrowUpRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
// Importando os dados mockados
import { DASHBOARD_KPIS, PRODUCTION_QUEUE, INVENTORY_ALERTS } from "@/mocks/dashboardData";

export default function Dashboard() {
  return (
    <MainLayout>
      {/* mt-[-14px] para colar de vez no header e subir o conteúdo visualmente */}
      <div className="px-8 pb-8 space-y-6 mt-[-14px]">
        
        {/* HEADER DE TÍTULO */}
        <div className="flex items-end justify-between border-l-[6px] border-red-700 pl-5 py-3 bg-white/40 backdrop-blur-sm">
          <div className="flex flex-col text-left">
            <span className="text-[10px] font-black text-red-600 uppercase tracking-[0.4em] mb-1">
              Live Monitor
            </span>
            <div className="flex items-baseline gap-2">
              <h1 className="text-4xl font-black text-slate-900 tracking-tighter leading-none">
                KIZUNA
              </h1>
              <span className="text-3xl font-thin text-slate-300 tracking-tighter uppercase leading-none">
                Dashboard
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full border border-emerald-100">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">System Online</span>
          </div>
        </div>

        {/* 1. KPIs ESSENCIAIS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {DASHBOARD_KPIS.map((kpi, i) => (
            <Card key={i} className="border-none shadow-sm bg-white relative overflow-hidden">
              <div className={`absolute top-0 right-0 w-16 h-16 ${kpi.bg} rounded-bl-[3rem] flex items-start justify-end p-4`}>
                <kpi.icon className={`${kpi.color} w-4 h-4`} />
              </div>
              <CardHeader className="p-5 pb-0 text-left">
                <CardTitle className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                  {kpi.label}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 pt-1 text-left">
                <div className="text-3xl font-black text-slate-900 tracking-tighter">{kpi.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 2. GRID PRINCIPAL */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Fila de Produção */}
          <Card className="lg:col-span-2 shadow-sm border-slate-100">
            <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 pb-4">
              <CardTitle className="text-sm font-black uppercase tracking-tight text-slate-700">Next in Line</CardTitle>
              <button className="text-[10px] font-black text-red-600 flex items-center gap-1 hover:underline">
                VIEW ALL QUEUE <ArrowUpRight size={14} />
              </button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-50">
                {PRODUCTION_QUEUE.map((po, i) => (
                  <div key={i} className="flex items-center justify-between p-4 hover:bg-slate-50/50 transition-colors">
                    <div className="flex flex-col text-left">
                      <span className="text-[10px] font-mono text-red-700 font-bold">{po.id}</span>
                      <span className="text-sm font-bold text-slate-800">{po.name}</span>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="flex flex-col items-end">
                        <span className="text-[9px] font-bold text-slate-400 uppercase">Est. Time</span>
                        <span className="text-xs font-mono font-bold text-slate-600">{po.deadline}</span>
                      </div>
                      <Badge variant={po.variant} className="text-[9px] font-black h-5 px-3 uppercase">
                        {po.priority}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Lateral: Alertas e Eficiência */}
          <div className="space-y-6">
            <Card className="border-l-4 border-l-red-600 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-[11px] font-black text-red-900 uppercase flex items-center gap-2">
                  <TriangleAlert size={14} /> Critical Stock
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {INVENTORY_ALERTS.map((alert, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-red-50/50 rounded-lg border border-red-100">
                    <span className="text-xs font-bold text-slate-700">{alert.item}</span>
                    <span className="text-xs font-black text-red-700">{alert.current}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-slate-900 text-white overflow-hidden p-6 relative">
              <div className="relative z-10 text-left">
                <p className="text-[9px] font-black text-red-500 uppercase tracking-[.2em] mb-1">Overall Efficiency</p>
                <h3 className="text-4xl font-black tracking-tighter">94.2%</h3>
                <div className="flex items-center gap-1 mt-2 text-emerald-400 text-[10px] font-bold">
                  <TrendingUp size={12} /> ON TARGET
                </div>
              </div>
              <div className="absolute -right-6 -bottom-6 w-24 h-24 border-[12px] border-white/5 rounded-full" />
            </Card>
          </div>
        </div>

      </div>
    </MainLayout>
  );
}