import * as React from "react"
import { cn } from "cn"
import { cmsInput } from "./input"

function Textarea({ className,isAdmin, ...props }: React.ComponentProps<"textarea"> & { isAdmin?: boolean }) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        isAdmin ?( cmsInput + " h-auto min-h-20 py-2 leading-relaxed") :
        "flex label-mono field-sizing-content min-h-16 w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-base transition-colors outline-none placeholder:text-muted-foreground focus:border-accent focus:ring-2 focus:ring-accent/30 disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
