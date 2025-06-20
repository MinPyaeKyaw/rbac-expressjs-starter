import { NextFunction, Request, Response } from 'express';
import { AppError, responseData } from '../../utils/http';
import { MESSAGES } from '../../configs/messages';
import {
  createManyProductsService,
  createOneProductService,
  deleteManyProductsService,
  deleteOneProductService,
  getAllProductsService,
  getExistingProductService,
  getOneProductService,
  softDeleteManyProductsService,
  softDeleteOneProductService,
  updateOneProductService,
} from './product.service';
import db from '../../db/db';
import { Knex } from 'knex';
import { ListQuery } from '../../types/types';
import { v4 as uuidv4 } from 'uuid';

export async function getAllProductsController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await getAllProductsService(
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

export async function getOneProductController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const product = await getOneProductService(req.params.id);

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

export async function createOneProductController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const trx: Knex.Transaction = await db.transaction();
  try {
    const existingProduct = await getExistingProductService({
      name: req.body.name,
    });
    if (existingProduct)
      throw new AppError(`${req.body.name} is already existed!`, 400);

    const payload = {
      id: uuidv4(),
      name: req.body.name,
      price: req.body.price,
      category_id: req.body.category_id,
      created_by: req.body.user.id,
    };
    const createdProduct = await createOneProductService(payload, trx);

    await trx.commit();

    responseData({
      res,
      status: 200,
      message: MESSAGES.SUCCESS.CREATE,
      data: createdProduct,
    });
  } catch (error) {
    await trx.rollback();
    next(error);
  }
}

export async function createManyProductsController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const trx: Knex.Transaction = await db.transaction();
  try {
    const payload = req.body.products.map((pd: Record<string, unknown>) => ({
      id: uuidv4(),
      name: pd.name,
      price: pd.price,
      category_id: pd.category_id,
      created_by: req.body.user.id,
    }));
    const createdProducts = await createManyProductsService(payload, trx);

    await trx.commit();

    responseData({
      res,
      status: 200,
      message: MESSAGES.SUCCESS.CREATE,
      data: createdProducts,
    });
  } catch (error) {
    await trx.rollback();
    next(error);
  }
}

export async function updateOneProductController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const trx: Knex.Transaction = await db.transaction();
  try {
    const payload = {
      name: req.body.name,
      price: req.body.price,
      category_id: req.body.category_id,
      updated_by: req.body.user.id,
    };
    const updatedProduct = await updateOneProductService(
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
      data: updatedProduct,
    });
  } catch (error) {
    await trx.rollback();
    next(error);
  }
}

export async function deleteOneProductController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const trx: Knex.Transaction = await db.transaction();
  try {
    const deletedProduct = await deleteOneProductService(req.params.id, trx);

    await trx.commit();

    responseData({
      res,
      status: 200,
      message: MESSAGES.SUCCESS.DELETE,
      data: deletedProduct,
    });
  } catch (error) {
    await trx.rollback();
    next(error);
  }
}

export async function deleteManyProductsController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const trx: Knex.Transaction = await db.transaction();
  try {
    const deletedProducts = await deleteManyProductsService(req.body.ids, trx);

    await trx.commit();

    responseData({
      res,
      status: 200,
      message: MESSAGES.SUCCESS.DELETE,
      data: deletedProducts,
    });
  } catch (error) {
    await trx.rollback();
    next(error);
  }
}

export async function softDeleteOneProductController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const trx: Knex.Transaction = await db.transaction();
  try {
    const isExistedProduct = await getExistingProductService({
      id: req.params.id,
    });

    if (!isExistedProduct) throw new AppError(MESSAGES.ERROR.BAD_REQUEST, 400);

    const deletedProduct = await softDeleteOneProductService(req.params.id);

    await trx.commit();

    responseData({
      res,
      status: 200,
      message: MESSAGES.SUCCESS.DELETE,
      data: deletedProduct,
    });
  } catch (error) {
    await trx.rollback();
    next(error);
  }
}

export async function softDeleteManyProductsController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const trx: Knex.Transaction = await db.transaction();
  try {
    const deletedProducts = await softDeleteManyProductsService(
      req.body.ids,
      trx
    );

    await trx.commit();

    responseData({
      res,
      status: 200,
      message: MESSAGES.SUCCESS.DELETE,
      data: deletedProducts,
    });
  } catch (error) {
    await trx.rollback();
    next(error);
  }
}
