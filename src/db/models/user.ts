import {
  Model,
  Table,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
  PrimaryKey,
} from "sequelize-typescript";
import Document from "./document";

@Table({
  timestamps: true,
  tableName: "users", // Specify the table name explicitly
  modelName: "User",
})
class User extends Model {
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
  firstName!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  lastName!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  email!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    defaultValue: "user",
  })
  role?: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  active?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  token?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  accountAddress?: string;

  @HasMany(() => Document)
  documents!: Document[];
}

export default User;
