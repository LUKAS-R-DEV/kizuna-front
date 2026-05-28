import MainLayout from "@/layouts/MainLayout";
import { 
  Zap,
  Activity,
  ShieldCheck,
  LayoutDashboard,
  Cpu,
  Globe,
  Bell,
  Terminal,
  ChevronRight,
  Wifi,
  Database
} from "lucide-react";
import { Card } from "@/components/ui/card";
import EagleIcon from "@/components/icons/EagleIcon";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  return (
    <MainLayout>
      <div className="min-h-[calc(100vh-80px)] p-8 flex flex-col items-center relative overflow-hidden bg-[#050505]">
        
        {/* ATMOSPHERIC BACKGROUND */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.2] pointer-events-none" />
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-red-600/5 to-transparent pointer-events-none" />
        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-red-600/5 blur-[150px] rounded-full pointer-events-none opacity-50" />
        
        {/* CENTRAL WELCOME TERMINAL */}
        <div className="flex flex-col items-center text-center mt-12 mb-20 relative z-10 animate-in fade-in zoom-in duration-1000">
           <div className="relative mb-20 mt-10 group flex items-center justify-center">
              {/* Massive Holographic Radar / Sonar Background */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] opacity-20 pointer-events-none">
                 {/* Sonar Rings */}
                 <div className="absolute inset-0 rounded-full border border-red-500/20 animate-[ping_4s_cubic-bezier(0,0,0.2,1)_infinite]" />
                 <div className="absolute inset-10 rounded-full border border-red-500/30" />
                 <div className="absolute inset-20 rounded-full border border-red-500/30 border-dashed animate-[spin_60s_linear_infinite]" />
                 <div className="absolute inset-32 rounded-full border border-red-500/40" />
                 
                 {/* Crosshairs */}
                 <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-red-500/20 -translate-x-1/2" />
                 <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-red-500/20 -translate-y-1/2" />
                 
                 {/* Scanning Beam extending out from center */}
                 <div className="absolute top-1/2 left-1/2 w-[250px] h-[250px] origin-top-left animate-[spin_4s_linear_infinite] overflow-hidden mix-blend-screen -translate-x-1/2 -translate-y-1/2 z-0">
                    <div className="w-full h-full bg-gradient-to-br from-red-600/40 via-red-600/10 to-transparent transform -skew-x-[20deg] origin-top-left" />
                 </div>
              </div>

              {/* Glowing Aura */}
              <div className="absolute bg-red-600/30 blur-[80px] rounded-full scale-150 opacity-60 group-hover:opacity-100 transition-opacity duration-700 w-40 h-40" />
              
              {/* Central Terminal Icon */}
              <div className="w-40 h-40 bg-black/60 border-2 border-red-500/30 rounded-3xl flex items-center justify-center relative z-10 shadow-[0_0_50px_rgba(220,38,38,0.3)] hover:border-red-500/60 transition-all duration-500 transform hover:scale-105 backdrop-blur-md">
                 <EagleIcon size={96} className="text-red-600 filter drop-shadow-[0_0_20px_rgba(220,38,38,1)]" />
                 
                 {/* Internal scanning lines */}
                 <div className="absolute inset-2 border-t border-red-500/20 rounded-xl overflow-hidden pointer-events-none">
                    <div className="w-full h-[1px] bg-red-500/40 absolute top-0 animate-[scan_2s_linear_infinite]" />
                 </div>
              </div>
              
              {/* Orbital Rings - Closer */}
              <div className="absolute w-[200px] h-[200px] border-2 border-red-500/20 rounded-full animate-[spin_10s_linear_infinite] pointer-events-none" />
              <div className="absolute w-[240px] h-[240px] border-2 border-dashed border-red-500/10 rounded-full animate-[spin_20s_linear_infinite_reverse] pointer-events-none" />
           </div>
           
           <div className="flex flex-col items-center">
              <div className="flex items-center gap-3 mb-4">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]" />
                 <span className="text-[12px] font-black text-slate-500 uppercase tracking-[0.8em] drop-shadow-sm italic">
                    Universal System Interface // v1.0
                 </span>
              </div>
              
              <h1 className="text-5xl font-black text-white tracking-tighter leading-none italic uppercase relative">
                 KIZUNA <span className="text-red-700 relative">INDUSTRIAL MANAGEMENT
                 </span>
              </h1>
              
              <div className="h-[1px] w-80 bg-white/10 mt-8 mb-6 relative overflow-hidden">
                 <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-600 to-transparent animate-[shimmer_2s_infinite]" />
              </div>

              <p className="text-slate-400 text-sm font-bold uppercase tracking-[0.3em] max-w-2xl mx-auto leading-relaxed italic opacity-80 mt-4">
                 Unified operational core for all sectors. <br />
                 <span className="text-white">Authorizing operational session... Welcome, System User.</span>
              </p>
           </div>
        </div>



      </div>

      <style>{`
        @keyframes scan {
          0% { top: 0%; opacity: 0.1; }
          50% { opacity: 0.5; }
          100% { top: 100%; opacity: 0.1; }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </MainLayout>
  );
}

