import { NextFunction, Request, Response } from 'express';
import { AppError, responseData } from '../../../utils/http';
import { MESSAGES } from '../../../configs/messages';
import {
  getModulesWithPermissionsService,
  getAllModulesService,
  getOneModuleService,
  getExistingModuleService,
  createOneModuleService,
  createManyModulesService,
  updateOneModuleService,
  deleteOneModuleService,
  deleteManyModulesService,
  softDeleteOneModuleService,
  softDeleteManyModulesService,
} from './module.service';
import db from '../../../db/db';
import { Knex } from 'knex';
import { ListQuery } from '../../../types/types';
import { v4 as uuidv4 } from 'uuid';

export async function getAllModulesWithPermissionsController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await getModulesWithPermissionsService(req.query);

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

export async function getAllModulesController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await getAllModulesService(
      req.query as unknown as ListQuery & { channel_id: string }
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

export async function getOneModuleController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const product = await getOneModuleService(req.params.id);

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

export async function createOneModuleController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const trx: Knex.Transaction = await db.transaction();
  try {
    const existingModule = await getExistingModuleService({
      name: req.body.name,
      channel_id: req.body.channel_id,
    });
    if (existingModule)
      throw new AppError(`${req.body.name} is already existed!`, 400);

    const payload = {
      id: uuidv4(),
      name: req.body.name,
      channel_id: req.body.channel_id,
      created_by: req.body.user.id,
    };
    const createdModule = await createOneModuleService(payload, trx);

    await trx.commit();

    responseData({
      res,
      status: 200,
      message: MESSAGES.SUCCESS.CREATE,
      data: createdModule,
    });
  } catch (error) {
    await trx.rollback();
    next(error);
  }
}

export async function createManyModulesController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const trx: Knex.Transaction = await db.transaction();
  try {
    const payload = req.body.modules.map((module: Record<string, unknown>) => ({
      id: uuidv4(),
      name: module.name,
      channel_id: module.channel_id,
      created_by: req.body.user.id,
    }));
    await createManyModulesService(payload, trx);

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

export async function updateOneModuleController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const trx: Knex.Transaction = await db.transaction();
  try {
    const payload = {
      name: req.body.name,
      channel_id: req.body.channel_id,
      updated_by: req.body.user.id,
    };
    const updatedModule = await updateOneModuleService(
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
      data: updatedModule,
    });
  } catch (error) {
    await trx.rollback();
    next(error);
  }
}

export async function deleteOneModuleController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const trx: Knex.Transaction = await db.transaction();
  try {
    const isExistedModule = await getExistingModuleService({
      id: req.params.id,
    });

    if (!isExistedModule) throw new AppError(MESSAGES.ERROR.BAD_REQUEST, 400);

    const deletedModule = await deleteOneModuleService(req.params.id);

    await trx.commit();

    responseData({
      res,
      status: 200,
      message: MESSAGES.SUCCESS.DELETE,
      data: deletedModule,
    });
  } catch (error) {
    await trx.rollback();
    next(error);
  }
}

export async function deleteManyModulesController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const trx: Knex.Transaction = await db.transaction();
  try {
    await deleteManyModulesService(req.body.ids, trx);

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

export async function softDeleteOneModuleController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const trx: Knex.Transaction = await db.transaction();
  try {
    const isExistedModule = await getExistingModuleService({
      id: req.params.id,
    });

    if (!isExistedModule) throw new AppError(MESSAGES.ERROR.BAD_REQUEST, 400);

    const deletedModule = await softDeleteOneModuleService(req.params.id);

    await trx.commit();

    responseData({
      res,
      status: 200,
      message: MESSAGES.SUCCESS.DELETE,
      data: deletedModule,
    });
  } catch (error) {
    await trx.rollback();
    next(error);
  }
}

export async function softDeleteManyModulesController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const trx: Knex.Transaction = await db.transaction();
  try {
    await softDeleteManyModulesService(req.body.ids, trx);

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
