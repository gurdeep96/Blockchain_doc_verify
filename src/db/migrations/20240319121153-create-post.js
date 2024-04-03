"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("documents", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      title: {
        type: Sequelize.STRING,
      },
      documentPath: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      hash: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      issuer: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
        references: {
          model: "users",
          key: "id",
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("documents");
  },
};
