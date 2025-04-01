import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines multiple class names into a single string, merging Tailwind CSS classes intelligently.
 *
 * This utility function is a wrapper around the `clsx` and `tailwind-merge` libraries.
 * It accepts multiple class values (which can be strings, objects, arrays, etc.),
 * combines them using `clsx`, and then merges Tailwind CSS classes using `twMerge`
 * to ensure that any conflicting classes are resolved correctly.
 *
 * @param {...ClassValue[]} inputs - The class values to be combined.
 *        These can be strings, arrays, objects, or any other format supported by `clsx`.
 * @returns {string} - A single string of combined class names with conflicting Tailwind CSS classes merged.
 *
 * @example
 * // Basic usage with string inputs
 * const className = cn("bg-red-500", "text-white");
 *
 * @example
 * // Usage with conditional classes
 * const className = cn("bg-red-500", isActive && "text-white");
 *
 * @example
 * // Usage with objects
 * const className = cn("bg-red-500", { "text-white": isActive });
 */
export const cn = (...inputs: ClassValue[]): string => {
  return twMerge(clsx(inputs));
};
