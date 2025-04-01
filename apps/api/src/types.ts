import type { User } from "@prisma/client";

declare module "hono" {
  interface ContextVariableMap {
    user: User;
  }
}
