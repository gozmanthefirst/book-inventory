import type { User } from "@repo/database";

declare module "hono" {
  interface ContextVariableMap {
    user: User;
  }
}
