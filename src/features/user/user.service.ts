import { Knex } from 'knex';
import bcrypt from 'bcrypt';
import db from '../../db/db';
import { getPaginatedData, getPagination } from '../../utils/common';
import { ListQuery } from '../../types/types';

export async function getAllUsersService(filters: ListQuery) {
  const pagination = getPagination({
    page: filters.page as number,
    size: filters.size as number,
  });

  const query = db
    .table('user')
    .select('*')
    .limit(pagination.limit)
    .offset(pagination.offset);
  const totalCountQuery = db.table('user').count('* as count');

  if (filters.sort) {
    query.orderBy(filters.sort, filters.order || 'asc');
  } else {
    query.orderBy('user.created_at', 'desc');
  }

  if (filters.keyword) {
    query.whereILike('user.name', `%${filters.keyword}%`);
    totalCountQuery.whereILike('user.name', `%${filters.keyword}%`);
  }

  return getPaginatedData(query, totalCountQuery, filters, pagination);
}

export async function getOneUserService(id: string | number) {
  const user = await db
    .table('user')
    .select('id', 'name', 'is_deleted')
    .where('id', id);
  return user[0] || null;
}

export async function createOneUserService(
  data: Record<string, unknown>,
  trx?: Knex.Transaction
) {
  const query = db.table('user').insert(data);
  if (trx) query.transacting(trx);
  await query;
  console.log('oops');
  return data;
}

export async function updateOneUserService(
  {
    id,
    data,
  }: {
    id: string | number;
    data: Record<string, unknown>;
  },
  trx?: Knex.Transaction
) {
  const query = db.table('user').update(data).where('id', id);

  if (trx) query.transacting(trx);

  return query;
}

export async function deleteOneUserService(
  id: string | number,
  trx?: Knex.Transaction
) {
  const toDelete = await db.table('user').where('id', id);

  const query = db.table('user').where('id', id).del();
  if (trx) query.transacting(trx);
  await query;

  return toDelete[0] || null;
}

export async function getExistingUserService(data: Record<string, unknown>) {
  const user = await db
    .table('user')
    .select('id', 'name', 'is_deleted')
    .where(data);
  return user[0] || null;
}

export const hashPasswordService = async (password: string) => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};
