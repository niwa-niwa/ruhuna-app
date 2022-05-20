import { Response } from "express";
import { Prisma, User, Village } from "@prisma/client";
import { prismaClient } from "../../lib/prismaClient";
import { CurrentUser, CustomRequest } from "../";
import {
  genErrorObj,
  genLinksHeader,
  genQArgsAndPage,
  genResponseHeader,
  isOwner,
  isVillager,
  parseFields,
  sendError,
  ResponseHeader,
  QArgs,
  QArgsAndPage,
} from "../../lib/utilities";
import { PARAMS } from "../../consts/url";

/** path parameter of village id */
export const villageId: string = "villageId";

async function isReadable(
  user: CurrentUser,
  villageId: Village["id"]
): Promise<boolean> {
  if (user.isAdmin) return true;

  try {
    const village: Pick<Village, "isPublic"> | null =
      await prismaClient.village.findUnique({
        where: { id: villageId },
        select: { isPublic: true },
      });

    if (!village) return false;

    if (village.isPublic) return true;

    return isVillager(user, { id: villageId });
  } catch (e) {
    throw e;
  }
}

async function isEditable(
  user: CurrentUser,
  villageId: Village["id"]
): Promise<boolean> {
  try {
    const village: Pick<Village, "id"> | null =
      await prismaClient.village.findUnique({
        where: { id: villageId },
        select: { id: true },
      });

    if (!village) return false;

    if (!user.isAdmin && !isOwner(user, village)) return false;

    return true;
  } catch (e) {
    throw e;
  }
}

async function getPublicVillages(
  req: CustomRequest,
  res: Response
): Promise<void> {
  // generate args for query and page
  const { args, page }: QArgsAndPage<Prisma.VillageFindManyArgs> =
    genQArgsAndPage(req.query);

  // should be public villages
  args.where = { ...args.where, isPublic: true };

  try {
    // get villages
    const villages: Village[] = await prismaClient.village.findMany(args);

    // total count of village
    const count: number = await prismaClient.village.count({
      where: args.where,
    });

    // generate info of  the result
    const header: ResponseHeader = genResponseHeader(count, args.take);

    // generate pagination
    const links: ReturnType<typeof genLinksHeader> = genLinksHeader(
      page,
      header[PARAMS.X_TOTAL_PAGE_COUNT],
      req.url
    );

    res.status(200).set(header).links(links).json({ villages });
  } catch (e) {
    sendError(res, e);
  }
}

async function getVillageDetail(
  req: CustomRequest,
  res: Response
): Promise<void> {
  const where: Prisma.VillageWhereUniqueInput = { id: req.params[villageId] };

  // the fields used to select of query
  const select: QArgs["select"] = parseFields(req.query.fields);

  try {
    // is request user allowed
    const validate: boolean = await isReadable(
      req.currentUser!,
      req.params[villageId]
    );

    // get a village
    const village: Partial<Village> | null =
      await prismaClient.village.findUnique({
        where,
        select,
      });

    if (!validate || !village) {
      res.status(404).json(genErrorObj(404, "The village is not found."));
      return;
    }

    res.status(200).json({ village });
  } catch (e) {
    sendError(res, e);
  }
}

async function getVillageUsers(
  req: CustomRequest,
  res: Response
): Promise<void> {
  const { args, page }: QArgsAndPage<Prisma.UserFindManyArgs> = genQArgsAndPage(
    req.query
  );

  args.where = { villages: { some: { id: req.params[villageId] } } };

  try {
    const validate: boolean = await isReadable(
      req.currentUser!,
      req.params[villageId]
    );

    if (!validate) {
      res.status(404).json(genErrorObj(404, "The village is not found."));
      return;
    }

    // extract users
    const users: Partial<User>[] = await prismaClient.user.findMany(args);

    // extract total records
    const count: number = await prismaClient.user.count({
      where: args.where,
    });

    // generate info of  the result
    const header: ResponseHeader = genResponseHeader(count, args.take);

    // generate pagination
    const links: ReturnType<typeof genLinksHeader> = genLinksHeader(
      page,
      header[PARAMS.X_TOTAL_PAGE_COUNT],
      req.url
    );

    // response
    res.status(200).set(header).links(links).json({ users });
  } catch (e) {
    sendError(res, e);
  }
}

async function getVillageMessages(
  req: CustomRequest,
  res: Response
): Promise<void> {
  const { args, page }: QArgsAndPage<Prisma.MessageFindManyArgs> =
    genQArgsAndPage(req.query);

  args.where = { villageId: req.params[villageId] };

  try {
    const validate: boolean = await isReadable(
      req.currentUser!,
      req.params[villageId]
    );

    if (!validate) {
      res.status(404).json(genErrorObj(404, "The village is not found."));
      return;
    }

    // extract users
    const messages: Partial<User>[] = await prismaClient.message.findMany(args);

    // extract total records
    const count: number = await prismaClient.message.count({
      where: args.where,
    });

    // generate info of  the result
    const header: ResponseHeader = genResponseHeader(count, args.take);

    // generate pagination
    const links: ReturnType<typeof genLinksHeader> = genLinksHeader(
      page,
      header[PARAMS.X_TOTAL_PAGE_COUNT],
      req.url
    );

    // response
    res.status(200).set(header).links(links).json({ messages });
  } catch (e) {
    sendError(res, e);
  }
}

async function createVillage(req: CustomRequest, res: Response): Promise<void> {
  const userId: string | undefined = req.currentUser?.id;

  const { name, description }: Prisma.VillageCreateWithoutUsersInput = req.body;

  try {
    const createdVillage: Village = await prismaClient.village.create({
      data: {
        name,
        description,
        users: { connect: { id: userId } },
        owner: { connect: { id: userId } },
      },
    });

    res.status(200).json({ village: createdVillage });
  } catch (e) {
    sendError(res, e);
  }
}

async function editVillage(req: CustomRequest, res: Response): Promise<void> {
  const currentUser: CurrentUser = req.currentUser!;

  const select: QArgs["select"] = parseFields(req.query.fields);

  const id: string = req.params[villageId];

  const data: Prisma.VillageUpdateInput = req.body;

  try {
    if (!(await isEditable(currentUser, id))) {
      res.status(404).json(genErrorObj(404, "Not found the village"));
      return;
    }

    const edited_village = await prismaClient.village.update({
      where: { id },
      data,
      select,
    });

    res.status(200).json({ village: edited_village });
  } catch (e) {
    sendError(res, e);
  }
}

async function deleteVillage(req: CustomRequest, res: Response): Promise<void> {
  const id: string = req.params[villageId];

  try {
    if (!(await isEditable(req.currentUser!, id))) {
      res.status(404).json(genErrorObj(404, "Not found the village"));
      return;
    }

    const village: Village = await prismaClient.village.delete({
      where: { id },
    });

    res.status(200).json({ village });
  } catch (e) {
    sendError(res, e);
  }
}

const villageController = {
  villageId,
  getPublicVillages,
  getVillageDetail,
  getVillageUsers,
  getVillageMessages,
  createVillage,
  editVillage,
  deleteVillage,
};

export default villageController;
