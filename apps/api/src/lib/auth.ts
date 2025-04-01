import type { User } from "@prisma/client";
import * as bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { env } from "@/config/env";

/**
 * Hashes a password using bcrypt with a salt round of 10
 * @param password - The plain text password to hash
 * @returns A Promise that resolves to the hashed password string
 */
export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 10);
};

/**
 * Compares a plain text password with a hashed password
 * @param password - The plain text password to compare
 * @param hash - The hashed password to compare against
 * @returns A Promise that resolves to a boolean indicating if the passwords match
 */
export const comparePasswords = async (
  password: string,
  hash: string,
): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

/**
 * Generates a JWT token for a user
 * @param user - The user object containing an id property
 * @returns A JWT token string that expires in 30 days
 */
export const generateJwtToken = (user: User): string => {
  return jwt.sign({ userId: user.id }, env.JWT_SECRET, { expiresIn: "30d" });
};

/**
 * Verifies and decodes a JWT token
 * @param token - The JWT token to verify
 * @returns The decoded token payload containing the userId
 * @throws {JsonWebTokenError} If the token is invalid
 */
export const verifyJwtToken = (token: string) => {
  return jwt.verify(token, env.JWT_SECRET) as { userId: string };
};
