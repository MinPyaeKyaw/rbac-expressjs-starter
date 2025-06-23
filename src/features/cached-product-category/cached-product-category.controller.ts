import { NextFunction, Request, Response } from 'express';
import { AppError, responseData } from '../../utils/http';
import { MESSAGES } from '../../configs/messages';
import {
  getAllCachedProductCategoriesService,
  getOneCachedProductCategoryService,
  getExistingCachedProductCategoryService,
  createOneCachedProductCategoryService,
  createManyCachedProductCategoriesService,
  updateOneCachedProductCategoryService,
  deleteOneCachedProductCategoryService,
  deleteManyCachedProductCategoriesService,
  softDeleteManyCachedProductCategoriesService,
  softDeleteOneCachedProductCategoryService,
  clearProductCategoryCache,
  getProductCategoryCacheStats,
} from './cached-product-category.service';
import db from '../../db/db';
import { Knex } from 'knex';
import { ListQuery } from '../../types/types';
import { v4 as uuidv4 } from 'uuid';

export async function getAllCachedProductCategoriesController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await getAllCachedProductCategoriesService(
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

export async function getOneCachedProductCategoryController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const product = await getOneCachedProductCategoryService(req.params.id);

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

export async function createOneCachedProductCategoryController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const trx: Knex.Transaction = await db.transaction();
  try {
    const existingProductCategory =
      await getExistingCachedProductCategoryService({
        name: req.body.name,
      });
    if (existingProductCategory)
      throw new AppError(`${req.body.name} is already existed!`, 400);

    const payload = {
      id: uuidv4(),
      name: req.body.name,
      created_by: req.body.user.id,
    };
    const createdProductCategory = await createOneCachedProductCategoryService(
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

export async function createManyCachedProductCategoriesController(
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
    const createdProductCategories =
      await createManyCachedProductCategoriesService(payload, trx);

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

export async function updateOneCachedProductCategoryController(
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
    const updatedProductCategory = await updateOneCachedProductCategoryService(
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

export async function deleteOneCachedProductCategoryController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const trx: Knex.Transaction = await db.transaction();
  try {
    const deletedProductCategory = await deleteOneCachedProductCategoryService(
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

export async function deleteManyCachedProductCategoriesController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const trx: Knex.Transaction = await db.transaction();
  try {
    console.log('controller', req.body.ids);
    const deletedProductCategories =
      await deleteManyCachedProductCategoriesService(req.body.ids, trx);

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

export async function softDeleteOneCachedProductCategoryController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const trx: Knex.Transaction = await db.transaction();
  try {
    const deletedProductCategory =
      await softDeleteOneCachedProductCategoryService(req.params.id, trx);

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

export async function softDeleteManyCachedProductCategoriesController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const trx: Knex.Transaction = await db.transaction();
  try {
    const deletedProductCategories =
      await softDeleteManyCachedProductCategoriesService(req.body.ids, trx);

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

// Cache management controllers
export async function clearProductCategoryCacheController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await clearProductCategoryCache();

    responseData({
      res,
      status: 200,
      message: 'Cache cleared successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function getProductCategoryCacheStatsController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await getProductCategoryCacheStats();

    responseData({
      res,
      status: 200,
      message: 'Cache stats retrieved successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
}
