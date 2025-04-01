import { randomBytes } from "crypto";

import type { User } from "@prisma/client";

import db from "@/config/prisma";

export async function createVerificationToken(user: User) {
  const token = randomBytes(32).toString("hex");
  const expires = new Date();
  expires.setHours(expires.getHours() + 24);

  const verificationToken = await db.emailVerificationToken.create({
    data: {
      token,
      userId: user.id,
      expires,
    },
  });

  return verificationToken;
}

export async function validateVerificationToken(token: string) {
  const verificationToken = await db.emailVerificationToken.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!verificationToken || verificationToken.expires < new Date()) {
    if (verificationToken) {
      await db.emailVerificationToken.delete({
        where: { id: verificationToken.id },
      });
    }
    return null;
  }

  return verificationToken;
}
