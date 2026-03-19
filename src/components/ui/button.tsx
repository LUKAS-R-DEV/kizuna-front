import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center !rounded-xl border border-transparent !text-[11px] !font-black !uppercase !tracking-widest transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 !shadow-sm hover:!shadow-lg hover:-translate-y-0.5",
  {
    variants: {
      variant: {
        default: "bg-slate-900 text-white hover:bg-slate-800 shadow-slate-900/20",
        destructive: "bg-red-600 text-white hover:bg-red-700 shadow-red-600/30",
        outline: "border-2 border-slate-200 bg-transparent hover:bg-slate-50 text-slate-700 !shadow-none hover:border-slate-300 hover:!translate-y-0",
        secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200",
        ghost: "hover:bg-slate-100 text-slate-800 !shadow-none hover:!translate-y-0",
        link: "text-blue-600 underline-offset-4 hover:underline !shadow-none hover:!translate-y-0",
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
