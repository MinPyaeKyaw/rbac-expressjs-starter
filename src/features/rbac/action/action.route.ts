import { Router } from 'express';
import {
  createManyActionsController,
  createOneActionController,
  deleteManyActionsController,
  deleteOneActionController,
  getAllActionsController,
  getOneActionController,
  softDeleteManyActionsController,
  softDeleteOneActionController,
  updateOneActionController,
} from './action.controller';
import { validateRequest } from '../../../middlewares/validation';
import validator from './action.validator';
import verifyRBAC from '../../../middlewares/rbac';
import { ACTIONS, MODULES, ROLES, SUB_MODULES } from '../../../configs/rbac';

const actionRoutes = Router();

actionRoutes.get(
  '/actions',
  verifyRBAC({
    action: ACTIONS.VIEW,
    roles: [ROLES.ADMIN],
    module: MODULES.USER_MANAGEMENT,
    subModule: SUB_MODULES.USER_ROLE_ASSIGN,
  }),
  validateRequest(validator.select),
  getAllActionsController
);

actionRoutes.get(
  '/actions/:id',
  verifyRBAC({
    action: ACTIONS.VIEW,
    roles: [ROLES.ADMIN],
    module: MODULES.USER_MANAGEMENT,
    subModule: SUB_MODULES.USER_ROLE_ASSIGN,
  }),
  validateRequest(validator.detail),
  getOneActionController
);

actionRoutes.post(
  '/actions/create',
  verifyRBAC({
    action: ACTIONS.CREATE,
    roles: [ROLES.ADMIN],
    module: MODULES.USER_MANAGEMENT,
    subModule: SUB_MODULES.USER_ROLE_ASSIGN,
  }),
  validateRequest(validator.create),
  createOneActionController
);

actionRoutes.post(
  '/actions/create-multi',
  verifyRBAC({
    action: ACTIONS.CREATE,
    roles: [ROLES.ADMIN],
    module: MODULES.USER_MANAGEMENT,
    subModule: SUB_MODULES.USER_ROLE_ASSIGN,
  }),
  validateRequest(validator.createMany),
  createManyActionsController
);

actionRoutes.patch(
  '/actions/:id',
  verifyRBAC({
    action: ACTIONS.UPDATE,
    roles: [ROLES.ADMIN],
    module: MODULES.USER_MANAGEMENT,
    subModule: SUB_MODULES.USER_ROLE_ASSIGN,
  }),
  validateRequest(validator.update),
  updateOneActionController
);

actionRoutes.delete(
  '/actions/:id',
  verifyRBAC({
    action: ACTIONS.DELETE,
    roles: [ROLES.ADMIN],
    module: MODULES.USER_MANAGEMENT,
    subModule: SUB_MODULES.USER_ROLE_ASSIGN,
  }),
  validateRequest(validator.delete),
  deleteOneActionController
);

actionRoutes.post(
  '/actions/delete-multi',
  verifyRBAC({
    action: ACTIONS.DELETE,
    roles: [ROLES.ADMIN],
    module: MODULES.USER_MANAGEMENT,
    subModule: SUB_MODULES.USER_ROLE_ASSIGN,
  }),
  validateRequest(validator.deleteMany),
  deleteManyActionsController
);

actionRoutes.delete(
  '/actions/soft-delete/:id',
  verifyRBAC({
    action: ACTIONS.DELETE,
    roles: [ROLES.ADMIN],
    module: MODULES.USER_MANAGEMENT,
    subModule: SUB_MODULES.USER_ROLE_ASSIGN,
  }),
  validateRequest(validator.delete),
  softDeleteOneActionController
);

actionRoutes.post(
  '/actions/soft-delete-multi',
  verifyRBAC({
    action: ACTIONS.DELETE,
    roles: [ROLES.ADMIN],
    module: MODULES.USER_MANAGEMENT,
    subModule: SUB_MODULES.USER_ROLE_ASSIGN,
  }),
  validateRequest(validator.deleteMany),
  softDeleteManyActionsController
);

export default actionRoutes;
