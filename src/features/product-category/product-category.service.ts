import { Knex } from 'knex';
import db from '../../db/db';
import { getPaginatedData, getPagination } from '../../utils/common';
import { ListQuery } from '../../types/types';

export async function getAllProductCategoriesService(filters: ListQuery) {
  const pagination = getPagination({
    page: filters.page as number,
    size: filters.size as number,
  });

  const query = db
    .table('product_category')
    .select(
      'product_category.id',
      'product_category.name',
      'product_category.is_deleted'
    )
    .limit(pagination.limit)
    .offset(pagination.offset);
  const totalCountQuery = db.table('product_category').count('* as count');

  if (filters.sort) {
    query.orderBy(filters.sort, filters.order || 'asc');
  } else {
    query.orderBy('product_category.created_at', 'desc');
  }

  if (filters.keyword) {
    query.whereILike('product_category.name', `%${filters.keyword}%`);
    totalCountQuery.whereILike('product_category.name', `%${filters.keyword}%`);
  }

  return getPaginatedData(query, totalCountQuery, filters, pagination);
}

export async function getOneProductCategoryService(id: string | number) {
  const product_category = await db
    .table('product_category')
    .select('id', 'name', 'is_deleted')
    .where('id', id);
  return product_category[0] || null;
}

export async function createOneProductCategoryService(
  data: Record<string, unknown>,
  trx?: Knex.Transaction
) {
  const query = db.table('product_category').insert(data);
  if (trx) query.transacting(trx);
  await query;

  return data;
}

export async function createManyProductCategoriesService(
  data: Record<string, unknown>[],
  trx?: Knex.Transaction
) {
  const query = db.table('product_category').insert(data);
  if (trx) query.transacting(trx);
  await query;

  return data;
}

export async function updateOneProductCategoryService(
  {
    id,
    data,
  }: {
    id: string | number;
    data: Record<string, unknown>;
  },
  trx?: Knex.Transaction
) {
  const query = db.table('product_category').update(data).where('id', id);

  if (trx) query.transacting(trx);

  return query;
}

export async function deleteOneProductCategoryService(
  id: string | number,
  trx?: Knex.Transaction
) {
  const toDelete = await db
    .table('product_category')
    .select('id', 'name', 'is_deleted')
    .where('id', id);

  const query = db.table('product_category').where('id', id).del();
  if (trx) query.transacting(trx);
  await query;

  return toDelete[0] || null;
}

export async function deleteManyProductCategoriesService(
  ids: string[],
  trx?: Knex.Transaction
) {
  const toDelete = await db
    .table('product_category')
    .select('*')
    .whereIn('id', ids);

  const query = db.table('product_category').whereIn('id', ids).del();
  if (trx) query.transacting(trx);
  await query;

  return toDelete;
}

export async function softDeleteOneProductCategoryService(
  id: string | number,
  trx?: Knex.Transaction
) {
  const query = db
    .table('product_category')
    .update({ is_deleted: true })
    .where('id', id);

  if (trx) query.transacting(trx);
  await query;

  const toDelete = await db
    .table('product_category')
    .select('id', 'name', 'is_deleted')
    .where('id', id);

  return toDelete[0] || null;
}

export async function softDeleteManyProductCategoriesService(
  ids: string[] | number[],
  trx?: Knex.Transaction
) {
  const query = db
    .table('product_category')
    .update({ is_deleted: true })
    .whereIn('id', ids);
  if (trx) query.transacting(trx);
  await query;

  const toDelete = await db
    .table('product_category')
    .select('id', 'name', 'is_deleted')
    .whereIn('id', ids);

  return toDelete || null;
}

export async function getExistingProductCategoryService(
  data: Record<string, unknown>
) {
  const product_category = await db
    .table('product_category')
    .select('id', 'name', 'is_deleted')
    .where(data);
  return product_category[0] || null;
}
