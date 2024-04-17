import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  BelongsToMany,
} from "sequelize-typescript";
import User from "./user"; // Assuming you have a User model

@Table({
  tableName: "documents",
  modelName: "Document",
  timestamps: true,
})
class Document extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  documentPath!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  hash!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  fileName!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  transactionId?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  mimeType?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  fileIdentifier?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  extension?: string;

  @Column({
    type: DataType.FLOAT,
    allowNull: true,
  })
  fileSizeMB?: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  issuer?: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  expiryDate?: Date;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userId: number | undefined;

  @BelongsTo(() => User, { onDelete: "CASCADE" })
  user!: User;
}

export default Document;
