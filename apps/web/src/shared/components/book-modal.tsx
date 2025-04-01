"use client";

import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import Image from "next/image";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useStore } from "@tanstack/react-store";
import { useClickAway } from "@uidotdev/usehooks";
import { AnimatePresence, motion } from "motion/react";
import { TbBook2 } from "react-icons/tb";
import { RotatingLines } from "react-loader-spinner";

import { addBook } from "@/features/book/api/add-book";
import { removeBook } from "@/features/book/api/remove-book";
import { ReadStatusBadge } from "@/features/book/components/read-status-badge";
import { getMyBooks } from "@/shared/api/get-my-books";
import { Button } from "@/shared/components/button";
import { readStatusDdStore } from "@/shared/lib/store";
import { SimpleBook } from "@/shared/types/google-book";
import { cn } from "@/shared/utils/cn";
import { runParallelAction } from "@/shared/utils/parallel-server-action";
import { alegreya } from "@/styles/fonts";

const MotionTbBook2 = motion.create(TbBook2);

// Read status types
type ReadStatus = "UNREAD" | "READING" | "READ";

// States object to store add button states for each book by ID
type ButtonAction = "add" | "remove";
type ButtonState = "idle" | "loading" | "success" | "error";
interface ButtonStates {
  [bookId: string]: {
    [action in ButtonAction]?: ButtonState;
  };
}

const addButtonCopy = {
  idle: "Add",
  loading: <RotatingLines visible width="18" strokeColor="#faf2e8" />,
  success: "Book added successfully!",
  error: "Something went wrong",
};

const removeButtonCopy = {
  idle: "Remove",
  loading: <RotatingLines visible width="18" strokeColor="#dc2626" />,
  success: "Book removed successfully!",
  error: "Something went wrong",
};

