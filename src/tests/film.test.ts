import { Request, Response } from "express";
import { getFilms } from "../controller/film.controller";
import { fetchFilms } from "../service/swapi.service";
import { IFilm } from "../model/film.model";

jest.mock("../service/swapi.service", () => ({
  fetchFilms: jest.fn(),
}));

describe("Films Controller", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getFilms", () => {
    test("should fetch films and return status 200 with films data", async () => {
      const films: IFilm[] = [
        { episode_id: 1, release_date: "2023-05-29", title: "Film 1" },
        { episode_id: 2, release_date: "2023-05-30", title: "Film 2" },
      ];
      (fetchFilms as jest.Mock).mockResolvedValue(films);
      const req = {} as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        send: jest.fn(),
      } as unknown as Response;

      await getFilms(req, res);

      expect(fetchFilms).toHaveBeenCalledWith(false);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(films);
    });

    test("should handle error and return status 500", async () => {
      const errorMessage = "unexpected error";
      (fetchFilms as jest.Mock).mockRejectedValue(new Error(errorMessage));
      const req = {} as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as unknown as Response;

      await getFilms(req, res);

      expect(fetchFilms).toHaveBeenCalledWith(false);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith(errorMessage);
    });
  });
});
