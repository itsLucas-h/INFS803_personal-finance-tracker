import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/db.js';

interface FileAttributes {
  id: number;
  userId: number;
  key: string;
  originalName: string;
  mimeType: string;
  size: number;
  downloadCount: number;
  createdAt?: Date;
  updatedAt?: Date;
}

type FileCreationAttributes = Optional<
  FileAttributes,
  'id' | 'downloadCount' | 'createdAt' | 'updatedAt'
>;

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
      comment: 'References the user who uploaded the file',
    },
    key: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'The unique S3 object key for the file',
    },
    originalName: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Original file name as uploaded by the user',
    },
    mimeType: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'The MIME type of the file',
    },
    size: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'File size in bytes',
    },
    downloadCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: 'Number of times the file has been viewed or downloaded',
    },
  },
  {
    sequelize,
    modelName: 'File',
    tableName: 'files',
    timestamps: true,
  },
);
