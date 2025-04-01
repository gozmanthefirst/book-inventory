import type { ValidationTargets } from "hono";
import { zValidator } from "@hono/zod-validator";
import { StatusCodes } from "http-status-codes";
import { ZodSchema } from "zod";

import { errorResponse } from "@/utils/api-response";

export const zv = <T extends ZodSchema, Target extends keyof ValidationTargets>(
  target: Target,
  schema: T,
) => {
  return zValidator(target, schema, (result, c) => {
    if (!result.success) {
      return c.json(
        errorResponse(
          "INVALID_DATA",
          result.error.errors.map((error) => error.message),
        ),
        StatusCodes.BAD_REQUEST,
      );
    }
  });
};

// Example response for invalid request:
// {
//   "error": "INVALID_DATA",
//   "messages": ["First name must be at least 2 characters", "Email is invalid"],
//   "statusCode": 400
// }
