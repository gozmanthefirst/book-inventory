"use client";

import { useLockBodyScroll } from "@uidotdev/usehooks";

import { Skeleton } from "@/shared/components/skeleton";

export const BookListLoader = () => {
  useLockBodyScroll();

  return (
    <div className="flex w-full flex-col gap-3">
      {[...Array(20)].map((_, i) => (
        <Skeleton key={i} className="h-40 w-full rounded-none" />
      ))}
    </div>
  );
};
