import { DataSource } from "typeorm";
import config from "config";
import { Character } from "./entity/Character";
import { Film } from "./entity/Film";
import { Favorites } from "./entity/Favorites";

export const dataSource = new DataSource({
  type: "postgres",
  database: config.get("dbName"),
  username: config.get("dbUsername"),
  password: config.get("dbPassword"),
  host: config.get("dbHost"),
  port: config.get("dbPort"),
  synchronize: true,
  dropSchema: true,
  entities: [Character, Film, Favorites],
});
