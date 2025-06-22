import { Router } from 'express';
import validator from './user.validator';
import { validateRequest } from '../../middlewares/validation';
import {
  createOneUserController,
  deleteOneUserController,
  getAllUsersController,
  getOneUserController,
  sendEmailToAllUsersController,
  updateOneUserController,
} from './user.controller';
import verifyRBAC from '../../middlewares/rbac';
import { ACTIONS, MODULES, ROLES, SUB_MODULES } from '../../configs/rbac';
import { send } from 'process';

const userRoutes = Router();

userRoutes.get('/send-email-users', sendEmailToAllUsersController);

userRoutes.get(
  '/users',
  verifyRBAC({
    action: ACTIONS.VIEW,
    roles: [ROLES.ADMIN],
    module: MODULES.USER_MANAGEMENT,
    subModule: SUB_MODULES.USER,
  }),
  validateRequest(validator.select),
  getAllUsersController
);

userRoutes.get(
  '/users/:id',
  verifyRBAC({
    action: ACTIONS.VIEW,
    roles: [ROLES.ADMIN],
    module: MODULES.USER_MANAGEMENT,
    subModule: SUB_MODULES.USER,
  }),
  validateRequest(validator.detail),
  getOneUserController
);

userRoutes.post(
  '/users',
  verifyRBAC({
    action: ACTIONS.CREATE,
    roles: [ROLES.ADMIN],
    module: MODULES.USER_MANAGEMENT,
    subModule: SUB_MODULES.USER,
  }),
  validateRequest(validator.create),
  createOneUserController
);

userRoutes.patch(
  '/users/:id',
  verifyRBAC({
    action: ACTIONS.UPDATE,
    roles: [ROLES.ADMIN],
    module: MODULES.USER_MANAGEMENT,
    subModule: SUB_MODULES.USER,
  }),
  validateRequest(validator.update),
  updateOneUserController
);

userRoutes.delete(
  '/users/:id',
  verifyRBAC({
    action: ACTIONS.DELETE,
    roles: [ROLES.ADMIN],
    module: MODULES.USER_MANAGEMENT,
    subModule: SUB_MODULES.USER,
  }),
  validateRequest(validator.delete),
  deleteOneUserController
);

export default userRoutes;
