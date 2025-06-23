import { Knex } from 'knex';
import db from '../../../db/db';
import { getPaginatedData, getPagination } from '../../../utils/common';
import { ListQuery } from '../../../types/types';

export async function getAllActionsService(filters: ListQuery) {
  const query = db
    .table('action')
    .select('id', 'name', 'is_deleted')
    .where('is_deleted', 0);
  const totalCountQuery = db.table('action').count('* as count');

  let pagination;
  if (filters.page && filters.size) {
    pagination = getPagination({
      page: filters.page as number,
      size: filters.size as number,
    });
    query.limit(pagination.limit).offset(pagination.offset);
  }

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

export async function getOneActionService(id: string | number) {
  const action = await db
    .table('action')
    .select('id', 'name', 'is_deleted')
    .where('id', id);
  return action[0] || null;
}

export async function createOneActionService(
  data: Record<string, unknown>,
  trx?: Knex.Transaction
) {
  const query = db.table('action').insert(data);
  if (trx) query.transacting(trx);
  await query;

  return data;
}

export async function createManyActionsService(
  data: Record<string, unknown>[],
  trx?: Knex.Transaction
) {
  const query = db.table('action').insert(data);
  if (trx) query.transacting(trx);
  await query;

  return data;
}

export async function updateOneActionService(
  {
    id,
    data,
  }: {
    id: string | number;
    data: Record<string, unknown>;
  },
  trx?: Knex.Transaction
) {
  const query = db.table('action').update(data).where('id', id);

  if (trx) query.transacting(trx);

  return query;
}

export async function deleteOneActionService(
  id: string | number,
  trx?: Knex.Transaction
) {
  const toDelete = await db.table('action').select('*').where('id', id);

  const query = db.table('action').where('id', id).del();
  if (trx) query.transacting(trx);
  await query;

  return toDelete;
}

export async function deleteManyActionsService(
  ids: string[],
  trx?: Knex.Transaction
) {
  const toDelete = await db.table('action').select('*').whereIn('id', ids);

  const query = db.table('action').whereIn('id', ids).del();
  if (trx) query.transacting(trx);
  await query;

  return toDelete || null;
}

export async function softDeleteOneActionService(
  id: string | number,
  trx?: Knex.Transaction
) {
  const toDelete = await db.table('action').select('*').where('id', id);

  const query = db.table('action').update({ is_deleted: true }).where('id', id);
  if (trx) query.transacting(trx);
  await query;

  return toDelete[0] || null;
}

export async function softDeleteManyActionsService(
  ids: string[] | number[],
  trx?: Knex.Transaction
) {
  const toDelete = await db.table('action').select('*').whereIn('id', ids);

  const query = db
    .table('action')
    .update({ is_deleted: true })
    .whereIn('id', ids);
  if (trx) query.transacting(trx);
  await query;

  return toDelete || null;
}

export async function getExistingActionService(data: Record<string, unknown>) {
  const action = await db
    .table('action')
    .select('id', 'name', 'is_deleted')
    .where(data);
  return action[0] || null;
}
