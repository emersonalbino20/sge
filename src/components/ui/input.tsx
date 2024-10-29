import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input 
        type={type}
        className={cn(
          "flex h-7 sm:h-8 md:h-8 lg:h-9 rounded-md bg-white px-3 text-sm sm:text-xs md:text-[10px] lg:text-[12px] xl:text-[16px] w-full  border-2 input-confirm   ring-offset-background file:border-0 file:bg-transparent file:text-lg file:font-medium placeholder:text-muted-foreground  focus-visible:outline-none  transition duration-500 ease-in-out focus-visible:shadow-sm disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
