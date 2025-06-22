import { NextFunction, Request, Response } from 'express';
import { AppError, responseData } from '../../utils/http';
import { MESSAGES } from '../../configs/messages';
import {
  createOneUserService,
  deleteOneUserService,
  getAllUsersService,
  getOneUserService,
  hashPasswordService,
  updateOneUserService,
} from './user.service';
import db from '../../db/db';
import { Knex } from 'knex';
import { ListQuery } from '../../types/types';
import { v4 as uuidv4 } from 'uuid';
import { addEmailJobs } from '../../queues/email-queue';

export async function sendEmailToAllUsersController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    await addEmailJobs('user-email', ['minpyaekyaw419@gmail.com']);

    responseData({
      res,
      status: 200,
      message: 'Emails added to queue!',
      data: null,
    });
  } catch (error) {
    next(error);
  }
}

export async function getAllUsersController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await getAllUsersService(req.query as unknown as ListQuery);

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

export async function getOneUserController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = await getOneUserService(req.params.id);

    responseData({
      res,
      status: 200,
      message: MESSAGES.SUCCESS.RETRIVE,
      data: user,
    });
  } catch (error) {
    next(error);
  }
}

export async function createOneUserController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const trx: Knex.Transaction = await db.transaction();
  try {
    if (!req.file) {
      throw new AppError(`File is required!`, 400);
    }

    const password = await hashPasswordService(req.body.password);
    const payload = {
      id: uuidv4(),
      username: req.body.username,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      phone1: req.body.phone1,
      phone2: req.body.phone2,
      phone3: req.body.phone3,
      password: password,
      address1: req.body.address1,
      address2: req.body.address2,
      img: req.file.path,
      created_by: req.body.user.id,
    };
    const createdUser = await createOneUserService(payload, trx);

    await trx.commit();

    responseData({
      res,
      status: 200,
      message: MESSAGES.SUCCESS.CREATE,
      data: createdUser,
    });
  } catch (error) {
    await trx.rollback();
    next(error);
  }
}

export async function updateOneUserController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const trx: Knex.Transaction = await db.transaction();
  try {
    const payload = {
      name: req.body.name,
      price: req.body.price,
      updated_by: req.body.user.id,
    };
    const updatedUser = await updateOneUserService(
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
      data: updatedUser,
    });
  } catch (error) {
    await trx.rollback();
    next(error);
  }
}

export async function deleteOneUserController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const trx: Knex.Transaction = await db.transaction();
  try {
    const deletedUser = await deleteOneUserService(req.params.id);

    await trx.commit();

    responseData({
      res,
      status: 200,
      message: MESSAGES.SUCCESS.DELETE,
      data: deletedUser,
    });
  } catch (error) {
    await trx.rollback();
    next(error);
  }
}
