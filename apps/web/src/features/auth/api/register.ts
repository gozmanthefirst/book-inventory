"use server";

import axios from "axios";

import { ServerActionResponse } from "@/shared/types/shared-types";
import { handleApiError } from "@/shared/utils/handle-api-error";

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || "";

// register user
export const registerUser = async (data: {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}): Promise<ServerActionResponse> => {
  try {
    console.log(API_BASE);

    await axios.post(`${API_BASE}/auth/register`, {
      name: data.name,
      email: data.email,
      password: data.password,
      confirmPassword: data.confirmPassword,
    });

    return {
      status: "success",
      details: "User successfully registered!",
    };
  } catch (error) {
    return handleApiError(error, {
      errorDescription: "Error registering user",
      errorMapping: {
        USER_EXISTS: "This email belongs to another user.",
      },
    });
  }
};
