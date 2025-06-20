import { NextFunction, Request, Response } from 'express';
import { AppError, responseData } from '../../../utils/http';
import { MESSAGES } from '../../../configs/messages';
import {
  getAllChannelsService,
  getOneChannelService,
  getExistingChannelService,
  createOneChannelService,
  createManyChannelsService,
  updateOneChannelService,
  deleteOneChannelService,
  deleteManyChannelsService,
  softDeleteOneChannelService,
  softDeleteManyChannelsService,
} from './channel.service';
import db from '../../../db/db';
import { Knex } from 'knex';
import { ListQuery } from '../../../types/types';
import { v4 as uuidv4 } from 'uuid';

export async function getAllChannelsController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await getAllChannelsService(
      req.query as unknown as ListQuery
    );

    responseData({
      res,
      status: 200,
      message: MESSAGES.SUCCESS.RETRIVE,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function getOneChannelController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const product = await getOneChannelService(req.params.id);

    responseData({
      res,
      status: 200,
      message: MESSAGES.SUCCESS.RETRIVE,
      data: product,
    });
  } catch (error) {
    next(error);
  }
}

export async function createOneChannelController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const trx: Knex.Transaction = await db.transaction();
  try {
    const existingChannel = await getExistingChannelService({
      name: req.body.name,
    });
    if (existingChannel)
      throw new AppError(`${req.body.name} is already existed!`, 400);

    const payload = {
      id: uuidv4(),
      name: req.body.name,
      created_by: req.body.user.id,
    };
    const createdChannel = await createOneChannelService(payload, trx);

    await trx.commit();

    responseData({
      res,
      status: 200,
      message: MESSAGES.SUCCESS.CREATE,
      data: createdChannel,
    });
  } catch (error) {
    await trx.rollback();
    next(error);
  }
}

export async function createManyChannelsController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const trx: Knex.Transaction = await db.transaction();
  try {
    const payload = req.body.channel.map((action: Record<string, unknown>) => ({
      id: uuidv4(),
      name: action.name,
      created_by: req.body.user.id,
    }));
    await createManyChannelsService(payload, trx);

    await trx.commit();

    responseData({
      res,
      status: 200,
      message: MESSAGES.SUCCESS.CREATE,
      data: null,
    });
  } catch (error) {
    await trx.rollback();
    next(error);
  }
}

export async function updateOneChannelController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const trx: Knex.Transaction = await db.transaction();
  try {
    const payload = {
      name: req.body.name,
      updated_by: req.body.user.id,
    };
    const updatedChannel = await updateOneChannelService(
      {
        id: req.params.id,
        data: payload,
      },
      trx
    );

    await trx.commit();

    responseData({
      res,
      status: 200,
      message: MESSAGES.SUCCESS.UPDATE,
      data: updatedChannel,
    });
  } catch (error) {
    await trx.rollback();
    next(error);
  }
}

export async function deleteOneChannelController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const trx: Knex.Transaction = await db.transaction();
  try {
    const isExistedChannel = await getExistingChannelService({
      id: req.params.id,
    });

    if (!isExistedChannel) throw new AppError(MESSAGES.ERROR.BAD_REQUEST, 400);

    const deletedChannel = await deleteOneChannelService(req.params.id);

    await trx.commit();

    responseData({
      res,
      status: 200,
      message: MESSAGES.SUCCESS.DELETE,
      data: deletedChannel,
    });
  } catch (error) {
    await trx.rollback();
    next(error);
  }
}

export async function deleteManyChannelsController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const trx: Knex.Transaction = await db.transaction();
  try {
    await deleteManyChannelsService(req.body.ids, trx);

    await trx.commit();

    responseData({
      res,
      status: 200,
      message: MESSAGES.SUCCESS.DELETE,
      data: null,
    });
  } catch (error) {
    await trx.rollback();
    next(error);
  }
}

export async function softDeleteOneChannelController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const trx: Knex.Transaction = await db.transaction();
  try {
    const isExistedChannel = await getExistingChannelService({
      id: req.params.id,
    });

    if (!isExistedChannel) throw new AppError(MESSAGES.ERROR.BAD_REQUEST, 400);

    const deletedChannel = await softDeleteOneChannelService(req.params.id);

    await trx.commit();

    responseData({
      res,
      status: 200,
      message: MESSAGES.SUCCESS.DELETE,
      data: deletedChannel,
    });
  } catch (error) {
    await trx.rollback();
    next(error);
  }
}

export async function softDeleteManyChannelsController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const trx: Knex.Transaction = await db.transaction();
  try {
    await softDeleteManyChannelsService(req.body.ids, trx);

    await trx.commit();

    responseData({
      res,
      status: 200,
      message: MESSAGES.SUCCESS.DELETE,
      data: null,
    });
  } catch (error) {
    await trx.rollback();
    next(error);
  }
}
