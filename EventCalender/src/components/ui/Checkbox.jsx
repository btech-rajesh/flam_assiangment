"use client"

import { forwardRef } from "react"
import { Check } from "lucide-react"
import { cn } from "../../lib/utils"

const Checkbox = forwardRef(({ className, checked, onCheckedChange, ...props }, ref) => {
  return (
    <button
      ref={ref}
      type="button"
      role="checkbox"
      aria-checked={checked}
      className={cn(
        "peer h-4 w-4 shrink-0 rounded-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
        checked && "bg-blue-600 border-blue-600 text-white",
        className,
      )}
      onClick={() => onCheckedChange?.(!checked)}
      {...props}
    >
      {checked && <Check className="h-3 w-3" />}
    </button>
  )
})

Checkbox.displayName = "Checkbox"

export { Checkbox }
