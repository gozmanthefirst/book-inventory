import { db } from "@repo/database";

export const getUserByIdQ = async (id: string) => {
  const user = await db.user.findUnique({
    where: {
      id,
    },
    include: {
      books: true,
    },
  });
  return user;
};
