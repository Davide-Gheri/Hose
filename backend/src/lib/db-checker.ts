import Config from 'config';

/**
 * Some methods are different between database connection types, this class handles all the supported possibilities
 */
export class DbChecker {
  static type: 'mysql' | 'sqlite' | 'postgres' = Config.get('database.type');

  /**
   * Get raw query to disable foreign keys check (useful when seeding)
   */
  public static disableFkCheck() {
    switch (this.type) {
      case 'mysql':
        return 'SET FOREIGN_KEY_CHECKS=0;';
      case 'sqlite':
        return 'PRAGMA foreign_keys = OFF';
      case 'postgres':
        return 'SET session_replication_role = \'replica\';';
    }
  }

  /**
   * Get raw query to enable foreign keys check (useful when seeding)
   */
  public static enableFkCheck() {
    switch (this.type) {
      case 'mysql':
        return 'SET FOREIGN_KEY_CHECKS=1;';
      case 'sqlite':
        return 'PRAGMA foreign_keys = ON';
      case 'postgres':
        return 'SET session_replication_role = \'origin\';';
    }
  }
}
