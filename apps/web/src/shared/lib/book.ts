import { SimpleBook } from "@/shared/types/google-book";
import { ComplexBook } from "@/shared/types/shared-types";

export const complexBookToSimpleBook = (
  complexBook: ComplexBook,
): SimpleBook => {
  let formattedDate = "";
  if (complexBook.publishedDate !== null) {
    const date = new Date(complexBook.publishedDate);
    if (!isNaN(date.getTime())) {
      formattedDate = date.toISOString().split("T")[0] ?? "";
    }
  }
  return {
    id: complexBook.id,
    title: complexBook.title,
    subtitle: complexBook.subtitle || "",
    description: complexBook.bookDesc || "",
    publisher: complexBook.publisher || "",
    publishedDate: formattedDate,
    isbn10: complexBook.isbn?.length === 10 ? complexBook.isbn : "",
    isbn13: complexBook.isbn?.length === 13 ? complexBook.isbn : "",
    pageCount: complexBook.pageCount,
    readStatus: complexBook.readStatus,
    image: complexBook.imageUrl || "",
    authors: complexBook.authors.map((author) => author.authorName),
    categories: complexBook.genres.map((genre) => genre.genreName),
  };
};
