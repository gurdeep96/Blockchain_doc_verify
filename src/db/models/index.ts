import * as fs from "fs";
import * as path from "path";
import * as Sequelize from "sequelize-typescript";
import Document from "./document";
import User from "./user";
// import { sequelize } from "../db/connection";

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require(path.join(__dirname + "/../config/config.js"))[env];
const db: { [key: string]: any } = {}; // Use an indexed object type for db

interface SequelizeInstance extends Sequelize.Sequelize {} // Define an interface for Sequelize with potential extensions
let sequelize: SequelizeInstance | null = null;
if (config.use_env_variable) {
  sequelize = new Sequelize.Sequelize(
    process.env[config.use_env_variable] as any,
    config
  );
} else {
  sequelize = new Sequelize.Sequelize(
    config.database,
    config.username,
    config.password,
    {
      dialect: config.dialect,
      logging: true,
      host: config.host,

      pool: {
        max: 50,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
    }
  );
}
sequelize.addModels([User, Document]);

const models: any[] = [];
fs.readdirSync(__dirname)
  .filter(
    (file) =>
      file !== basename &&
      file.slice(-3) === ".js" &&
      file.indexOf(".test.js") === -1
  )
  .forEach(async (file) => {
    try {
      const model = (await import(path.join(__dirname, file))).default;
      db[model.name] = model;
      models.push(model);
      //model.init(db.sequelize); // Initialize the model with the Sequelize instance
      if (db[model.name].associate) {
        db[model.name].associate(db);
      }
    } catch (error: any) {
      if (error instanceof Error && error.name === "SequelizeConnectionError") {
        console.error("Error connecting to database:", error);
        // Throw a custom error or return an error object here
        throw new Error("Invalid database credentials provided!");
      } else {
        console.error(`Error importing/associating model ${file}`, error);
      }
    }
  });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
