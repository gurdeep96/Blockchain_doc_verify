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
import PostTags from "./posttags";
import Tag from "./tag";

@Table({
  tableName: "posts",
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
    allowNull: false,
  })
  userId!: number;

  @BelongsTo(() => User)
  user!: User;

  @BelongsToMany(() => Tag, () => PostTags) // Define many-to-many association with Tag model through PostTags
  tags!: Tag[];
}

export default Post;
