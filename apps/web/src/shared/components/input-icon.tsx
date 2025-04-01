import { HTMLAttributes, Ref } from "react";

import { cn } from "../utils/cn";

interface InputIconProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
  direction?: "start" | "end";
}

export const InputIcon = ({
  className,
  children,
  ref,
  tabIndex = -1,
  direction = "start",
  ...props
}: InputIconProps) => {
  return (
    <div
      ref={ref}
      tabIndex={tabIndex}
      className={cn(
        "absolute top-3 bottom-3 flex aspect-square h-auto items-center justify-center text-neutral-400 transition-colors duration-200",
        direction === "start" ? "left-3" : "right-3",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};
