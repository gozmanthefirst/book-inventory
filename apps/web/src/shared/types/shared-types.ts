import { Book, Prisma, User } from "@prisma/client";

export type ServerActionResponse<T = undefined> = T extends undefined
  ?
      | {
          status: "success" | "info";
          details: string;
          data?: never;
        }
      | {
          status: "error";
          details: string;
          errorCode: string;
          data?: never;
        }
  :
      | {
          status: "success" | "info";
          details: string;
          data: T;
        }
      | {
          status: "error";
          details: string;
          errorCode: string;
          data: T;
        };

export type ComplexBook = Prisma.BookGetPayload<{
  include: {
    authors: true;
    genres: true;
  };
}>;

export type BackendError<T = undefined> = T extends undefined
  ? {
      status: "error";
      code: string;
      details: string | string[];
      data?: never;
    }
  : {
      status: "error";
      code: string;
      details: string | string[];
      data: T;
    };

export type UserCustom = {
  id: User["id"];
  email: User["email"];
  name: User["name"];
  books: Book[];
};
