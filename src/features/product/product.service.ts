import { Knex } from 'knex';
import db from '../../db/db';
import { getPaginatedData, getPagination } from '../../utils/common';
import { ListQuery } from '../../types/types';

export async function getAllProductsService(filters: ListQuery) {
  const pagination = getPagination({
    page: filters.page as number,
    size: filters.size as number,
  });

  const query = db
    .table('product')
    .select(
      'product.id',
      'product.name',
      'product.price',
      'product.is_deleted',
      db.raw(
        `JSON_OBJECT('id', product_category.id, 'name', product_category.name) as category`
      )
    )
    .leftJoin('product_category', 'product_category.id', 'product.category_id')
    .limit(pagination.limit)
    .offset(pagination.offset);
  const totalCountQuery = db.table('product').count('* as count');

  if (filters.sort) {
    query.orderBy(filters.sort, filters.order || 'asc');
  } else {
    query.orderBy('product.created_at', 'desc');
  }

  if (filters.keyword) {
    query.whereILike('product.name', `%${filters.keyword}%`);
    totalCountQuery.whereILike('product.name', `%${filters.keyword}%`);
  }

  return getPaginatedData(query, totalCountQuery, filters, pagination);
}

export async function getOneProductService(id: string | number) {
  const product = await db
    .table('product')
    .select('id', 'name', 'is_deleted')
    .where('id', id);
  return product[0] || null;
}

export async function createOneProductService(
  data: Record<string, unknown>,
  trx?: Knex.Transaction
) {
  const query = db.table('product').insert(data);
  if (trx) query.transacting(trx);
  await query;

  return data;
}

export async function createManyProductsService(
  data: Record<string, unknown>[],
  trx?: Knex.Transaction
) {
  const query = db.table('product').insert(data);
  if (trx) query.transacting(trx);
  await query;

  return data;
}

export async function updateOneProductService(
  {
    id,
    data,
  }: {
    id: string | number;
    data: Record<string, unknown>;
  },
  trx?: Knex.Transaction
) {
  const query = db.table('product').update(data).where('id', id);

  if (trx) query.transacting(trx);

  return query;
}

export async function deleteOneProductService(
  id: string | number,
  trx?: Knex.Transaction
) {
  const toDelete = await db.table('product').select('*').where('id', id);

  const query = db.table('product').where('id', id).del();
  if (trx) query.transacting(trx);
  await query;

  return toDelete[0] || null;
}

export async function deleteManyProductsService(
  ids: string[],
  trx?: Knex.Transaction
) {
  const toDelete = await db.table('product').select('*').whereIn('id', ids);

  const query = db.table('product').whereIn('id', ids).del();
  if (trx) query.transacting(trx);
  await query;

  return toDelete;
}

export async function softDeleteOneProductService(
  id: string | number,
  trx?: Knex.Transaction
) {
  const query = db
    .table('product')
    .update({ is_deleted: true })
    .where('id', id);

  if (trx) query.transacting(trx);
  await query;

  const toDelete = await db.table('product').select('*').where('id', id);

  return toDelete[0] || null;
}

export async function softDeleteManyProductsService(
  ids: string[] | number[],
  trx?: Knex.Transaction
) {
  const query = db
    .table('product')
    .update({ is_deleted: true })
    .whereIn('id', ids);
  if (trx) query.transacting(trx);
  await query;

  const toDelete = await db
    .table('product')
    .select('id', 'name', 'is_deleted')
    .whereIn('id', ids);

  return toDelete || null;
}

export async function getExistingProductService(data: Record<string, unknown>) {
  const product = await db
    .table('product')
    .select('id', 'name', 'is_deleted')
    .where(data);
  return product[0] || null;
}
