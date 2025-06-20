import { NextFunction, Request, Response } from 'express';
import {
  getAccessTokenService,
  getPermissionsByRoleService,
  getRefreshTokenService,
  getUserService,
  verifyPasswordService,
} from './auth.service';
import { AppError, responseData } from '../../utils/http';
import { MESSAGES } from '../../configs/messages';

export async function loginController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = await getUserService({ username: req.body.username });
    if (!user) throw new AppError(MESSAGES.ERROR.USER_NOT_FOUND, 400);

    const isCorrectPassword = await verifyPasswordService(
      user.password,
      req.body.password
    );
    if (!isCorrectPassword)
      throw new AppError(MESSAGES.ERROR.INVALID_CREDENTIAL, 400);
    delete user.password;

    const accessToken = await getAccessTokenService(user);
    const refreshToken = await getRefreshTokenService({ id: user.id });
    const userPermissions = await getPermissionsByRoleService(user.role_id);

    responseData({
      res,
      status: 200,
      message: MESSAGES.SUCCESS.LOGIN,
      data: {
        accessToken,
        refreshToken,
        ...user,
        permissions: userPermissions,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function refreshTokenController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = await getUserService({ id: req.body.user.id });
    if (!user) throw new AppError(MESSAGES.ERROR.USER_NOT_FOUND, 400);

    const accessToken = await getAccessTokenService(user);
    const refreshToken = await getRefreshTokenService({ id: user.id });

    responseData({
      res,
      status: 200,
      message: MESSAGES.SUCCESS.CREATE,
      data: { accessToken, refreshToken },
    });
  } catch (error) {
    next(error);
  }
}
