import { Router } from 'express';
import {
  getAllPermissionsController,
  getAllRoleOnChannelsController,
  updatePermissionsByRoleController,
} from './permission.controller';
import { validateRequest } from '../../../middlewares/validation';
import validator from './permission.validator';
import verifyRBAC from '../../../middlewares/rbac';
import { ACTIONS, MODULES, ROLES, SUB_MODULES } from '../../../configs/rbac';

const permissionRoutes = Router();

permissionRoutes.get(
  '/role-channel-list',
  verifyRBAC({
    action: ACTIONS.VIEW,
    roles: [ROLES.ADMIN],
    module: MODULES.USER_MANAGEMENT,
    subModule: SUB_MODULES.USER_ROLE_ASSIGN,
  }),
  validateRequest(validator.select),
  getAllRoleOnChannelsController
);

permissionRoutes.get(
  '/permissions',
  verifyRBAC({
    action: ACTIONS.VIEW,
    roles: [ROLES.ADMIN],
    module: MODULES.USER_MANAGEMENT,
    subModule: SUB_MODULES.USER_ROLE_ASSIGN,
  }),
  validateRequest(validator.select),
  getAllPermissionsController
);

permissionRoutes.patch(
  '/permissions',
  verifyRBAC({
    action: ACTIONS.UPDATE,
    roles: [ROLES.ADMIN],
    module: MODULES.USER_MANAGEMENT,
    subModule: SUB_MODULES.USER_ROLE_ASSIGN,
  }),
  validateRequest(validator.update),
  updatePermissionsByRoleController
);

export default permissionRoutes;
