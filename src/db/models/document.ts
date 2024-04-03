// import { Model, DataTypes } from "sequelize";
// import { Sequelize } from "sequelize-typescript";

// interface PostAttributes {
//   title: string;
//   content: string;
//   userId: number;
// }

// class post extends Model<PostAttributes> {
//   public title!: string;
//   public content!: string;
//   public userId!: number;

//   static associate(models: any) {
//     // Define association here

//     post.belongsTo(models.user, { foreignKey: "userId" });
//     post.belongsToMany(models.post, {
//       through: models.PostTags,
//       foreignKey: "postId",
//     });
//   }
// }

// export default (sequelize: Sequelize, DataTypes: any) => {
//   post.init(
//     {
//       title: DataTypes.STRING,
//       content: DataTypes.STRING,
//       userId: {
//         type: DataTypes.INTEGER,
//         references: {
//           model: "User",
//           key: "id",
//         },
//       },
//     },
//     {
//       sequelize,
//       modelName: "post",
//     }
//   );

//   return post;
// };

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
  timestamps: true, // Specify the table name explicitly
})
class Post extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  content!: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  userId: number | undefined;

  @BelongsTo(() => User, { onDelete: "CASCADE" })
  user!: User;
}

export default Post;
