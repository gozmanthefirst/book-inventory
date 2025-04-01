"use server";

import { cookies } from "next/headers";
import axios from "axios";

import { SimpleBook } from "@/shared/types/google-book";
import { ServerActionResponse } from "@/shared/types/shared-types";
import { handleApiError } from "@/shared/utils/handle-api-error";

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || "";

// add book
export const addBook = async (
  book: SimpleBook,
): Promise<ServerActionResponse> => {
  try {
    // Get the session token
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("books_gd_session_token");

    await axios.post(
      `${API_BASE}/books`,
      {
        title: book.title,
        subtitle: book.subtitle,
        bookDesc: book.description,
        imageUrl: book.image,
        isbn: book.isbn13 || book.isbn10,
        publisher: book.publisher,
        publishedDate: book.publishedDate,
        pageCount: book.pageCount,
        readStatus: (book.readStatus || "UNREAD").toLowerCase(),
        authors: book.authors,
        genres: book.categories,
      },
      {
        headers: {
          Authorization: `Bearer ${sessionToken?.value}`,
        },
      },
    );

    return {
      status: "success",
      details: "Book successfully added!",
    };
  } catch (error) {
    return handleApiError(error, {
      errorDescription: "Error adding book",
      errorMapping: {
        INVALID_DATA: "Invalid book data provided.",
        ISBN_ALREADY_EXIST:
          "You already have a book with this ISBN in your library.",
      },
    });
  }
};
