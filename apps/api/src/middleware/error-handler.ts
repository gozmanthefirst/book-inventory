import type { ErrorHandler } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import { StatusCodes } from "http-status-codes";

import { env as typedEnv } from "@/config/env";

export const errorHandler: ErrorHandler = (err, c) => {
  console.log(err.stack);

  const currentStatus =
    "status" in err ? err.status : c.newResponse(null).status;

  const statusCode =
    currentStatus !== StatusCodes.OK
      ? (currentStatus as ContentfulStatusCode)
      : StatusCodes.INTERNAL_SERVER_ERROR;

  const env = c.env?.NODE_ENV || typedEnv.NODE_ENV;

  return c.json(
    {
      message: err.message,
      stack: env === "production" ? undefined : err.stack,
    },
    statusCode,
  );
};
