import { Response } from "express";
import { PrismaClientValidationError } from "@prisma/client/runtime";
import { ErrorObject,ResponseHeader } from "./../types/rest.types";

// TODO fixme return values
export function genResponseHeader(count:number, limit:number|undefined, page:number):ResponseHeader{
  let total_pages:number=1

  
  if(limit && count > limit){
    total_pages = Math.ceil(count / limit)
  }

  return {
    "X-Total-Count":count,
    "X-TotalPages-Count":total_pages,
    "X-Current-Page":page
  }
}

export function genLinksHeader(query?:any):{next:string,prev:string}{
  if(!query){
    return {next:"",prev:""}
  }
  // TODO implement generating links object made by the request query
  return {next:"http://niwacan.com",prev:"http://niwacan.com/1"}
}

/**
 * for response error message to frontend
 * @param code
 * @param message
 * @returns
 */
export function genErrorObj(
  code: ErrorObject["code"],
  message: ErrorObject["message"]
): ErrorObject {
  return {
    code,
    message,
  };
}

export function sendError(res: Response, e: unknown): void {
  console.error(e);

  if (e instanceof PrismaClientValidationError) {
    console.error(e.message);
    res.status(400).json(genErrorObj(400, "Incorrect your request."));
    return;
  }

  res.status(500).json(genErrorObj(500, "Internal Server Error"));
}

/**
 * separate strings-field in a request params  with separator.
 * field = "field=id,name,createdAt"
 * @param field 
 * @param separator 
 * @returns 
 */
export function parseFields(
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

/**
 * optimize sort-string for prisma.js
 * sort = "sort=-createdAt,+updatedAt"
 * Prefix means "-" = desc, "+" = asc
 * @param sort 
 * @param separator 
 * @returns 
 */
export function parseSort(
  sort: any,
  separator: string = ","
): { [key: string]: string }[] | undefined {
  if (!sort || !sort.length) return undefined;

  const sorts: string[] = sort.toString().split(separator);

  let sorts_obj: { [key: string]: string }[] = [];

  sorts.forEach((value) => {
    const key: string = value.slice(1);
    const val: string = value.charAt(0) === "-" ? "desc" : "asc";
    sorts_obj.push({
      [key]: val,
    });
  });

  return sorts_obj;
}

/**
 * optimize limit for prisma
 * @param limit 
 * @param by_default 
 * @returns 
 */
export function parseLimit(
  limit: any,
  by_default: number = 10
): number | undefined {
  if (isNaN(limit) || limit === null) return by_default;

  if (Number(limit) === 0) return undefined;

  return Number(limit);
}

/**
 * offset means skip in Prisma.js
 * @param offset : ;
 * @returns 
 */
export function parseOffset(offset: any): number{
  if (isNaN(offset) || offset === null) return 1;

  return Number(offset);
}

/**
 * page =  total-record / limit
 * @param page 
 * @returns 
 */
export function parsePage(page:any):number{
  if (isNaN(page) || page === null) return 1;

  if (Number(page) < 1) return 1;

  return Number(page);

}