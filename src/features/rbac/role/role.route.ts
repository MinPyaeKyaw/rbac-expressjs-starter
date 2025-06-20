import { Router } from 'express';
import {
  getAllRolesController,
  getOneRoleController,
  createOneRoleController,
  createManyRolesController,
  updateOneRoleController,
  deleteOneRoleController,
  deleteManyRolesController,
  softDeleteOneRoleController,
  softDeleteManyRolesController,
} from './role.controller';
import { validateRequest } from '../../../middlewares/validation';
import validator from './role.validator';
import verifyRBAC from '../../../middlewares/rbac';
import { ACTIONS, MODULES, ROLES, SUB_MODULES } from '../../../configs/rbac';

const roleRoutes = Router();

roleRoutes.get(
  '/roles',
  verifyRBAC({
    action: ACTIONS.VIEW,
    roles: [ROLES.ADMIN],
    module: MODULES.USER_MANAGEMENT,
    subModule: SUB_MODULES.USER_ROLE_ASSIGN,
  }),
  validateRequest(validator.select),
  getAllRolesController
);

roleRoutes.get(
  '/roles/:id',
  verifyRBAC({
    action: ACTIONS.VIEW,
    roles: [ROLES.ADMIN],
    module: MODULES.USER_MANAGEMENT,
    subModule: SUB_MODULES.USER_ROLE_ASSIGN,
  }),
  validateRequest(validator.detail),
  getOneRoleController
);

roleRoutes.post(
  '/roles/create',
  verifyRBAC({
    action: ACTIONS.CREATE,
    roles: [ROLES.ADMIN],
    module: MODULES.USER_MANAGEMENT,
    subModule: SUB_MODULES.USER_ROLE_ASSIGN,
  }),
  validateRequest(validator.create),
  createOneRoleController
);

roleRoutes.post(
  '/roles/create-multi',
  verifyRBAC({
    action: ACTIONS.CREATE,
    roles: [ROLES.ADMIN],
    module: MODULES.USER_MANAGEMENT,
    subModule: SUB_MODULES.USER_ROLE_ASSIGN,
  }),
  validateRequest(validator.createMany),
  createManyRolesController
);

roleRoutes.patch(
  '/roles/update/:id',
  verifyRBAC({
    action: ACTIONS.UPDATE,
    roles: [ROLES.ADMIN],
    module: MODULES.USER_MANAGEMENT,
    subModule: SUB_MODULES.USER_ROLE_ASSIGN,
  }),
  validateRequest(validator.update),
  updateOneRoleController
);

roleRoutes.delete(
  '/roles/delete/:id',
  verifyRBAC({
    action: ACTIONS.DELETE,
    roles: [ROLES.ADMIN],
    module: MODULES.USER_MANAGEMENT,
    subModule: SUB_MODULES.USER_ROLE_ASSIGN,
  }),
  validateRequest(validator.delete),
  deleteOneRoleController
);

roleRoutes.post(
  '/roles/delete-multi',
  verifyRBAC({
    action: ACTIONS.DELETE,
    roles: [ROLES.ADMIN],
    module: MODULES.USER_MANAGEMENT,
    subModule: SUB_MODULES.USER_ROLE_ASSIGN,
  }),
  validateRequest(validator.deleteMany),
  deleteManyRolesController
);

roleRoutes.delete(
  '/roles/soft-delete/:id',
  verifyRBAC({
    action: ACTIONS.DELETE,
    roles: [ROLES.ADMIN],
    module: MODULES.USER_MANAGEMENT,
    subModule: SUB_MODULES.USER_ROLE_ASSIGN,
  }),
  validateRequest(validator.delete),
  softDeleteOneRoleController
);

roleRoutes.post(
  '/roles/soft-delete-multi',
  verifyRBAC({
    action: ACTIONS.DELETE,
    roles: [ROLES.ADMIN],
    module: MODULES.USER_MANAGEMENT,
    subModule: SUB_MODULES.USER_ROLE_ASSIGN,
  }),
  validateRequest(validator.deleteMany),
  softDeleteManyRolesController
);

export default roleRoutes;
