import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/db';
import { User } from './user';

interface TransactionAttributes {
  id: number;
  userId: number;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description?: string;
  date: Date;
}

export class Transaction
  extends Model<TransactionAttributes, Optional<TransactionAttributes, 'id'>>
  implements TransactionAttributes
{
  public id!: number;
  public userId!: number;
  public type!: 'income' | 'expense';
  public category!: string;
  public amount!: number;
  public description?: string;
  public date!: Date;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Transaction.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('income', 'expense'),
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'transactions',
    modelName: 'Transaction',
  },
);

Transaction.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(Transaction, { foreignKey: 'userId', as: 'transactions' });
