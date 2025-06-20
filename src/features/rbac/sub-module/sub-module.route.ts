import { Router } from 'express';
import {
  getAllSubModulesController,
  getOneSubModuleController,
  createOneSubModuleController,
  createManySubModulesController,
  updateOneSubModuleController,
  deleteOneSubModuleController,
  deleteManySubModulesController,
  softDeleteOneSubModuleController,
  softDeleteManySubModulesController,
} from './sub-module.controller';
import { validateRequest } from '../../../middlewares/validation';
import validator from './sub-module.validator';
import verifyRBAC from '../../../middlewares/rbac';
import { ACTIONS, MODULES, ROLES, SUB_MODULES } from '../../../configs/rbac';

const subModuleRoutes = Router();

subModuleRoutes.get(
  '/sub-modules',
  verifyRBAC({
    action: ACTIONS.VIEW,
    roles: [ROLES.ADMIN],
    module: MODULES.USER_MANAGEMENT,
    subModule: SUB_MODULES.USER_ROLE_ASSIGN,
  }),
  validateRequest(validator.select),
  getAllSubModulesController
);

subModuleRoutes.get(
  '/sub-modules/:id',
  verifyRBAC({
    action: ACTIONS.VIEW,
    roles: [ROLES.ADMIN],
    module: MODULES.USER_MANAGEMENT,
    subModule: SUB_MODULES.USER_ROLE_ASSIGN,
  }),
  validateRequest(validator.detail),
  getOneSubModuleController
);

subModuleRoutes.post(
  '/sub-modules/create',
  verifyRBAC({
    action: ACTIONS.CREATE,
    roles: [ROLES.ADMIN],
    module: MODULES.USER_MANAGEMENT,
    subModule: SUB_MODULES.USER_ROLE_ASSIGN,
  }),
  validateRequest(validator.create),
  createOneSubModuleController
);

subModuleRoutes.post(
  '/sub-modules/create-multi',
  verifyRBAC({
    action: ACTIONS.CREATE,
    roles: [ROLES.ADMIN],
    module: MODULES.USER_MANAGEMENT,
    subModule: SUB_MODULES.USER_ROLE_ASSIGN,
  }),
  validateRequest(validator.createMany),
  createManySubModulesController
);

subModuleRoutes.patch(
  '/sub-modules/update/:id',
  verifyRBAC({
    action: ACTIONS.UPDATE,
    roles: [ROLES.ADMIN],
    module: MODULES.USER_MANAGEMENT,
    subModule: SUB_MODULES.USER_ROLE_ASSIGN,
  }),
  validateRequest(validator.update),
  updateOneSubModuleController
);

subModuleRoutes.delete(
  '/sub-modules/delete/:id',
  verifyRBAC({
    action: ACTIONS.DELETE,
    roles: [ROLES.ADMIN],
    module: MODULES.USER_MANAGEMENT,
    subModule: SUB_MODULES.USER_ROLE_ASSIGN,
  }),
  validateRequest(validator.delete),
  deleteOneSubModuleController
);

subModuleRoutes.post(
  '/sub-modules/delete-multi',
  verifyRBAC({
    action: ACTIONS.DELETE,
    roles: [ROLES.ADMIN],
    module: MODULES.USER_MANAGEMENT,
    subModule: SUB_MODULES.USER_ROLE_ASSIGN,
  }),
  validateRequest(validator.deleteMany),
  deleteManySubModulesController
);

subModuleRoutes.delete(
  '/sub-modules/soft-delete/:id',
  verifyRBAC({
    action: ACTIONS.DELETE,
    roles: [ROLES.ADMIN],
    module: MODULES.USER_MANAGEMENT,
    subModule: SUB_MODULES.USER_ROLE_ASSIGN,
  }),
  validateRequest(validator.delete),
  softDeleteOneSubModuleController
);

subModuleRoutes.post(
  '/sub-modules/soft-delete-multi',
  verifyRBAC({
    action: ACTIONS.DELETE,
    roles: [ROLES.ADMIN],
    module: MODULES.USER_MANAGEMENT,
    subModule: SUB_MODULES.USER_ROLE_ASSIGN,
  }),
  validateRequest(validator.deleteMany),
  softDeleteManySubModulesController
);

export default subModuleRoutes;