export const BookModal = ({
  book,
  setSelectedBook,
  allowBookAdding = false,
  allowBookRemoving = false,
  showReadStatus = false,
}: {
  book: SimpleBook | null;
  setSelectedBook: Dispatch<SetStateAction<SimpleBook | null>>;
  allowBookAdding?: boolean;
  allowBookRemoving?: boolean;
  showReadStatus?: boolean;
}) => {
  // State to store 'read status' dropdown status
  const readStatusDdOpen = useStore(readStatusDdStore);

  const [buttonStates, setButtonStates] = useState<ButtonStates>({});

  // Close modal when a anywhere outside the modal is clicked
  const ref = useClickAway<HTMLDivElement>(() => {
    setSelectedBook(null);
  });

  // Clear button states when component unmounts
  useEffect(() => {
    return () => {
      setButtonStates({});
    };
  }, []);

  // Close modal when the `esc` key is pressed
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setSelectedBook(null);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [setSelectedBook]);

  // Stop page from scrolling when the modal is open
  useEffect(() => {
    if (book) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [book]);

  const queryClient = useQueryClient();

  const updateButtonState = useCallback(
    (bookId: string, action: ButtonAction, state: ButtonState) => {
      setButtonStates((prev) => ({
        ...prev,
        [bookId]: {
          ...prev[bookId],
          [action]: state,
        },
      }));
    },
    [],
  );

  // Function to add book
  const handleAddBook = async (readStatus: ReadStatus) => {
    if (!book) return;

    const bookId = book.id;

    try {
      updateButtonState(bookId, "add", "loading");

      const response = await addBook({
        ...book,
        readStatus,
      });

      if (response.status === "error") {
        updateButtonState(bookId, "add", "error");
        return;
      }

      await queryClient.invalidateQueries({
        queryKey: ["my-books"],
      });
      updateButtonState(bookId, "add", "success");

      const timeoutId = setTimeout(() => {
        setSelectedBook(null);
      }, 800);

      return () => clearTimeout(timeoutId);
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.error(error);
      }

      updateButtonState(bookId, "add", "error");
    } finally {
      setTimeout(() => {
        updateButtonState(bookId, "add", "idle");
      }, 3000);
    }
  };

  // Function to remove book
  const handleRemoveBook = async () => {
    if (!book) return;

    const bookId = book.id;

    try {
      updateButtonState(bookId, "remove", "loading");

      const response = await removeBook(book);

      if (response.status === "error") {
        updateButtonState(bookId, "remove", "error");
        return;
      }

      setSelectedBook(null);
      updateButtonState(bookId, "remove", "success");

      setTimeout(() => {
        queryClient.invalidateQueries({
          queryKey: ["my-books"],
        });
      }, 1000);
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.error(error);
      }

      updateButtonState(bookId, "remove", "error");
    } finally {
      setTimeout(() => {
        updateButtonState(bookId, "remove", "idle");
      }, 3000);
    }
  };

  return (
    <AnimatePresence>
      {book ? (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              type: "spring",
              duration: 0.5,
              bounce: 0.2,
            }}
            className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm"
          />

          {/* Selected Book */}
          <div className="fixed inset-0 z-50 grid place-items-center px-2">
            <motion.div
              ref={ref}
              layoutId={`book-${book.id}`}
              transition={{
                type: "spring",
                duration: 0.5,
                bounce: 0.2,
              }}
              className="relative flex max-h-[95dvh] w-full max-w-4xl flex-col gap-4 overflow-auto border-neutral-300 bg-background p-4 shadow-md md:p-6"
            >
              {/* Modal Contents */}
              <div className="flex w-full flex-col gap-4 smd:gap-4 md:h-80 md:flex-row">
                {/* Book image */}
                <motion.div
                  layoutId={`book-image-${book.id}`}
                  transition={{
                    type: "spring",
                    duration: 0.5,
                    bounce: 0.2,
                  }}
                  className="relative aspect-2/3 h-60 self-start shadow-md sm:h-70 smd:h-88 md:h-full"
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

                {/* Book title, author and desc */}
                <div className="relative flex flex-col gap-1">
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
                        "text-xl leading-tight font-semibold text-brand-500 transition-colors duration-200 md:text-2xl",
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
                      className="max-h-[8dvh] overflow-auto text-[13px]/[18px] font-semibold text-neutral-600 md:text-sm"
                    >
                      {book.authors?.join(", ")}
                    </motion.p>

                    {showReadStatus ? (
                      <ReadStatusBadge
                        layoutId="book-read-status"
                        book={book}
                        showDdOnClick
                        setSelectedBook={setSelectedBook}
                      />
                    ) : null}
                  </div>

                  {/* Description */}
                  {book?.description ? (
                    <motion.p
                      layoutId={`book-desc-${book.id}`}
                      transition={{
                        type: "spring",
                        duration: 0.5,
                        bounce: 0.2,
                      }}
                      className="md:max-h-auto mt-2 max-h-[15dvh] overflow-auto text-[13px]/[18px] text-neutral-600 sm:max-h-[20dvh] smd:mt-2 smd:max-h-[25dvh] md:text-sm"
                    >
                      {book?.description}
                    </motion.p>
                  ) : null}
                </div>
              </div>

              {/* Modal Overlay to cover the rest  */}
              <AnimatePresence>
                {readStatusDdOpen ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{
                      type: "spring",
                      duration: 0.5,
                      bounce: 0.2,
                    }}
                    className="absolute inset-0"
                    onClick={() => readStatusDdStore.setState(() => false)}
                  />
                ) : null}
              </AnimatePresence>

              {/* Buttons */}
              <div className="sticky bottom-0 bg-background">
                {/* Modal Overlay (to cover the bottom buttons) */}
                <AnimatePresence>
                  {readStatusDdOpen ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{
                        type: "spring",
                        duration: 0.5,
                        bounce: 0.2,
                      }}
                      className="absolute inset-0 z-55"
                      onClick={() => readStatusDdStore.setState(() => false)}
                    />
                  ) : null}
                </AnimatePresence>

                {/* Small */}
                <BookModalButtons
                  book={book}
                  handleAddBook={handleAddBook}
                  handleRemoveBook={handleRemoveBook}
                  setSelectedBook={setSelectedBook}
                  size="lg"
                  buttonStates={buttonStates}
                  allowBookAdding={allowBookAdding}
                  allowBookRemoving={allowBookRemoving}
                />

                {/* Large */}
                <BookModalButtons
                  book={book}
                  handleAddBook={handleAddBook}
                  handleRemoveBook={handleRemoveBook}
                  setSelectedBook={setSelectedBook}
                  size="xl"
                  buttonStates={buttonStates}
                  allowBookAdding={allowBookAdding}
                  allowBookRemoving={allowBookRemoving}
                />
              </div>
            </motion.div>
          </div>
        </>
      ) : null}
    </AnimatePresence>
  );
};

