"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { TbBook, TbChartDonut3, TbSearch } from "react-icons/tb";

import { Tabs, TabsList, TabsTrigger } from "@/shared/components/tabs";
import { cn } from "@/shared/utils/cn";

const NAVS = [
  {
    value: "/my-books",
    icon: TbBook,
  },
  {
    value: "/search",
    icon: TbSearch,
  },
  {
    value: "/portfolio",
    icon: TbChartDonut3,
  },
];

export const BottomNav = () => {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="pointer-events-none sticky bottom-0 z-40 flex items-center justify-center py-4">
      <Tabs
        defaultValue="/search"
        value={pathname}
        onValueChange={(value) => router.push(value)}
        className="pointer-events-auto"
      >
        <TabsList className="border border-neutral-300 shadow-sm">
          {NAVS.map((tab) => {
            const Icon = tab.icon;

            return (
              <Link prefetch href={tab.value} key={tab.value}>
                <TabsTrigger
                  value={tab.value}
                  className={cn(
                    "px-4 py-2 text-brand-500 transition duration-200 md:px-6",
                    pathname === tab.value && "bg-brand-500 text-background",
                  )}
                >
                  <div className="relative z-[30]">
                    <Icon size={20} strokeWidth={2.5} />
                  </div>
                </TabsTrigger>
              </Link>
            );
          })}
        </TabsList>
      </Tabs>
    </div>
  );
};
