import { useState, useEffect } from "react";
import MainLayout from "@/layouts/MainLayout";
import { Card } from "@/components/ui/card";
import { 
  Activity, 
  Database, 
  ShieldCheck, 
  Zap, 
  Bell, 
  Terminal as TerminalIcon,
  Globe,
  Radio,
  Server,
  CheckCircle2,
  Lock,
  Cpu as AIChip
} from "lucide-react";
import { useHealth } from "@/contexts/HealthContext";
import { coreApi, dataApi, iamApi, auditApi, notificationApi, aiApi } from "@/lib/api";
import { extractHealthComponents, HealthComponentInfo } from "@/lib/healthDetails";
import { HEALTH_SERVICES } from "@/lib/systemHealth";

interface ServiceStatus {
  name: string;
  id: string;
  essential: boolean;
  status: "UP" | "DOWN" | "WARN" | "LOADING";
  latency: number;
  icon: any;
  endpoint: string;
  color: string;
  details?: Record<string, HealthComponentInfo>;
}

const SERVICE_UI: Record<string, { name: string; icon: typeof Server; endpoint: string; color: string }> = {
  core: { name: "CORE HUB", icon: Server, endpoint: "/api-core", color: "text-blue-500" },
  iam: { name: "IAM GATEWAY", icon: Lock, endpoint: "/api-iam", color: "text-amber-500" },
  data: { name: "DATA SYNC", icon: Database, endpoint: "/api-data", color: "text-cyan-500" },
  ai: { name: "NEURAL LINK (AI)", icon: AIChip, endpoint: "/api-ai", color: "text-purple-500" },
  audit: { name: "AUDIT LOGS", icon: ShieldCheck, endpoint: "/api-audit", color: "text-emerald-500" },
  notification: { name: "COMMS LINK", icon: Bell, endpoint: "/api-notification", color: "text-rose-500" },
};

