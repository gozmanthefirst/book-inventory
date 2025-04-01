import axios, { AxiosError } from "axios";

import {
  BackendError,
  ServerActionResponse,
} from "@/shared/types/shared-types";

type ErrorHandlerOptions = {
  errorDescription?: string;
  defaultMessage?: string;
  errorMapping?: Record<string, string>;
};

export function handleApiError(
  error: unknown,
  options: ErrorHandlerOptions = {},
): ServerActionResponse {
  const {
    errorDescription,
    defaultMessage = "Something went wrong.",
    errorMapping = {},
  } = options;

  if (axios.isAxiosError(error)) {
    const backendError = (error as AxiosError<BackendError>).response?.data;
    console.log(`${errorDescription}:`, backendError);

    if (backendError) {
      // Handle specific error codes if provided in errorMapping
      if (backendError.code && errorMapping[backendError.code]) {
        return {
          status: "error",
          errorCode: backendError.code,
          details: errorMapping[backendError.code] || defaultMessage,
        };
      }

      // Handle array or string details from backend
      if (backendError.details) {
        return {
          status: "error",
          errorCode: backendError.code,
          details:
            (Array.isArray(backendError.details)
              ? backendError.details[0]
              : backendError.details) || defaultMessage,
        };
      }

      return {
        status: "error",
        errorCode: "ERROR",
        details: defaultMessage,
      };
    }

    // Handle network errors
    return {
      status: "error",
      errorCode: "ERROR",
      details: "Network error. Please check your connection and try again.",
    };
  }

  // Handle unexpected errors
  console.log("Unexpected error:", error);
  return {
    status: "error",
    errorCode: "ERROR",
    details: "An unexpected error occurred. Please try again later.",
  };
}
