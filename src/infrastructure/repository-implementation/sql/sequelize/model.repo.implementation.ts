import {
  Model,
  Sequelize,
  Transaction,
  WhereOptions,
  FindOptions,
  ModelStatic,
  Attributes,
  Op,
} from 'sequelize';
import {
  IDataAccessRepo,
  PaginateOptions,
  PaginationResult,
} from '../../../../core/repositories/dataAccess.repository';
import { MakeNullishOptional } from 'sequelize/types/utils';

export class SequelizeBaseRepo<T extends Model> implements IDataAccessRepo<T> {
  private model: ModelStatic<T>;
  private sequelize: Sequelize;

  constructor(model: ModelStatic<T>, sequelize: Sequelize) {
    this.model = model;
    this.sequelize = sequelize;
  }
  async create(data: Partial<T>): Promise<T> {
    return (await this.model.create(
      data as MakeNullishOptional<T['_creationAttributes']>,
    )) as T;
  }

  async createMany(data: Partial<T>[]): Promise<T[]> {
    return (await this.model.bulkCreate(
      data as MakeNullishOptional<T['_creationAttributes']>[],
    )) as T[];
  }

  async findOne(
    query: Partial<T>,
    options?: {
      populate?: string[];
      select?: string[];
      lean?: boolean;
    },
  ): Promise<T | null> {
    const findOptions: FindOptions = {
      where: query,
      attributes: options?.select,
      include: options?.populate,
    };
    return (await this.model.findOne(findOptions)) as T | null;
  }

  async find(
    query: Partial<T>,
    options?: {
      populate?: string[];
      select?: string[];
      lean?: boolean;
      sort?: Record<string, number>;
      limit?: number;
      skip?: number;
    },
  ): Promise<T[]> {
    const findOptions: FindOptions = {
      where: query,
      attributes: options?.select,
      include: options?.populate,
      limit: options?.limit,
      offset: options?.skip,
      order: options?.sort
        ? Object.entries(options.sort).map(([key, val]) => [
            key,
            val > 0 ? 'ASC' : 'DESC',
          ])
        : undefined,
    };
    return (await this.model.findAll(findOptions)) as T[];
  }

  async findById(
    id: string,
    options?: {
      populate?: string[];
      select?: string[];
      lean?: boolean;
    },
  ): Promise<T | null> {
    return this.findOne({ id } as unknown as Partial<T>, options);
  }

  async updateOne(
    query: Partial<T>,
    data: Partial<T>,
    options?: {
      upsert?: boolean;
      returnOriginal?: boolean;
      runValidators?: boolean;
    },
  ): Promise<T | null> {
    const [affectedRows, updatedRows] = await this.model.update(data, {
      where: query as unknown as WhereOptions<Attributes<T>>,
      returning: true,
    });

    return affectedRows > 0 ? (updatedRows[0] as T) : null;
  }

  async upsert(
    query: Partial<T>,
    data: Partial<T>,
    options?: {
      upsert?: boolean;
      returnOriginal?: boolean;
      runValidators?: boolean;
    },
  ): Promise<T | null> {
    const mergedData = { ...query, ...data };
    const [record, created] = await this.model.upsert(
      mergedData as MakeNullishOptional<T['_creationAttributes']>,
      {
        returning: true,
      },
    );

    return record ? (record as T) : null;
  }

  async updateMany(
    query: Partial<T>,
    data: Partial<T>,
    options?: {
      upsert?: boolean;
      runValidators?: boolean;
    },
  ): Promise<{ modifiedCount: number }> {
    const [modifiedCount] = await this.model.update(data, {
      where: query as unknown as WhereOptions<Attributes<T>>,
    });
    return { modifiedCount };
  }

  async deleteOne(query: Partial<T>): Promise<{ deletedCount: number }> {
    const deletedCount = await this.model.destroy({
      where: query as unknown as WhereOptions<Attributes<T>>,
      limit: 1,
    });
    return { deletedCount };
  }

  async deleteMany(query: Partial<T>): Promise<{ deletedCount: number }> {
    const deletedCount = await this.model.destroy({
      where: query as unknown as WhereOptions<Attributes<T>>,
    });
    return { deletedCount };
  }

  async count(query: Partial<T>): Promise<number> {
    return await this.model.count({
      where: query as unknown as WhereOptions<Attributes<T>>,
    });
  }

  async exists(query: Partial<T>): Promise<boolean> {
    const count = await this.model.count({
      where: query as unknown as WhereOptions<Attributes<T>>,
    });
    return count > 0;
  }

  async paginate(
    options: PaginateOptions & { filters?: Record<string, any> },
  ): Promise<PaginationResult<T>> {
    const {
      limit,
      offset,
      orderBy,
      orderDirection,
      search,
      searchFields,
      filters,
    } = options;

    const where: any = { ...filters };

    if (search && searchFields) {
      where[Op.or] = searchFields.map((field) => ({
        [field as keyof Model]: {
          [Op.like]: `%${search}%`,
        },
      }));
    }

    const result = await this.model.findAndCountAll({
      where,
      limit,
      offset,
      order: orderBy ? [[orderBy, orderDirection || 'ASC']] : undefined,
    });

    const totalDocs = result.count;
    const totalPages = Math.ceil(totalDocs / limit);
    const page = Math.floor(offset / limit) + 1;

    return {
      docs: result.rows,
      totalDocs,
      limit,
      page,
      totalPages,
      hasNextPage: page < totalPages,
      nextPage: page < totalPages ? page + 1 : null,
      hasPrevPage: page > 1,
      prevPage: page > 1 ? page - 1 : null,
      pagingCounter: offset + 1,
    };
  }

  async aggregate(pipeline: any[]): Promise<any[]> {
    throw new Error(
      'Aggregate is not supported in Sequelize directly. Use raw queries if needed.',
    );
  }

  async startTransaction(): Promise<Transaction> {
    return await this.sequelize.transaction();
  }

  async commitTransaction(transaction: Transaction): Promise<void> {
    await transaction.commit();
  }

  async rollbackTransaction(transaction: Transaction): Promise<void> {
    await transaction.rollback();
  }

  async softDelete(query: Partial<T>): Promise<{ modifiedCount: number }> {
    const [modifiedCount] = await this.model.update(
      { deletedAt: new Date() },
      {
        where: query as unknown as WhereOptions<Attributes<T>>,
      },
    );
    return { modifiedCount };
  }

  async restoreDeleted(query: Partial<T>): Promise<{ modifiedCount: number }> {
    const [modifiedCount] = await this.model.update(
      { deletedAt: null },
      {
        where: query as unknown as WhereOptions<Attributes<T>>,
      },
    );
    return { modifiedCount };
  }

  async bulkWrite(
    operations: Array<{
      insertOne?: { document: Partial<T> };
      updateOne?: { filter: Partial<T>; update: Partial<T> };
      deleteOne?: { filter: Partial<T> };
    }>,
  ): Promise<{
    insertedCount?: number;
    modifiedCount?: number;
    deletedCount?: number;
  }> {
    throw new Error(
      'Bulk operations are not natively supported in Sequelize. Use transactions or raw queries.',
    );
  }
}
