"use server";

import { cookies } from "next/headers";
import axios from "axios";

import { ServerActionResponse } from "@/shared/types/shared-types";
import { handleApiError } from "@/shared/utils/handle-api-error";

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || "";

// login user
export const loginUser = async (data: {
  email: string;
  password: string;
}): Promise<ServerActionResponse> => {
  try {
    const response = await axios.post(`${API_BASE}/auth/login`, {
      email: data.email,
      password: data.password,
    });

    const token: string = response.data.data.sessionToken;
    const expires: Date = new Date(response.data.data.sessionExpires as string);

    // Set the cookie in the browser
    const cookieStore = await cookies();
    cookieStore.set({
      name: "books_gd_session_token",
      value: token,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      domain:
        process.env.NODE_ENV === "production"
          ? "books.gozman.dev"
          : "localhost",
      httpOnly: true,
      expires: expires,
      sameSite: "strict",
    });

    return {
      status: "success",
      details: "User successfully logged in!",
    };
  } catch (error) {
    return handleApiError(error, {
      errorDescription: "Error logging user in",
      errorMapping: {
        INVALID_CREDENTIALS: "The email or password is invalid.",
        EMAIL_NOT_VERIFIED:
          "This email is not verified. A verification email has been sent.",
      },
    });
  }
};
