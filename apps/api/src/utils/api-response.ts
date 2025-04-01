/**
 * Generates a success response object.
 *
 * @param {string} details - A message providing more details about the success.
 * @param {T} [data] - Optional additional data related to the success response.
 * @returns {Object} An object containing the status, details, and optionally data.
 *
 * @example
 * successResponse("Operation completed", { id: 1 });
 * // {
 * //   status: "success",
 * //   details: "Operation completed",
 * //   data: { id: 1 }
 * // }
 *
 * successResponse("Operation completed");
 * // {
 * //   status: "success",
 * //   details: "Operation completed"
 * // }
 */
export const successResponse = <T = unknown>(details: string, data?: T) => {
  if (data) {
    return {
      status: "success",
      details,
      data,
    };
  } else {
    return {
      status: "success",
      details,
    };
  }
};

/**
 * Generates an error response object.
 *
 * @param {string} code - A string representing the error code.
 * @param {string | string[]} details - A message or list of messages providing more details about the error.
 * @param {T} [data] - Optional additional data related to the error response.
 * @returns {Object} An object containing the status, code, details, and optionally data.
 *
 * @example
 * errorResponse("INTERNAL_SERVER_ERROR", "Invalid input");
 * // {
 * //   status: "error",
 * //   code: "INTERNAL_SERVER_ERROR",
 * //   details: "Somethign went wrong"
 * // }
 *
 * errorResponse("INVALID_DATA", ["Invalid input", "Missing fields"], { field: "email" });
 * // {
 * //   status: "error",
 * //   code: "INVALID_DATA",
 * //   details: ["Invalid input", "Missing fields"],
 * //   data: { field: "email" }
 * // }
 */
export const errorResponse = <T = unknown>(
  code: string,
  details: string | string[],
  data?: T,
) => {
  if (data) {
    return {
      status: "error",
      code,
      details,
      data,
    };
  } else {
    return {
      status: "error",
      code,
      details,
    };
  }
};
