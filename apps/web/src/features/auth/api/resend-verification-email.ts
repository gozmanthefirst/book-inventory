"use server";

import axios from "axios";

import { ServerActionResponse } from "@/shared/types/shared-types";
import { handleApiError } from "@/shared/utils/handle-api-error";

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || "";

// resend verification email
export const resendVerificationEmail = async (data: {
  email: string;
}): Promise<ServerActionResponse> => {
  try {
    await axios.post(`${API_BASE}/auth/resend-verification`, {
      email: data.email,
    });

    return {
      status: "success",
      details: "Verification email successfully resent!",
    };
  } catch (error) {
    return handleApiError(error, {
      errorDescription: "Error resending verification email",
    });
  }
};
