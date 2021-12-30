import { Response } from "express";
import { Prisma, Village } from "@prisma/client";
import { prismaClient } from "../../lib/prismaClient";
import { CustomRequest } from "../types/CustomRequest";
import { generateErrorObj } from "../../lib/generateErrorObj";

export const getVillages = async (req: CustomRequest, res: Response) => {
  const villages: Village[] = await prismaClient.village.findMany({
    include: { users: true, messages: true },
  });

  res.status(200).json({ villages });
};

export const getVillageDetail = async (req: CustomRequest, res: Response) => {
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
};

export const createVillage = async (req: CustomRequest, res: Response) => {
  const userId = req.currentUser?.id || "";

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
  } catch (e) {
    console.error(e);

    res.status(400).json({
      village: null,
      errorObj: generateErrorObj(400, "couldn't create a village"),
    });
  }
};

export const editVillage = async (req: CustomRequest, res: Response) => {
  const id: string = req.params.villageId;
  const data: Prisma.VillageUpdateInput = req.body;

  try {
    const village: Village = await prismaClient.village.update({
      where: { id },
      data: data,
      include: { users: true, messages: true },
    });

    res.status(200).json({ village });
  } catch (e) {
    console.error(e);

    res.status(400).json({
      village: null,
      errorObj: generateErrorObj(400, "couldn't edit a village"),
    });
  }
};

export const deleteVillage = async (req: CustomRequest, res: Response) => {
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
};

// TODO Leave a village to reject relation of a user between a village


const villageController = {
  getVillages,
  getVillageDetail,
  createVillage,
  editVillage,
  deleteVillage,
};

export default villageController;
