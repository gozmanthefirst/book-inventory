import * as React from "react";
import { Ref } from "react";
import { ValidationError } from "@tanstack/react-form";

import { cn } from "../utils/cn";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  ref?: Ref<HTMLInputElement>;
  errors?: ValidationError[];
}

export const Input = ({
  className,
  ref,
  type,
  errors,
  ...props
}: InputProps) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-12 w-full border border-neutral-300 bg-transparent px-4 py-1 text-sm text-neutral-900 transition duration-200 group-first:rounded-t-2xl group-last:rounded-b-2xl file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-400 hover:border-brand-200 focus-visible:border-brand-500 focus-visible:ring-4 focus-visible:ring-brand-500/20 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50",
        Array.isArray(errors) &&
          errors?.length > 0 &&
          "border-red-300 bg-red-400/15 hover:border-red-300 focus-visible:border-red-500 focus-visible:ring-red-500/20",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
};
