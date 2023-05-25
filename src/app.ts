import express from "express";
import dotenv from "dotenv";
dotenv.config();
import config from "config";
import bodyParser from "body-parser";
import { dataSource } from "./db-config";
import { log } from "./utils/logger";
import filmRouter from "./router/film.router";

const app = express();
const port = config.get("port");

dataSource
  .initialize()
  .then(() => {
    log.info("Succesfully connected with database");
  })
  .catch((err) => {
    log.error(`Could not connect with database: ${err}`);
  });

app.use(bodyParser.json());
app.use(filmRouter);

app.listen(port, async () => {
  log.info(`App started at http://localhost:${port}`);
});
