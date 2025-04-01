import { randomBytes } from "crypto";

import type { User } from "@prisma/client";

import db from "@/config/prisma";

export async function createPasswordResetToken(user: User) {
  const token = randomBytes(32).toString("hex");
  const expires = new Date();
  expires.setHours(expires.getHours() + 1); // 1 hour expiration

  // Delete any existing reset tokens for this user
  await db.passwordResetToken.deleteMany({
    where: { userId: user.id },
  });

  const resetToken = await db.passwordResetToken.create({
    data: {
      token,
      userId: user.id,
      expires,
    },
  });

  return resetToken;
}

export async function validatePasswordResetToken(token: string) {
  const resetToken = await db.passwordResetToken.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!resetToken || resetToken.expires < new Date()) {
    if (resetToken) {
      await db.passwordResetToken.delete({
        where: { id: resetToken.id },
      });
    }
    return null;
  }

  return resetToken;
}
