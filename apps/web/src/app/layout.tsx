import { ReactNode } from "react";
import type { Metadata } from "next";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Toaster } from "sonner";

import QueryProvider from "@/providers/query-provider";
import { ScreenSize } from "@/shared/components/screen-size";
import { cn } from "@/shared/utils/cn";
import { geist } from "@/styles/fonts";

import "@/styles/globals.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Book Inventory",
  description: "Book Inventory",
};

interface Props {
  children: ReactNode;
}

const RootLayout = async ({ children }: Props) => {
  return (
    <html lang="en">
      <body
        className={cn(
          `bg-background text-foreground antialiased`,
          geist.className,
        )}
      >
        <NuqsAdapter>
          <ScreenSize />
          <QueryProvider>
            {children}
            <Toaster richColors />
          </QueryProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
};

export default RootLayout;
