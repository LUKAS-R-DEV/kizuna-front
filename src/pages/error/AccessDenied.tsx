import { ShieldAlert, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function AccessDenied() {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-full flex items-center justify-center bg-slate-950 p-6 overflow-hidden relative">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-[10%] left-[5%] w-[400px] h-[400px] bg-red-600 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[5%] w-[300px] h-[300px] bg-red-900 rounded-full blur-[100px]" />
        <div className="w-full h-full bg-[url('/grid.svg')] bg-repeat opacity-20" />
      </div>

      <div className="max-w-2xl w-full flex flex-col items-center text-center space-y-8 relative z-10">
        {/* Animated Icon Container */}
        <div className="relative">
          <div className="absolute inset-0 bg-red-600 opacity-20 blur-2xl animate-pulse rounded-full" />
          <div className="relative bg-slate-900 border-2 border-red-600/50 p-8 rounded-full shadow-[0_0_30px_rgba(220,38,38,0.3)]">
            <ShieldAlert size={80} className="text-red-500" />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-black text-red-600 uppercase tracking-[0.5em] mb-2 animate-pulse">
              Security Protocol Alpha-9
            </span>
            <h1 className="text-6xl md:text-7xl font-black text-white uppercase tracking-tighter italic leading-none">
              Access <span className="text-red-600">Denied</span>
            </h1>
          </div>
          
          <div className="h-[1px] w-48 bg-gradient-to-r from-transparent via-red-600/50 to-transparent mx-auto" />
          
          <p className="text-slate-400 font-bold max-w-md mx-auto leading-relaxed uppercase tracking-tight text-xs">
            Suas credenciais não têm permissão para este recurso ou rota da grade KIZUNA.
            Se você acredita que deveria ter acesso, verifique a role no Keycloak (realm Kizuna).
            Este incidente foi registrado nos logs de auditoria.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center mt-8">
          <Button 
            onClick={() => navigate(-1)}
            variant="outline"
            className="border-white/10 hover:bg-white/5 text-white font-black uppercase tracking-widest gap-2 h-14 px-8"
          >
            <ArrowLeft size={18} /> Retornar
          </Button>
          <Button 
            onClick={() => navigate("/home")}
            className="bg-red-600 hover:bg-red-500 text-white font-black uppercase tracking-widest gap-2 h-14 px-8 shadow-[0_0_15px_rgba(220,38,38,0.3)]"
          >
            <Home size={18} /> Base Central
          </Button>
        </div>

        {/* System Error Code Decorative Footer */}
        <div className="pt-12">
            <span className="text-[8px] font-mono text-slate-700 tracking-[0.3em] uppercase">
              Error Code: 403_FORBIDDEN_OPERATIONAL_MISMATCH // HUD_STABILIZER_ACTIVE
            </span>
        </div>
      </div>

      {/* Decorative Scanline Effect */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] bg-[length:100%_4px,3px_100%] z-50" />
    </div>
  );
}
