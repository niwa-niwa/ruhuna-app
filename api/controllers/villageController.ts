import { Response } from "express";
import { Prisma, Village } from "@prisma/client";
import { prismaClient } from "../../lib/prismaClient";
import { CustomRequest } from "../../types/rest.types";
import { generateErrorObj } from "../../lib/generateErrorObj";
import { ioChatSocket } from "../../sockets/chatSocket";

/**
 * get all villages
 * @param req
 * @param res
 */
async function getVillages(req: CustomRequest, res: Response): Promise<void> {
  const villages: Village[] = await prismaClient.village.findMany({
    include: { users: true, messages: true },
  });
  res.status(200).json({ villages });
  return;
}

async function getVillageDetail(
  req: CustomRequest,
  res: Response
): Promise<void> {
  const id: string = req.params.villageId;

  const village: Village | null = await prismaClient.village.findUnique({
    where: { id },
    include: { users: true, messages: true },
  });

  if (village === null) {
    res.status(404).json({
      village: null,
      errorObj: generateErrorObj(400, "couldn't find the village"),
    });

    return;
  }

  res.status(200).json({ village });
  return;
}

/**
 * create a village
 * @param req
 * @param res
 */
async function createVillage(req: CustomRequest, res: Response): Promise<void> {
  const userId: string | undefined = req.currentUser?.id;

  const { name, description }: Prisma.VillageCreateWithoutUsersInput = req.body;

  try {
    const createdVillage: Village = await prismaClient.village.create({
      data: {
        name,
        description,
        users: { connect: { id: userId } },
      },
      include: {
        users: true,
        messages: true,
      },
    });

    res.status(200).json({ village: createdVillage });

    return;
  } catch (e) {
    console.error(e);

    res.status(400).json({
      village: null,
      errorObj: generateErrorObj(400, "couldn't create a village"),
    });
  }
}

/**
 * edit a village
 * @param req
 * @param res
 */
async function editVillage(req: CustomRequest, res: Response): Promise<void> {
  const id: string = req.params.villageId;
  const data: Prisma.VillageUpdateInput = req.body;

  try {
    const village: Village = await prismaClient.village.update({
      where: { id },
      data: data,
      include: { users: true, messages: true },
    });

    res.status(200).json({ village });

    return;
  } catch (e) {
    console.error(e);

    res.status(400).json({
      village: null,
      errorObj: generateErrorObj(400, "couldn't edit a village"),
    });
  }
}

/**
 * delete a village
 * @param req
 * @param res
 */
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

/**
 * Leave a village to reject relation of a user between a village
 *
 * @param req
 * @param res
 */
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

const villageController: {
  getVillages: any;
  getVillageDetail: any;
  createVillage: any;
  editVillage: any;
  deleteVillage: any;
  leaveVillage: any;
} = {
  getVillages,
  getVillageDetail,
  createVillage,
  editVillage,
  deleteVillage,
  leaveVillage,
};

export default villageController;
