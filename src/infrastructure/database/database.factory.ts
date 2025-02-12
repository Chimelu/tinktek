import { startDBServer } from './sqldb.database';

export class DatabaseFactory {
  /**
   *
   * @param type - database type
   * @param modelRepo - this is the repo for each of the module
   * @param dataSource - dataSource is not needed for mongodb
   * @returns
   */
  static initDatabase(type: 'mongo' | 'mysql' | 'postgres' | string) {
    switch (type) {
      case 'postgres':
        return startDBServer();
      default:
        throw new Error('Unsupported database type');
    }
  }
}
