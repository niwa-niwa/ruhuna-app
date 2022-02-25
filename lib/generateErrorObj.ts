import { ErrorObj } from "../types/error.types";

export function generateErrorObj(
  errorCode: number,
  errorMessage: String
): ErrorObj {
  return {
    errorCode,
    errorMessage,
  };
}
