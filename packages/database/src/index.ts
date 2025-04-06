/* eslint-disable no-var */

import { PrismaClient } from "../generated/client/index.js";

declare global {
  var prisma: PrismaClient | undefined;
}

const prisma = globalThis.prisma || new PrismaClient();

const text = "wtf, dude!";

text.replaceAll("dude", "bro");

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prisma;
}

export * from "../generated/client/index.js";
export { prisma as db };
