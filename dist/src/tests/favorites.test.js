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
const favoritesController = __importStar(require("../controller/favorites.controller"));
const favorites_service_1 = require("../service/favorites.service");
const swapi_service_1 = require("../service/swapi.service");
jest.mock("../service/favorites.service");
jest.mock("../service/characters.service");
jest.mock("../service/swapi.service");
jest.mock("../service/film.service");
describe("Favorites Controller", () => {
    describe("createFavorites", () => {
        it("should create favorites and return saved favorites", () => __awaiter(void 0, void 0, void 0, function* () {
            const listName = "My Favorites";
            const movieIds = [1, 2, 3];
            const fetchedFilms = [
                {
                    episode_id: 1,
                    title: "Film 1",
                    characters: [],
                    release_date: Date(),
                },
                {
                    episode_id: 2,
                    title: "Film 2",
                    characters: [],
                    release_date: Date(),
                },
                {
                    episode_id: 3,
                    title: "Film 3",
                    characters: [],
                    release_date: Date(),
                },
            ];
            swapi_service_1.fetchFilms.mockResolvedValue(fetchedFilms);
            const req = {
                body: { listName, movieIds },
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis(),
                send: jest.fn(),
            };
            yield favoritesController.createFavorites(req, res);
            expect(swapi_service_1.fetchFilms).toHaveBeenCalledWith(true);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalled();
        }));
        it("should return an error for invalid data", () => __awaiter(void 0, void 0, void 0, function* () {
            const req = {
                body: { listName: "My Favorites", movieIds: null },
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis(),
                send: jest.fn(),
            };
            yield favoritesController.createFavorites(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: "Invalid data",
                code: 400,
            });
            expect(res.send).toHaveBeenCalled();
        }));
    });
    describe("getFavorites", () => {
        it("should get favorites based on list name", () => __awaiter(void 0, void 0, void 0, function* () {
            const listName = "My Favorites";
            const page = 2;
            const favorites = [
                { listName: "Favorites 1", films: [] },
                { listName: "Favorites 2", films: [] },
            ];
            favorites_service_1.getAllFavorites.mockResolvedValue(favorites);
            favorites_service_1.getAllFavorites.mockImplementationOnce(() => []);
            const req = {
                query: { listName },
                params: { page },
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis(),
                send: jest.fn(),
            };
            yield favoritesController.getFavorites(req, res);
            expect(favorites_service_1.getAllFavorites).toHaveBeenCalledWith(page, listName);
            expect(favorites_service_1.getAllFavorites).toHaveBeenCalledWith(page + 1, listName);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalled();
            expect(res.send).toHaveBeenCalled();
        }));
    });
    describe("getFavoritesWithGivenId", () => {
        it("should get favorites with the given id", () => __awaiter(void 0, void 0, void 0, function* () {
            const favoritesId = "abc123";
            const favorites = { listName: "My Favorites", films: [] };
            favorites_service_1.getFavoritesById.mockResolvedValue(favorites);
            const req = { params: { id: favoritesId } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis(),
                send: jest.fn(),
            };
            yield favoritesController.getFavoritesWithGivenId(req, res);
            expect(favorites_service_1.getFavoritesById).toHaveBeenCalledWith(favoritesId);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(favorites);
            expect(res.send).toHaveBeenCalled();
        }));
        it("should return an error if favorites with the given id is not found", () => __awaiter(void 0, void 0, void 0, function* () {
            const req = { params: { id: "abc123" } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis(),
                send: jest.fn(),
            };
            favorites_service_1.getFavoritesById.mockResolvedValue(null);
            yield favoritesController.getFavoritesWithGivenId(req, res);
            expect(favorites_service_1.getFavoritesById).toHaveBeenCalledWith("abc123");
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                message: "Favorites not found",
                code: 404,
            });
            expect(res.send).toHaveBeenCalled();
        }));
    });
    describe("getFavoritesAsExcel", () => {
        it("should get favorites as Excel file", () => __awaiter(void 0, void 0, void 0, function* () {
            const favoritesId = "abc123";
            const favorites = {
                listName: "My Favorites",
                films: [
                    //@ts-ignore
                    { title: "Film 1", characters: [{ name: "Character 1" }] },
                    //@ts-ignore
                    { title: "Film 2", characters: [{ name: "Character 2" }] },
                ],
            };
            favorites_service_1.getFavoritesById.mockResolvedValue(favorites);
            const req = { params: { id: favoritesId } };
            const res = {
                setHeader: jest.fn(),
                send: jest.fn(),
            };
            yield favoritesController.getFavoritesAsExcel(req, res);
            expect(favorites_service_1.getFavoritesById).toHaveBeenCalledWith(favoritesId);
            expect(res.setHeader).toHaveBeenCalledWith("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            expect(res.setHeader).toHaveBeenCalledWith("Content-Disposition", `attachment; filename=${favoritesId}.xlsx`);
            expect(res.send).toHaveBeenCalled();
        }));
        it("should return an error if favorites with the given id is not found", () => __awaiter(void 0, void 0, void 0, function* () {
            const req = { params: { id: "abc123" } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis(),
                send: jest.fn(),
            };
            favorites_service_1.getFavoritesById.mockResolvedValue(null);
            yield favoritesController.getFavoritesAsExcel(req, res);
            expect(favorites_service_1.getFavoritesById).toHaveBeenCalledWith("abc123");
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                message: "Favorites not found",
                code: 404,
            });
            expect(res.send).toHaveBeenCalled();
        }));
    });
});
