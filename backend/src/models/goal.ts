import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/db.js';


interface GoalAttributes {
  id: number;
  userId: number;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: Date;
}

type GoalCreationAttributes = Optional<GoalAttributes, 'id' | 'currentAmount' | 'deadline'>;

export class Goal extends Model<GoalAttributes, GoalCreationAttributes> implements GoalAttributes {
  public id!: number;
  public userId!: number;
  public title!: string;
  public targetAmount!: number;
  public currentAmount!: number;
  public deadline?: Date;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Goal.init(
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
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    targetAmount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    currentAmount: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    deadline: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Goal',
    tableName: 'goals',
  },
);
