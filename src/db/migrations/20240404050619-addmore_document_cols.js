"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    await queryInterface.addColumn("documents", "fileSizeMB", {
      type: Sequelize.FLOAT,
      allowNull: true,
      after: "hash",
    });

    await queryInterface.addColumn("documents", "extension", {
      type: Sequelize.STRING,
      allowNull: true,
      after: "hash",
    });

    await queryInterface.addColumn("documents", "fileIdentifier", {
      type: Sequelize.STRING,
      allowNull: true,
      after: "hash",
    });

    await queryInterface.addColumn("documents", "mimeType", {
      type: Sequelize.STRING,
      allowNull: true,
      after: "hash",
    });

    await queryInterface.addColumn("documents", "transactionId", {
      type: Sequelize.STRING,
      allowNull: true,
      after: "hash",
    });

    await queryInterface.addColumn("documents", "fileName", {
      type: Sequelize.STRING,
      allowNull: false,
      after: "hash",
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn("documents", "fileSizeMB");
    await queryInterface.removeColumn("documents", "extension");
    await queryInterface.removeColumn("documents", "fileIdentifier");
    await queryInterface.removeColumn("documents", "mimeType");
    await queryInterface.removeColumn("documents", "transactionId");
    await queryInterface.removeColumn("documents", "fileName");
  },
};
