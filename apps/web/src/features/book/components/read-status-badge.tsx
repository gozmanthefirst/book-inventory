"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useClickAway } from "@uidotdev/usehooks";
import { AnimatePresence, motion } from "motion/react";
import { TbCircleCheck, TbExclamationCircle } from "react-icons/tb";
import { RotatingLines } from "react-loader-spinner";

import { updateBook } from "@/features/book/api/update-book";
import { readStatusDdStore } from "@/shared/lib/store";
import { SimpleBook } from "@/shared/types/google-book";
import { ServerActionResponse } from "@/shared/types/shared-types";
import { cn } from "@/shared/utils/cn";

type ReadStatus = "UNREAD" | "READING" | "READ";

export const ReadStatusBadge = ({
  book,
  layoutId,
  showDdOnClick,
  setSelectedBook,
}: {
  book: SimpleBook;
  layoutId: string;
  showDdOnClick?: boolean;
  setSelectedBook?: Dispatch<SetStateAction<SimpleBook | null>>;
}) => {
  // States object to store update icon states for each book by ID
  const [updateIconStates, setUpdateIconStates] = useState<
    Record<string, "idle" | "loading" | "success" | "error">
  >({});
  const updateIconState = book ? updateIconStates[book.id] || "idle" : "idle";

  // Add local state for this specific badge's dropdown
  const [localDropdownOpen, setLocalDropdownOpen] = useState(false);

  // Close modal when a anywhere outside the modal is clicked
  const readStatusDdRef = useClickAway<HTMLDivElement>(() => {
    setLocalDropdownOpen(false);
    readStatusDdStore.setState(() => false);
  });

  const queryClient = useQueryClient();

  // Function to update book
  const handleUpdateBook = async (readStatus: ReadStatus) => {
    if (!book) return;

    try {
      setUpdateIconStates((prev) => ({
        ...prev,
        [book.id]: "loading",
      }));

      const response: ServerActionResponse = await updateBook({
        bookId: book.id,
        readStatus,
      });

      if (response.status === "error") {
        return setUpdateIconStates((prev) => ({
          ...prev,
          [book.id]: "error",
        }));
      }

      await queryClient.invalidateQueries({
        queryKey: ["my-books"],
      });
      setUpdateIconStates((prev) => ({
        ...prev,
        [book.id]: "success",
      }));

      const timeoutId = setTimeout(() => {
        setSelectedBook?.(null);
      }, 800);

      return () => clearTimeout(timeoutId);
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.error(error);
      }

      setUpdateIconStates((prev) => ({
        ...prev,
        [book.id]: "error",
      }));
    } finally {
      setTimeout(() => {
        setUpdateIconStates((prev) => ({
          ...prev,
          [book.id]: "idle",
        }));
      }, 3000);
    }
  };

  return (
    <>
      <div className="relative flex items-center gap-1 self-start">
        {/* Read status */}
        <motion.div
          layoutId={`${layoutId}-${book.id}`}
          onClick={() => {
            if (showDdOnClick) {
              setLocalDropdownOpen(true);
              readStatusDdStore.setState(() => true);
            }
          }}
          transition={{
            type: "spring",
            duration: 0.5,
            bounce: 0.2,
          }}
          className={cn(
            "relative cursor-pointer self-start rounded-full px-2 py-0.5 text-[10px] font-semibold",
            book.readStatus.toLowerCase() === "read"
              ? "bg-green-200 text-green-800"
              : book.readStatus.toLowerCase() === "reading"
                ? "bg-blue-200 text-blue-800"
                : "bg-red-200 text-red-800",
          )}
        >
          {book.readStatus}
        </motion.div>

        {/* Loader */}
        {updateIconState === "loading" ? (
          <RotatingLines visible width="14" strokeColor="#2563eb" />
        ) : updateIconState === "error" ? (
          <TbExclamationCircle className="text-red-600" />
        ) : updateIconState === "success" ? (
          <TbCircleCheck className="text-green-600" />
        ) : null}

        {/* Read Status Dropdown */}
        <AnimatePresence initial={false}>
          {localDropdownOpen ? (
            <motion.div
              ref={readStatusDdRef}
              initial={{
                scale: 0.95,
                opacity: 0,
                y: -5,
                x: -5,
              }}
              animate={{
                scale: 1,
                opacity: 1,
                y: 0,
                x: 0,
              }}
              exit={{
                scale: 0.95,
                opacity: 0,
                y: -5,
                x: -5,
              }}
              transition={{
                type: "spring",
                duration: 0.3,
                bounce: 0.2,
              }}
              className={cn(
                "absolute top-[calc(100%_+_0.5rem)] left-0 z-[52] w-64 rounded-3xl border border-neutral-300 bg-neutral-200 p-3 text-sm text-brand-500 shadow-sm",
              )}
            >
              {["UNREAD", "READING", "READ"].map((option) => (
                <motion.div
                  key={option.toLowerCase()}
                  onClick={async () => {
                    setLocalDropdownOpen(false);
                    readStatusDdStore.setState(() => false);
                    handleUpdateBook(option as ReadStatus);
                  }}
                  tabIndex={1}
                  className={cn(
                    "relative flex h-10 cursor-pointer items-center justify-center rounded-xl bg-inherit font-semibold text-brand-500 transition duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 lg:hover:bg-neutral-300",
                    option === book.readStatus ||
                      (!book.readStatus && option === "UNREAD")
                      ? "bg-brand-500 text-background lg:hover:bg-brand-500"
                      : "",
                  )}
                >
                  {option}
                </motion.div>
              ))}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </>
  );
};
