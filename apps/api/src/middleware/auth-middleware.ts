import { createMiddleware } from "hono/factory";
import { StatusCodes } from "http-status-codes";

import { validateSession } from "@/lib/session";
import { errorResponse } from "@/utils/api-response";

export const authMiddleware = createMiddleware(async (c, next) => {
  const authHeader = c.req.header("Authorization");
  const sessionToken = authHeader?.startsWith("Bearer ")
    ? authHeader.substring(7)
    : null;

  if (!sessionToken) {
    return c.json(
      errorResponse("UNAUTHENTICATED", "No session found"),
      StatusCodes.UNAUTHORIZED,
    );
  }

  try {
    const session = await validateSession(sessionToken);

    if (!session) {
      return c.json(
        errorResponse("UNAUTHENTICATED", "Session expired"),
        StatusCodes.UNAUTHORIZED,
      );
    }

    c.set("user", session.user);
    await next();
  } catch (error) {
    console.error("Error validating session:", error);
    return c.json(
      errorResponse("UNAUTHENTICATED", "Invalid session"),
      StatusCodes.UNAUTHORIZED,
    );
  }
});
