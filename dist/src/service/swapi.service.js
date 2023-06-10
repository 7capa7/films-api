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
exports.fetchFilms = void 0;
const axios_1 = __importDefault(require("axios"));
function fetchFilms(characters) {
    return __awaiter(this, void 0, void 0, function* () {
        const apiData = (yield axios_1.default.get("https://swapi.dev/api/films/")).data
            .results;
        const films = yield mapApiResponseToFilms(apiData, characters, fetchCharacters);
        return films;
    });
}
exports.fetchFilms = fetchFilms;
const mapApiResponseToFilms = (apiData, chars, fetchCharacters) => __awaiter(void 0, void 0, void 0, function* () {
    const charactersApi = yield fetchCharacters(chars);
    const films = apiData.map((e) => {
        const characterUrls = e.characters;
        const charactersFiltered = charactersApi.filter((item) => characterUrls.includes(item.url));
        const characters = charactersFiltered.map((item) => item.name);
        const { episode_id, release_date, title } = e;
        return Object.assign({ episode_id,
            release_date,
            title }, (chars && { characters }));
    });
    return films;
});
const fetchCharacters = (chars) => __awaiter(void 0, void 0, void 0, function* () {
    if (chars) {
        const characters = [];
        let url = "https://swapi.dev/api/people/";
        while (url) {
            const response = yield axios_1.default.get(url);
            const data = response.data;
            characters.push(...data.results);
            url = data.next;
        }
        return characters;
    }
    else
        return [];
});
