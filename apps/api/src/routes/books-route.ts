import { Hono } from "hono";
import { StatusCodes } from "http-status-codes";

import { deleteOrphanedAuthors } from "@/lib/authors";
import {
  createNewBookForUserQ,
  deleteBookByIdForUserQ,
  getAllBooksForUserQ,
  getBookByIdForUserQ,
  getBookByIdQ,
  getBookByIsbnForUserQ,
  updateBookReadStatusForUserQ,
} from "@/lib/books";
import { deleteOrphanedGenres } from "@/lib/genres";
import { zv } from "@/middleware/validator";
import { errorResponse, successResponse } from "@/utils/api-response";
import {
  createBookSchema,
  updateBookSchema,
} from "@/validators/books-validator";

const books = new Hono({ strict: false });

//* Get all books for a user
//* GET /books
books.get("/", async (c) => {
  try {
    const user = c.get("user");
    const books = await getAllBooksForUserQ(user.id);

    return c.json(
      successResponse("User's books successfully retrieved.", books),
      StatusCodes.OK,
    );
  } catch (error) {
    console.error("Error retrieving books for user:", error);
    return c.json(
      errorResponse(
        "INTERNAL_SERVER_ERROR",
        "Error retrieving books for user.",
      ),
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
});

//* Create book for user
//* POST /books
books.post("/", zv("json", createBookSchema), async (c) => {
  try {
    const user = c.get("user");
    const bookData = c.req.valid("json");

    // Check if a book already has that ISBN
    const modifiedIsbn = bookData.isbn.replace(/[-\s]/g, "");
    const existingIsbn = await getBookByIsbnForUserQ(modifiedIsbn, user.id);

    if (existingIsbn) {
      return c.json(
        errorResponse(
          "ISBN_ALREADY_EXIST",
          "Book with this ISBN already exists.",
        ),
        StatusCodes.CONFLICT,
      );
    }

    // Optional fields
    const finalSubtitle = bookData.subtitle ?? "";
    const finalBookDesc = bookData.bookDesc ?? "";
    const finalImageUrl = bookData.imageUrl ?? "";
    const finalPubDate = new Date(bookData.publishedDate);

    await createNewBookForUserQ({
      ...bookData,
      subtitle: finalSubtitle,
      bookDesc: finalBookDesc,
      imageUrl: finalImageUrl,
      publishedDate: finalPubDate,
      isbn: modifiedIsbn,
      userId: user.id,
    });

    return c.json(
      successResponse("User's book successfully created."),
      StatusCodes.CREATED,
    );
  } catch (error) {
    console.error("Error creating book for user:", error);
    return c.json(
      errorResponse("INTERNAL_SERVER_ERROR", "Error creating book for user."),
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
});

//* Get a single book for user
//* GET /books/:bookId
books.get("/:bookId", async (c) => {
  try {
    const user = c.get("user");
    const bookId = c.req.param("bookId");

    const book = await getBookByIdForUserQ(bookId, user.id);

    // Return an error if the book was not found
    if (!book) {
      return c.json(
        errorResponse("NOT_FOUND", "Book not found."),
        StatusCodes.NOT_FOUND,
      );
    }

    return c.json(
      successResponse("User's book successfully retrieved.", book),
      StatusCodes.OK,
    );
  } catch (error) {
    console.error("Error retrieving books for user:", error);
    return c.json(
      errorResponse(
        "INTERNAL_SERVER_ERROR",
        "Error retrieving books for user.",
      ),
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
});

//* Update book for user
//* PATCH /books/:bookId
books.patch("/:bookId", zv("json", updateBookSchema), async (c) => {
  try {
    const user = c.get("user");
    const bookId = c.req.param("bookId");
    const { readStatus } = c.req.valid("json");

    const book = await getBookByIdQ(bookId);

    // Return an error if the book was not found
    if (!book) {
      return c.json(
        errorResponse("NOT_FOUND", "Book not found."),
        StatusCodes.NOT_FOUND,
      );
    }

    // Update book
    const updatedBook = await updateBookReadStatusForUserQ(
      book.id,
      user.id,
      readStatus,
    );

    // Delete authors and genres if they no longer have a connected book
    await deleteOrphanedAuthors();
    await deleteOrphanedGenres();

    return c.json(
      successResponse("User's book successfully updated.", updatedBook),
      StatusCodes.OK,
    );
  } catch (error) {
    console.error("Error updating user's book:", error);
    return c.json(
      errorResponse("INTERNAL_SERVER_ERROR", "Error updating user's book."),
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
});

//* Delete book for user
//* DELETE /books/:bookId
books.delete("/:bookId", async (c) => {
  try {
    const user = c.get("user");
    const bookId = c.req.param("bookId");

    const book = await getBookByIdQ(bookId);

    // Return an error if the book was not found
    if (!book) {
      return c.json(
        errorResponse("NOT_FOUND", "Book not found."),
        StatusCodes.NOT_FOUND,
      );
    }

    // Delete book
    await deleteBookByIdForUserQ(book.id, user.id);

    // Delete authors and genres if they no longer have a connected book
    await deleteOrphanedAuthors();
    await deleteOrphanedGenres();

    return c.json(
      successResponse("User's book successfully deleted."),
      StatusCodes.OK,
    );
  } catch (error) {
    console.error("Error deleting user's book:", error);
    return c.json(
      errorResponse("INTERNAL_SERVER_ERROR", "Error deleting user's book."),
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
});

export default books;
