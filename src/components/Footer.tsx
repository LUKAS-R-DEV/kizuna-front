import { Cpu, Wifi, ShieldCheck, Clock } from "lucide-react";
import { useEffect, useState } from "react";

export default function Footer() {
  const [time, setTime] = useState(new Date());

  // Atualiza o relógio interno do sistema Kizuna
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <footer className="w-full bg-slate-900 text-slate-400 py-2 px-6 border-t border-slate-800 fixed bottom-0 z-50">
      <div className="max-w-[1800px] mx-auto flex items-center justify-between">
        
        {/* LADO ESQUERDO: STATUS DO SISTEMA */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500">
              System: Nominal
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-4 border-l border-slate-700 pl-4 text-[9px] font-bold uppercase tracking-widest">
            <div className="flex items-center gap-1.5">
              <Cpu size={12} className="text-slate-500" />
              <span>Core-v3.0.4</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Wifi size={12} className="text-slate-500" />
              <span>Net: Secure</span>
            </div>
          </div>
        </div>

        {/* CENTRO: BRANDING DISCRETO */}
        <div className="absolute left-1/2 -translate-x-1/2 hidden lg:block">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30 hover:opacity-100 transition-opacity cursor-default">
            Kizuna <span className="text-red-600">Industrial</span> Management
          </p>
        </div>

        {/* LADO DIREITO: DATA E SEGURANÇA */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4 text-[9px] font-bold uppercase tracking-widest border-r border-slate-700 pr-4">
            <div className="flex items-center gap-1.5">
              <ShieldCheck size={12} className="text-emerald-500/50" />
              <span className="text-slate-500 text-[8px]">Encrypted Session</span>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-[11px] text-slate-300">
            <Clock size={12} className="text-red-600" />
            <span>
              {time.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).toUpperCase()}
            </span>
            <span className="text-slate-600">|</span>
            <span className="font-black">
              {time.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}