import { Hono } from "hono";
import { compress } from "hono/compress";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { secureHeaders } from "hono/secure-headers";
import { serve } from "@hono/node-server";

import { env } from "@/config/env";
import { cleanupExpiredSessions } from "@/lib/session";
import { authMiddleware } from "@/middleware/auth-middleware";
import { errorHandler } from "@/middleware/error-handler";
import { notFoundRoute } from "@/middleware/not-found-route";
import auth from "@/routes/auth-route";
import authors from "@/routes/authors-route";
import books from "@/routes/books-route";
import genres from "@/routes/genres-route";
import user from "@/routes/user-route";

import "@/types";

// Initialize app
const app = new Hono({ strict: false });

// Enable CORS
app.use(
  "*",
  cors({
    origin: ["https://books.gozman.dev", "http://localhost:3000"],
    credentials: true,
    maxAge: 3600,
  }),
);

// CSRF Protection
// app.use(
//   csrf({
//     origin: ["https://books.gozman.dev", "http://localhost:3000"],
//   }),
// );

// Security Headers
app.use(
  "*",
  secureHeaders({
    xFrameOptions: "DENY",
    xXssProtection: "1",
    strictTransportSecurity:
      env.NODE_ENV === "production"
        ? "max-age=31536000; includeSubDomains"
        : false,
    referrerPolicy: "strict-origin-when-cross-origin",
  }),
);

// Enable compression and route logging
app.use(compress());
app.use(logger());

// Healthcheck
app.get("/", (c) => c.text("API is up and running!"));

// Public routes
app.route("/api/v1/auth", auth);

app.use(authMiddleware);

// Protected Routes
app.route("/api/v1/user", user);
app.route("/api/v1/books", books);
app.route("/api/v1/authors", authors);
app.route("/api/v1/genres", genres);

// Not Found & Error Handling Middleware
app.notFound(notFoundRoute);
app.onError(errorHandler);

serve(
  {
    fetch: app.fetch,
    port: env.PORT,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);

if (env.NODE_ENV === "development") {
  console.log(`mode: ${env.NODE_ENV}`);
}

// Run cleanup every hour
const CLEANUP_INTERVAL = 1000 * 60 * 60;

setInterval(async () => {
  try {
    const deletedCount = await cleanupExpiredSessions();
    if (deletedCount > 0) {
      console.log(`Cleaned up ${deletedCount} expired sessions`);
    }
  } catch (error) {
    console.error("Session cleanup failed:", error);
  }
}, CLEANUP_INTERVAL);
