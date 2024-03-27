// import { Sequelize, Model, DataTypes } from "sequelize";

// interface PostTagsAttributes {
//   id: number;
//   postId: number;
//   tagId: number;
//   createdAt: Date;
//   updatedAt: Date;
// }

// class posttags extends Model<PostTagsAttributes> {
//   public id!: number;
//   public postId!: number;
//   public tagId!: number;
//   public createdAt!: Date;
//   public updatedAt!: Date;
//   static associate(models: any) {
//     // define association here
//   }
// }
// export default (sequelize: Sequelize, DataTypes: any) => {
//   posttags.init(
//     {
//       id: {
//         type: DataTypes.INTEGER,
//         primaryKey: true,
//         autoIncrement: true,
//       },
//       postId: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
//         references: {
//           model: "Post", // Assuming your post model name is Posts
//           key: "id",
//         },
//         onUpdate: "CASCADE",
//         onDelete: "CASCADE",
//       },
//       tagId: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
//         references: {
//           model: "Tags",
//           key: "id",
//         },
//         onUpdate: "CASCADE",
//         onDelete: "CASCADE",
//       },
//       createdAt: {
//         type: DataTypes.DATE,
//         allowNull: false,
//         defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
//       },
//       updatedAt: {
//         type: DataTypes.DATE,
//         allowNull: false,
//         defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
//       },
//     },
//     {
//       sequelize,
//       modelName: "posttags",
//     }
//   );
//   return posttags;
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
import Post from "./post";
import Tag from "./tag";

@Table({ tableName: "posttags", timestamps: true })
class PostTags extends Model {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  id!: number;

  @ForeignKey(() => Post)
  @Column({ type: DataType.INTEGER, allowNull: false })
  postId!: number;

  @ForeignKey(() => Tag)
  @Column({ type: DataType.INTEGER, allowNull: false })
  tagId!: number;
}
export default PostTags;
