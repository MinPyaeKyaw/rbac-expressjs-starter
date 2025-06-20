import db from '../../db/db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export async function getUserService(conds: Record<string, unknown>) {
  const user = await db
    .table('user')
    .select(
      'user.id',
      'user.username',
      'user.password',
      'user.phone1',
      'user.email',
      'user.is_deleted',
      'user.role_id',
      'role.name as role'
    )
    .leftJoin('role', 'role.id', 'user.role_id')
    .where(conds);
  return user[0] || null;
}

export async function getPermissionsByRoleService(roleId: string) {
  const permissions = await db
    .table('permission')
    .select(
      'permission.module_id',
      'module.name as module',
      'permission.sub_module_id',
      'sub_module.name as sub_module',
      'permission.role_id',
      'role.name as role',
      'permission.channel_id',
      'channel.name as channel',
      db.raw(`
      JSON_ARRAYAGG(
        JSON_OBJECT('id', action.id, 'name', action.name)
      ) as actions
    `)
    )
    .leftJoin('channel', 'channel.id', 'permission.channel_id')
    .leftJoin('module', 'module.id', 'permission.module_id')
    .leftJoin('sub_module', 'sub_module.id', 'permission.sub_module_id')
    .leftJoin('role', 'role.id', 'permission.role_id')
    .leftJoin('action', 'action.id', 'permission.action_id')
    .where('permission.role_id', '=', roleId)
    .groupBy(
      'permission.module_id',
      'module.name',
      'permission.sub_module_id',
      'sub_module.name',
      'permission.role_id',
      'role.name',
      'permission.channel_id',
      'channel.name'
    );

  return permissions;
}

export async function getAccessTokenService(payload: Record<string, unknown>) {
  return jwt.sign(payload, process.env.JWT_SECRET || 'smsk-jwt-secret', {
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
  } as jwt.SignOptions);
}

export async function getRefreshTokenService(payload: Record<string, unknown>) {
  return jwt.sign(
    payload,
    process.env.REFRESH_JWT_SECRET || 'smsk-refresh-jwt-secret',
    {
      expiresIn: process.env.REFRESH_JWT_EXPIRES_IN || '7d',
    } as jwt.SignOptions
  );
}

export async function verifyPasswordService(
  hashedPassword: string,
  password: string
) {
  return bcrypt.compare(password, hashedPassword);
}
