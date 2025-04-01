import { Hono } from "hono";
import { StatusCodes } from "http-status-codes";

import { getAllAuthorsQ } from "@/lib/authors";
import { errorResponse, successResponse } from "@/utils/api-response";

const authors = new Hono({ strict: false });

//* Get all authors
//* GET /authors
authors.get("/", async (c) => {
  try {
    const authors = await getAllAuthorsQ();
    return c.json(
      successResponse("Authors successfully retrieved.", authors),
      StatusCodes.OK,
    );
  } catch (error) {
    console.error("Error retrieving authors:", error);
    return c.json(
      errorResponse("INTERNAL_SERVER_ERROR", "Error retrieving authors."),
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
});

export default authors;
