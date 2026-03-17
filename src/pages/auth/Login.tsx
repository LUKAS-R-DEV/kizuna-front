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
      <div className="flex items-center justify-center bg-gradient-to-br from-black via-red-950 to-red-700 p-8 relative overflow-hidden">

        {/* gradient lights */}
        <div className="absolute -top-20 -left-20 h-80 w-80 bg-red-500/20 blur-[120px] rounded-full"></div>
        <div className="absolute -bottom-20 -right-20 h-80 w-80 bg-red-700/20 blur-[120px] rounded-full"></div>

        {/* LOGIN CARD */}
        <div className="relative z-10 bg-white dark:bg-slate-900 rounded-xl shadow-2xl p-8 w-full max-w-md space-y-6">

          <div>
            <h2 className="text-2xl font-bold text-center">
              Sign in to Kizuna
            </h2>

            <p className="text-sm text-slate-500 text-center">
              Access the platform
            </p>
          </div>

          {/* EMAIL */}
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-slate-400" size={18}/>
            <Input placeholder="name@company.com" className="pl-9 h-11"/>
          </div>

          {/* PASSWORD */}
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-slate-400" size={18}/>
            <Input type="password" placeholder="Password" className="pl-9 h-11"/>
          </div>

          {/* BUTTON */}
          <Button className="w-full h-11 bg-red-600 hover:bg-red-700 text-white">
            Sign In
          </Button>
          <div className="text-center mt-2">
  <Link
    to="/forgot-password"
    className="text-red-600 hover:underline font-medium"
  >
    Forgot Password?
  </Link>
</div>

          <div className="text-xs text-slate-500 text-center">
            Secure Industrial Access System
          </div>

        </div>

      </div>

    </div>
  )
}