import express, { Express, Request, Response } from "express";
import * as dotenv from "dotenv";
import db from "./models/index";
import userRouter from "./routes/user.route";
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(userRouter);

db.sequelize.authenticate().then(() => {});
db.sequelize.sync().then(() => {
  console.log("connected db");
});
app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
