import express, { Express, Request, Response } from "express";
import * as dotenv from "dotenv";
import db from "./db/models/index";
import userRouter from "./routes/user.route";
import PostRouter from "./routes/document.route";
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(userRouter);
app.use(PostRouter);

db.sequelize.authenticate().then(() => {
  console.log("Successfully connected to DB!");
});
db.sequelize.sync().then(() => {
  console.log("synced db");
});
app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
