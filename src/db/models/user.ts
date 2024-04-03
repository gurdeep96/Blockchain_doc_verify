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
import Post from "./document";

@Table({
  timestamps: true,
  tableName: "users", // Specify the table name explicitly
  modelName: "User",
})
class User extends Model {
  // @PrimaryKey
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
    allowNull: false,
  })
  role!: string;

  @HasMany(() => Post)
  posts!: Post[];
}

export default User;
