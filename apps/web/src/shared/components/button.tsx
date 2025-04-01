import { ButtonHTMLAttributes, forwardRef } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../utils/cn";

export const buttonVariants = cva(
  "inline-flex gap-2 items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold cursor-pointer transition duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-70",
  {
    variants: {
      variant: {
        brand:
          "bg-brand-500 text-background shadow-sm lg:hover:bg-brand-300 focus-visible:outline-brand-500",
        destructive:
          "bg-red-600 text-background shadow-sm lg:hover:bg-red-500 focus-visible:outline-red-600",
        white:
          "bg-white text-black shadow-sm lg:hover:bg-white/90 focus-visible:outline-white",
        black:
          "bg-neutral-950 text-white shadow-sm lg:hover:bg-neutral-950/90 focus-visible:outline-neutral-950",
        secondary:
          "bg-neutral-200 border border-neutral-300 text-brand-500 shadow-sm lg:hover:bg-neutral-300/70 focus-visible:outline-brand-500",
        grayed:
          "bg-neutral-600 text-foreground shadow-sm lg:hover:bg-neutral-600/90 focus-visible:outline-neutral-600",
        destructiveOutline:
          "border border-red-600 bg-red-400/15 text-red-600 shadow-xs lg:hover:bg-red-400/20",
        outline:
          "border border-brand-600 bg-inherit text-brand-500 shadow-xs lg:hover:bg-brand-500/10 lg:hover:border-brand-500",
        ghost:
          "border-none bg-inherit text-neutral-200 lg:hover:text-neutral-100 focus-visible:outline-hidden focus-visible:outline-0 focus-visible:outline-offset-0",
      },
      size: {
        default: "h-10 px-8 py-2",
        xs: "h-7 rounded-md px-3 text-xs",
        sm: "h-8 rounded-lg px-4 text-[13px]/[18px]",
        lg: "h-12 rounded-xl px-12",
        xl: "h-14 rounded-2xl px-12 text-base",
        icon: "h-10 w-10",
        smIcon: "h-7 w-7 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "brand",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";
