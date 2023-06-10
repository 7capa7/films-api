import { Request, Response } from "express";
import * as favoritesController from "../controller/favorites.controller";
import {
  getAllFavorites,
  getFavoritesById,
} from "../service/favorites.service";
import { fetchFilms } from "../service/swapi.service";
import { IFavorites } from "../model/favorites.model";
import { IFilm } from "../model/film.model";

jest.mock("../service/favorites.service");
jest.mock("../service/characters.service");
jest.mock("../service/swapi.service");
jest.mock("../service/film.service");

describe("Favorites Controller", () => {
  describe("createFavorites", () => {
    it("should create favorites and return saved favorites", async () => {
      const listName = "My Favorites";
      const movieIds = [1, 2, 3];
      const fetchedFilms: IFilm[] = [
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

      (fetchFilms as jest.Mock).mockResolvedValue(fetchedFilms);

      const req = {
        body: { listName, movieIds },
      } as unknown as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as unknown as Response;

      await favoritesController.createFavorites(req, res);

      expect(fetchFilms).toHaveBeenCalledWith(true);
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should return an error if moviesIds is null", async () => {
      const req = {
        body: { listName: "My Favorites", movieIds: null },
      } as unknown as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as unknown as Response;

      await favoritesController.createFavorites(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Invalid data",
        code: 400,
      });
    });
    it("should return an error if listName is not string", async () => {
      const req = {
        body: { listName: 12, movieIds: [1, 3] },
      } as unknown as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as unknown as Response;

      await favoritesController.createFavorites(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Invalid data",
        code: 400,
      });
    });
  });

  describe("getFavorites", () => {
    it("should get favorites based on list name", async () => {
      const listName = "My Favorites";
      const page = 2;
      const favorites: IFavorites[] = [
        { listName: "Favorites 1", films: [] },
        { listName: "Favorites 2", films: [] },
      ];

      (getAllFavorites as jest.Mock).mockResolvedValue(favorites);
      (getAllFavorites as jest.Mock).mockImplementationOnce(() => []);

      const req = {
        query: { listName },
        params: { page },
      } as unknown as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as unknown as Response;

      await favoritesController.getFavorites(req, res);

      expect(getAllFavorites).toHaveBeenCalledWith(page, listName);
      expect(getAllFavorites).toHaveBeenCalledWith(page + 1, listName);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalled();
    });
  });

  describe("getFavoritesWithGivenId", () => {
    it("should get favorites with the given id", async () => {
      const favoritesId = "7c0564a9-231b-4a5e-9c37-52f3e992f18c";
      const favorites: IFavorites = { listName: "My Favorites", films: [] };

      (getFavoritesById as jest.Mock).mockResolvedValue(favorites);

      const req = { params: { id: favoritesId } } as unknown as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as unknown as Response;

      await favoritesController.getFavoritesWithGivenId(req, res);

      expect(getFavoritesById).toHaveBeenCalledWith(favoritesId);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(favorites);
    });

    it("should return an error if favorites with the given id is not found", async () => {
      const req = {
        params: { id: "7c0564a9-231b-4a5e-9c37-52f3e992f18c" },
      } as unknown as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as unknown as Response;

      (getFavoritesById as jest.Mock).mockResolvedValue(null);

      await favoritesController.getFavoritesWithGivenId(req, res);

      expect(getFavoritesById).toHaveBeenCalledWith(
        "7c0564a9-231b-4a5e-9c37-52f3e992f18c"
      );
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "Favorites not found",
        code: 404,
      });
    });

    it("should return an error if id is not valid UUID", async () => {
      const req = { params: { id: "uuid-123" } } as unknown as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as unknown as Response;

      (getFavoritesById as jest.Mock).mockResolvedValue(null);

      await favoritesController.getFavoritesWithGivenId(req, res);

      expect(getFavoritesById).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Invalid ID",
        code: 400,
      });
    });
  });

  describe("getFavoritesAsExcel", () => {
    it("should get favorites as Excel file", async () => {
      const favoritesId = "7c0564a9-231b-4a5e-9c37-52f3e992f18c";
      const favorites: IFavorites = {
        listName: "My Favorites",
        films: [
          //@ts-ignore
          { title: "Film 1", characters: [{ name: "Character 1" }] },
          //@ts-ignore
          { title: "Film 2", characters: [{ name: "Character 2" }] },
        ],
      };

      (getFavoritesById as jest.Mock).mockResolvedValue(favorites);

      const req = { params: { id: favoritesId } } as unknown as Request;
      const res = {
        setHeader: jest.fn(),
        send: jest.fn(),
      } as unknown as Response;

      await favoritesController.getFavoritesAsExcel(req, res);

      expect(getFavoritesById).toHaveBeenCalledWith(favoritesId);
      expect(res.setHeader).toHaveBeenCalledWith(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      expect(res.setHeader).toHaveBeenCalledWith(
        "Content-Disposition",
        `attachment; filename=${favoritesId}.xlsx`
      );
    });

    it("should return an error if favorites with the given id is not found", async () => {
      const req = {
        params: { id: "7c0564a9-231b-4a5e-9c37-52f3e992f18c" },
      } as unknown as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as unknown as Response;

      (getFavoritesById as jest.Mock).mockResolvedValue(null);

      await favoritesController.getFavoritesAsExcel(req, res);

      expect(getFavoritesById).toHaveBeenCalledWith(
        "7c0564a9-231b-4a5e-9c37-52f3e992f18c"
      );
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "Favorites not found",
        code: 404,
      });
    });
    it("should return an error if id is not valid UUID", async () => {
      const req = { params: { id: "uuid-123" } } as unknown as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as unknown as Response;

      (getFavoritesById as jest.Mock).mockResolvedValue(null);

      await favoritesController.getFavoritesAsExcel(req, res);

      expect(getFavoritesById).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Invalid ID",
        code: 400,
      });
    });
  });
});
