"use server";

import axios from "axios";

import { ServerActionResponse } from "@/shared/types/shared-types";
import { handleApiError } from "@/shared/utils/handle-api-error";
import { createParallelAction } from "@/shared/utils/parallel-server-action";

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || "";

// verify email
export const verifyEmail = createParallelAction(
  async (token: string): Promise<ServerActionResponse> => {
    try {
      await axios.get(`${API_BASE}/auth/verify-email?token=${token}`);

      return {
        status: "success",
        details: "Email successfully verified!",
      };
    } catch (error) {
      return handleApiError(error, {
        errorDescription: "Error verifying email",
      });
    }
  },
);
