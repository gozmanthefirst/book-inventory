import { Resend } from "resend";

import { env } from "@/config/env";

const resend = new Resend(env.RESEND_API_KEY);

interface SendEmailVerificationParams {
  to: string;
  name: string | null;
  token: string;
}

export const sendVerificationEmail = async ({
  to,
  name,
  token,
}: SendEmailVerificationParams) => {
  const verificationUrl = `${env.FRONTEND_URL}/verify-email?token=${token}`;

  await resend.emails.send({
    from: "Book Inventory <book@gozman.dev>",
    to,
    subject: "Verify your email address",
    html: `
      <h1>Hello ${name || "there"}!</h1>
      <p>Please verify your email address by clicking the link below:</p>
      <a href="${verificationUrl}">Verify Email</a>
      <p>If you didn't create an account, you can safely ignore this email.</p>
    `,
  });
};

interface SendPasswordResetEmailParams {
  to: string;
  name: string | null;
  token: string;
}

export const sendPasswordResetEmail = async ({
  to,
  name,
  token,
}: SendPasswordResetEmailParams) => {
  const resetUrl = `${env.FRONTEND_URL}/reset-password?token=${token}`;

  await resend.emails.send({
    from: "Book Inventory <book@gozman.dev>",
    to,
    subject: "Reset your password",
    html: `
      <h1>Hello ${name || "there"}!</h1>
      <p>Someone requested a password reset for your account.</p>
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}">Reset Password</a>
      <p>If you didn't request this, you can safely ignore this email.</p>
      <p>This link will expire in 1 hour.</p>
    `,
  });
};
