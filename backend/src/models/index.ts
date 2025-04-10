import { User } from './user.js';
import { Transaction } from './transaction.js';
import { Goal } from './goal.js';
import { Budget } from './budget.js';
import { File } from './file.js';

User.hasMany(Transaction, { foreignKey: 'userId' });
Transaction.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Goal, { foreignKey: 'userId' });
Goal.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Budget, { foreignKey: 'userId' });
Budget.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(File, { foreignKey: 'userId' });
File.belongsTo(User, { foreignKey: 'userId' });

export { User, Transaction, Goal, Budget, File };
