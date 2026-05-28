import { useState, useEffect } from "react";
import MainLayout from "@/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { dataApi } from "@/lib/api";
import { 
  FileBarChart, 
  TrendingUp, 
  ShieldCheck, 
  Boxes, 
  Download, 
  Activity,
  Calendar,
  Loader2,
  PieChart as LucidePieChart,
  Zap,
  Target,
  AlertTriangle,
  Radar,
  ArrowRight
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  Legend
} from 'recharts';

interface IProductionEvent {
  id: string;
  orderId: number;
  recipeName: string;
  status: string;
  type: string;
  timestamp: string;
  quantity: number;
}

interface IInventoryEvent {
  id: string;
  inventoryId: number;
  inventoryName: string;
  status: string;
  type: string;
  quantity: number;
  timestamp: string;
}

interface IQualityEvent {
  id: string;
  orderId: number;
  productName: string;
  type: string;
  result: string;
  timestamp: string;
}

type ReportType = 'PRODUCTION' | 'QUALITY' | 'INVENTORY';
type PeriodPreset = 'today' | '7d' | '30d' | 'all';

const PERIOD_OPTIONS: { id: PeriodPreset; label: string }[] = [
  { id: 'today', label: 'Hoje' },
  { id: '7d', label: '7 dias' },
  { id: '30d', label: '30 dias' },
  { id: 'all', label: 'Tudo' },
];

const PRODUCTION_STATUS_FILTERS = ['ALL', 'PLANNED', 'START', 'PAUSED', 'FINISH', 'WAITING_INSPECTION', 'APPROVED', 'CANCELLED'];
const QUALITY_RESULT_FILTERS = ['ALL', 'APPROVED', 'REJECTED', 'REWORK'];

function buildFilterParams(period: PeriodPreset, extra: Record<string, string | boolean> = {}) {
  const params = new URLSearchParams({ period });
  Object.entries(extra).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '' || value === 'ALL' || value === false) {
      return;
    }
    params.set(key, value === true ? 'true' : String(value));
  });
  return params.toString();
}

