import { Router } from 'express';
import validator from './product.validator';
import { validateRequest } from '../../middlewares/validation';
import {
  createManyProductsController,
  createOneProductController,
  deleteManyProductsController,
  deleteOneProductController,
  getAllProductsController,
  getOneProductController,
  softDeleteManyProductsController,
  softDeleteOneProductController,
  updateOneProductController,
} from './product.controller';
import verifyRBAC from '../../middlewares/rbac';
import { ACTIONS, MODULES, ROLES, SUB_MODULES } from '../../configs/rbac';

const productRoutes = Router();

productRoutes.get(
  '/products',
  verifyRBAC({
    action: ACTIONS.VIEW,
    roles: [ROLES.ADMIN],
    module: MODULES.PRODUCT,
    subModule: SUB_MODULES.PRODUCT,
  }),
  validateRequest(validator.select),
  getAllProductsController
);

productRoutes.get(
  '/products/:id',
  verifyRBAC({
    action: ACTIONS.VIEW,
    roles: [ROLES.ADMIN],
    module: MODULES.PRODUCT,
    subModule: SUB_MODULES.PRODUCT,
  }),
  validateRequest(validator.detail),
  getOneProductController
);

productRoutes.post(
  '/products',
  verifyRBAC({
    action: ACTIONS.CREATE,
    roles: [ROLES.ADMIN],
    module: MODULES.PRODUCT,
    subModule: SUB_MODULES.PRODUCT,
  }),
  validateRequest(validator.create),
  createOneProductController
);

productRoutes.post(
  '/products/create-many',
  verifyRBAC({
    action: ACTIONS.CREATE,
    roles: [ROLES.ADMIN],
    module: MODULES.PRODUCT,
    subModule: SUB_MODULES.PRODUCT,
  }),
  validateRequest(validator.createMany),
  createManyProductsController
);

productRoutes.patch(
  '/products/:id',
  verifyRBAC({
    action: ACTIONS.UPDATE,
    roles: [ROLES.ADMIN],
    module: MODULES.PRODUCT,
    subModule: SUB_MODULES.PRODUCT,
  }),
  validateRequest(validator.update),
  updateOneProductController
);

productRoutes.delete(
  '/products/:id',
  verifyRBAC({
    action: ACTIONS.DELETE,
    roles: [ROLES.ADMIN],
    module: MODULES.PRODUCT,
    subModule: SUB_MODULES.PRODUCT,
  }),
  validateRequest(validator.delete),
  deleteOneProductController
);

productRoutes.post(
  '/products/delete-many',
  verifyRBAC({
    action: ACTIONS.DELETE,
    roles: [ROLES.ADMIN],
    module: MODULES.PRODUCT,
    subModule: SUB_MODULES.PRODUCT,
  }),
  validateRequest(validator.deleteMany),
  deleteManyProductsController
);

productRoutes.delete(
  '/products/soft-delete/:id',
  verifyRBAC({
    action: ACTIONS.DELETE,
    roles: [ROLES.ADMIN],
    module: MODULES.PRODUCT,
    subModule: SUB_MODULES.PRODUCT,
  }),
  validateRequest(validator.delete),
  softDeleteOneProductController
);

productRoutes.post(
  '/products/soft-delete-many',
  verifyRBAC({
    action: ACTIONS.DELETE,
    roles: [ROLES.ADMIN],
    module: MODULES.PRODUCT,
    subModule: SUB_MODULES.PRODUCT,
  }),
  validateRequest(validator.deleteMany),
  softDeleteManyProductsController
);

export default productRoutes;
