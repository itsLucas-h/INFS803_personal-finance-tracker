import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/db.js';

interface BudgetAttributes {
  id: number;
  userId: number;
  month: string;
  category: string;
  amount: number;
}

type BudgetCreationAttributes = Optional<BudgetAttributes, 'id'>;

export class Budget
  extends Model<BudgetAttributes, BudgetCreationAttributes>
  implements BudgetAttributes
{
  public id!: number;
  public userId!: number;
  public month!: string;
  public category!: string;
  public amount!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Budget.init(
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
    month: {
      type: DataTypes.STRING,
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
  },
  {
    sequelize,
    modelName: 'Budget',
    tableName: 'budgets',
  },
);
