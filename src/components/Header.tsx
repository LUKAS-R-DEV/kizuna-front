import React, { useState, useEffect } from "react";
import kizunaLogo from "@/assets/kizuna_logo.png"
import EagleIcon from "./icons/EagleIcon";
import { coreApi } from "@/lib/api";
import { useHealth } from "@/contexts/HealthContext";
import { formatAppTime, parseServerUtc } from "@/lib/datetime";

export default function Header() {
  const { colorClass } = useHealth();
  const [serverTime, setServerTime] = useState<Date>(new Date());

  useEffect(() => {
    let offset = 0;
    let interval: ReturnType<typeof setInterval> | undefined;

    const tick = () => setServerTime(new Date(Date.now() + offset));

    coreApi.get<string>("/server-time").then((res) => {
      offset = parseServerUtc(String(res.data)) - Date.now();
      tick();
      interval = setInterval(tick, 1000);
    }).catch((err) => console.error("Could not sync server time", err));

    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);

  const formattedTime = formatAppTime(serverTime);

  return (
    <header className="h-24 bg-[#0a0a0a] backdrop-blur-xl border-b border-white/[0.05] flex items-center justify-between sticky top-0 z-50 shadow-[0_10px_40px_rgba(0,0,0,0.8)] overflow-hidden">
      
      {/* 1. Lado Esquerdo: O Bloco "Power" para a Logo */}
      <div className="flex items-center h-full relative z-10 w-full max-w-[55%] drop-shadow-[15px_0_30px_rgba(220,38,38,0.45)]">
        {/* Fundo Escuro com Corte Diagonal e Sombra Colorida */}
        <div 
          className="h-full bg-[#030303] flex items-center px-6 pr-20 lg:pr-28 relative"
          style={{ clipPath: 'polygon(0 0, 100% 0, 82% 100%, 0% 100%)' }}
        >
          <div className="relative flex items-center gap-4">
            <div className="w-14 h-14 bg-red-600/10 rounded-xl flex items-center justify-center border border-red-500/30 shadow-[0_0_30px_rgba(220,38,38,0.4)] transition-transform hover:scale-105 duration-300">
              <EagleIcon size={38} className="text-red-500" />
            </div>
          </div>
        </div>

        {/* Texto de Apoio KIZUNA gigante com separação */}
        <div className="ml-4 lg:ml-8 hidden md:flex flex-col justify-center relative z-20">
          <h2 className="text-[32px] md:text-[40px] font-black text-white tracking-tight italic drop-shadow-[0_0_15px_rgba(255,255,255,0.4)] leading-none mb-1">
            KIZUNA
          </h2>
          <div className="flex items-center gap-3">
            <span className="h-[3px] w-12 bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.8)] rounded-full" />
            <span className="text-[10px] md:text-[11px] font-black text-red-600 uppercase tracking-[0.35em]">
              Industrial Management System
            </span>
          </div>
        </div>
      </div>

      {/* 2. Lado Direito: Informações em HUD */}
      <div className="flex items-center gap-8 pl-8 pr-12 relative z-10">
        
        {/* Box de Status HUD */}
        <div className="bg-white/[0.02] border border-white/[0.05] py-2.5 px-6 rounded-xl flex items-center gap-6 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]">
            <div className="text-right">
                <p className="text-[9px] font-black text-red-600 uppercase tracking-widest">Active Node</p>
                <p className="text-[11px] font-black text-white uppercase tracking-wider mt-1 drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">KIZUNA v1.0</p>
            </div>
            
            <div className="h-8 w-[1px] bg-white/[0.08]" />

            <div className="flex flex-col items-center">
                <span className="text-[9px] font-black text-red-600 uppercase tracking-widest">Status</span>
                <div className="relative flex h-3.5 w-3.5 mt-1">
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${colorClass.split(' ')[0]}`}></span>
                    <span className={`relative inline-flex rounded-full h-3.5 w-3.5 ${colorClass}`}></span>
                </div>
            </div>
        </div>

        {/* Relógio Digital */}
        <div className="hidden lg:flex flex-col items-end justify-center">
          <p className="text-[9px] font-black text-red-600 uppercase tracking-widest">Horário do Servidor</p>
          <p className="text-2xl font-mono font-black text-white tracking-tighter mt-1 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">{formattedTime}</p>
        </div>

      </div>
    </header>
  )
}