const BookModalButtons = ({
  book,
  handleAddBook,
  handleRemoveBook,
  setSelectedBook,
  size,
  buttonStates,
  allowBookAdding,
  allowBookRemoving,
}: {
  book: SimpleBook;
  handleAddBook: (readStatus: ReadStatus) => Promise<(() => void) | undefined>;
  handleRemoveBook: () => Promise<void>;
  setSelectedBook: Dispatch<SetStateAction<SimpleBook | null>>;
  size: "lg" | "xl";
  buttonStates: ButtonStates;
  allowBookAdding: boolean;
  allowBookRemoving: boolean;
}) => {
  const addButtonState = buttonStates[book.id]?.add || "idle";
  const removeButtonState = buttonStates[book.id]?.remove || "idle";

  const variants = {
    initial: { opacity: 0, y: -40 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 40 },
  };

  // Get my books
  const { data: { data: myBooks } = {} } = useQuery({
    queryKey: ["my-books"],
    queryFn: () => runParallelAction(getMyBooks()),
  });

  const isBookAdded = myBooks?.some(
    (myBook) => myBook.isbn === book?.isbn13 || myBook.isbn === book?.isbn10,
  );

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: -30,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      exit={{
        opacity: 0,
        y: -30,
      }}
      transition={{ duration: 0.1 }}
      className={
        size === "xl"
          ? "hidden flex-col-reverse gap-3 smd:flex-row md:flex"
          : "flex flex-col-reverse gap-3 smd:flex-row md:hidden"
      }
    >
      {/* Close */}
      <Button
        size={size}
        variant={"secondary"}
        onClick={() => setSelectedBook(null)}
        className="relative w-full gap-2 overflow-hidden"
      >
        Close
      </Button>

      {/* Add */}
      {allowBookAdding ? (
        <AddButton
          size={size}
          buttonState={addButtonState}
          handleAddBook={handleAddBook}
          isBookAdded={!!isBookAdded}
        />
      ) : null}

      {/* Remove */}
      {allowBookRemoving ? (
        <Button
          size={size}
          variant={
            removeButtonState === "error" ? "destructive" : "destructiveOutline"
          }
          onClick={handleRemoveBook}
          disabled={removeButtonState !== "idle"}
          className="relative w-full gap-2 overflow-hidden"
        >
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={removeButtonState}
              transition={{ type: "spring", bounce: 0, duration: 0.3 }}
              initial="initial"
              animate="visible"
              exit="exit"
              variants={variants}
            >
              {removeButtonCopy[removeButtonState]}
            </motion.div>
          </AnimatePresence>
        </Button>
      ) : null}
    </motion.div>
  );
};

const AddButton = ({
  size,
  buttonState,
  handleAddBook,
  isBookAdded,
}: {
  size: "lg" | "xl";
  buttonState: ButtonState;
  handleAddBook: (readStatus: ReadStatus) => Promise<(() => void) | undefined>;
  isBookAdded: boolean;
}) => {
  // Add local state
  const [localDropdownOpen, setLocalDropdownOpen] = useState(false);

  const readStatusDdRef = useClickAway<HTMLDivElement>(() => {
    setLocalDropdownOpen(false);
    readStatusDdStore.setState(() => false);
  });

  const variants = {
    initial: { opacity: 0, y: -40 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 40 },
  };

  return (
    <div className="relative w-full">
      <Button
        size={size}
        variant={buttonState === "error" ? "destructive" : "brand"}
        type="button"
        onClick={() => {
          setLocalDropdownOpen(true);
          readStatusDdStore.setState(() => true);
        }}
        disabled={buttonState !== "idle" || isBookAdded}
        className="relative w-full gap-2 overflow-hidden lg:hover:bg-brand-500"
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
            {isBookAdded && buttonState === "idle"
              ? "Added"
              : addButtonCopy[buttonState]}
          </motion.div>
        </AnimatePresence>
      </Button>

      {/* Read Status Dropdown */}
      <AnimatePresence initial={false}>
        {localDropdownOpen ? (
          <motion.div
            ref={readStatusDdRef}
            initial={{
              scale: 0.95,
              opacity: 0,
              y: 5,
              x: 5,
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
              y: 5,
              x: 5,
            }}
            transition={{
              type: "spring",
              duration: 0.3,
              bounce: 0.2,
            }}
            className={cn(
              "absolute right-0 bottom-[calc(100%_+_0.5rem)] left-0 z-55 rounded-3xl border border-neutral-300 bg-neutral-200 p-3 text-sm text-brand-500 shadow-sm",
            )}
          >
            {["UNREAD", "READING", "READ"].map((option) => (
              <motion.div
                key={option.toLowerCase()}
                onClick={async () => {
                  setLocalDropdownOpen(false);
                  readStatusDdStore.setState(() => false);
                  await handleAddBook(option as ReadStatus);
                }}
                tabIndex={1}
                className={cn(
                  "relative flex h-10 cursor-pointer items-center justify-center rounded-xl bg-inherit font-semibold text-brand-500 transition duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 lg:hover:bg-brand-500 lg:hover:text-background",
                )}
              >
                {option}
              </motion.div>
            ))}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};
