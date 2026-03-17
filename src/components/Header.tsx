// src/components/Header.tsx
import kizunaLogo from "@/assets/kizuna_logo.png"

export default function Header() {
  return (
    <header className="relative h-28 bg-gradient-to-r from-red-700 via-red-900 to-black flex items-center justify-between sticky top-0 z-50 shadow-2xl overflow-visible">
      
      {/* 1. Lado Esquerdo: O Bloco "Power" para a Logo */}
      <div className="flex items-center h-full relative">
        {/* Trapézio Branco Gigante para a Logo Vermelho/Preto */}
        <div 
          className="h-full bg-white flex items-center pl-10 pr-20 relative shadow-[10px_0_30px_rgba(0,0,0,0.3)]"
          style={{ clipPath: 'polygon(0 0, 100% 0, 80% 100%, 0% 100%)' }}
        >
          {/* A Logo agora está realmente grande (h-20) */}
          <img 
            src={kizunaLogo} 
            alt="Kizuna Logo" 
            className="h-32 w-auto object-contain drop-shadow-[0_4px_6px_rgba(0,0,0,0.1)] transition-transform hover:scale-105 duration-300" 
          />
        </div>

        {/* Texto de Apoio sobre o Vermelho */}
        <div className="ml-4 hidden xl:flex flex-col">
          <h2 className="text-2xl font-black text-white tracking-tighter italic opacity-90">
            KIZUNA <span className="text-red-500"></span>
          </h2>
          <div className="flex items-center gap-2">
            <span className="h-[2px] w-8 bg-red-500" />
            <span className="text-[10px] font-bold text-red-200 uppercase tracking-[0.3em]">
              Industrial Management System
            </span>
          </div>
        </div>
      </div>

      {/* 2. Lado Direito: Informações em Vidro (Glassmorphism) */}
      <div className="flex items-center gap-6 px-12">
        
        {/* Box de Status com fundo semi-transparente para modernizar */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 p-3 rounded-lg flex items-center gap-4">
            <div className="text-right">
                <p className="text-[10px] font-bold text-red-300 uppercase">Localização</p>
                <p className="text-sm font-bold text-white uppercase tracking-tight">Setor de Produção A1</p>
            </div>
            
            <div className="h-8 w-[1px] bg-white/20" />

            <div className="flex flex-col items-center">
                <span className="text-[10px] font-bold text-red-300 uppercase">Status</span>
                <div className="relative flex h-3 w-3 mt-1">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </div>
            </div>
        </div>

        {/* Relógio Digital (Estética Industrial) */}
        <div className="hidden md:block text-right">
          <p className="text-[10px] font-bold text-red-400 uppercase">Horário do Servidor</p>
          <p className="text-xl font-mono font-black text-white">14:55:02</p>
        </div>
      </div>

      {/* Detalhe Final: Linha de luz no topo */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-white/20" />
    </header>
  )
}