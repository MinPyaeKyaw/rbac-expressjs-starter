import { NextFunction, Request, Response } from 'express';
import { responseData } from '../../../utils/http';
import { MESSAGES } from '../../../configs/messages';
import {
  getRolesOnChannelDataService,
  getAllPermissionsService,
  deleteManyPermissionsService,
  createManyPermissionsService,
} from './permission.service';
import db from '../../../db/db';
import { Knex } from 'knex';
import { ListQuery } from '../../../types/types';

export async function getAllRoleOnChannelsController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await getRolesOnChannelDataService(
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

export async function getAllPermissionsController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await getAllPermissionsService(req.query);

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

export async function updatePermissionsByRoleController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const trx: Knex.Transaction = await db.transaction();
  try {
    await deleteManyPermissionsService(
      { role_id: req.body.role_id, channel_id: req.body.channel_id },
      trx
    );

    const preparedMultiCreatePayload = req.body.permissions.flatMap(
      (permission: Record<string, any>) =>
        permission.actions.map((action_id: string | number) => ({
          action_id,
          role_id: req.body.role_id,
          module_id: permission.module_id,
          sub_module_id: permission.sub_module_id,
          channel_id: permission.channel_id,
        }))
    );
    await createManyPermissionsService(preparedMultiCreatePayload, trx);

    await trx.commit();

    responseData({
      res,
      status: 200,
      message: MESSAGES.SUCCESS.UPDATE,
      data: null,
    });
  } catch (error) {
    await trx.rollback();
    next(error);
  }
}
