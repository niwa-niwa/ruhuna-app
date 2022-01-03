import { ErrorObj } from "../api/types/ErrorObj";

export function generateErrorObj(
  errorCode: number,
  errorMessage: String
): ErrorObj {
  return {
    errorCode,
    errorMessage,
  };
}
