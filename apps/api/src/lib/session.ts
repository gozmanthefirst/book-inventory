import { randomBytes } from "crypto";

import type { User } from "@prisma/client";

import db from "@/config/prisma";

export const createSession = async (
  user: User,
  expires: Date,
  metadata: { ipAddress?: string; userAgent?: string },
) => {
  const token = randomBytes(32).toString("hex");

  const session = await db.session.create({
    data: {
      userId: user.id,
      token,
      expires,
      ipAddress: metadata.ipAddress,
      userAgent: metadata.userAgent,
    },
  });

  return session;
};

export const validateSession = async (token: string) => {
  try {
    const session = await db.session.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!session) {
      return null;
    }

    // Check if session has expired
    if (session.expires < new Date()) {
      // Delete the expired session
      await db.session.delete({ where: { id: session.id } });
      return null;
    }

    // Update lastUsedAt
    await db.session.update({
      where: { id: session.id },
      data: { lastUsedAt: new Date() },
    });

    return session;
  } catch (error) {
    console.error("Error validating session:", error);
    throw error;
  }
};

export const getCurrentSession = async (token: string) => {
  const session = await db.session.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!session || session.expires < new Date()) {
    return null;
  }

  return session;
};

export const getSuspiciousSessions = async (userId: string) => {
  const distinctIPs = await db.session.groupBy({
    by: ["ipAddress"],
    where: {
      userId,
      ipAddress: { not: null },
    },
    having: {
      ipAddress: {
        _count: {
          gt: 5,
        },
      },
    },
  });

  return distinctIPs;
};

export const cleanupExpiredSessions = async () => {
  try {
    const result = await db.session.deleteMany({
      where: {
        expires: {
          lt: new Date(),
        },
      },
    });
    return result.count;
  } catch (error) {
    console.error("Error cleaning up expired sessions:", error);
    throw error;
  }
};

export const getAuthenticatedUser = async (sessionToken: string) => {
  if (!sessionToken) {
    return null;
  }

  try {
    const session = await validateSession(sessionToken);
    if (!session) {
      return null;
    }

    return session.user;
  } catch (error) {
    console.error("Error getting authenticated user:", error);
    return null;
  }
};
