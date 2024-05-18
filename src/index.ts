import express, { Express, NextFunction, Request, Response } from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import userRouter from "./routes/user.route";
import PostRouter from "./routes/document.route";
import "reflect-metadata";

dotenv.config();
import db from "./db/models/index";
import swaggerDocs from "./utils/swagger";

const app: Express = express();
const port = process.env.PORT;

function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error(err); // Log the error to the console for debugging
  res.status(500).json({ error: "Internal Server Error" }); // Send a generic error response
}

const corsOptions = {
  origin: '*',
  credentials: true,
  maxAge: 86400,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(userRouter);
app.use(PostRouter);
app.use(errorHandler);

db.sequelize
  .authenticate()
  .then(() => {
    console.log("Successfully connected to DB!");
  })
  .catch((error: Error) => {
    console.error("Unable to connect to the database:", error);
  });

db.sequelize.sync().then(() => {
  console.log("synced db");
});
app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
  swaggerDocs(app, port);
});
