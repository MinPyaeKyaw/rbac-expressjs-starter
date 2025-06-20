import { NextFunction, Request, Response } from 'express';
import { AppError, responseData } from '../../../utils/http';
import { MESSAGES } from '../../../configs/messages';
import {
  getAllSubModulesService,
  getOneSubModuleService,
  getExistingSubModuleService,
  createOneSubModuleService,
  createManySubModulesService,
  updateOneSubModuleService,
  deleteManySubModulesService,
  softDeleteOneSubModuleService,
  softDeleteManySubModulesService,
} from './sub-module.service';
import db from '../../../db/db';
import { Knex } from 'knex';
import { ListQuery } from '../../../types/types';
import { v4 as uuidv4 } from 'uuid';

export async function getAllSubModulesController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await getAllSubModulesService(
      req.query as unknown as ListQuery & {
        channel_id: string;
        module_id: string;
      }
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

export async function getOneSubModuleController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const product = await getOneSubModuleService(req.params.id);

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

export async function createOneSubModuleController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const trx: Knex.Transaction = await db.transaction();
  try {
    const existingSubModule = await getExistingSubModuleService({
      name: req.body.name,
      channel_id: req.body.channel_id,
    });
    if (existingSubModule)
      throw new AppError(`${req.body.name} is already existed!`, 400);

    const payload = {
      id: uuidv4(),
      name: req.body.name,
      channel_id: req.body.channel_id,
      module_id: req.body.module_id,
      created_by: req.body.user.id,
    };
    const createdSubModule = await createOneSubModuleService(payload, trx);

    await trx.commit();

    responseData({
      res,
      status: 200,
      message: MESSAGES.SUCCESS.CREATE,
      data: createdSubModule,
    });
  } catch (error) {
    await trx.rollback();
    next(error);
  }
}

export async function createManySubModulesController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const trx: Knex.Transaction = await db.transaction();
  try {
    const payload = req.body.subModules.map(
      (subModule: Record<string, unknown>) => ({
        id: uuidv4(),
        name: subModule.name,
        channel_id: subModule.channel_id,
        module_id: subModule.module_id,
        created_by: req.body.user.id,
      })
    );
    const createdModules = await createManySubModulesService(payload, trx);

    await trx.commit();

    responseData({
      res,
      status: 200,
      message: MESSAGES.SUCCESS.CREATE,
      data: createdModules,
    });
  } catch (error) {
    await trx.rollback();
    next(error);
  }
}

export async function updateOneSubModuleController(
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
    const updatedSubModule = await updateOneSubModuleService(
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
      data: updatedSubModule,
    });
  } catch (error) {
    await trx.rollback();
    next(error);
  }
}

export async function deleteOneSubModuleController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const trx: Knex.Transaction = await db.transaction();
  try {
    const isExistedSubModule = await getExistingSubModuleService({
      id: req.params.id,
    });

    if (!isExistedSubModule)
      throw new AppError(MESSAGES.ERROR.BAD_REQUEST, 400);

    const deletedSubModule = await getOneSubModuleService(req.params.id);

    await trx.commit();

    responseData({
      res,
      status: 200,
      message: MESSAGES.SUCCESS.DELETE,
      data: deletedSubModule,
    });
  } catch (error) {
    await trx.rollback();
    next(error);
  }
}

export async function deleteManySubModulesController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const trx: Knex.Transaction = await db.transaction();
  try {
    const deletedModules = await deleteManySubModulesService(req.body.ids, trx);

    await trx.commit();

    responseData({
      res,
      status: 200,
      message: MESSAGES.SUCCESS.DELETE,
      data: deletedModules,
    });
  } catch (error) {
    await trx.rollback();
    next(error);
  }
}

export async function softDeleteOneSubModuleController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const trx: Knex.Transaction = await db.transaction();
  try {
    const isExistedSubModule = await getExistingSubModuleService({
      id: req.params.id,
    });

    if (!isExistedSubModule)
      throw new AppError(MESSAGES.ERROR.BAD_REQUEST, 400);

    const deletedSubModule = await softDeleteOneSubModuleService(req.params.id);

    await trx.commit();

    responseData({
      res,
      status: 200,
      message: MESSAGES.SUCCESS.DELETE,
      data: deletedSubModule,
    });
  } catch (error) {
    await trx.rollback();
    next(error);
  }
}

export async function softDeleteManySubModulesController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const trx: Knex.Transaction = await db.transaction();
  try {
    const deletedModules = await softDeleteManySubModulesService(
      req.body.ids,
      trx
    );

    await trx.commit();

    responseData({
      res,
      status: 200,
      message: MESSAGES.SUCCESS.DELETE,
      data: deletedModules,
    });
  } catch (error) {
    await trx.rollback();
    next(error);
  }
}
