"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.getFavoritesAsExcel = exports.getFavoritesWithGivenId = exports.getFavorites = exports.createFavorites = void 0;
const swapi_service_1 = require("../service/swapi.service");
const characters_service_1 = require("../service/characters.service");
const film_service_1 = require("../service/film.service");
const favorites_service_1 = require("../service/favorites.service");
const exceljs = __importStar(require("exceljs"));
function createFavorites(req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { listName, movieIds } = req.body;
            if (!listName ||
                !movieIds ||
                !Array.isArray(movieIds) ||
                !movieIds.every((id) => typeof id === "number")) {
                return res
                    .status(400)
                    .json({ message: "Invalid data", code: 400 })
                    .send();
            }
            const fetchedFilms = yield (0, swapi_service_1.fetchFilms)(true);
            const films = fetchedFilms.filter((film) => movieIds.includes(film.episode_id));
            const favorites = { listName, films };
            const savedFilms = [];
            for (const film of favorites.films) {
                const allCharacters = (_a = film.characters) !== null && _a !== void 0 ? _a : [];
                const characters = yield createOrUpdateCharacters(allCharacters);
                const savedFilm = yield createOrUpdateFilm(film, characters);
                if (savedFilm) {
                    savedFilms.push(savedFilm);
                }
            }
            const savedFavorites = yield (0, favorites_service_1.saveFavorites)(savedFilms, listName);
            return res.status(200).json(savedFavorites).send();
        }
        catch (error) {
            return res
                .status(500)
                .json({ message: "Internal server error", code: 500 });
        }
    });
}
exports.createFavorites = createFavorites;
function getFavorites(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const listName = req.query.listName;
            const page = Number(req.params.page) || 1;
            const favorites = yield (0, favorites_service_1.getAllFavorites)(page, listName);
            let next = null;
            if ((yield (0, favorites_service_1.getAllFavorites)(page + 1, listName)).length > 0)
                next = page + 1;
            return res
                .status(200)
                .json(Object.assign(Object.assign({}, (next !== null && { next })), { favorites }))
                .send();
        }
        catch (error) {
            return res
                .status(500)
                .json({ message: "Internal server error", code: 500 });
        }
    });
}
exports.getFavorites = getFavorites;
function getFavoritesWithGivenId(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const favoritesId = req.params.id;
            const favorites = yield (0, favorites_service_1.getFavoritesById)(favoritesId);
            if (favorites) {
                return res.status(200).json(favorites).send();
            }
            else {
                return res
                    .status(404)
                    .json({ message: "Favorites not found", code: 404 })
                    .send();
            }
        }
        catch (error) {
            return res
                .status(500)
                .json({ message: "Internal server error", code: 500 });
        }
    });
}
exports.getFavoritesWithGivenId = getFavoritesWithGivenId;
function getFavoritesAsExcel(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.params.id;
        try {
            const favorites = yield (0, favorites_service_1.getFavoritesById)(id);
            if (!favorites) {
                return res
                    .status(404)
                    .json({ message: "Favorites not found", code: 404 })
                    .send();
            }
            const workbook = new exceljs.Workbook();
            const worksheet = workbook.addWorksheet("Favorites");
            worksheet.getCell("A1").value = "Characters";
            worksheet.getCell("B1").value = "Movie Titles";
            let row = 2;
            const charactersSet = new Set();
            favorites.films.forEach((film) => {
                film.characters.forEach((character) => {
                    charactersSet.add(character.name);
                });
            });
            const charactersArray = Array.from(charactersSet);
            charactersArray.forEach((character) => {
                worksheet.getCell(`A${row}`).value = character;
                row++;
            });
            const movieTitles = favorites.films.map((film) => film.title).join(", ");
            worksheet.getCell(`B2`).value = movieTitles;
            worksheet.getColumn("A").width = 20;
            worksheet.getColumn("B").width = 20 * favorites.films.length;
            const buffer = yield workbook.xlsx.writeBuffer();
            res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            res.setHeader("Content-Disposition", `attachment; filename=${id}.xlsx`);
            res.send(buffer);
        }
        catch (error) {
            return res
                .status(500)
                .json({ message: "Internal server error", code: 500 });
        }
    });
}
exports.getFavoritesAsExcel = getFavoritesAsExcel;
const createOrUpdateCharacters = (characterNames) => __awaiter(void 0, void 0, void 0, function* () {
    const uniqueCharacterNames = [...new Set(characterNames)];
    const characters = [];
    yield Promise.all(uniqueCharacterNames.map((name) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (!(yield (0, characters_service_1.checkIfCharacterExist)(name))) {
                characters.push(yield (0, characters_service_1.createCharacter)(name));
            }
            else {
                const character = yield (0, characters_service_1.getCharacter)(name);
                if (character) {
                    characters.push(character);
                }
            }
        }
        catch (error) { }
    })));
    return characters;
});
const createOrUpdateFilm = (filmData, charactersData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!(yield (0, film_service_1.checkIfFilmExist)(filmData))) {
            return yield (0, film_service_1.saveFilm)(filmData, charactersData);
        }
        else {
            return yield (0, film_service_1.getFilm)(filmData);
        }
    }
    catch (error) { }
});
