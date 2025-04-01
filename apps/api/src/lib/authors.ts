import db from "@/config/prisma";

export const getAllAuthorsQ = async () => {
  const authors = await db.author.findMany({
    include: {
      books: true,
    },
  });
  return authors;
};

export const getAuthorByIdQ = async (id: string) => {
  const authors = await db.author.findUnique({
    where: {
      id,
    },
    include: {
      books: true,
    },
  });
  return authors;
};

export const getAuthorByNameQ = async (name: string) => {
  const authors = await db.author.findUnique({
    where: {
      authorName: name,
    },
    include: {
      books: true,
    },
  });
  return authors;
};

export const deleteAuthorByIdQ = async (id: string) => {
  await db.author.delete({
    where: {
      id,
    },
  });
};

export const deleteOrphanedAuthors = async () => {
  await db.author.deleteMany({
    where: {
      books: { none: {} },
    },
  });
};
