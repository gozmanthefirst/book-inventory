import { cn } from "../utils/cn";

export const Skeleton = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn("animate-pulse rounded-2xl bg-black/10", className)}
      {...props}
    />
  );
};
