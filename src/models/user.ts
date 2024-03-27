// "use strict";
// import { ModelStatic, Model } from "sequelize";
// import { Sequelize } from "sequelize-typescript";
// import post from "./post";

// class user extends Model {
//   /**
//    * Helper method for defining associations.
//    * This method is not a part of Sequelize lifecycle.
//    * The `models/index` file will call this method automatically.
//    */
//   static associate(models: any) {
//     // define association here
//     user.hasMany(models.post, {
//       foreignKey: "userId",
//     });
//   }
// }

// export default (sequelize: Sequelize, DataTypes: any) => {
//   user.init(
//     {
//       firstName: DataTypes.STRING,
//       lastName: DataTypes.STRING,
//       email: DataTypes.STRING,
//     },
//     {
//       sequelize,
//       modelName: "user",
//     }
//   );
//   return user;
// };

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
import Post from "./post";

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

  @HasMany(() => Post)
  posts!: Post[];
}

export default User;
