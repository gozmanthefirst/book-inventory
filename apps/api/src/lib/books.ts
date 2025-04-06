import type { ReadStatus } from "@repo/database";
import { db } from "@repo/database";

export const getAllBooksQ = async () => {
  const books = await db.book.findMany({
    include: {
      authors: true,
      genres: true,
    },
  });
  return books;
};

export const getAllBooksForUserQ = async (userId: string) => {
  const books = await db.book.findMany({
    where: {
      userId,
    },
    include: {
      authors: true,
      genres: true,
    },
  });
  return books;
};

export const createNewBookForUserQ = async ({
  title,
  subtitle,
  bookDesc,
  imageUrl,
  isbn,
  publisher,
  publishedDate,
  pageCount,
  readStatus,
  authors,
  genres,
  userId,
}: {
  title: string;
  subtitle?: string;
  bookDesc?: string;
  imageUrl?: string;
  isbn?: string;
  publisher?: string;
  publishedDate?: Date;
  pageCount: number;
  readStatus: string;
  authors: string[];
  genres: string[];
  userId: string;
}) => {
  await db.book.create({
    data: {
      title,
      subtitle,
      bookDesc,
      imageUrl,
      isbn,
      publisher,
      publishedDate,
      pageCount,
      readStatus: (readStatus.toUpperCase() || "UNREAD") as ReadStatus,
      userId,
      authors: {
        connectOrCreate: authors.map((name) => ({
          where: { authorName: name },
          create: { authorName: name },
        })),
      },
      genres: {
        connectOrCreate: genres.map((name) => ({
          where: { genreName: name },
          create: { genreName: name },
        })),
      },
    },
  });
};

export const getBookByIdQ = async (booKId: string) => {
  const book = await db.book.findUnique({
    where: {
      id: booKId,
    },
    include: {
      authors: true,
      genres: true,
    },
  });
  return book;
};

export const getBookByIdForUserQ = async (bookId: string, userId: string) => {
  const book = await db.book.findUnique({
    where: {
      id: bookId,
      userId,
    },
    include: {
      authors: true,
      genres: true,
    },
  });
  return book;
};

export const getBookByIsbnForUserQ = async (isbn: string, userId: string) => {
  const book = await db.book.findFirst({
    where: {
      isbn,
      userId,
    },
    include: {
      authors: true,
      genres: true,
    },
  });
  return book;
};

export const deleteBookByIdQ = async (id: string) => {
  await db.book.delete({
    where: {
      id,
    },
  });
};

export const updateBookReadStatusForUserQ = async (
  bookId: string,
  userId: string,
  readStatus: string,
) => {
  const book = await db.book.update({
    where: {
      id: bookId,
      userId,
    },
    data: {
      readStatus: (readStatus.toUpperCase() || "UNREAD") as ReadStatus,
    },
    include: {
      authors: true,
      genres: true,
    },
  });

  return book;
};

export const deleteBookByIdForUserQ = async (
  bookId: string,
  userId: string,
) => {
  await db.book.delete({
    where: {
      id: bookId,
      userId,
    },
  });
};
