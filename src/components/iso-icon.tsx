import type { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

type IsoTone = "blue" | "orange" | "red" | "ink"

interface IsoIconProps {
  icon: LucideIcon
  tone?: IsoTone
  className?: string
  label?: string
}

export function IsoIcon({ icon: Icon, tone = "blue", className, label }: IsoIconProps) {
  return (
    <div className={cn("iso-wrap", `iso-${tone}`, className)} aria-label={label} role={label ? "img" : undefined}>
      <div className="iso-top" />
      <div className="iso-front" />
      <div className="iso-side" />
      <div className="iso-plane">
        <Icon className="iso-icon size-5 text-white" strokeWidth={1.8} aria-hidden={!label} />
      </div>
    </div>
  )
}
