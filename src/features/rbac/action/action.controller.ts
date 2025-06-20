import { NextFunction, Request, Response } from 'express';
import { AppError, responseData } from '../../../utils/http';
import { MESSAGES } from '../../../configs/messages';
import {
  getAllActionsService,
  getOneActionService,
  getExistingActionService,
  createOneActionService,
  createManyActionsService,
  updateOneActionService,
  deleteOneActionService,
  deleteManyActionsService,
  softDeleteOneActionService,
  softDeleteManyActionsService,
} from './action.service';
import db from '../../../db/db';
import { Knex } from 'knex';
import { ListQuery } from '../../../types/types';
import { v4 as uuidv4 } from 'uuid';

export async function getAllActionsController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await getAllActionsService(
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

export async function getOneActionController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const product = await getOneActionService(req.params.id);

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

export async function createOneActionController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const trx: Knex.Transaction = await db.transaction();
  try {
    const existingAction = await getExistingActionService({
      name: req.body.name,
    });
    if (existingAction)
      throw new AppError(`${req.body.name} is already existed!`, 400);

    const payload = {
      id: uuidv4(),
      name: req.body.name,
      created_by: req.body.user.id,
    };
    const createdAction = await createOneActionService(payload, trx);

    await trx.commit();

    responseData({
      res,
      status: 200,
      message: MESSAGES.SUCCESS.CREATE,
      data: createdAction,
    });
  } catch (error) {
    await trx.rollback();
    next(error);
  }
}

export async function createManyActionsController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const trx: Knex.Transaction = await db.transaction();
  try {
    const payload = req.body.actions.map((action: Record<string, unknown>) => ({
      id: uuidv4(),
      name: action.name,
      created_by: req.body.user.id,
    }));
    await createManyActionsService(payload, trx);

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

export async function updateOneActionController(
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
    const updatedAction = await updateOneActionService(
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
      data: updatedAction,
    });
  } catch (error) {
    await trx.rollback();
    next(error);
  }
}

export async function deleteOneActionController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const trx: Knex.Transaction = await db.transaction();
  try {
    const isExistedAction = await getExistingActionService({
      id: req.params.id,
    });

    if (!isExistedAction) throw new AppError(MESSAGES.ERROR.BAD_REQUEST, 400);

    const deletedAction = await deleteOneActionService(req.params.id);

    await trx.commit();

    responseData({
      res,
      status: 200,
      message: MESSAGES.SUCCESS.DELETE,
      data: deletedAction,
    });
  } catch (error) {
    await trx.rollback();
    next(error);
  }
}

export async function deleteManyActionsController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const trx: Knex.Transaction = await db.transaction();
  try {
    await deleteManyActionsService(req.body.ids, trx);

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

export async function softDeleteOneActionController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const trx: Knex.Transaction = await db.transaction();
  try {
    const isExistedAction = await getExistingActionService({
      id: req.params.id,
    });

    if (!isExistedAction) throw new AppError(MESSAGES.ERROR.BAD_REQUEST, 400);

    const deletedAction = await softDeleteOneActionService(req.params.id);

    await trx.commit();

    responseData({
      res,
      status: 200,
      message: MESSAGES.SUCCESS.DELETE,
      data: deletedAction,
    });
  } catch (error) {
    await trx.rollback();
    next(error);
  }
}

export async function softDeleteManyActionsController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const trx: Knex.Transaction = await db.transaction();
  try {
    await softDeleteManyActionsService(req.body.ids, trx);

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
