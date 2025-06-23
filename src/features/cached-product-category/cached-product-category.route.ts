import { Router } from 'express';
import validator from './cached-product-category.validator';
import { validateRequest } from '../../middlewares/validation';
import {
  createManyCachedProductCategoriesController,
  createOneCachedProductCategoryController,
  deleteManyCachedProductCategoriesController,
  deleteOneCachedProductCategoryController,
  getAllCachedProductCategoriesController,
  getOneCachedProductCategoryController,
  softDeleteManyCachedProductCategoriesController,
  softDeleteOneCachedProductCategoryController,
  updateOneCachedProductCategoryController,
  clearProductCategoryCacheController,
  getProductCategoryCacheStatsController,
} from './cached-product-category.controller';
import verifyRBAC from '../../middlewares/rbac';
import { ACTIONS, MODULES, ROLES, SUB_MODULES } from '../../configs/rbac';

const cachedProductCategoryRoutes = Router();

// Main CRUD routes
cachedProductCategoryRoutes.get(
  '/cached-product-categories',
  verifyRBAC({
    action: ACTIONS.VIEW,
    roles: [ROLES.ADMIN],
    module: MODULES.PRODUCT,
    subModule: SUB_MODULES.PRODUCT_CATEGORY,
  }),
  validateRequest(validator.select),
  getAllCachedProductCategoriesController
);

cachedProductCategoryRoutes.get(
  '/cached-product-categories/:id',
  verifyRBAC({
    action: ACTIONS.VIEW,
    roles: [ROLES.ADMIN],
    module: MODULES.PRODUCT,
    subModule: SUB_MODULES.PRODUCT_CATEGORY,
  }),
  validateRequest(validator.detail),
  getOneCachedProductCategoryController
);

cachedProductCategoryRoutes.post(
  '/cached-product-categories',
  verifyRBAC({
    action: ACTIONS.CREATE,
    roles: [ROLES.ADMIN],
    module: MODULES.PRODUCT,
    subModule: SUB_MODULES.PRODUCT_CATEGORY,
  }),
  validateRequest(validator.create),
  createOneCachedProductCategoryController
);

cachedProductCategoryRoutes.post(
  '/cached-product-categories/create-multi',
  verifyRBAC({
    action: ACTIONS.CREATE,
    roles: [ROLES.ADMIN],
    module: MODULES.PRODUCT,
    subModule: SUB_MODULES.PRODUCT_CATEGORY,
  }),
  validateRequest(validator.createMany),
  createManyCachedProductCategoriesController
);

cachedProductCategoryRoutes.patch(
  '/cached-product-categories/:id',
  verifyRBAC({
    action: ACTIONS.UPDATE,
    roles: [ROLES.ADMIN],
    module: MODULES.PRODUCT,
    subModule: SUB_MODULES.PRODUCT_CATEGORY,
  }),
  validateRequest(validator.update),
  updateOneCachedProductCategoryController
);

cachedProductCategoryRoutes.delete(
  '/cached-product-categories/:id',
  verifyRBAC({
    action: ACTIONS.DELETE,
    roles: [ROLES.ADMIN],
    module: MODULES.PRODUCT,
    subModule: SUB_MODULES.PRODUCT_CATEGORY,
  }),
  validateRequest(validator.delete),
  deleteOneCachedProductCategoryController
);

cachedProductCategoryRoutes.post(
  '/cached-product-categories/delete-multi',
  verifyRBAC({
    action: ACTIONS.DELETE,
    roles: [ROLES.ADMIN],
    module: MODULES.PRODUCT,
    subModule: SUB_MODULES.PRODUCT_CATEGORY,
  }),
  validateRequest(validator.deleteMany),
  deleteManyCachedProductCategoriesController
);

cachedProductCategoryRoutes.delete(
  '/cached-product-categories/soft-delete/:id',
  verifyRBAC({
    action: ACTIONS.DELETE,
    roles: [ROLES.ADMIN],
    module: MODULES.PRODUCT,
    subModule: SUB_MODULES.PRODUCT_CATEGORY,
  }),
  validateRequest(validator.delete),
  softDeleteOneCachedProductCategoryController
);

cachedProductCategoryRoutes.post(
  '/cached-product-categories/soft-delete-multi',
  verifyRBAC({
    action: ACTIONS.DELETE,
    roles: [ROLES.ADMIN],
    module: MODULES.PRODUCT,
    subModule: SUB_MODULES.PRODUCT_CATEGORY,
  }),
  validateRequest(validator.deleteMany),
  softDeleteManyCachedProductCategoriesController
);

// Cache management routes
cachedProductCategoryRoutes.delete(
  '/cached-product-categories/cache/clear',
  verifyRBAC({
    action: ACTIONS.DELETE,
    roles: [ROLES.ADMIN],
    module: MODULES.PRODUCT,
    subModule: SUB_MODULES.PRODUCT_CATEGORY,
  }),
  clearProductCategoryCacheController
);

cachedProductCategoryRoutes.get(
  '/cached-product-categories/cache/stats',
  verifyRBAC({
    action: ACTIONS.VIEW,
    roles: [ROLES.ADMIN],
    module: MODULES.PRODUCT,
    subModule: SUB_MODULES.PRODUCT_CATEGORY,
  }),
  getProductCategoryCacheStatsController
);

export default cachedProductCategoryRoutes;
