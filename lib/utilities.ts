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
  field: any,
  separator: string = ","
): { [key: string]: boolean } | undefined {
  if (!field || !field.length) return undefined;

  const fields: string[] = field.toString().split(separator);

  let fields_obj: { [key: string]: boolean } = {};

  fields.forEach((value) => {
    fields_obj[value] = true;
  });

  return fields_obj;
}
