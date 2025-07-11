import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const chipVariants = cva(
  "inline-flex w-fit items-center justify-center rounded-full font-normal transition-colors focus:outline-none select-none",
  {
    variants: {
      variant: {
        default: "border-transparent bg-gray-100 text-gray-900 hover:bg-gray-200",
        solid:
          "bg-gradient-to-r from-accent1 to-accent2 text-white border-transparent hover:opacity-90",
        outline: "bg-white text-text-primary border border-background-secondary",
      },
      size: {
        sm: "h-7 px-3 text-xs",
        md: "h-8 sm:h-10 px-4 sm:px-5 text-sm sm:text-base",
        lg: "h-10 px-5 text-base",
      },
      selected: {
        true: "bg-background-bk text-white border-transparent hover:bg-background-bk",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      selected: false,
    },
  }
);

export interface ChipProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof chipVariants> {
  asChild?: boolean;
  selected?: boolean;
}

const Chip = React.forwardRef<HTMLButtonElement, ChipProps>(
  ({ className, variant, size, selected, asChild = false, ...props }, ref) => {
    const Comp = asChild ? "span" : "button";
    return (
      <Comp
        className={cn(chipVariants({ variant, size, selected: !!selected, className }))}
        ref={ref}
        {...props}
        type={asChild ? undefined : "button"}
        aria-pressed={selected}
      />
    );
  }
);
Chip.displayName = "Chip";

export { Chip, chipVariants };
