import * as React from "react";

import { cn } from "@pezzo/ui/utils";
import { cva } from "class-variance-authority";

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  size?: "default" | "sm" | "lg";
}

const inputVariants = cva(
  "flex h-9 w-full rounded-md border-input bg-neutral-800 px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 text-xs",
        lg: "h-10",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, size, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(inputVariants({ size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
