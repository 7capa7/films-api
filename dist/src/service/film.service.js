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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFilm = exports.saveFilm = exports.checkIfFilmExist = void 0;
const Film_1 = require("../entity/Film");
function checkIfFilmExist(filmData) {
    return __awaiter(this, void 0, void 0, function* () {
        const repository = Film_1.Film.getRepository();
        const film = yield repository.findOne({
            where: { episode_id: filmData.episode_id },
        });
        return film != null;
    });
}
exports.checkIfFilmExist = checkIfFilmExist;
function saveFilm(filmData, characters) {
    return __awaiter(this, void 0, void 0, function* () {
        const film = Film_1.Film.create({
            episode_id: filmData.episode_id,
            release_date: filmData.release_date,
            title: filmData.title,
            characters: characters,
        });
        return yield film.save();
    });
}
exports.saveFilm = saveFilm;
function getFilm(filmData) {
    return __awaiter(this, void 0, void 0, function* () {
        const repository = Film_1.Film.getRepository();
        return yield repository.findOne({
            where: { episode_id: filmData.episode_id },
            relations: ["characters"],
        });
    });
}
exports.getFilm = getFilm;
