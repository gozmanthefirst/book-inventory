import { db } from "@repo/database";

export const getAllGenresQ = async () => {
  const genres = await db.genre.findMany({
    include: {
      books: true,
    },
  });
  return genres;
};

export const getGenreByIdQ = async (id: string) => {
  const genres = await db.genre.findUnique({
    where: {
      id,
    },
    include: {
      books: true,
    },
  });
  return genres;
};

export const getGenreByNameQ = async (name: string) => {
  const genres = await db.genre.findUnique({
    where: {
      genreName: name,
    },
    include: {
      books: true,
    },
  });
  return genres;
};

export const deleteGenreByIdQ = async (id: string) => {
  await db.genre.delete({
    where: {
      id,
    },
  });
};

export const deleteOrphanedGenres = async () => {
  await db.genre.deleteMany({
    where: {
      books: { none: {} },
    },
  });
};
