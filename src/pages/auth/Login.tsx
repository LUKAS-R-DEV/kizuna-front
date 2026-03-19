import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Mail, Lock } from "lucide-react"
import { Link } from "react-router-dom"
import kizunaLogo from "@/assets/kizuna_logo_background.png"

export default function Login() {

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">

      {/* LEFT SIDE - JAPANESE STYLE */}
      <div className="hidden lg:flex items-center justify-center bg-white relative overflow-hidden">

        {/* floating particles */}
        <div className="absolute top-16 left-24 w-3 h-3 bg-red-500 rounded-full animate-floatSlow"></div>
        <div className="absolute bottom-20 right-32 w-2 h-2 bg-red-400 rounded-full animate-floatSlow delay-200"></div>
        <div className="absolute top-40 right-16 w-2 h-2 bg-red-500 rounded-full animate-floatSlow delay-500"></div>

        {/* sakura flowers */}
        <div className="sakura top-0 left-10"></div>
        <div className="sakura top-0 left-40"></div>
        <div className="sakura top-0 left-72"></div>
        <div className="sakura top-0 left-96"></div>
        <div className="sakura top-0 left-[500px]"></div>

        {/* logo and branding */}
        <div className="flex flex-col items-center text-center p-10 relative z-10">
          <img
            src={kizunaLogo}
            alt="Kizuna Logo"
            className="h-128 w-auto object-contain animate-float"
          />
        </div>

      </div>

      {/* RIGHT SIDE - LOGIN */}
      <div className="flex items-center justify-center bg-[#050505] relative overflow-hidden p-8 border-l border-white/[0.02]">
        
        {/* gradient lights */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/15 blur-[120px] rounded-full pointer-events-none"></div>

        {/* LOGIN CARD */}
        <div className="relative z-10 bg-white dark:bg-slate-900 !rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.4)] p-10 w-full max-w-[420px] space-y-8 border border-white/10">

          <div className="space-y-2">
            <h2 className="text-3xl font-black text-center tracking-tighter text-slate-900">
              Sign in to Kizuna
            </h2>
            <p className="text-[11px] font-bold text-slate-500 text-center uppercase tracking-widest">
              Access the platform
            </p>
          </div>

          <div className="space-y-4">
            {/* EMAIL */}
            <div className="relative group">
              <Mail className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-red-500 transition-colors" size={18}/>
              <Input placeholder="name@company.com" className="pl-11 h-12 bg-slate-50 border-slate-200 focus-visible:ring-red-500 !rounded-xl text-sm font-medium transition-all shadow-none"/>
            </div>

            {/* PASSWORD */}
            <div className="relative group">
              <Lock className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-red-500 transition-colors" size={18}/>
              <Input type="password" placeholder="Password" className="pl-11 h-12 bg-slate-50 border-slate-200 focus-visible:ring-red-500 !rounded-xl text-sm font-medium transition-all shadow-none"/>
            </div>
          </div>

          <div className="pt-2 space-y-6">
            <Button className="w-full h-12 bg-red-600 hover:bg-red-700 text-white !rounded-xl shadow-[0_4px_14px_rgba(220,38,38,0.4)] hover:-translate-y-0.5 transition-all duration-300 font-black uppercase tracking-widest text-[11px]">
              Sign In
            </Button>
            
            <div className="text-center">
              <Link
                to="/forgot-password"
                className="text-[10px] font-black text-slate-400 hover:text-red-600 uppercase tracking-widest transition-colors"
              >
                Forgot Password?
              </Link>
            </div>
          </div>

          <div className="text-[9px] font-bold text-slate-400 text-center uppercase tracking-[0.2em] pt-6 border-t border-slate-50">
            Secure Industrial Access System
          </div>

        </div>

      </div>

    </div>
  )
}