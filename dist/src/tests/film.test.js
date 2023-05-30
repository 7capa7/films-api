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
const film_controller_1 = require("../controller/film.controller");
const swapi_service_1 = require("../service/swapi.service");
jest.mock("../service/swapi.service", () => ({
    fetchFilms: jest.fn(),
}));
describe("Films Controller", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe("getFilms", () => {
        test("should fetch films and return status 200 with films data", () => __awaiter(void 0, void 0, void 0, function* () {
            const films = [
                { episode_id: 1, release_date: "2023-05-29", title: "Film 1" },
                { episode_id: 2, release_date: "2023-05-30", title: "Film 2" },
            ];
            swapi_service_1.fetchFilms.mockResolvedValue(films);
            const req = {};
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
                send: jest.fn(),
            };
            yield (0, film_controller_1.getFilms)(req, res);
            expect(swapi_service_1.fetchFilms).toHaveBeenCalledWith(false);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(films);
            expect(res.send).toHaveBeenCalled();
        }));
        test("should handle error and return status 500", () => __awaiter(void 0, void 0, void 0, function* () {
            const errorMessage = "unexpected error";
            swapi_service_1.fetchFilms.mockRejectedValue(new Error(errorMessage));
            const req = {};
            const res = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn(),
            };
            yield (0, film_controller_1.getFilms)(req, res);
            expect(swapi_service_1.fetchFilms).toHaveBeenCalledWith(false);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith(errorMessage);
        }));
    });
});
