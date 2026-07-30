import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-bg hover:bg-primary-soft shadow-[0_0_0_1px_rgba(140,124,255,0.35)]",
        secondary:
          "bg-surface-3 text-text hover:bg-surface-3/80 border border-border-strong",
        outline:
          "border border-border-strong bg-transparent hover:bg-surface-2 text-text",
        ghost: "hover:bg-surface-2 text-text-muted hover:text-text",
        destructive:
          "bg-danger/15 text-danger border border-danger/30 hover:bg-danger/25",
        success: "bg-success text-bg hover:bg-success/90",
      },
      size: {
        default: "h-10 px-4 text-sm",
        sm: "h-8 px-3 text-xs",
        lg: "h-12 px-6 text-base",
        icon: "h-10 w-10 shrink-0",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
);
Button.displayName = "Button";

export { Button, buttonVariants };
