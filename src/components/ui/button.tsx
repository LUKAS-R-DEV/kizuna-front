import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center !rounded-xl border border-transparent !text-[11px] !font-black !uppercase !tracking-widest transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 !shadow-sm hover:!shadow-lg hover:-translate-y-0.5",
  {
    variants: {
      variant: {
        default: "bg-slate-800/80 text-white hover:bg-slate-700 shadow-[0_0_15px_rgba(255,255,255,0.05)] border border-white/5",
        destructive: "bg-red-950/50 text-red-500 hover:bg-red-900/60 shadow-[0_0_15px_rgba(220,38,38,0.3)] border border-red-900/50 hover:text-red-400",
        outline: "border-2 border-white/10 bg-transparent hover:bg-white/5 text-slate-300 !shadow-none hover:border-white/20 hover:text-white hover:!translate-y-0",
        secondary: "bg-white/10 text-slate-200 hover:bg-white/20 border border-white/5",
        ghost: "hover:bg-white/5 text-slate-400 hover:text-white !shadow-none hover:!translate-y-0",
        link: "text-red-500 underline-offset-4 hover:underline !shadow-none hover:!translate-y-0 hover:text-red-400 drop-shadow-[0_0_8px_rgba(220,38,38,0.6)]",
      },
      size: {
        default: "h-11 px-6 py-2 gap-2",
        sm: "h-9 px-4 text-[10px] gap-1.5",
        lg: "h-14 px-10 text-xs gap-3",
        icon: "h-11 w-11 !rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
