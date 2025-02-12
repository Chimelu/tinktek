import { Model, Sequelize } from 'sequelize';
import { IDataAccessRepo } from '../../core/repositories/dataAccess.repository';
import { SequelizeBaseRepo } from './sql/sequelize/model.repo.implementation';

export class RepositoryFactory {
  /**
   *
   * @param type - database type
   * @param modelRepo - this is the repo for each of the module
   * @returns
   */
  static setRepository<T extends Document>(
    type: 'mongo' | 'mysql' | 'postgres' | string,
    model: Model<T> | any,
    alias: string | Sequelize,
  ): IDataAccessRepo {
    switch (type) {
      case 'postgres':
        return new SequelizeBaseRepo(model, alias as Sequelize);
      default:
        throw new Error('Unsupported database type');
    }
  }
}
