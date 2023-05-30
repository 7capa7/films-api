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
exports.getCharacter = exports.createCharacter = exports.checkIfCharacterExist = void 0;
const Character_1 = require("../entity/Character");
function checkIfCharacterExist(characterData) {
    return __awaiter(this, void 0, void 0, function* () {
        const repository = Character_1.Character.getRepository();
        const character = yield repository.findOne({
            where: { name: characterData },
        });
        return character != null;
    });
}
exports.checkIfCharacterExist = checkIfCharacterExist;
function createCharacter(characterData) {
    return __awaiter(this, void 0, void 0, function* () {
        const character = Character_1.Character.create({ name: characterData });
        return yield character.save();
    });
}
exports.createCharacter = createCharacter;
function getCharacter(characterData) {
    return __awaiter(this, void 0, void 0, function* () {
        const repository = Character_1.Character.getRepository();
        const character = yield repository.findOne({
            where: { name: characterData },
        });
        return character;
    });
}
exports.getCharacter = getCharacter;
