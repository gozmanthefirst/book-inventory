"use server";

import { cookies } from "next/headers";
import axios from "axios";

import { ComplexBook, ServerActionResponse } from "@/shared/types/shared-types";
import { handleApiError } from "@/shared/utils/handle-api-error";
import { createParallelAction } from "@/shared/utils/parallel-server-action";

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || "";

// get my books
export const getMyBooks = createParallelAction(
  async (): Promise<
    ServerActionResponse | ServerActionResponse<ComplexBook[]>
  > => {
    try {
      // Get the session token
      const cookieStore = await cookies();
      const sessionToken = cookieStore.get("books_gd_session_token");

      const response = await axios.get(`${API_BASE}/books`, {
        headers: {
          Authorization: `Bearer ${sessionToken?.value}`,
        },
      });

      return {
        status: "success",
        details: "Books gotten!",
        data: response.data.data,
      };
    } catch (error) {
      return handleApiError(error, {
        errorDescription: "Error getting books",
      });
    }
  },
);
