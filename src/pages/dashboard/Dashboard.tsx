import MainLayout from "@/layouts/MainLayout";
import { 
  TrendingUp, TrendingDown, TriangleAlert, CheckCircle2, 
  Package, ClipboardList
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DASHBOARD_KPIS, PRODUCTION_QUEUE, INVENTORY_ALERTS, PENDING_INSPECTIONS } from "@/mocks/dashboardData";

export default function Dashboard() {
  
  const getBadgeStyle = (priority: string) => {
    switch (priority) {
      case "High": return "bg-red-50 text-red-700 border-red-100";
      case "Medium": return "bg-yellow-50 text-yellow-700 border-yellow-100";
      case "Low": return "bg-green-50 text-green-700 border-green-100";
      default: return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  const chartData = [
    { day: "Mon", value: 45, max: 80 },
    { day: "Tue", value: 55, max: 80 },
    { day: "Wed", value: 48, max: 80 },
    { day: "Thu", value: 62, max: 80 },
    { day: "Fri", value: 55, max: 80 }
  ];

  return (
    <MainLayout>
      <div className="px-8 pb-12 space-y-6 pt-4 bg-[#f8fafc] min-h-screen">
        
        {/* HEADER DE TÍTULO PADRÃO */}
        <div className="flex items-end justify-between border-l-[6px] border-red-700 pl-5 mb-8">
          <div className="flex flex-col text-left">
            <span className="text-[10px] font-black text-red-600 uppercase tracking-[0.4em] mb-1">
              System Overview
            </span>
            <div className="flex items-baseline gap-2">
              <h1 className="text-4xl font-black text-slate-900 tracking-tighter leading-none">
               DASHBOARD
              </h1>
              <span className="text-3xl font-thin text-slate-700 tracking-tighter uppercase leading-none">
                
              </span>
            </div>
          </div>
        </div>

        {/* 1. KPIs ESSENCIAIS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {DASHBOARD_KPIS.map((kpi, i) => (
            <Card key={i} className="p-6 flex flex-col justify-between min-h-[145px] border-slate-200 shadow-sm hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:-translate-y-1 transition-all duration-300 !rounded-2xl bg-white group border-t-4 border-t-white hover:border-t-slate-100">
              <div className="flex justify-between items-start">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 ${kpi.bg}`}>
                  <kpi.icon className={`w-5 h-5 ${kpi.color}`} strokeWidth={2.5} />
                </div>
                {kpi.trend && (
                  <span className={`text-[11px] font-black uppercase tracking-widest flex items-center gap-1.5 px-2 py-1 bg-slate-50 rounded-lg border border-slate-100 ${kpi.trendColor}`}>
                    {kpi.trendUp ? <TrendingUp size={14} strokeWidth={3} /> : <TrendingDown size={14} strokeWidth={3} />} 
                    {kpi.trend}
                  </span>
                )}
              </div>
              <div className="text-left mt-3">
                <p className="text-[11px] font-bold text-slate-800 uppercase tracking-widest mb-0.5 group-hover:text-slate-800 transition-colors">{kpi.label}</p>
                <h3 className="text-3xl font-black text-slate-900 tracking-tighter leading-none">{kpi.value}</h3>
              </div>
            </Card>
          ))}
        </div>

        {/* 2. GRID PRINCIPAL (Chart + Orders) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          
          {/* Chart Card */}
          <Card className="p-7 flex flex-col border-slate-200 shadow-sm !rounded-2xl min-h-[420px] bg-white">
            <h2 className="text-sm font-black uppercase tracking-widest text-slate-800 mb-8 text-left">Production Metrics</h2>
            
            <div className="flex-1 relative flex items-end ml-4">
              {/* Y Axis Grid Lines */}
              <div className="absolute inset-0 flex flex-col justify-between text-left">
                {[80, 60, 40, 20, 0].map((val) => (
                  <div key={val} className="flex items-center w-full h-0 relative group/line">
                    <span className="text-[10px] font-bold text-slate-800 absolute -left-7 -translate-y-[50%] bg-white pr-2 group-hover/line:text-blue-500 transition-colors w-8 text-right">{val}</span>
                    <div className="w-full border-t border-dashed border-slate-100 relative z-0 group-hover/line:border-blue-100 transition-colors" />
                  </div>
                ))}
              </div>

              {/* X Axis & Bars */}
              <div className="relative z-10 w-full h-full flex items-end justify-around pl-4 pb-[1px]">
                {chartData.map((data, i) => (
                  <div key={i} className="flex flex-col items-center gap-3 w-14 h-full justify-end group/bar">
                    {/* Tooltip Hover value */}
                    <span className="text-[11px] font-black text-blue-600 opacity-0 group-hover/bar:opacity-100 group-hover/bar:translate-y-[-2px] transition-all duration-300">
                      {data.value}
                    </span>
                    <div 
                      className="w-full bg-slate-200/80 rounded-t-md group-hover/bar:bg-gradient-to-t group-hover/bar:from-blue-600 group-hover/bar:to-blue-400 shadow-inner group-hover/bar:shadow-[0_0_15px_rgba(59,130,246,0.2)] transition-all duration-300 relative border border-slate-200 border-b-0 group-hover/bar:border-blue-500/50" 
                      style={{ height: `${(data.value / data.max) * 100}%` }}
                    >
                      {/* Efeito highlight gloss na barra quando em hover */}
                      <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent opacity-0 group-hover/bar:opacity-100 transition-opacity rounded-t-md" />
                    </div>
                    <span className="text-[11px] font-black text-slate-800 uppercase tracking-widest absolute -bottom-7 group-hover/bar:text-blue-600 transition-colors">{data.day}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Recent Orders List */}
          <Card className="p-7 bg-white border-slate-200 shadow-sm !rounded-2xl flex flex-col flex-1 h-full">
            <h2 className="text-sm font-black uppercase tracking-widest text-slate-800 mb-6 text-left">Recent Production Orders</h2>
            
            <div className="flex flex-col gap-3">
              {PRODUCTION_QUEUE.map((po, i) => (
                <div 
                  key={i} 
                  className="p-4 bg-slate-50/40 hover:bg-slate-50/80 border border-slate-100 hover:border-slate-200 rounded-xl transition-all duration-300 flex justify-between items-start text-left cursor-default shadow-sm hover:shadow-md"
                >
                  <div>
                    <h4 className="font-bold text-slate-900 tracking-tight">{po.id}</h4>
                    <p className="text-[13px] font-bold text-slate-700 mt-0.5 mb-1">{po.name}</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-800">Deadline: {po.deadline}</p>
                  </div>
                  <Badge variant="outline" className={`!text-[10px] !font-black !uppercase !tracking-widest !px-3 !py-1 shadow-sm bg-white ${getBadgeStyle(po.priority)}`}>
                    {po.priority}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>

        </div>

        {/* BOTTOM ROW START (Alarms & Inspections) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-12 mt-8">
          
          <Card className="p-7 border-slate-200 shadow-sm !rounded-2xl bg-white">
            <h2 className="text-sm font-black uppercase tracking-widest text-slate-800 text-left mb-6">Low Inventory Alerts</h2>
            <div className="flex flex-col gap-3">
              {INVENTORY_ALERTS.map((alert, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-amber-50/40 border-l-4 border-l-amber-400 rounded-r-xl rounded-l-[3px] border-y border-r border-slate-100 hover:bg-amber-100/40 hover:border-y-amber-200/50 hover:border-r-amber-200/50 transition-all duration-300 shadow-sm hover:shadow-md">
                  <div className="text-left">
                     <h4 className="font-bold text-slate-900 tracking-tight">{alert.item}</h4>
                    <p className="text-[11px] font-bold text-slate-700 mt-1 uppercase tracking-widest">
                      Current: <span className="text-slate-700">{alert.current}</span> <span className="text-slate-700 mx-1">/</span> Min: {alert.min}
                    </p>
                  </div>
                  <TriangleAlert size={18} className="text-amber-500 drop-shadow-sm" />
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-7 border-slate-200 shadow-sm !rounded-2xl bg-white">
            <h2 className="text-sm font-black uppercase tracking-widest text-slate-800 text-left mb-6">Pending Inspections</h2>
            <div className="flex flex-col gap-3">
              {PENDING_INSPECTIONS.map((insp, i) => (
                <div key={i} className="p-4 bg-slate-50/40 hover:bg-slate-50/80 border border-slate-100 hover:border-slate-200 rounded-xl transition-all duration-300 flex justify-between items-start text-left shadow-sm hover:shadow-md">
                  <div>
                    <h4 className="font-bold text-slate-900 tracking-tight">{insp.id}</h4>
                    <p className="text-[13px] font-bold text-slate-700 mt-0.5 mb-1">{insp.product}</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-800">{insp.date}</p>
                  </div>
                  <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-200 !text-[10px] !font-black !uppercase !tracking-widest !px-3 !py-1 shadow-sm">
                    {insp.status}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
          
        </div>

      </div>
    </MainLayout>
  );
}