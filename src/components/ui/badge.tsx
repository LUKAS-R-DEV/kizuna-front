import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center border transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 overflow-hidden !rounded-full !px-2.5 !py-0.5 !text-[10px] !font-bold !uppercase !tracking-widest shadow-sm backdrop-blur-sm whitespace-nowrap",
  {
    variants: {
      variant: {
        default: "bg-white/[0.05] text-slate-300 border-white/10 hover:bg-white/10 shadow-[0_0_8px_rgba(255,255,255,0.05)]",
        secondary:
          "bg-white/[0.05] text-slate-400 border-white/10 hover:bg-white/10",
        destructive:
          "bg-red-950/30 text-red-500 hover:bg-red-900/40 border-red-900/50 shadow-[0_0_8px_rgba(220,38,38,0.2)] focus:ring-red-500",
        outline:
          "text-slate-400 hover:bg-white/5 border-white/10",
        ghost:
          "hover:bg-white/5 hover:text-slate-300",
        success:
          "bg-emerald-950/30 text-emerald-500 hover:bg-emerald-900/40 border-emerald-900/50 shadow-[0_0_8px_rgba(16,185,129,0.2)] focus:ring-emerald-500",
        link: "text-red-500 underline-offset-4 hover:underline hover:text-red-400 drop-shadow-[0_0_8px_rgba(220,38,38,0.5)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
