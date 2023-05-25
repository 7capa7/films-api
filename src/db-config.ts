import { DataSource } from "typeorm";
import config from "config";

export const dataSource = new DataSource({
  type: "postgres",
  database: config.get("dbName"),
  username: config.get("dbUsername"),
  password: config.get("dbPassword"),
  host: config.get("dbHost"),
  port: config.get("dbPort"),
  synchronize: true,
  entities: [],
});
