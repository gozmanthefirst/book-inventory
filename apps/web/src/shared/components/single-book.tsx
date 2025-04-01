"use client";

import { Dispatch, SetStateAction } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { TbBook2 } from "react-icons/tb";

import { ReadStatusBadge } from "@/features/book/components/read-status-badge";
import { SimpleBook } from "@/shared/types/google-book";
import { cn } from "@/shared/utils/cn";
import { alegreya } from "@/styles/fonts";

const MotionTbBook2 = motion.create(TbBook2);

export const SingleBook = ({
  book,
  setSelectedBook,
  showReadStatus = false,
}: {
  book: SimpleBook;
  setSelectedBook: Dispatch<SetStateAction<SimpleBook | null>>;
  showReadStatus?: boolean;
}) => {
  return (
    <motion.li
      layoutId={`book-${book.id}`}
      transition={{
        type: "spring",
        duration: 0.5,
        bounce: 0.2,
      }}
      onClick={() => setSelectedBook(book)}
      className="group flex cursor-pointer flex-col gap-4 pt-4"
    >
      <div className="flex h-32 w-full gap-3 smd:h-40 smd:gap-4">
        {/* Book image */}
        <motion.div
          layoutId={`book-image-${book.id}`}
          transition={{
            type: "spring",
            duration: 0.5,
            bounce: 0.2,
          }}
          className="relative aspect-2/3 h-full shadow-md"
        >
          <div className="absolute inset-0 flex items-center justify-center bg-[#e1d8cf] text-neutral-400">
            <MotionTbBook2
              layoutId={`book-icon-${book.id}`}
              transition={{
                type: "spring",
                duration: 0.5,
                bounce: 0.2,
              }}
              size={40}
            />
          </div>
          {book.image ? (
            <Image
              src={book.image}
              alt={""}
              fill
              className="object-cover object-center"
            />
          ) : null}
        </motion.div>

        {/* Book title, author */}
        <div className="flex flex-col gap-1">
          {/* Title */}
          <motion.p
            layoutId={`book-title-${book.id}`}
            transition={{
              type: "spring",
              duration: 0.5,
              bounce: 0.2,
            }}
            className={cn(
              "line-clamp-2 text-xl leading-tight font-semibold text-neutral-800 transition-colors duration-200 group-hover:text-brand-500 md:text-2xl",
              alegreya.className,
            )}
          >
            {book.title}
          </motion.p>

          {/* Authors */}
          <motion.p
            layoutId={`book-author-${book.id}`}
            transition={{
              type: "spring",
              duration: 0.5,
              bounce: 0.2,
            }}
            className="line-clamp-2 text-[13px]/[18px] font-semibold text-neutral-600 md:text-sm"
          >
            {book.authors?.join(", ")}
          </motion.p>

          {showReadStatus ? (
            <ReadStatusBadge layoutId="book-read-status" book={book} />
          ) : null}

          {/* Description */}
          <motion.p
            layoutId={`book-desc-${book.id}`}
            transition={{
              type: "spring",
              duration: 0.5,
              bounce: 0.2,
            }}
            className="mt-2 line-clamp-2 text-[13px]/[18px] text-neutral-600 smd:mt-2 smd:line-clamp-3 md:text-sm"
          >
            {book?.description}
          </motion.p>
        </div>
      </div>

      <div className="h-px w-full bg-neutral-300 group-last:hidden" />
    </motion.li>
  );
};
