// import { Sequelize, Model, DataTypes } from "sequelize";
// import post from "./post";

// class Tag extends Model {
//   public id!: number;
//   public name!: string;
//   public createdAt!: Date;
//   public updatedAt!: Date;
//   static associate(models: any) {
//     // define association here

//     Tag.belongsToMany(models.post, {
//       through: models.posttags,
//       foreignKey: "tagId",
//     });
//   }
// }
// export default (sequelize: Sequelize, DataTypes: any) => {
//   Tag.init(
//     {
//       id: {
//         type: DataTypes.INTEGER,
//         primaryKey: true,
//         autoIncrement: true,
//       },
//       name: {
//         type: DataTypes.STRING,
//         allowNull: false,
//       },
//       createdAt: {
//         type: DataTypes.DATE,
//         allowNull: false,
//       },
//       updatedAt: {
//         type: DataTypes.DATE,
//         allowNull: false,
//       },
//     },
//     {
//       sequelize,
//       modelName: "Tag",
//     }
//   );
//   return Tag;
// };

import {
  Table,
  Column,
  Model,
  BelongsToMany,
  DataType,
} from "sequelize-typescript";
import Post from "./post"; // Assuming you have a Post model
import PostTags from "./posttags";

@Table({ tableName: "tags", timestamps: true }) // Define table name explicitly
class Tag extends Model {
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
  name!: string;

  // @BelongsToMany(() => Post, () => PostTags) // Define many-to-many association with Post model through PostTags
  // posts!: Post[];
}

export default Tag;
