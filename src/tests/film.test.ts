import express from "express";
import bodyParser from "body-parser";
import { request } from "../utils/request";
import supertest from "supertest";
import filmRouter from "../router/film.router";

const app = express();
app.use(bodyParser.json());
app.use(filmRouter);

const apiData = {
  data: {
    results: [
      {
        title: "The Phantom Menace",
        release_date: "1999-05-19",
        episode_id: 1,
        created: "2014-12-10T14:23:31.880000Z",
        director: "George Lucas",
        edited: "2014-12-12T11:24:39.858000Z",
      },
    ],
  },
};

const film = {
  title: "The Phantom Menace",
  release_date: "1999-05-19",
  episode_id: 1,
};

jest.mock("../utils/request", () => ({
  request: {
    get: jest.fn(),
  },
}));

describe("Film", () => {
  describe("get films", () => {
    describe("get all films", () => {
      it("should return films and a 200", async () => {
        //@ts-ignore
        request.get.mockResolvedValue(apiData);

        const { statusCode, body } = await supertest(app).get("/api/films/");

        expect(statusCode).toBe(200);
        expect(body[0]).toEqual(film);
      });
    });
  });
});
