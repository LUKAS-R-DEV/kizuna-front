import { Factory } from "lucide-react"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950 overflow-hidden">

      {/* industrial blur lights */}
      <div className="absolute -top-40 -left-40 h-[400px] w-[400px] rounded-full bg-blue-500/10 blur-[140px]" />
      <div className="absolute -bottom-40 -right-40 h-[400px] w-[400px] rounded-full bg-indigo-500/10 blur-[140px]" />

      {/* industrial grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 2px 2px, #415976 1px, transparent 0)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 w-full max-w-md px-6">

        {/* logo */}
        <div className="mb-10 text-center">

          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-slate-800 text-white shadow-xl">
            <Factory size={30} />
          </div>

          <h1 className="text-3xl font-bold tracking-tight">
            Kizuna Industrial
          </h1>

          <p className="text-slate-700 text-sm">
            Production Management System
          </p>

        </div>

        {children}

      </div>
    </div>
  )
}