import { Response } from "express";
import { Prisma, User, Village } from "@prisma/client";
import { prismaClient } from "../../lib/prismaClient";
import {
  CurrentUser,
  CustomRequest,
  QArgs,
  QArgsAndPage,
  ResponseHeader,
} from "../../types/rest.types";
import { generateErrorObj } from "../../lib/generateErrorObj";
import { ioChatSocket } from "../../sockets/chatSocket";
import {
  genErrorObj,
  genLinksHeader,
  genQArgsAndPage,
  genResponseHeader,
  isOwner,
  parseFields,
  sendError,
} from "../../lib/utilities";
import { PARAMS } from "../../consts/url";

// TODO executes CRUD by only member or admin
//
/** path parameter of village id */
export const villageId: string = "villageId";

async function getVillages(req: CustomRequest, res: Response): Promise<void> {
  // generate args for query and page
  const { args, page }: QArgsAndPage<Prisma.VillageFindManyArgs> =
    genQArgsAndPage(req.query);

  try {
    // get villages
    const villages: Village[] = await prismaClient.village.findMany(args);
    // total count of users
    const count: number = await prismaClient.village.count();

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
    const village: Partial<Village> | null =
      await prismaClient.village.findUnique({
        where,
        select,
      });

    if (village === null) {
      res.status(404).json(genErrorObj(404, "The user is not found."));
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
    const village: Pick<Village, "id"> | null =
      await prismaClient.village.findUnique({
        where: { id },
        select: { id: true },
      });

    if (!village) {
      res.status(404).json(genErrorObj(404, "Not Found The Village"));
      return;
    }

    if (!isOwner(currentUser, village!)) {
      res.status(404).json(genErrorObj(403, "Not Allow You to edit the user"));
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
  const id: string = req.params.villageId;

  try {
    const village: Village = await prismaClient.village.delete({
      where: { id },
    });

    res.status(200).json({ village });
  } catch (e) {
    console.error(e);

    res.status(400).json({
      village: null,
      errorObj: generateErrorObj(400, "couldn't delete a village"),
    });
  }
}

async function leaveVillage(req: CustomRequest, res: Response) {
  // get village id from params
  const villageId: string = req.params.villageId;

  // leave village
  const village: Village = await prismaClient.village.update({
    where: {
      id: villageId,
    },
    data: {
      users: { disconnect: { id: req.currentUser?.id } },
    },
    include: {
      users: true,
      messages: true,
    },
  });

  // Throw an error village is null that's why not found the village
  if (!village) {
    res.status(404).json({
      village: null,
      errorObj: generateErrorObj(404, "the village is not found"),
    });
  }

  // leave the village socket
  ioChatSocket.sockets.socketsLeave(villageId);

  // response the village model
  res.status(200).json({ village });
}

const villageController = {
  villageId,
  getVillages,
  getVillageDetail,
  getVillageUsers,
  getVillageMessages,
  createVillage,
  editVillage,
  deleteVillage,
  leaveVillage,
};

export default villageController;
