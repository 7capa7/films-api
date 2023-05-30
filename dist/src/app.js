"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const config_1 = __importDefault(require("config"));
const body_parser_1 = __importDefault(require("body-parser"));
const db_config_1 = require("./db-config");
const logger_1 = require("./utils/logger");
const film_router_1 = __importDefault(require("./router/film.router"));
const favorites_router_1 = __importDefault(require("./router/favorites.router"));
const app = (0, express_1.default)();
const port = config_1.default.get("port");
db_config_1.dataSource
    .initialize()
    .then(() => {
    logger_1.log.info("Succesfully connected with database");
})
    .catch((err) => {
    logger_1.log.error(`Could not connect with database: ${err}`);
});
app.use(body_parser_1.default.json());
app.use(film_router_1.default);
app.use(favorites_router_1.default);
app.listen(port, () => __awaiter(void 0, void 0, void 0, function* () {
    logger_1.log.info(`App started at http://localhost:${port}`);
}));
