import { Router } from 'express';
import {
  createManyModulesController,
  createOneModuleController,
  deleteManyModulesController,
  deleteOneModuleController,
  getAllModulesController,
  getAllModulesWithPermissionsController,
  getOneModuleController,
  softDeleteManyModulesController,
  softDeleteOneModuleController,
  updateOneModuleController,
} from './module.controller';
import { validateRequest } from '../../../middlewares/validation';
import validator from './module.validator';
import verifyRBAC from '../../../middlewares/rbac';
import { ACTIONS, MODULES, ROLES, SUB_MODULES } from '../../../configs/rbac';

const moduleRoutes = Router();

moduleRoutes.get(
  '/modules-with-permissions',
  verifyRBAC({
    action: ACTIONS.VIEW,
    roles: [ROLES.ADMIN],
    module: MODULES.USER_MANAGEMENT,
    subModule: SUB_MODULES.USER_ROLE_ASSIGN,
  }),
  validateRequest(validator.moduleWithPermissionSelect),
  getAllModulesWithPermissionsController
);

moduleRoutes.get(
  '/modules',
  verifyRBAC({
    action: ACTIONS.VIEW,
    roles: [ROLES.ADMIN],
    module: MODULES.USER_MANAGEMENT,
    subModule: SUB_MODULES.USER_ROLE_ASSIGN,
  }),
  validateRequest(validator.select),
  getAllModulesController
);

moduleRoutes.get(
  '/modules/:id',
  verifyRBAC({
    action: ACTIONS.VIEW,
    roles: [ROLES.ADMIN],
    module: MODULES.USER_MANAGEMENT,
    subModule: SUB_MODULES.USER_ROLE_ASSIGN,
  }),
  validateRequest(validator.detail),
  getOneModuleController
);

moduleRoutes.post(
  '/modules/create',
  verifyRBAC({
    action: ACTIONS.CREATE,
    roles: [ROLES.ADMIN],
    module: MODULES.USER_MANAGEMENT,
    subModule: SUB_MODULES.USER_ROLE_ASSIGN,
  }),
  validateRequest(validator.create),
  createOneModuleController
);

moduleRoutes.post(
  '/modules/create-multi',
  verifyRBAC({
    action: ACTIONS.CREATE,
    roles: [ROLES.ADMIN],
    module: MODULES.USER_MANAGEMENT,
    subModule: SUB_MODULES.USER_ROLE_ASSIGN,
  }),
  validateRequest(validator.createMany),
  createManyModulesController
);

moduleRoutes.patch(
  '/modules/update/:id',
  verifyRBAC({
    action: ACTIONS.UPDATE,
    roles: [ROLES.ADMIN],
    module: MODULES.USER_MANAGEMENT,
    subModule: SUB_MODULES.USER_ROLE_ASSIGN,
  }),
  validateRequest(validator.update),
  updateOneModuleController
);

moduleRoutes.delete(
  '/modules/delete/:id',
  verifyRBAC({
    action: ACTIONS.DELETE,
    roles: [ROLES.ADMIN],
    module: MODULES.USER_MANAGEMENT,
    subModule: SUB_MODULES.USER_ROLE_ASSIGN,
  }),
  validateRequest(validator.delete),
  deleteOneModuleController
);

moduleRoutes.post(
  '/modules/delete-multi',
  verifyRBAC({
    action: ACTIONS.DELETE,
    roles: [ROLES.ADMIN],
    module: MODULES.USER_MANAGEMENT,
    subModule: SUB_MODULES.USER_ROLE_ASSIGN,
  }),
  validateRequest(validator.deleteMany),
  deleteManyModulesController
);

moduleRoutes.delete(
  '/modules/soft-delete/:id',
  verifyRBAC({
    action: ACTIONS.DELETE,
    roles: [ROLES.ADMIN],
    module: MODULES.USER_MANAGEMENT,
    subModule: SUB_MODULES.USER_ROLE_ASSIGN,
  }),
  validateRequest(validator.delete),
  softDeleteOneModuleController
);

moduleRoutes.post(
  '/modules/soft-delete-multi',
  verifyRBAC({
    action: ACTIONS.DELETE,
    roles: [ROLES.ADMIN],
    module: MODULES.USER_MANAGEMENT,
    subModule: SUB_MODULES.USER_ROLE_ASSIGN,
  }),
  validateRequest(validator.deleteMany),
  softDeleteManyModulesController
);

export default moduleRoutes;
