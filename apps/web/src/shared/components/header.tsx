"use client";

import { HTMLAttributes, MouseEvent, Ref, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "motion/react";
import { TbChevronDown } from "react-icons/tb";
import { RotatingLines } from "react-loader-spinner";
import { toast } from "sonner";

import { getUser } from "@/features/auth/api/get-user";
import { logoutUser } from "@/features/auth/api/logout";
import { runParallelAction } from "@/shared/utils/parallel-server-action";
import { cn } from "../utils/cn";
import { Button } from "./button";

const MotionChevron = motion.create(TbChevronDown);

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

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const variants = {
    initial: { opacity: 0, y: -40 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 40 },
  };

  // Get user
  const { data: { data: user } = {} } = useQuery({
    queryKey: ["user"],
    queryFn: () => runParallelAction(getUser()),
  });

  const handleSignOut = async (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

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

      <div
        onClick={() => setDropdownOpen((p) => !p)}
        className={cn(
          "lg:hover:text-brand-600 pointer-events-auto relative flex cursor-pointer items-center gap-1 font-medium text-neutral-700 transition-colors duration-200",
          dropdownOpen ? "text-brand-600" : "text-neutral-700",
        )}
      >
        <span className="z-60 relative">
          {user?.name
            ?.split(" ")
            .map((part, index, arr) =>
              index === arr.length - 1 && arr.length > 1
                ? `${part.charAt(0)}.`
                : `${part}${index < arr.length - 1 ? " " : ""}`,
            )}
        </span>

        <div className="z-60 relative rounded-md p-0.5 transition-all duration-200">
          <MotionChevron
            animate={{
              rotate: dropdownOpen ? 180 : 0,
            }}
          />
        </div>

        <AnimatePresence>
          {/* Overlay */}
          {dropdownOpen ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                type: "spring",
                duration: 0.5,
                bounce: 0.2,
              }}
              className="fixed inset-0 z-50 cursor-auto bg-black/20 backdrop-blur-sm"
            />
          ) : null}
        </AnimatePresence>

        <AnimatePresence mode="popLayout" initial={false}>
          {dropdownOpen ? (
            <motion.div
              initial={{
                opacity: 0,
                y: -10,
                scale: 0.95,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                y: -10,
                scale: 0.95,
              }}
              transition={{
                type: "spring",
                bounce: 0.4,
                duration: 0.4,
              }}
              className="bg-background absolute right-0 top-[calc(100%_+_8px)] z-50 flex min-w-64 cursor-auto flex-col border px-6 py-4 shadow-lg"
            >
              <p className="text-semibold text-brand-500">{user?.name}</p>
              <p className="text-sm text-neutral-700">{user?.email}</p>
              <Button
                size={"sm"}
                disabled={buttonState !== "idle"}
                onClick={handleSignOut}
                className={cn("relative mt-4 w-full overflow-hidden")}
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
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </header>
  );
};
