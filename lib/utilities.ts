import { Response, Request } from "express";
import { PrismaClientValidationError } from "@prisma/client/runtime";
import { ErrorObject, QArgs, ResponseHeader } from "./../types/rest.types";
import { params } from "../consts/params";

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
 * generate record information
 * @param count
 * @param par_page
 * @returns
 */
export function genResponseHeader(
  count: number,
  par_page: number | undefined
): ResponseHeader {
  let total_pages: number = 1;

  if (par_page && count > par_page) {
    total_pages = Math.ceil(count / par_page);
  }

  return {
    "x-total-count": count,
    "x-total-page-count": total_pages,
  };
}

/**
 * generate pagination as link
 * @param page
 * @param total_page
 * @param url
 * @returns
 */
export function genLinksHeader(
  page: number,
  total_page: number,
  url: string
): { next: string; prev: string } {
  const next: string =
    total_page > page
      ? url.replace(`${params.PAGE}=${page}`, `${params.PAGE}=${page + 1}`)
      : "";

  const prev: string =
    page > 1
      ? url.replace(`${params.PAGE}=${page}`, `${params.PAGE}=${page - 1}`)
      : "";

  return { next, prev };
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
): QArgs["select"] {
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
): QArgs["orderBy"] {
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
export function parsePerPage(
  limit: any,
  by_default: number = 10
): number | undefined {
  if (isNaN(limit) || limit === null) return by_default;

  if (Number(limit) === 0) return undefined;

  return Number(limit);
}

/**
 *
 * @param offset : ;
 * @returns
 */
export function parseOffset(offset: any): number {
  if (isNaN(offset) || offset === null) return 0;

  return Number(offset);
}

/**
 * page =  total-record / limit
 * @param page
 * @returns
 */
export function parsePage(page: any): number {
  if (isNaN(page) || page === null) return 1;

  if (Number(page) < 1) return 1;

  return Number(page);
}

/**
 * calculate total skip records
 * @param par_page
 * @param page
 * @param offset
 * @returns
 */
export function calcSkipRecords(
  par_page: ReturnType<typeof parsePerPage>,
  page: ReturnType<typeof parsePage>,
  offset: ReturnType<typeof parseOffset>
): QArgs["skip"] {
  let skip: number | undefined = 0;

  if (par_page !== undefined) skip = par_page * (page - 1);

  if (offset !== undefined) skip += offset;

  return skip;
}

/**
 * generate arguments for Prisma.js and current page number
 * @param query
 * @returns
 */
export function genQArgsAndPage(query: Request["query"]): {
  args: QArgs;
  page: ReturnType<typeof parsePage>;
} {
  let args: QArgs = {};

  // extract columns
  args.select = parseFields(query[params.FIELDS]);

  // record should be the orderBy
  args.orderBy = parseSort(query[params.SORT]);

  // how many records should be in par page
  args.take = parsePerPage(query[params.PAR_PAGE]);

  // where page number should return
  const page: number = args.take ? parsePage(query[params.PAGE]) : 1;

  const offset: number | undefined = parseOffset(query[params.OFFSET]);

  // how many skip records from 0
  args.skip = calcSkipRecords(args.take, page, offset);

  return { args, page };
}
