import { NextFunction, Request, Response } from 'express';
import { AppError, responseData } from '../../utils/http';
import { MESSAGES } from '../../configs/messages';
import {
  getAllProductCategoriesService,
  getOneProductCategoryService,
  getExistingProductCategoryService,
  createOneProductCategoryService,
  createManyProductCategoriesService,
  updateOneProductCategoryService,
  deleteOneProductCategoryService,
  deleteManyProductCategoriesService,
  softDeleteManyProductCategoriesService,
  softDeleteOneProductCategoryService,
} from './product-category.service';
import db from '../../db/db';
import { Knex } from 'knex';
import { ListQuery } from '../../types/types';
import { v4 as uuidv4 } from 'uuid';

export async function getAllProductCategoriesController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await getAllProductCategoriesService(
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

export async function getOneProductCategoryController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const product = await getOneProductCategoryService(req.params.id);

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

export async function createOneProductCategoryController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const trx: Knex.Transaction = await db.transaction();
  try {
    const existingProductCategory = await getExistingProductCategoryService({
      name: req.body.name,
    });
    if (existingProductCategory)
      throw new AppError(`${req.body.name} is already existed!`, 400);

    const payload = {
      id: uuidv4(),
      name: req.body.name,
      created_by: req.body.user.id,
    };
    const createdProductCategory = await createOneProductCategoryService(
      payload,
      trx
    );

    await trx.commit();

    responseData({
      res,
      status: 200,
      message: MESSAGES.SUCCESS.CREATE,
      data: createdProductCategory,
    });
  } catch (error) {
    await trx.rollback();
    next(error);
  }
}

export async function createManyProductCategoriesController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const trx: Knex.Transaction = await db.transaction();
  try {
    const payload = req.body.productCategories.map(
      (pd: Record<string, unknown>) => ({
        id: uuidv4(),
        name: pd.name,
        created_by: req.body.user.id,
      })
    );
    const createdProductCategories = await createManyProductCategoriesService(
      payload,
      trx
    );

    await trx.commit();

    responseData({
      res,
      status: 200,
      message: MESSAGES.SUCCESS.CREATE,
      data: createdProductCategories,
    });
  } catch (error) {
    await trx.rollback();
    next(error);
  }
}

export async function updateOneProductCategoryController(
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
    const updatedProductCategory = await updateOneProductCategoryService(
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
      data: updatedProductCategory,
    });
  } catch (error) {
    await trx.rollback();
    next(error);
  }
}

export async function deleteOneProductCategoryController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const trx: Knex.Transaction = await db.transaction();
  try {
    const deletedProductCategory = await deleteOneProductCategoryService(
      req.params.id,
      trx
    );

    await trx.commit();

    responseData({
      res,
      status: 200,
      message: MESSAGES.SUCCESS.DELETE,
      data: deletedProductCategory,
    });
  } catch (error) {
    await trx.rollback();
    next(error);
  }
}

export async function deleteManyProductCategoriesController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const trx: Knex.Transaction = await db.transaction();
  try {
    console.log('controller', req.body.ids);
    const deletedProductCategories = await deleteManyProductCategoriesService(
      req.body.ids,
      trx
    );

    await trx.commit();

    responseData({
      res,
      status: 200,
      message: MESSAGES.SUCCESS.DELETE,
      data: deletedProductCategories,
    });
  } catch (error) {
    await trx.rollback();
    next(error);
  }
}

export async function softDeleteOneProductCategoryController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const trx: Knex.Transaction = await db.transaction();
  try {
    const isExistedProductCategory = await getExistingProductCategoryService({
      id: req.params.id,
    });

    if (!isExistedProductCategory)
      throw new AppError(MESSAGES.ERROR.BAD_REQUEST, 400);

    const deletedProductCategory = await softDeleteOneProductCategoryService(
      req.params.id
    );

    await trx.commit();

    responseData({
      res,
      status: 200,
      message: MESSAGES.SUCCESS.DELETE,
      data: deletedProductCategory,
    });
  } catch (error) {
    await trx.rollback();
    next(error);
  }
}

export async function softDeleteManyProductCategoriesController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const trx: Knex.Transaction = await db.transaction();
  try {
    const deletedProductCategories =
      await softDeleteManyProductCategoriesService(req.body.ids, trx);

    await trx.commit();

    responseData({
      res,
      status: 200,
      message: MESSAGES.SUCCESS.DELETE,
      data: deletedProductCategories,
    });
  } catch (error) {
    await trx.rollback();
    next(error);
  }
}
