import { ErrorObject } from "./../types/rest.types";

/**
 * for response error message to frontend
 * @param code
 * @param message
 * @returns
 */
export function getErrorObj(
  code: ErrorObject["code"],
  message: ErrorObject["message"]
): ErrorObject {
  return {
    code,
    message,
  };
}

export function splitFields(
  filed: string,
  separator: string = ","
): { [key: string]: boolean } {
  const fields: string[] = filed.toString().split(",");
  let fields_obj: { [key: string]: boolean } = {};
  fields.forEach((value) => {
    fields_obj[value] = true;
  });
  return fields_obj;
}
