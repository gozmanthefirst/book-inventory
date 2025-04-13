"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@uidotdev/usehooks";
import { TbBooksOff, TbExclamationCircle, TbSearch } from "react-icons/tb";

import { BookListLoader } from "@/shared/components/book-list-loader";
import { BookModal } from "@/shared/components/book-modal";
import { Input } from "@/shared/components/input";
import { InputIcon } from "@/shared/components/input-icon";
import { SingleBook } from "@/shared/components/single-book";
import { complexBookToSimpleBook } from "@/shared/lib/book";
import { SimpleBook } from "@/shared/types/google-book";
import { cn } from "@/shared/utils/cn";
import { runParallelAction } from "@/shared/utils/parallel-server-action";
import { alegreya } from "@/styles/fonts";
import { getMyBooks } from "../../../shared/api/get-my-books";

export const MyBooks = () => {
  const [selectedBook, setSelectedBook] = useState<SimpleBook | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery.trim(), 500);

  // Get my books
  const {
    data: { data: myBooks } = {},
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["my-books"],
    queryFn: () => runParallelAction(getMyBooks()),
  });

  // Filter books based on debounced search query
  const filteredBooks = useMemo(() => {
    if (!myBooks) return [];
    if (!debouncedSearchQuery) return myBooks;

    return myBooks.filter((book) => {
      const simpleBook = complexBookToSimpleBook(book);
      const searchTerm = debouncedSearchQuery.toLowerCase();
      const titleMatch = simpleBook.title.toLowerCase().includes(searchTerm);
      const authorMatch = simpleBook.authors.some((author) =>
        author.toLowerCase().includes(searchTerm),
      );
      return titleMatch || authorMatch;
    });
  }, [myBooks, debouncedSearchQuery]);

  return (
    <div className="flex flex-col gap-8">
      {/* My Books Header and Search Input */}
      <div className="flex flex-col gap-3">
        <h1
          className={cn(
            "text-brand-500 text-3xl font-semibold",
            alegreya.className,
          )}
        >
          My Books
        </h1>
        {/* Add Search Input */}
        <div className="relative">
          <InputIcon>
            <TbSearch size={20} />
          </InputIcon>
          <Input
            placeholder="Search your books by title or author"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-brand-200 h-14 px-5 pl-12 text-base"
          />
        </div>
      </div>

      {isLoading ? (
        <BookListLoader />
      ) : isError ? (
        <div className="my-10 flex flex-col">
          <div className="flex-1">
            <div className="mx-auto flex aspect-square h-full max-h-[400px] flex-col items-center justify-center text-red-500">
              <TbExclamationCircle size={144} strokeWidth={1.5} className="" />
              <p className={cn("text-xl")}>No added books</p>
            </div>
          </div>
        </div>
      ) : Array.isArray(myBooks) && myBooks.length === 0 ? (
        <div className="my-10 flex flex-col">
          <div className="flex-1">
            <div className="mx-auto flex aspect-square h-full max-h-[400px] flex-col items-center justify-center text-neutral-400">
              <TbBooksOff size={144} strokeWidth={1.5} className="" />
              <p className={cn("text-xl")}>No added books</p>
            </div>
          </div>
        </div>
      ) : filteredBooks.length > 0 ? (
        <ul className="flex w-full flex-col">
          {[...filteredBooks]
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime(),
            )
            .map((complexBook) => {
              const simpleBook = complexBookToSimpleBook(complexBook);

              return (
                <SingleBook
                  key={simpleBook.id}
                  book={simpleBook}
                  setSelectedBook={setSelectedBook}
                  showReadStatus
                />
              );
            })}
        </ul>
      ) : (
        <div className="my-10 flex flex-col">
          <div className="flex-1">
            <div className="mx-auto flex aspect-square h-full max-h-[400px] flex-col items-center justify-center text-neutral-400">
              <TbSearch size={144} strokeWidth={1.5} className="" />
              <p className={cn("text-xl")}>No books match your search</p>
            </div>
          </div>
        </div>
      )}

      {/* Book Modal */}
      <BookModal
        book={selectedBook}
        setSelectedBook={setSelectedBook}
        allowBookRemoving
        showReadStatus
      />
    </div>
  );
};
