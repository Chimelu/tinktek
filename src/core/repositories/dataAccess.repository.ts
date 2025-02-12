// Sort Order Type
export type SortOrder = "ASC" | "DESC";

export interface PaginateOptions {
  searchFields?: string[];
  limit: number;
  offset: number;
  search?: string;
  fromDate?: string;
  toDate?: string;
  orderBy?: string;
  orderDirection?: SortOrder;
  [key: string]: any;
}

export interface PaginationResult<T> {
  docs: T[] | any;
  totalDocs: number;
  limit: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  nextPage: number | null | undefined;
  hasPrevPage: boolean;
  prevPage: number | null | undefined;
  pagingCounter: number;
}

export interface IDataAccessRepo<T = any> {
  // Basic CRUD Operations
  create(data: Partial<T>): Promise<T>;
  createMany?(data: Partial<T>[]): Promise<T[]>;

  findOne(
    query: Partial<T>,
    options?: {
      populate?: string[];
      select?: string[];
      lean?: boolean;
    }
  ): Promise<T | null>;

  find(
    query: Partial<T>,
    options?: {
      populate?: string[];
      select?: string[];
      lean?: boolean;
      sort?: Record<string, number>;
      limit?: number;
      skip?: number;
    }
  ): Promise<T[]>;

  findById(
    id: string,
    options?: {
      populate?: string[];
      select?: string[];
      lean?: boolean;
    }
  ): Promise<T | null>;

  // Update Operations
  updateOne(
    query: Partial<T>,
    data: Partial<T>,
    options?: {
      upsert?: boolean;
      returnOriginal?: boolean;
      runValidators?: boolean;
    }
  ): Promise<T | null>;

  upsert(
    query: Partial<T>,
    data: Partial<T>,
    options?: {
      upsert?: boolean;
      returnOriginal?: boolean;
      runValidators?: boolean;
    }
  ): Promise<T | null>;

  updateMany(
    query: Partial<T>,
    data: Partial<T>,
    options?: {
      upsert?: boolean;
      runValidators?: boolean;
    }
  ): Promise<{ modifiedCount: number }>;

  // Delete Operations
  deleteOne(query: Partial<T>): Promise<{ deletedCount: number }>;
  deleteMany(query: Partial<T>): Promise<{ deletedCount: number }>;

  // Advanced Query Methods
  count?(query: Partial<T>): Promise<number>;

  exists?(query: Partial<T>): Promise<boolean>;

  // Updated Pagination Method
  paginate(
    options: PaginateOptions & {
      filters?: Record<string, any>;
    }
  ): Promise<PaginationResult<T>>;

  // Aggregate Methods (optional, as implementation varies by ORM)
  aggregate?(pipeline: any[]): Promise<any[]>;

  // Transaction Support (optional)
  startTransaction?(): Promise<any>;
  commitTransaction?(transaction: any): Promise<void>;
  rollbackTransaction?(transaction: any): Promise<void>;

  // Soft Delete Support
  softDelete?(query: Partial<T>): Promise<{ modifiedCount: number }>;
  restoreDeleted?(query: Partial<T>): Promise<{ modifiedCount: number }>;

  // Bulk Operations
  bulkWrite?(
    operations: Array<{
      insertOne?: { document: Partial<T> };
      updateOne?: { filter: Partial<T>; update: Partial<T> };
      deleteOne?: { filter: Partial<T> };
    }>
  ): Promise<{
    insertedCount?: number;
    modifiedCount?: number;
    deletedCount?: number;
  }>;
}

