import { NextFunction, Request, Response } from 'express';
import { AppError, responseData } from '../../../utils/http';
import { MESSAGES } from '../../../configs/messages';
import {
  getAllRolesService,
  getOneRoleService,
  getExistingRoleService,
  createOneRoleService,
  createManyRolesService,
  updateOneRoleService,
  deleteOneRoleService,
  deleteManyRolesService,
  softDeleteOneRoleService,
  softDeleteManyRolesService,
} from './role.service';
import db from '../../../db/db';
import { Knex } from 'knex';
import { ListQuery } from '../../../types/types';
import { v4 as uuidv4 } from 'uuid';

export async function getAllRolesController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await getAllRolesService(req.query as unknown as ListQuery);

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

export async function getOneRoleController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const product = await getOneRoleService(req.params.id);

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

export async function createOneRoleController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const trx: Knex.Transaction = await db.transaction();
  try {
    const existingRole = await getExistingRoleService({
      name: req.body.name,
    });
    if (existingRole)
      throw new AppError(`${req.body.name} is already existed!`, 400);

    const payload = {
      id: uuidv4(),
      name: req.body.name,
      created_by: req.body.user.id,
    };
    const createdRole = await createOneRoleService(payload, trx);

    await trx.commit();

    responseData({
      res,
      status: 200,
      message: MESSAGES.SUCCESS.CREATE,
      data: createdRole,
    });
  } catch (error) {
    await trx.rollback();
    next(error);
  }
}

export async function createManyRolesController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const trx: Knex.Transaction = await db.transaction();
  try {
    const payload = req.body.roles.map((action: Record<string, unknown>) => ({
      id: uuidv4(),
      name: action.name,
      created_by: req.body.user.id,
    }));
    await createManyRolesService(payload, trx);

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

export async function updateOneRoleController(
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
    const updatedRole = await updateOneRoleService(
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
      data: updatedRole,
    });
  } catch (error) {
    await trx.rollback();
    next(error);
  }
}

export async function deleteOneRoleController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const trx: Knex.Transaction = await db.transaction();
  try {
    const isExistedRole = await getExistingRoleService({
      id: req.params.id,
    });

    if (!isExistedRole) throw new AppError(MESSAGES.ERROR.BAD_REQUEST, 400);

    const deletedRole = await deleteOneRoleService(req.params.id);

    await trx.commit();

    responseData({
      res,
      status: 200,
      message: MESSAGES.SUCCESS.DELETE,
      data: deletedRole,
    });
  } catch (error) {
    await trx.rollback();
    next(error);
  }
}

export async function deleteManyRolesController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const trx: Knex.Transaction = await db.transaction();
  try {
    await deleteManyRolesService(req.body.ids, trx);

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

export async function softDeleteOneRoleController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const trx: Knex.Transaction = await db.transaction();
  try {
    const isExistedRole = await getExistingRoleService({
      id: req.params.id,
    });

    if (!isExistedRole) throw new AppError(MESSAGES.ERROR.BAD_REQUEST, 400);

    const deletedRole = await softDeleteOneRoleService(req.params.id);

    await trx.commit();

    responseData({
      res,
      status: 200,
      message: MESSAGES.SUCCESS.DELETE,
      data: deletedRole,
    });
  } catch (error) {
    await trx.rollback();
    next(error);
  }
}

export async function softDeleteManyRolesController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const trx: Knex.Transaction = await db.transaction();
  try {
    await softDeleteManyRolesService(req.body.ids, trx);

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
