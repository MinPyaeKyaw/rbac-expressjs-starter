import { Router } from 'express';
import validator from './product-category.validator';
import { validateRequest } from '../../middlewares/validation';
import {
  createManyProductCategoriesController,
  createOneProductCategoryController,
  deleteManyProductCategoriesController,
  deleteOneProductCategoryController,
  getAllProductCategoriesController,
  getOneProductCategoryController,
  softDeleteManyProductCategoriesController,
  softDeleteOneProductCategoryController,
  updateOneProductCategoryController,
} from './product-category.controller';
import verifyRBAC from '../../middlewares/rbac';
import { ACTIONS, MODULES, ROLES, SUB_MODULES } from '../../configs/rbac';

const productCategoryRoutes = Router();

productCategoryRoutes.get(
  '/product-categories',
  verifyRBAC({
    action: ACTIONS.VIEW,
    roles: [ROLES.ADMIN],
    module: MODULES.PRODUCT,
    subModule: SUB_MODULES.PRODUCT_CATEGORY,
  }),
  validateRequest(validator.select),
  getAllProductCategoriesController
);

productCategoryRoutes.get(
  '/product-categories/:id',
  verifyRBAC({
    action: ACTIONS.VIEW,
    roles: [ROLES.ADMIN],
    module: MODULES.PRODUCT,
    subModule: SUB_MODULES.PRODUCT_CATEGORY,
  }),
  validateRequest(validator.detail),
  getOneProductCategoryController
);

productCategoryRoutes.post(
  '/product-categories',
  verifyRBAC({
    action: ACTIONS.CREATE,
    roles: [ROLES.ADMIN],
    module: MODULES.PRODUCT,
    subModule: SUB_MODULES.PRODUCT_CATEGORY,
  }),
  validateRequest(validator.create),
  createOneProductCategoryController
);

productCategoryRoutes.post(
  '/product-categories/create-multi',
  verifyRBAC({
    action: ACTIONS.CREATE,
    roles: [ROLES.ADMIN],
    module: MODULES.PRODUCT,
    subModule: SUB_MODULES.PRODUCT_CATEGORY,
  }),
  validateRequest(validator.createMany),
  createManyProductCategoriesController
);

productCategoryRoutes.patch(
  '/product-categories/:id',
  verifyRBAC({
    action: ACTIONS.UPDATE,
    roles: [ROLES.ADMIN],
    module: MODULES.PRODUCT,
    subModule: SUB_MODULES.PRODUCT_CATEGORY,
  }),
  validateRequest(validator.update),
  updateOneProductCategoryController
);

productCategoryRoutes.delete(
  '/product-categories/:id',
  verifyRBAC({
    action: ACTIONS.DELETE,
    roles: [ROLES.ADMIN],
    module: MODULES.PRODUCT,
    subModule: SUB_MODULES.PRODUCT_CATEGORY,
  }),
  validateRequest(validator.delete),
  deleteOneProductCategoryController
);

productCategoryRoutes.post(
  '/product-categories/delete-multi',
  verifyRBAC({
    action: ACTIONS.DELETE,
    roles: [ROLES.ADMIN],
    module: MODULES.PRODUCT,
    subModule: SUB_MODULES.PRODUCT_CATEGORY,
  }),
  validateRequest(validator.deleteMany),
  deleteManyProductCategoriesController
);

productCategoryRoutes.delete(
  '/product-categories/soft-delete/:id',
  verifyRBAC({
    action: ACTIONS.DELETE,
    roles: [ROLES.ADMIN],
    module: MODULES.PRODUCT,
    subModule: SUB_MODULES.PRODUCT_CATEGORY,
  }),
  validateRequest(validator.delete),
  softDeleteOneProductCategoryController
);

productCategoryRoutes.post(
  '/product-categories/soft-delete-multi',
  verifyRBAC({
    action: ACTIONS.DELETE,
    roles: [ROLES.ADMIN],
    module: MODULES.PRODUCT,
    subModule: SUB_MODULES.PRODUCT_CATEGORY,
  }),
  validateRequest(validator.deleteMany),
  softDeleteManyProductCategoriesController
);

export default productCategoryRoutes;
