import { Router } from 'express';
import {
  createManyChannelsController,
  createOneChannelController,
  deleteManyChannelsController,
  deleteOneChannelController,
  getAllChannelsController,
  getOneChannelController,
  softDeleteManyChannelsController,
  softDeleteOneChannelController,
  updateOneChannelController,
} from './channel.controller';
import { validateRequest } from '../../../middlewares/validation';
import validator from './channel.validator';
import verifyRBAC from '../../../middlewares/rbac';
import { ACTIONS, MODULES, ROLES, SUB_MODULES } from '../../../configs/rbac';

const channelRoutes = Router();

channelRoutes.get(
  '/channels',
  verifyRBAC({
    action: ACTIONS.VIEW,
    roles: [ROLES.ADMIN],
    module: MODULES.USER_MANAGEMENT,
    subModule: SUB_MODULES.USER_ROLE_ASSIGN,
  }),
  validateRequest(validator.select),
  getAllChannelsController
);

channelRoutes.get(
  '/channels/:id',
  verifyRBAC({
    action: ACTIONS.VIEW,
    roles: [ROLES.ADMIN],
    module: MODULES.USER_MANAGEMENT,
    subModule: SUB_MODULES.USER_ROLE_ASSIGN,
  }),
  validateRequest(validator.detail),
  getOneChannelController
);

channelRoutes.post(
  '/channels/create',
  verifyRBAC({
    action: ACTIONS.CREATE,
    roles: [ROLES.ADMIN],
    module: MODULES.USER_MANAGEMENT,
    subModule: SUB_MODULES.USER_ROLE_ASSIGN,
  }),
  validateRequest(validator.create),
  createOneChannelController
);

channelRoutes.post(
  '/channels/create-multi',
  verifyRBAC({
    action: ACTIONS.CREATE,
    roles: [ROLES.ADMIN],
    module: MODULES.USER_MANAGEMENT,
    subModule: SUB_MODULES.USER_ROLE_ASSIGN,
  }),
  validateRequest(validator.createMany),
  createManyChannelsController
);

channelRoutes.patch(
  '/channels/update/:id',
  verifyRBAC({
    action: ACTIONS.UPDATE,
    roles: [ROLES.ADMIN],
    module: MODULES.USER_MANAGEMENT,
    subModule: SUB_MODULES.USER_ROLE_ASSIGN,
  }),
  validateRequest(validator.update),
  updateOneChannelController
);

channelRoutes.delete(
  '/channels/delete/:id',
  verifyRBAC({
    action: ACTIONS.DELETE,
    roles: [ROLES.ADMIN],
    module: MODULES.USER_MANAGEMENT,
    subModule: SUB_MODULES.USER_ROLE_ASSIGN,
  }),
  validateRequest(validator.delete),
  deleteOneChannelController
);

channelRoutes.post(
  '/channels/delete-multi',
  verifyRBAC({
    action: ACTIONS.DELETE,
    roles: [ROLES.ADMIN],
    module: MODULES.USER_MANAGEMENT,
    subModule: SUB_MODULES.USER_ROLE_ASSIGN,
  }),
  validateRequest(validator.deleteMany),
  deleteManyChannelsController
);

channelRoutes.delete(
  '/channels/soft-delete/:id',
  verifyRBAC({
    action: ACTIONS.DELETE,
    roles: [ROLES.ADMIN],
    module: MODULES.USER_MANAGEMENT,
    subModule: SUB_MODULES.USER_ROLE_ASSIGN,
  }),
  validateRequest(validator.delete),
  softDeleteOneChannelController
);

channelRoutes.post(
  '/channels/soft-delete-multi',
  verifyRBAC({
    action: ACTIONS.DELETE,
    roles: [ROLES.ADMIN],
    module: MODULES.USER_MANAGEMENT,
    subModule: SUB_MODULES.USER_ROLE_ASSIGN,
  }),
  validateRequest(validator.deleteMany),
  softDeleteManyChannelsController
);

export default channelRoutes;
