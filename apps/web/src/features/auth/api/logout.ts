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

    await axios.post(`${API_BASE}/auth/logout`, {
      headers: {
        Authorization: `Bearer ${sessionToken?.value}`,
      },
    });

    // Delete session token cookie after user logs out
    cookieStore.delete("books_gd_session_token");

    return {
      status: "success",
      details: "User successfully logged out!",
    };
  } catch (error) {
    return handleApiError(error, {
      errorDescription: "Error logging user out",
    });
  }
};
