"use client";

import { HTMLAttributes, Ref, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { RotatingLines } from "react-loader-spinner";
import { toast } from "sonner";

import { logoutUser } from "@/features/auth/api/logout";
import { cn } from "../utils/cn";
import { Button } from "./button";

interface HeaderProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
}

const buttonCopy = {
  idle: "Sign Out",
  loading: <RotatingLines visible width="16" strokeColor="#faf2e8" />,
  success: "Signed Out!",
  error: "Error",
};

export const Header = ({ className, ref, ...props }: HeaderProps) => {
  const [buttonState, setButtonState] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const variants = {
    initial: { opacity: 0, y: -40 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 40 },
  };

  const handleSignOut = async () => {
    // Make the button load
    setButtonState("loading");

    // Logout user
    const logoutResponse = await logoutUser();

    if (logoutResponse.status === "error") {
      toast.error(logoutResponse.details);
      setButtonState("error");
    } else if (logoutResponse.status === "success") {
      setButtonState("success");

      setTimeout(() => {
        redirect("/sign-in");
      }, 1000);
    }

    // Make the button idle
    setTimeout(() => {
      setButtonState("idle");
    }, 3000);
  };

  return (
    <header
      ref={ref}
      className={cn(
        "pointer-events-none sticky top-0 z-50 flex items-center justify-between py-6",
        className,
      )}
      {...props}
    >
      <Link href={"/"} className="pointer-events-auto">
        <div className="relative size-10 md:size-11">
          <Image src={"/images/logo.png"} alt="Logo" fill />
        </div>
      </Link>

      <div className="pointer-events-auto">
        <Button
          size={"sm"}
          disabled={buttonState !== "idle"}
          onClick={handleSignOut}
          className={cn("relative w-30 overflow-hidden")}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={buttonState}
              transition={{ type: "spring", bounce: 0, duration: 0.3 }}
              initial="initial"
              animate="visible"
              exit="exit"
              variants={variants}
            >
              {buttonCopy[buttonState]}
            </motion.div>
          </AnimatePresence>
        </Button>
      </div>
    </header>
  );
};
