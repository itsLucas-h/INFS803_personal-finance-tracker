import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/db';

interface FileAttributes {
  id: number;
  userId: number;
  key: string;
  originalName: string;
  mimeType: string;
  size: number;
  downloadCount: number;
}

type FileCreationAttributes = Optional<FileAttributes, 'id' | 'downloadCount'>;

export class File extends Model<FileAttributes, FileCreationAttributes> implements FileAttributes {
  public id!: number;
  public userId!: number;
  public key!: string;
  public originalName!: string;
  public mimeType!: string;
  public size!: number;
  public downloadCount!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

File.init(
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
    key: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    originalName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mimeType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    size: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    downloadCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    tableName: 'files',
    modelName: 'File',
  },
);
