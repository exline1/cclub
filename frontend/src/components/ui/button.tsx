import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-bold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-glow focus-visible:ring-offset-2 focus-visible:ring-offset-background-primary disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 min-h-[44px] px-5 py-2.5 active:scale-95",
  {
    variants: {
      variant: {
        default:
          "bg-accent-primary text-white hover:bg-accent-glow hover:shadow-accent-glow-sm",
        secondary:
          "glass-hover text-text-primary",
        ghost:
          "text-text-secondary hover:bg-background-secondary hover:text-text-primary",
        outline:
          "border border-border-glass bg-transparent text-text-primary hover:glass-hover",
        google:
          "border border-border-glass bg-background-secondary text-text-primary hover:bg-background-primary",
      },
      size: {
        default: "h-11 px-5 rounded-2xl",
        sm: "h-10 px-4 text-xs rounded-xl",
        lg: "h-12 px-8 text-base rounded-50px",
        icon: "h-11 w-11 rounded-full", // Icon buttons are circular, keep rounded-full
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
