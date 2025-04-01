import { Hono } from "hono";
import { StatusCodes } from "http-status-codes";

import db from "@/config/prisma";
import { errorResponse, successResponse } from "@/utils/api-response";

const user = new Hono({ strict: false });

//* Get user
//* POST /user/me
user.get("/me", async (c) => {
  try {
    const user = c.get("user");

    const userWithBooks = await db.user.findUnique({
      where: {
        id: user.id,
      },
      include: {
        books: true,
      },
    });

    return c.json(
      successResponse("Session valid.", {
        user: {
          id: userWithBooks?.id,
          email: userWithBooks?.email,
          name: userWithBooks?.name,
          books: userWithBooks?.books,
        },
      }),
      StatusCodes.OK,
    );
  } catch (error) {
    console.error("Error getting user:", error);
    return c.json(
      errorResponse("INTERNAL_SERVER_ERROR", "Error getting user."),
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
});

export default user;