export default function ReportsPage() {
  const [reportType, setReportType] = useState<ReportType>('PRODUCTION');
  const [period, setPeriod] = useState<PeriodPreset>('30d');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [resultFilter, setResultFilter] = useState('ALL');
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [metrics, setMetrics] = useState<any>(null);
  const [oeeMetrics, setOeeMetrics] = useState<any>(null);
  const [eventLogs, setEventLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
  }, [reportType, period, statusFilter, resultFilter, lowStockOnly]);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      const query = buildFilterParams(period);
      const metricsEndpoint = reportType === 'PRODUCTION' ? '/dashboard/production' : 
                              reportType === 'QUALITY' ? '/dashboard/quality' : '/dashboard/inventory';
      
      const eventExtra =
        reportType === 'PRODUCTION' ? { status: statusFilter } :
        reportType === 'QUALITY' ? { result: resultFilter } :
        { lowStockOnly };
      const eventsQuery = buildFilterParams(period, eventExtra);

      const requests = [
        dataApi.get(`${metricsEndpoint}?${query}`),
        dataApi.get(`/report/${reportType === 'PRODUCTION' ? 'production' : reportType === 'QUALITY' ? 'quality' : 'inventory'}-events?${eventsQuery}`),
      ];
      if (reportType === 'PRODUCTION') {
        requests.push(dataApi.get(`/dashboard/oee?${query}`));
      }

      const results = await Promise.all(requests);
      setMetrics(results[0].data);
      setEventLogs(results[1].data || []);
      setOeeMetrics(reportType === 'PRODUCTION' ? results[2]?.data : null);
    } catch (error) {
      console.error("Failed to fetch metrics and events", error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      setLoading(true);
      const res = await dataApi.get(`/report/export?${buildFilterParams(period)}`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `KIZUNA_ANALYTICS_REPORT_${new Date().getTime()}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export failed", error);
    } finally {
      setLoading(false);
    }
  };

  const getChartData = () => {
    if (!metrics) return [];
    if (reportType === 'PRODUCTION') {
      return [
        { name: 'TOTAL', value: Number(metrics.totalOrders || 0), fill: '#ef4444' },
        { name: 'IN PROGRESS', value: Number(metrics.StartedOrders || 0), fill: '#3b82f6' },
        { name: 'FINISHED', value: Number(metrics.finishedOrders || 0), fill: '#10b981' }
      ];
    }
    if (reportType === 'QUALITY') {
      return [
        { name: 'APPROVED', value: Number(metrics.aprovedOrders || 0), fill: '#10b981' },
        { name: 'REJECTED', value: Number(metrics.rejectedOrders || 0), fill: '#f43f5e' },
        { name: 'REWORK', value: Number(metrics.reworkOrders || 0), fill: '#f59e0b' }
      ];
    }
    if (reportType === 'INVENTORY') {
      return [
        { name: 'HEALTHY', value: Math.max(0, Number(metrics.totalItems || 0) - Number(metrics.lowStockItems || 0)), fill: '#10b981' },
        { name: 'LOW_STOCK', value: Number(metrics.lowStockItems || 0), fill: '#f59e0b' }
      ];
    }
    return [];
  };

  return (
    <MainLayout>
      <div className="p-8 space-y-8 max-w-[1700px] mx-auto animate-in fade-in duration-700 bg-[#050505] min-h-[calc(100vh-80px)]">
        
        {/* HEADER INDUSTRIAL COM SUBMENU INTEGRADO */}
        <div className="flex flex-col gap-6 border-l-[6px] border-red-700 pl-5 py-4 bg-transparent/40 backdrop-blur-sm mb-4">
          <div className="flex items-end justify-between">
            <div className="flex flex-col text-left">
              <span className="text-[10px] font-black text-red-600 uppercase tracking-[0.4em] mb-1">
                Tactical Intelligence
              </span>
              <div className="flex items-baseline gap-2">
                <h1 className="text-4xl font-black text-white tracking-tighter leading-none uppercase">
                  Data
                </h1>
                <span className="text-4xl font-black text-red-600 tracking-tighter leading-none uppercase">
                  Reports
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={() => handleExport()} className="bg-red-700 hover:bg-red-600 text-[10px] font-black text-white uppercase tracking-widest h-11 px-8 gap-3 shadow-[0_0_20px_rgba(220,38,38,0.4)] border border-red-500/50 transition-all hover:scale-105 group">
                <Download size={16} className="group-hover:translate-y-0.5 transition-transform" /> 
                EXPORT ANALYTICAL REPORT (PDF)
              </Button>
            </div>
          </div>
        </div>

        {/* NAVIGATION SELECTOR */}
        <Card className="p-2 border-white/5 bg-slate-900/40 backdrop-blur-md rounded-2xl">
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'PRODUCTION' as const, label: 'Production Stream', icon: <Activity size={16} /> },
              { id: 'QUALITY' as const, label: 'Quality Control', icon: <ShieldCheck size={16} /> },
              { id: 'INVENTORY' as const, label: 'Inventory Node', icon: <Boxes size={16} /> }
            ].map((type) => (
              <button
                key={type.id}
                onClick={() => setReportType(type.id)}
                className={`flex items-center justify-center gap-3 py-5 rounded-xl transition-all font-black text-[10px] uppercase tracking-[0.2em] relative overflow-hidden group ${
                  reportType === type.id 
                    ? 'bg-white text-slate-950 shadow-[0_0_25px_rgba(255,255,255,0.15)] scale-[1.01]' 
                    : 'text-slate-500 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className={`${reportType === type.id ? 'text-red-600' : 'group-hover:text-red-500'} transition-colors`}>
                   {type.icon}
                </div>
                {type.label}
                {reportType === type.id && (
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-red-600" />
                )}
              </button>
            ))}
          </div>
        </Card>

        {/* FILTERS */}
        <Card className="p-6 border-white/5 bg-slate-900/30 backdrop-blur-md rounded-2xl space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mr-2">Período</span>
            {PERIOD_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setPeriod(opt.id)}
                className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
                  period === opt.id
                    ? 'bg-red-700 text-white shadow-[0_0_15px_rgba(220,38,38,0.35)]'
                    : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {opt.label}
              </button>
            ))}
            {metrics?.periodLabel && (
              <Badge variant="outline" className="ml-auto text-[9px] font-black uppercase border-white/10 text-slate-500">
                Janela: {metrics.periodLabel}
              </Badge>
            )}
          </div>

          {reportType === 'PRODUCTION' && (
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/5">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mr-2">Status OP</span>
              {PRODUCTION_STATUS_FILTERS.map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1.5 rounded-md text-[9px] font-black uppercase tracking-wider ${
                    statusFilter === status
                      ? 'bg-blue-600 text-white'
                      : 'bg-white/5 text-slate-500 hover:text-white'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          )}

          {reportType === 'QUALITY' && (
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/5">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mr-2">Resultado</span>
              {QUALITY_RESULT_FILTERS.map((result) => (
                <button
                  key={result}
                  onClick={() => setResultFilter(result)}
                  className={`px-3 py-1.5 rounded-md text-[9px] font-black uppercase tracking-wider ${
                    resultFilter === result
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white/5 text-slate-500 hover:text-white'
                  }`}
                >
                  {result}
                </button>
              ))}
            </div>
          )}

          {reportType === 'INVENTORY' && (
            <div className="flex items-center gap-3 pt-2 border-t border-white/5">
              <button
                onClick={() => setLowStockOnly((v) => !v)}
                className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                  lowStockOnly ? 'bg-amber-600 text-white' : 'bg-white/5 text-slate-400 hover:text-white'
                }`}
              >
                Somente estoque baixo (&lt; 10)
              </button>
            </div>
          )}
        </Card>

        {/* MAIN DASHBOARD GRID */}
        <div className="grid grid-cols-12 gap-8 items-start">
           
           {/* LEFT COLUMN: KPI CARDS + ULTRA SONAR */}
           <div className="col-span-12 xl:col-span-4 space-y-8">
              
              {/* KPI STACK */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-6">
                 {loading ? (
                    [...Array(4)].map((_, i) => (
                       <Card key={i} className="h-32 bg-white/[0.02] border-white/5 animate-pulse" />
                    ))
                 ) : (
                    <>
                       {reportType === 'PRODUCTION' && (
                          <>
                             <KPICard label="Total Work Orders" val={metrics?.totalOrders} icon={<Boxes />} color="text-white" />
                             <KPICard label="In Progress" val={metrics?.StartedOrders} icon={<Activity />} color="text-blue-500" />
                             <KPICard label="Produced Output" val={metrics?.finishedOrders} icon={<ShieldCheck />} color="text-emerald-500" />
                             <KPICard label="Efficiency Factor" val={metrics?.efficiencyPercent ?? (metrics?.totalOrders ? Math.round((metrics.finishedOrders / metrics.totalOrders) * 100) : 0)} icon={<Zap />} color="text-amber-500" suffix="%" />
                             <KPICard label="OEE (simplificado)" val={oeeMetrics?.oeePercent ?? 0} icon={<Target />} color="text-red-500" suffix="%" />
                             <KPICard label="Disponibilidade" val={oeeMetrics?.availabilityPercent ?? 0} icon={<TrendingUp />} color="text-blue-400" suffix="%" />
                          </>
                       )}
                       {reportType === 'QUALITY' && (
                          <>
                             <KPICard label="Total Inspections" val={metrics ? (metrics.aprovedOrders || 0) + (metrics.rejectedOrders || 0) + (metrics.reworkOrders || 0) : 0} icon={<Target />} color="text-white" />
                             <KPICard label="Safety Approved" val={metrics?.aprovedOrders} icon={<ShieldCheck />} color="text-emerald-500" />
                             <KPICard label="Rejected Units" val={metrics?.rejectedOrders} icon={<AlertTriangle />} color="text-red-500" />
                             <KPICard label="Rework" val={metrics?.reworkOrders} icon={<Activity />} color="text-amber-500" />
                             <KPICard label="Rejection Rate" val={metrics?.rejectionRatePercent ?? 0} icon={<AlertTriangle />} color="text-red-400" suffix="%" />
                             <KPICard label="Yield Percentage" val={metrics?.yieldPercent ?? (metrics ? Math.round((metrics.aprovedOrders / ((metrics.aprovedOrders || 0) + (metrics.rejectedOrders || 0) || 1)) * 100) : 0)} icon={<Activity />} color="text-blue-400" suffix="%" />
                          </>
                       )}
                       {reportType === 'INVENTORY' && (
                          <>
                             <KPICard label="SKU Index" val={metrics?.totalItems} icon={<Boxes />} color="text-white" />
                             <KPICard label="Low Stock Alert" val={metrics?.lowStockItems} icon={<AlertTriangle />} color="text-red-600" />
                             <KPICard label="Inventory Health" val={metrics ? Math.round((((metrics.totalItems || 0) - (metrics.lowStockItems || 0)) / (metrics.totalItems || 1)) * 100) : 0} icon={<TrendingUp />} color="text-emerald-500" suffix="%" />
                             <KPICard label="Supply Capacity" val={metrics?.totalItems} icon={<Target />} color="text-blue-500" />
                          </>
                       )}
                    </>
                 )}
              </div>

              {/* ULTRA SONAR TACTICAL SCANNER */}
              <Card className="p-12 border-white/10 bg-black/60 backdrop-blur-3xl flex flex-col items-center justify-center relative overflow-hidden group min-h-[550px] shadow-[0_0_50px_rgba(220,38,38,0.05)] border-t-2 border-t-red-600/20">
                 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none" />
                 
                 <div className="absolute top-6 left-8 flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping shadow-[0_0_5px_#dc2626]" />
                    <h4 className="text-[10px] font-black uppercase text-slate-500 tracking-[0.4em] italic">Tactical Area Scanner</h4>
                 </div>

                 <div className="relative w-80 h-80 flex items-center justify-center mt-4">
                    <div className="absolute inset-x-[-40px] inset-y-[-40px] border border-white/[0.02] rounded-full" />
                    <div className="absolute inset-[-20px] border border-white/[0.05] rounded-full" />
                    <div className="absolute inset-0 border-2 border-dashed border-red-900/40 rounded-full animate-[spin_60s_linear_infinite]" />
                    <div className="absolute inset-6 border border-white/5 rounded-full shadow-inner" />
                    
                    <div className="absolute inset-0 rounded-full overflow-hidden">
                       <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-red-600/20 opacity-40 animate-[spin_6s_linear_infinite] origin-center" style={{ width: '100%', height: '100%', borderRadius: '50%', background: 'conic-gradient(from 0deg at 50% 50%, transparent 0deg, transparent 300deg, rgba(220, 38, 38, 0.2) 360deg)' }} />
                    </div>

                    <div className="absolute inset-28 bg-red-950/20 rounded-full border-2 border-red-500/30 flex items-center justify-center shadow-[0_0_30px_rgba(220,38,38,0.2)]">
                       <LucidePieChart size={64} className="text-red-500 animate-[spin_12s_linear_infinite]" />
                    </div>
                    
                    <div className="absolute w-full h-px bg-white/5 top-1/2 left-0 -translate-y-1/2" />
                    <div className="absolute h-full w-px bg-white/5 left-1/2 top-0 -translate-x-1/2" />
                 </div>

                 <div className="mt-16 text-center space-y-3 z-10">
                    <div className="flex flex-col items-center gap-1">
                       <p className="text-[14px] font-black text-white uppercase tracking-[0.3em] italic mb-1">Operational_Stream_Live</p>
                       <div className="flex gap-1.5 opacity-30">
                          {[1,2,3,4,5,6].map(i => <div key={i} className="w-2 h-1 bg-red-600 rounded-full" />)}
                       </div>
                    </div>
                 </div>
              </Card>
           </div>
 
           {/* RIGHT COLUMN: MAIN VISUAL ANALYTICS + LARGE TABLE */}
           <div className="col-span-12 xl:col-span-8 space-y-8">
              
              <Card className="p-10 border-white/10 bg-black/40 backdrop-blur-xl relative overflow-hidden group min-h-[850px] flex flex-col shadow-2xl border-t-2 border-t-blue-600/20">
                 <div className="absolute top-0 right-0 p-8 opacity-[0.015] pointer-events-none group-hover:opacity-[0.03] transition-opacity duration-1000">
                    <Radar size={400} className="text-white" />
                 </div>
                 
                 <div className="flex justify-between items-start mb-12 relative z-10">
                    <div>
                       <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center border border-red-500/30">
                             <TrendingUp size={18} className="text-white" />
                          </div>
                          <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic">Distribution Protocol</h3>
                       </div>
                       <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest italic mt-1 pl-11">Real-time distribution mapping from data nodes</p>
                    </div>
                    <Badge className="bg-blue-950/40 text-blue-400 border-blue-500/30 text-[10px] font-black uppercase tracking-[0.2em] px-5 py-2 italic rounded-lg shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                       Analytics Hub v1.0
                    </Badge>
                 </div>
 
                 <div className="flex-1 w-full min-h-[500px] relative z-20 mt-4 px-2">
                    {loading ? (
                       <div className="h-full flex items-center justify-center">
                          <Loader2 className="animate-spin text-red-600" size={64} />
                       </div>
                    ) : (
                       <ResponsiveContainer width="100%" height={500}>
                          {reportType === 'QUALITY' ? (
                             <PieChart>
                                <Pie
                                   data={getChartData()}
                                   cx="50%"
                                   cy="50%"
                                   innerRadius={80}
                                   outerRadius={140}
                                   paddingAngle={8}
                                   dataKey="value"
                                   stroke="none"
                                >
                                   {getChartData().map((entry: any, index: number) => (
                                      <Cell key={`cell-${index}`} fill={entry.fill} />
                                   ))}
                                </Pie>
                                <Tooltip 
                                   contentStyle={{ backgroundColor: '#020617', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                                   itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: '900' }}
                                />
                                <Legend layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{ fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', color: '#64748b', paddingLeft: '20px' }} />
                             </PieChart>
                          ) : (
                             <BarChart data={getChartData()} margin={{ top: 20, right: 30, left: 10, bottom: 40 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                                <XAxis 
                                   dataKey="name" 
                                   axisLine={false} 
                                   tickLine={false} 
                                   tick={{ fill: '#475569', fontSize: 10, fontWeight: '900' }} 
                                />
                                <YAxis 
                                   axisLine={false} 
                                   tickLine={false} 
                                   tick={{ fill: '#475569', fontSize: 10, fontWeight: '900' }} 
                                />
                                <Tooltip 
                                   cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                                   contentStyle={{ backgroundColor: '#020617', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                                   itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: '900' }}
                                />
                                <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={80}>
                                   {getChartData().map((entry: any, index: number) => (
                                      <Cell key={`cell-${index}`} fill={entry.fill} />
                                   ))}
                                </Bar>
                             </BarChart>
                          )}
                       </ResponsiveContainer>
                    )}
                 </div>
              </Card>

              {/* HISTORICAL TABLE SECTION */}
              <Card className="border-white/10 bg-black/60 backdrop-blur-3xl overflow-hidden shadow-2xl border-t-2 border-t-emerald-600/20">
                 <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
                    <div className="flex items-center gap-5">
                       <div className="w-12 h-12 bg-emerald-600/10 rounded-xl flex items-center justify-center border border-emerald-500/20">
                          <Calendar size={22} className="text-emerald-500" />
                       </div>
                       <div>
                          <h3 className="text-lg font-black uppercase tracking-[0.2em] text-white italic leading-none mb-1">Synchronization Logs</h3>
                          <p className="text-[10px] font-bold text-slate-600 uppercase italic tracking-widest">Real-time data stream from KIZUNA nodes</p>
                       </div>
                    </div>
                    <Badge className="bg-emerald-950/40 text-emerald-500 border-emerald-500/30 text-[10px] font-black uppercase tracking-widest px-5 py-1.5 shadow-inner">
                       Records: {eventLogs.length}
                    </Badge>
                 </div>
                 
                 <div className="max-h-[600px] overflow-y-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                       <thead className="sticky top-0 bg-[#0a0a0a] z-20 border-b border-white/5">
                          <tr>
                             <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest pl-10">Transmission Index</th>
                             <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">{reportType === 'INVENTORY' ? 'Identifier' : 'Protocol'}</th>
                             <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">{reportType === 'PRODUCTION' ? 'Operational Status' : 'Type Class'}</th>
                             <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right pr-10">{reportType === 'QUALITY' ? 'Result' : 'Value'}</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-white/5 bg-slate-900/5">
                          {eventLogs.map((log) => (
                             <tr key={log.id} className="hover:bg-white/[0.01] transition-all group/row">
                                <td className="p-6 pl-10">
                                   <div className="flex flex-col">
                                      <span className="text-[12px] font-bold text-white">{new Date(log.timestamp).toLocaleDateString('en-US')}</span>
                                      <span className="text-[9px] font-black text-slate-600 font-mono tracking-tighter uppercase">{new Date(log.timestamp).toLocaleTimeString('en-US', {hour: '2-digit', minute:'2-digit'})}</span>
                                   </div>
                                </td>
                                <td className="p-6 text-[11px] font-black text-slate-300 uppercase tracking-tighter italic">
                                   {log.recipeName || log.inventoryName || log.productName || 'NODE_EVENT'}
                                </td>
                                <td className="p-6">
                                   <Badge variant="outline" className={`text-[9px] font-black uppercase px-3 ${
                                      log.status === 'IN_PROGRESS' || log.status === 'START' ? 'border-blue-500/30 bg-blue-500/5 text-blue-500' :
                                      log.status === 'FINISHED_BY_TIME' || log.status === 'FINISH' || log.status === 'WAITING_INSPECTION' || log.status === 'APPROVED' ? 'border-emerald-500/30 bg-emerald-500/5 text-emerald-500' :
                                      log.status === 'PAUSED' ? 'border-amber-500/30 bg-amber-500/5 text-amber-500' :
                                      log.status === 'CANCELLED' || log.status === 'REJECTED' ? 'border-red-500/30 bg-red-500/5 text-red-500' :
                                      'border-white/10 bg-white/[0.01] text-slate-500'
                                   }`}>
                                      {log.status || log.type || 'RAW'}
                                   </Badge>
                                </td>
                                <td className="p-6 text-right pr-10">
                                   {reportType === 'QUALITY' ? (
                                      <Badge className={`${log.result === 'APPROVED' ? 'bg-emerald-950/30 text-emerald-500 border-emerald-500/20' : 'bg-red-950/30 text-red-500 border-red-500/20'} text-[10px] font-black uppercase border italic px-4 py-1 rounded-md`}>
                                         {log.result}
                                      </Badge>
                                   ) : (
                                      <span className="text-lg font-mono font-black text-white italic">
                                         {log.quantity !== undefined ? log.quantity : log.status || '-'}
                                      </span>
                                   )}
                                </td>
                             </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>
              </Card>
           </div>
        </div>
 
      </div>
    </MainLayout>
  );
}

function KPICard({ label, val, icon, color = "text-white", suffix = "" }: any) {
  return (
    <Card className="p-7 border-white/5 bg-white/[0.02] hover:border-white/10 transition-all group overflow-hidden relative backdrop-blur-md rounded-2xl shadow-xl hover:-translate-y-1">
      <div className="absolute top-0 right-0 p-5 opacity-[0.03] group-hover:opacity-[0.1] transition-all transform translate-x-2 -translate-y-2 group-hover:scale-150 rotate-12 bg-white/[0.05] rounded-full">
         {icon && <div className={color}>{icon}</div>}
      </div>
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div className="flex items-center gap-2 mb-1">
           <div className={`w-1 h-3 rounded-full ${color.replace('text-', 'bg-')} opacity-30`} />
           <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{label}</p>
        </div>
      </div>
      <div className="flex items-end gap-1.5 relative z-10 pb-2">
        <span className={`text-[46px] font-black tracking-tighter leading-none italic tabular-nums ${color}`}>
          {(val !== undefined && val !== null) ? val.toString().padStart(2, '0') : '--'}
        </span>
        <span className="text-[14px] font-black text-slate-600 mb-1.5 ml-0.5 tracking-tighter uppercase">{suffix || "Units"}</span>
      </div>
    </Card>
  );
}
