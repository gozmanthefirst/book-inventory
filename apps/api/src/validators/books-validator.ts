import { z } from "zod";

export const createBookSchema = z.object({
  title: z
    .string({ required_error: "Title is required." })
    .min(1, "Title cannot be blank."),
  subtitle: z.string().optional(),
  bookDesc: z.string().optional(),
  imageUrl: z.string().optional(),

  // The ISBN must be a string of 10 numbers, 9 numbers and the alphabet 'X' at the end, or 13 numbers.
  isbn: z
    .string({ required_error: "The book's ISBN is required." })
    .refine((val) => {
      const cleaned = val.replace(/[-\s]/g, "");
      if (cleaned.length === 10) {
        return /^\d{9}[\dXx]$/.test(cleaned);
      }
      if (cleaned.length === 13) {
        return /^\d{13}$/.test(cleaned);
      }
      return false;
    }, "Invalid ISBN format."),

  publisher: z.string().optional(),

  // The published date must be in the past.
  publishedDate: z
    .string({ required_error: "The publication date is required." })
    .refine((val) => {
      const date = new Date(val);
      return !isNaN(date.getTime()) && date <= new Date();
    }, "Invalid publication date."),

  pageCount: z.coerce
    .number({ required_error: "The page count of the book is required." })
    .positive("Page count must be a positive number."),
  readStatus: z.enum(["unread", "read", "reading"], {
    required_error: "Reading status is required.",
    invalid_type_error:
      "Reading status must be either 'unread', 'read', or 'reading'.",
  }),
  authors: z
    .array(z.string().min(1, "Author cannot be empty."))
    .min(1, "At least one author required."),
  genres: z
    .array(z.string().min(1, "Genre cannot be empty."))
    .min(1, "At least one genre required."),
});

export const updateBookSchema = z.object({
  readStatus: z.enum(["unread", "read", "reading"], {
    required_error: "Reading status is required.",
    invalid_type_error:
      "Reading status must be either 'unread', 'read', or 'reading'.",
  }),
});
