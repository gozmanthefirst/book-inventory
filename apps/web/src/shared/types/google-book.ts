export type GoogleBookVolume = {
  id: string;
  volumeInfo: {
    title: string;
    subtitle?: string;
    authors: string[];
    publisher: string;
    publishedDate: string;
    description?: string;
    industryIdentifiers: {
      type: "ISBN_10" | "ISBN_13";
      identifier: string;
    }[];
    pageCount: number;
    categories: string[];
    imageLinks?: {
      thumbnail?: string;
    };
  };
};

export type SimpleBook = {
  id: string;
  title: string;
  subtitle?: string;
  authors: string[];
  description?: string;
  publisher: string;
  publishedDate: string;
  isbn10: string;
  isbn13: string;
  pageCount: number;
  readStatus: "UNREAD" | "READ" | "READING";
  categories: string[];
  image?: string;
};

export type GoogleBookResponse = {
  items: GoogleBookVolume[];
  totalItems: number;
  kind: string;
};
