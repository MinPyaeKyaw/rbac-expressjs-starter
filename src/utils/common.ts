import { ListQuery } from '../types/types';

export const base64Encode = (data: string): string => {
  return Buffer.from(data).toString('base64');
};

export const getPagination = ({
  page,
  size,
}: {
  page: number;
  size: number;
}) => {
  const limit = size;
  const offset = page * size;
  return { offset, limit };
};

// Reusable function to get paginated data
export async function getPaginatedData<T>(
  query: any,
  countQuery: any,
  filters: ListQuery,
  pagination?: { limit: number; offset: number }
): Promise<{
  data: T[];
  meta: {
    page: number;
    size: number;
    totalCount: number;
    totalPages: number;
  };
}> {
  // Execute the queries concurrently
  const [data, countResult]: any = await Promise.all([query, countQuery]);

  // Calculate pagination data
  const totalCount = countResult[0].count;
  let totalPages = 1;
  if (pagination) totalPages = Math.ceil(totalCount / pagination.limit || 1);

  // Return the paginated data with pagination information
  return {
    data,
    meta: {
      page: filters.page,
      size: filters.size,
      totalCount,
      totalPages,
    },
  };
}
