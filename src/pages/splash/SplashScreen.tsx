import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Activity, Zap } from "lucide-react";
import { useEffect, useState } from "react";

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // 2.5 seconds loading + 0.5 sec fade out
    const duration = 2500;
    const interval = 50;
    const step = 100 / (duration / interval);

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 400); // Small pause before actual unmount trigger
          return 100;
        }
        return prev + step;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: "blur(10px)", scale: 1.02 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 h-screen w-screen bg-[#050505] text-slate-400 overflow-hidden font-geist flex flex-col items-center justify-center z-[9999]"
    >
      
      {/* CINEMATIC BACKGROUND GRID */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.015] z-0"
        style={{
          backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "60px 60px"
        }}
      />

      {/* AMBIENT GLOW */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-red-600/[0.03] blur-[180px] rounded-full" />
      </div>

      {/* MAIN CINEMATIC CONTAINER */}
      <main className="relative z-10 flex flex-col items-center text-center w-full max-w-4xl px-8">
        
        {/* LOGO HUD INDICATOR */}
        <motion.div
           initial={{ opacity: 0, y: -20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 1, delay: 0.2 }}
           className="mb-12 flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.5em] text-red-600/50 italic"
        >
           <span className="w-8 h-[1px] bg-red-600/30" />
           Initializing_Neural_Link
           <span className="w-8 h-[1px] bg-red-600/30" />
        </motion.div>

        {/* HERO: CLEAN ORIGAMIC TAKA */}
        <div className="relative mb-12 group">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="relative z-10"
          >
            <img 
              src="/assets/kizuna_taka_origami_v2_transparent.png" 
              alt="Kizuna Taka" 
              className="w-64 md:w-80 h-auto filter drop-shadow-[0_0_30px_rgba(220,38,38,0.2)] animate-pulse"
            />
            
            {/* Minimalist HUD Frames */}
            <div className="absolute -top-6 -right-6 border-r border-t border-red-600/30 w-12 h-12" />
            <div className="absolute -bottom-6 -left-6 border-l border-b border-red-600/30 w-12 h-12" />
          </motion.div>

          {/* BACKGROUND DEPTH INDICATOR */}
          <div className="absolute inset-0 border border-white/[0.03] rounded-full scale-[1.5] animate-[spin_60s_linear_infinite] pointer-events-none" />
        </div>

        {/* BRANDING */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="space-y-6 flex flex-col items-center"
        >
          <h1 className="text-8xl md:text-9xl font-black text-white tracking-[0.2em] leading-none uppercase italic relative">
            KIZUNA
          </h1>
          
          <div className="pt-8 w-full max-w-sm flex flex-col items-center gap-4">
             {/* PROGRESS BAR */}
             <div className="w-full h-1 bg-white/5 relative overflow-hidden">
                <motion.div 
                  className="absolute top-0 left-0 h-full bg-red-600"
                  style={{ width: `${progress}%` }}
                />
             </div>
             
             <div className="flex items-center justify-between w-full text-[9px] font-mono tracking-widest uppercase text-slate-500">
                <span>Authenticating Config...</span>
                <span className="text-white">{Math.floor(progress)}%</span>
             </div>
          </div>

          <div className="pt-12 flex items-center gap-12 opacity-40">
             <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-500 italic">
               <Activity size={12} className="text-red-600" /> Core_Stable
             </div>
             <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-500 italic">
               <ShieldCheck size={12} className="text-red-500" /> AES_Encrypted
             </div>
             <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-500 italic">

             </div>
          </div>
        </motion.div>
      </main>

      <style>{`
        .font-geist {
          font-family: 'Geist Variable', sans-serif;
        }
      `}</style>
    </motion.div>
  );
}
