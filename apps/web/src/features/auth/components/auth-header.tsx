import { HTMLAttributes, Ref } from "react";
import Image from "next/image";
import Link from "next/link";

import { cn } from "@/shared/utils/cn";

interface HeaderProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
}

export const AuthHeader = ({ className, ref, ...props }: HeaderProps) => {
  return (
    <header
      ref={ref}
      className={cn("fixed top-0 z-50 flex justify-start py-6", className)}
      {...props}
    >
      <Link href={"/"}>
        <div className="relative size-10 md:size-11">
          <Image src={"/images/logo.png"} alt="Logo" fill />
        </div>
      </Link>
    </header>
  );
};
