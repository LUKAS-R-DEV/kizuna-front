import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Mail } from "lucide-react"

export default function ForgotPassword() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-black via-red-950 to-red-700 p-8 relative overflow-hidden">

      {/* Floating sakura particles */}
      <div className="sakura top-10 left-20"></div>
      <div className="sakura top-32 right-16"></div>
      <div className="sakura top-48 left-40"></div>

      <div className="w-full max-w-md space-y-6 bg-white dark:bg-slate-900 rounded-xl shadow-2xl p-8 relative z-10">

        {/* Título com gradiente */}
        <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-red-600 to-red-900 bg-clip-text text-transparent">
          Forgot Password
        </h2>

        <p className="text-sm text-slate-700 text-center">
          Enter your email to reset your password.
        </p>

        <div className="relative">
          <Mail className="absolute left-3 top-3 text-slate-800" size={18}/>
          <Input placeholder="Email Address" className="pl-9 h-11" />
        </div>

        <Button className="w-full h-11 bg-red-600 hover:bg-red-700 text-white hover:scale-105 transition-transform duration-300">
          Send Reset Link
        </Button>

      </div>
    </div>
  )
}