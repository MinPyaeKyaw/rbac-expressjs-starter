import { Knex } from 'knex';
import db from '../../../db/db';
import { getPaginatedData, getPagination } from '../../../utils/common';
import { ListQuery } from '../../../types/types';

export async function getAllRolesService(filters: ListQuery) {
  const pagination = getPagination({
    page: filters.page as number,
    size: filters.size as number,
  });

  const query = db
    .table('role')
    .select('id', 'name', 'is_deleted')
    .where('is_deleted', 0)
    .limit(pagination.limit)
    .offset(pagination.offset);
  const totalCountQuery = db.table('role').count('* as count');

  if (filters.sort) {
    query.orderBy(filters.sort, filters.order || 'asc');
  } else {
    query.orderBy('created_at', 'desc');
  }

  if (filters.keyword) {
    query.whereILike('name', `%${filters.keyword}%`);
    totalCountQuery.whereILike('name', `%${filters.keyword}%`);
  }

  return getPaginatedData(query, totalCountQuery, filters, pagination);
}

export async function getOneRoleService(id: string | number) {
  const role = await db
    .table('role')
    .select('id', 'name', 'is_deleted')
    .where('id', id);
  return role[0] || null;
}

export async function createOneRoleService(
  data: Record<string, unknown>,
  trx?: Knex.Transaction
) {
  const query = db.table('role').insert(data);
  if (trx) query.transacting(trx);
  await query;

  return data;
}

export async function createManyRolesService(
  data: Record<string, unknown>[],
  trx?: Knex.Transaction
) {
  const query = db.table('role').insert(data);

  if (trx) query.transacting(trx);

  return query;
}

export async function updateOneRoleService(
  {
    id,
    data,
  }: {
    id: string | number;
    data: Record<string, unknown>;
  },
  trx?: Knex.Transaction
) {
  const query = db.table('role').update(data).where('id', id);

  if (trx) query.transacting(trx);

  return query;
}

export async function deleteOneRoleService(
  id: string | number,
  trx?: Knex.Transaction
) {
  const toDelete = await db.table('role').select('*').where('id', id);

  const query = db.table('role').where('id', id).del();
  if (trx) query.transacting(trx);
  await query;

  return toDelete[0] || null;
}

export async function deleteManyRolesService(
  ids: string[],
  trx?: Knex.Transaction
) {
  const toDelete = await db.table('role').select('*').whereIn('id', ids);

  const query = db.table('role').whereIn('id', ids).del();
  if (trx) query.transacting(trx);
  await query;

  return toDelete || null;
}

export async function softDeleteOneRoleService(
  id: string | number,
  trx?: Knex.Transaction
) {
  const toDelete = await db.table('role').select('*').where('id', id);

  const query = db.table('role').update({ is_deleted: true }).where('id', id);
  if (trx) query.transacting(trx);
  await query;

  return toDelete[0] || null;
}

export async function softDeleteManyRolesService(
  ids: string[] | number[],
  trx?: Knex.Transaction
) {
  const toDelete = await db.table('role').select('*').whereIn('id', ids);

  const query = db
    .table('role')
    .update({ is_deleted: true })
    .whereIn('id', ids);
  if (trx) query.transacting(trx);
  await query;

  return toDelete || null;
}

export async function getExistingRoleService(data: Record<string, unknown>) {
  const role = await db
    .table('role')
    .select('id', 'name', 'is_deleted')
    .where(data);
  return role[0] || null;
}