export default function SystemHealth() {
  const { health, textStatus, colorHex, lastCheck } = useHealth();
  const [services, setServices] = useState<ServiceStatus[]>(() =>
    HEALTH_SERVICES.map((s) => {
      const ui = SERVICE_UI[s.id];
      return {
        id: s.id,
        essential: s.essential,
        name: ui.name,
        status: "LOADING",
        latency: 0,
        icon: ui.icon,
        endpoint: ui.endpoint,
        color: ui.color,
      };
    })
  );

  const [logs, setLogs] = useState<string[]>([]);
  
  const addLog = (msg: string) => {
    setLogs(prev => [ `[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 50));
  };

  const fetchServiceHealth = async (id: string) => {
    const apiMap: Record<string, any> = {
      core: coreApi,
      iam: iamApi,
      data: dataApi,
      audit: auditApi,
      notification: notificationApi,
      ai: aiApi
    };

    const start = Date.now();
    try {
      const api = apiMap[id];
      const res = await api.get(`/actuator/health?t=${start}`, { timeout: 5000 });
      const latency = Date.now() - start;
      const isUp = res.status === 200 && res.data?.status === 'UP';
      
      setServices(prev => prev.map(s => s.id === id ? { 
        ...s, 
        status: isUp ? "UP" : "WARN", 
        latency,
        details: extractHealthComponents(res.data),
      } : s));
      
      if (!isUp) {
        addLog(`WARN: ${id.toUpperCase()} responded with status ${res.data?.status || 'UNKNOWN'}`);
      }
    } catch (err: any) {
      const latency = Date.now() - start;
      setServices(prev => prev.map(s => s.id === id ? { 
        ...s, 
        status: "DOWN", 
        latency: 0 
      } : s));
      addLog(`ERR: ${id.toUpperCase()} uplink failed (${err.message || 'Remote Reset'})`);
    }
  };

  useEffect(() => {
    addLog("Uplink sync initiated. Real-time telemetry engaged.");
    
    const refreshAll = () => {
      setServices(prev => prev.map(s => ({ ...s, status: s.status === 'DOWN' ? 'DOWN' : 'LOADING' })));
      services.forEach(s => fetchServiceHealth(s.id));
    };

    refreshAll();
    const interval = setInterval(refreshAll, 20000);
    return () => clearInterval(interval);
  }, []);

  return (
    <MainLayout>
      <div className="px-8 pb-12 space-y-8 pt-4 bg-[#050505] min-h-[calc(100vh-80px)] relative overflow-hidden font-mono selection:bg-red-500/30">
        
        {/* Background Effects */}
        <div className="absolute inset-0 bg-tech-grid opacity-[0.4] pointer-events-none scale-125" />
        
        {/* Scanning Line Animation */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.05]">
          <div className="w-[200%] h-[2px] bg-red-600 absolute animate-[scan_8s_linear_infinite]" style={{ top: '-10%' }} />
        </div>

        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row justify-between items-end border-l-[6px] border-red-600 pl-5 mb-12 relative z-10">
          <div className="text-left">
            <span className="text-[10px] font-black text-red-500 uppercase tracking-[0.6em] mb-1 drop-shadow-[0_0_8px_rgba(220,38,38,0.5)] flex items-center gap-2">
              <Radio size={12} className="animate-pulse" /> Real-Time API Integrity Matrix
            </span>
            <div className="flex items-baseline gap-3">
              <h1 className="text-5xl font-black text-white tracking-tighter leading-none uppercase italic">
                System<span className="text-red-600">Health</span>
              </h1>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded border border-white/10">LIVE DATA</span>
            </div>
          </div>

          <div className="flex items-center gap-8 bg-black/40 backdrop-blur-xl border border-white/5 p-4 rounded-xl mt-4 md:mt-0">
             <div className="flex flex-col items-end px-4 border-r border-white/5">
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Global Health</span>
                <div className="flex items-center gap-2">
                   <div className={`w-2 h-2 rounded-full ${
                     health === 'RED' ? 'bg-red-600 animate-ping' :
                     health === 'YELLOW' ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]' :
                     health === 'OFFLINE' ? 'bg-slate-600 animate-pulse' :
                     'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]'
                   }`} />
                   <span className={`text-sm font-black uppercase italic ${colorHex}`}>{textStatus}</span>
                </div>
                <p className="text-[8px] text-slate-600 uppercase tracking-widest mt-1 text-right max-w-[220px]">
                  Verde: tudo ok · Amarelo: serviços opcionais · Vermelho: essenciais fora
                </p>
             </div>
             <div className="flex flex-col items-end px-4">
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Last Matrix Sync</span>
                <span className="text-sm font-black text-white uppercase italic flex items-center gap-2">
                   {lastCheck}
                </span>
             </div>
          </div>
        </div>

        {/* MAIN HUD GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
          
          {/* LEFT COLUMN: SERVICE MATRIX */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((service) => (
              <Card key={service.id} className="group relative bg-[#0a0a0a] border-white/5 p-6 rounded-2xl overflow-hidden hover:border-red-500/30 transition-all duration-500">
                <div className={`absolute top-0 left-0 w-1 h-full ${
                  service.status === 'UP' ? 'bg-emerald-500' :
                  service.status === 'LOADING' ? 'bg-slate-700' :
                  service.essential ? 'bg-red-600' : 'bg-amber-500'
                } opacity-50`} />
                
                <div className="flex justify-between items-start mb-6">
                   <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-white/[0.02] border border-white/5 ${service.color} shadow-inner`}>
                         <service.icon size={22} />
                      </div>
                      <div>
                         <h3 className="text-lg font-black text-white tracking-widest uppercase italic">{service.name}</h3>
                         <div className="flex items-center gap-2 mt-0.5">
                           <span className="text-[9px] font-bold text-slate-500 tracking-[0.2em]">{service.endpoint.toUpperCase()}</span>
                           <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded border ${
                             service.essential
                               ? 'text-red-400 border-red-500/30 bg-red-950/20'
                               : 'text-slate-500 border-white/10 bg-white/5'
                           }`}>
                             {service.essential ? 'Essencial' : 'Opcional'}
                           </span>
                         </div>
                      </div>
                   </div>
                   <div className={`text-[10px] font-black uppercase px-2 py-0.5 rounded border border-white/5 flex items-center gap-1.5 ${service.status === 'UP' ? 'text-emerald-500 bg-emerald-500/5' : service.status === 'LOADING' ? 'text-slate-500 bg-white/5' : 'text-red-500 bg-red-500/5'}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${service.status === 'UP' ? 'bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,1)]' : service.status === 'LOADING' ? 'bg-slate-700 animate-pulse' : 'bg-red-500 animate-pulse'}`} />
                      {service.status}
                   </div>
                </div>

                <div className="space-y-4">
                   <div className="flex justify-between items-center bg-black/40 p-4 rounded-xl border border-white/5">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Network Latency</span>
                      <span className={`text-xl font-black ${service.latency > 500 ? 'text-red-500' : 'text-white'}`}>{service.latency}ms</span>
                   </div>
                   
                   {service.details && Object.keys(service.details).length > 0 ? (
                      <div className="bg-black/20 p-4 rounded-xl border border-white/5 space-y-2">
                         <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest block mb-2">Telemetria</span>
                         <div className="grid grid-cols-1 gap-2">
                            {Object.entries(service.details).map(([key, comp]) => (
                               <div key={key} className="flex flex-col gap-0.5 text-[9px] font-bold uppercase border-b border-white/5 pb-2 last:border-0">
                                  <div className="flex items-center gap-2">
                                    <div className={`w-1.5 h-1.5 rounded-full ${comp.status === 'UP' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                                    <span className="text-slate-300">{comp.label}</span>
                                    <span className={comp.status === 'UP' ? 'text-emerald-500' : 'text-red-500'}>{comp.status}</span>
                                  </div>
                                  {comp.detail && (
                                    <span className="text-[8px] text-slate-600 normal-case pl-3.5">{String(comp.detail)}</span>
                                  )}
                                </div>
                            ))}
                         </div>
                      </div>
                   ) : (
                      <div className="h-[60px] flex items-center justify-center border border-dashed border-white/5 rounded-xl">
                         <span className="text-[9px] text-slate-700 uppercase font-black tracking-widest">No detailed telemetrics</span>
                      </div>
                   )}
                </div>
              </Card>
            ))}
          </div>

          {/* RIGHT COLUMN: SYSTEM TERMINAL */}
          <div className="space-y-8">
             <Card className="bg-[#080808] border-white/5 p-6 rounded-2xl flex flex-col h-[600px] shadow-2xl relative">
                <div className="absolute top-0 right-0 p-4">
                   <TerminalIcon size={14} className="text-red-500 animate-pulse" />
                </div>
                <h3 className="text-xs font-black text-red-500 uppercase tracking-[0.3em] mb-4 flex items-center gap-2 italic">
                   <Activity size={14} /> LIVE_UPLINK.log
                </h3>
                <div className="flex-1 overflow-y-auto space-y-2 text-[10px] font-mono text-slate-500 custom-scrollbar pr-2">
                   {logs.map((log, i) => (
                      <div key={i} className="flex gap-3 animate-in slide-in-from-left-2 duration-300">
                         <span className="text-red-800 shrink-0 select-none">&gt;&gt;</span>
                         <span className="leading-relaxed hover:text-white transition-colors">{log}</span>
                      </div>
                   ))}
                </div>
                <div className="mt-4 pt-4 border-t border-white/5">
                   <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-2">
                      <Zap size={10} /> Real-Time Feed Validated
                   </span>
                </div>
             </Card>
          </div>

        </div>

      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scan {
          from { transform: translateY(0); }
          to { transform: translateY(100vh); }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(220, 38, 38, 0.3);
          border-radius: 10px;
        }
      `}} />
    </MainLayout>
  );
}
