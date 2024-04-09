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
    config
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
    const model = (await import(path.join(__dirname, file))).default;
    db[model.name] = model;
    models.push(model);
    //model.init(db.sequelize); // Initialize the model with the Sequelize instance
    if (db[model.name].associate) {
      db[model.name].associate(db);
    }
  });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
