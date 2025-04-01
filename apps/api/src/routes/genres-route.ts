import { Hono } from "hono";
import { StatusCodes } from "http-status-codes";

import { getAllGenresQ } from "@/lib/genres";
import { errorResponse, successResponse } from "@/utils/api-response";

const genres = new Hono({ strict: false });

// Get all genres - GET {/api/v1/genres}/
genres.get("/", async (c) => {
  try {
    const genres = await getAllGenresQ();
    return c.json(
      successResponse("Genres successfully retrieved.", genres),
      StatusCodes.OK,
    );
  } catch (error) {
    console.error("Error retrieving genres:", error);
    return c.json(
      errorResponse("INTERNAL_SERVER_ERROR", "Error retrieving genres."),
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
});

export default genres;
