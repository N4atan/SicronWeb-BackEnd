
import { AppDataSource } from "./config/data-source";
import UserRoutes from './routers/UserRoutes';
import * as dotenv from "dotenv";
import cors from 'cors';
import express, { Application } from 'express';

const app: Application = express();
const port: number = Number(process.env.PORT) || 3000;

app.use(express.json());
app.use(cors());

app.use("/api", UserRoutes);

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Error during Data Source initialization:", err);
  });