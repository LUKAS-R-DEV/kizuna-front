import { Cpu, Wifi, ShieldCheck, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { useHealth } from "@/contexts/HealthContext";

export default function Footer() {
  const [time, setTime] = useState(new Date());
  const { colorClass, textStatus, colorHex, iamUp } = useHealth();

  // Atualiza o relógio interno do sistema Kizuna
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <footer className="w-full bg-[#050505] text-slate-500 py-3 px-6 border-t border-white/[0.05] fixed bottom-0 z-50">
      <div className="max-w-[1800px] mx-auto flex items-center justify-between">
        
        {/* LADO ESQUERDO: STATUS DO SISTEMA */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${colorClass.split(' ')[0]} animate-pulse ${colorClass.split(' ')[1] || ''}`} />
            <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${colorHex}`}>
              {textStatus}
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-4 border-l border-white/10 pl-4 text-[9px] font-bold uppercase tracking-widest">
            <div className="flex items-center gap-1.5">
              <Cpu size={12} className="text-red-600" />
              <span className="text-slate-400">v1.0</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Wifi size={12} className={iamUp ? "text-red-600" : "text-red-500 animate-pulse"} />
              <span className={iamUp ? "text-slate-400" : "text-red-500 font-black animate-pulse"}>
                {iamUp ? "IAM: ACTIVE" : "IAM: INACTIVE"}
              </span>
            </div>
          </div>
        </div>

        {/* CENTRO: BRANDING DISCRETO */}
        <div className="absolute left-1/2 -translate-x-1/2 hidden lg:block">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600 hover:text-white transition-colors cursor-default">
            Kizuna <span className="text-red-600">Industrial</span> Management
          </p>
        </div>

        {/* LADO DIREITO: DATA E SEGURANÇA */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4 text-[9px] font-bold uppercase tracking-widest border-r border-white/10 pr-4">
            <div className="flex items-center gap-1.5">
              <ShieldCheck size={12} className="text-emerald-500" />
              <span className="text-slate-400 text-[8px]">Encrypted Session</span>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-[11px] text-slate-400">
            <Clock size={12} className="text-red-600" />
            <span>
              {time.toLocaleDateString('en-US', { day: '2-digit', month: 'short' }).toUpperCase()}
            </span>
            <span className="text-white/20">|</span>
            <span className="font-black text-slate-300">
              {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}