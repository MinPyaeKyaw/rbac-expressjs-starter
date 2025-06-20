import { Knex } from 'knex';
import db from '../../../db/db';
import { getPaginatedData, getPagination } from '../../../utils/common';
import { ListQuery } from '../../../types/types';

export async function getRolesOnChannelDataService(
  filters: ListQuery & { role_id?: string; channel_id?: string }
) {
  const pagination = getPagination({
    page: filters.page as number,
    size: filters.size as number,
  });

  const query = db('permission')
    .select(
      'permission.role_id',
      'role.name as role',
      'permission.channel_id',
      'channel.name as channel'
    )
    .leftJoin('channel', 'channel.id', 'permission.channel_id')
    .leftJoin('role', 'role.id', 'permission.role_id')
    .groupBy(
      'permission.role_id',
      'role.name',
      'permission.channel_id',
      'channel.name'
    )
    .limit(pagination.limit)
    .offset(pagination.offset);
  const totalCountQuery = db.table('permission').count('* as count');

  if (filters.channel_id) query.where('channel.id', '=', filters.channel_id);
  if (filters.role_id) query.where('role.id', '=', filters.role_id);

  return getPaginatedData(query, totalCountQuery, filters, pagination);
}

export async function getAllPermissionsService(
  filters: Record<string, unknown>
) {
  const query = db
    .table('permission')
    .select(
      'permission.id',
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
    .leftJoin('user', 'user.role_id', 'permission.role_id')
    .leftJoin('channel', 'channel.id', 'permission.channel_id')
    .leftJoin('module', 'module.id', 'permission.module_id')
    .leftJoin('sub_module', 'sub_module.id', 'permission.sub_module_id')
    .leftJoin('role', 'role.id', 'permission.role_id')
    .leftJoin('action', 'action.id', 'permission.action_id')
    .groupBy(
      'permission.id',
      'permission.module_id',
      'module.name',
      'permission.sub_module_id',
      'sub_module.name',
      'permission.role_id',
      'role.name',
      'permission.channel_id',
      'channel.name'
    );

  if (filters.user_id) query.where('user.id', '=', filters.user_id);
  if (filters.rold_id) query.where('role.id', '=', filters.rold_id);

  return query;
}

export async function getPermissionsByUserService(userId: string) {
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
    .leftJoin('user', 'user.role_id', 'permission.role_id')
    .leftJoin('channel', 'channel.id', 'permission.channel_id')
    .leftJoin('module', 'module.id', 'permission.module_id')
    .leftJoin('sub_module', 'sub_module.id', 'permission.sub_module_id')
    .leftJoin('role', 'role.id', 'permission.role_id')
    .leftJoin('action', 'action.id', 'permission.action_id')
    .where('user.id', '=', userId)
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

export async function getOnePermissionService(id: string | number) {
  const permission = await db
    .table('permission')
    .select('id', 'name', 'is_deleted')
    .where('id', id);
  return permission[0] || null;
}

export async function createOnePermissionService(
  data: Record<string, unknown>,
  trx?: Knex.Transaction
) {
  const query = db.table('permission').insert(data);

  if (trx) query.transacting(trx);

  return query;
}

export async function createManyPermissionsService(
  data: Record<string, unknown>[],
  trx?: Knex.Transaction
) {
  const query = db.table('permission').insert(data);

  if (trx) query.transacting(trx);

  return query;
}

export async function updateOnePermissionService(
  {
    id,
    data,
  }: {
    id: string | number;
    data: Record<string, unknown>;
  },
  trx?: Knex.Transaction
) {
  const query = db.table('permission').update(data).where('id', id);

  if (trx) query.transacting(trx);

  return query;
}

export async function deleteOnePermissionService(
  id: string | number,
  trx?: Knex.Transaction
) {
  const query = db.table('permission').where('id', id).del();

  if (trx) query.transacting(trx);

  return query;
}

export async function deleteManyPermissionsService(
  conds: Record<string, unknown>,
  trx?: Knex.Transaction
) {
  const query = db.table('permission').where(conds).del();

  if (trx) query.transacting(trx);

  return query;
}

export async function getExistingPermissionService(
  data: Record<string, unknown>
) {
  const permission = await db
    .table('permission')
    .select('id', 'is_deleted')
    .where(data);
  return permission[0] || null;
}
