"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dataSource = void 0;
const typeorm_1 = require("typeorm");
const config_1 = __importDefault(require("config"));
const Character_1 = require("./entity/Character");
const Film_1 = require("./entity/Film");
const Favorites_1 = require("./entity/Favorites");
exports.dataSource = new typeorm_1.DataSource({
    type: "postgres",
    database: config_1.default.get("dbName"),
    username: config_1.default.get("dbUsername"),
    password: config_1.default.get("dbPassword"),
    host: config_1.default.get("dbHost"),
    port: config_1.default.get("dbPort"),
    synchronize: true,
    dropSchema: true,
    entities: [Character_1.Character, Film_1.Film, Favorites_1.Favorites],
});
