import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-none border px-2 py-1 text-[10px] font-bold uppercase tracking-[0.14em] transition-colors",
  {
    variants: {
      variant: {
        default: "border-blue/20 bg-blue-soft text-blue-dark",
        orange: "border-orange/30 bg-orange-soft text-orange-dark",
        red: "border-red/30 bg-red-soft text-red",
        dark: "border-white/20 bg-white/5 text-blue-soft",
        outline: "border-line bg-transparent text-muted",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
