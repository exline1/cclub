import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <div
        className={cn(
          "glass rounded-2xl flex h-11 w-full items-center px-4 transition-all duration-200 focus-within:ring-2 focus-within:ring-accent-glow focus-within:border-accent-glow",
          className
        )}
      >
        <input
          type={type}
          className={cn(
            "w-full h-full bg-transparent py-2 text-sm text-text-primary placeholder:text-text-secondary focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
            className?.includes("text-center") && "text-center",
            className?.includes("text-right") && "text-right"
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
