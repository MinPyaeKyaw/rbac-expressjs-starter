import { Knex } from 'knex';
import db from '../../db/db';
import redisClient, { invalidateCache } from '../../external-services/redis';
import { getPaginatedData, getPagination } from '../../utils/common';
import { ListQuery } from '../../types/types';

const CACHE_TTL = 3600;
const CACHE_KEY = 'cached_product_category';

export async function getAllCachedProductCategoriesService(filters: ListQuery) {
  // Try to get from cache first
  const cachedData = await redisClient.get(CACHE_KEY);
  if (cachedData) {
    return JSON.parse(cachedData);
  }

  // If not in cache, fetch from database
  const query = db
    .table('product_category')
    .select(
      'product_category.id',
      'product_category.name',
      'product_category.is_deleted'
    );
  const totalCountQuery = db.table('product_category').count('* as count');

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
    query.orderBy('product_category.created_at', 'desc');
  }

  if (filters.keyword) {
    query.whereILike('product_category.name', `%${filters.keyword}%`);
    totalCountQuery.whereILike('product_category.name', `%${filters.keyword}%`);
  }

  const result = await getPaginatedData(
    query,
    totalCountQuery,
    filters,
    pagination
  );

  // Store in cache
  await redisClient.setex(CACHE_KEY, CACHE_TTL, JSON.stringify(result));

  return result;
}

export async function getOneCachedProductCategoryService(id: string | number) {
  // If not in cache, fetch from database
  const product_category = await db
    .table('product_category')
    .select('id', 'name', 'is_deleted')
    .where('id', id);

  const result = product_category[0] || null;

  return result;
}

export async function createOneCachedProductCategoryService(
  data: Record<string, unknown>,
  trx?: Knex.Transaction
) {
  const query = db.table('product_category').insert(data);
  if (trx) query.transacting(trx);
  await query;

  // Invalidate cache after creation
  await invalidateCache(CACHE_KEY);

  return data;
}

export async function createManyCachedProductCategoriesService(
  data: Record<string, unknown>[],
  trx?: Knex.Transaction
) {
  const query = db.table('product_category').insert(data);
  if (trx) query.transacting(trx);
  await query;

  // Invalidate cache after creation
  await invalidateCache(CACHE_KEY);

  return data;
}

export async function updateOneCachedProductCategoryService(
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
  await query;

  // Invalidate cache after update
  await invalidateCache(CACHE_KEY);

  return query;
}

export async function deleteOneCachedProductCategoryService(
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

  // Invalidate cache after deletion
  await invalidateCache(CACHE_KEY);

  return toDelete[0] || null;
}

export async function deleteManyCachedProductCategoriesService(
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

  // Invalidate cache after deletion
  await invalidateCache(CACHE_KEY);

  return toDelete;
}

export async function softDeleteOneCachedProductCategoryService(
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

  // Invalidate cache after soft deletion
  await invalidateCache(CACHE_KEY);

  return toDelete[0] || null;
}

export async function softDeleteManyCachedProductCategoriesService(
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

  // Invalidate cache after soft deletion
  await invalidateCache(CACHE_KEY);

  return toDelete || null;
}

export async function getExistingCachedProductCategoryService(
  data: Record<string, unknown>
) {
  const product_category = await db
    .table('product_category')
    .select('id', 'name', 'is_deleted')
    .where(data);
  return product_category[0] || null;
}

// Cache management functions
export async function clearProductCategoryCache() {
  await invalidateCache(CACHE_KEY);
  return { message: 'Product category cache cleared successfully' };
}

export async function getProductCategoryCacheStats() {
  const keys = await redisClient.keys(`${CACHE_KEY}:*`);
  const stats = {
    totalKeys: keys.length,
    listKeys: keys.filter((key) => key.includes(':list:')).length,
    detailKeys: keys.filter((key) => key.includes(':detail:')).length,
  };
  return stats;
}
