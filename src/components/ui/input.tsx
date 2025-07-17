import * as React from "react"
import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-10 w-full min-w-0 rounded-md border bg-white px-3 py-2 text-sm transition-all",
        "file:text-foreground placeholder:text-muted-foreground selection:bg-indigo-100 selection:text-indigo-900",
        "file:inline-flex file:h-8 file:border-0 file:bg-transparent file:text-sm file:font-medium",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500",
        "border-gray-300 text-gray-900",
        "hover:border-gray-400",
        "dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100",
        "dark:hover:border-gray-500",
        "dark:focus:ring-indigo-400 dark:focus:border-indigo-400",
        "aria-invalid:border-red-500 aria-invalid:ring-red-200",
        "dark:aria-invalid:border-red-400 dark:aria-invalid:ring-red-400/20",

        className
      )}
      {...props}
    />
  )
}

export { Input }