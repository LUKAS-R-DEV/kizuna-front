import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-10 w-full min-w-0 rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-slate-200 transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-white placeholder:text-slate-600 focus-visible:border-red-500/50 focus-visible:ring-2 focus-visible:ring-red-500/40 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-black/60 disabled:opacity-50 aria-invalid:border-red-500 aria-invalid:ring-2 aria-invalid:ring-red-500/30 md:text-sm shadow-inner",
        className
      )}
      {...props}
    />
  )
}

export { Input }
