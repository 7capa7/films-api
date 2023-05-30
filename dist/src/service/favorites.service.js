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
exports.getFavoritesById = exports.getAllFavorites = exports.saveFavorites = void 0;
const Favorites_1 = require("../entity/Favorites");
function saveFavorites(films, name) {
    return __awaiter(this, void 0, void 0, function* () {
        const favorites = Favorites_1.Favorites.create({ name, films });
        return favorites.save();
    });
}
exports.saveFavorites = saveFavorites;
function getAllFavorites(page, name) {
    return __awaiter(this, void 0, void 0, function* () {
        const repository = Favorites_1.Favorites.getRepository();
        const skip = (page - 1) * 5;
        const take = 5;
        if (name)
            return yield repository.find({ where: { name }, skip, take });
        else
            return yield repository.find({ skip, take });
    });
}
exports.getAllFavorites = getAllFavorites;
function getFavoritesById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const repository = Favorites_1.Favorites.getRepository();
        return yield repository.findOne({
            where: { id },
            relations: ["films", "films.characters"],
        });
    });
}
exports.getFavoritesById = getFavoritesById;
