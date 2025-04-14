"use server";

import { cookies } from "next/headers";
import axios from "axios";

import { ServerActionResponse } from "@/shared/types/shared-types";
import { handleApiError } from "@/shared/utils/handle-api-error";

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || "";

// logout user
export const logoutUser = async (): Promise<ServerActionResponse> => {
  try {
    // Get the session token
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("books_gd_session_token");

    // Only attempt backend logout if a token exists
    if (sessionToken?.value) {
      await axios.post(`${API_BASE}/auth/logout`, {
        headers: {
          Authorization: `Bearer ${sessionToken.value}`,
        },
      });
    }

    // Delete session token cookie after user logs out
    cookieStore.delete({
      name: "books_gd_session_token",
      path: "/",
      domain:
        process.env.NODE_ENV === "production"
          ? "books.gozman.dev"
          : "localhost",
    });

    return {
      status: "success",
      details: "User successfully logged out!",
    };
  } catch (error) {
    // Even if backend logout fails, try to delete the cookie
    try {
      const cookieStore = await cookies();
      cookieStore.delete({
        name: "books_gd_session_token",
        path: "/",
        domain:
          process.env.NODE_ENV === "production"
            ? "books.gozman.dev"
            : "localhost",
      });
    } catch (cookieError) {
      console.error(
        "Failed to delete cookie during logout error handling:",
        cookieError,
      );
    }

    return handleApiError(error, {
      errorDescription: "Error logging user out",
    });
  }
};
