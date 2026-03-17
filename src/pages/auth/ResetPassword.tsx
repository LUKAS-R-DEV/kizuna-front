import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function ResetPassword() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-black via-red-950 to-red-700 p-8">
      <div className="w-full max-w-md space-y-6 bg-white dark:bg-slate-900 rounded-xl shadow-2xl p-8">
          {/* Floating sakura particles */}
      <div className="sakura top-10 left-20"></div>
      <div className="sakura top-32 right-16"></div>
      <div className="sakura top-48 left-40"></div>

        {/* Título com gradiente */}
        <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-red-600 to-red-900 bg-clip-text text-transparent">
          Reset Password
        </h2>

        <p className="text-sm text-slate-500 text-center">
          Enter your new password below.
        </p>

        {/* New Password */}
        <Input type="password" placeholder="New Password" className="h-11" />

        {/* Confirm Password */}
        <Input type="password" placeholder="Confirm Password" className="h-11" />

        <Button className="w-full h-11 bg-red-600 hover:bg-red-700 text-white">
          Reset Password
        </Button>

      </div>
    </div>
  )
}