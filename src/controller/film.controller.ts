import { Request, Response } from "express";
import { Film } from "../model/film.model";
import { request } from "../utils/request";

export async function getFilms(req: Request, res: Response) {
  try {
    const films = mapApiResponseToFilmsArray(await request.get("/films/"));
    return res.status(200).json(films).send();
  } catch (e) {
    return res.status(500).send("unexpected error");
  }
}

const mapApiResponseToFilmsArray = (array: any): Film[] => {
  return array.data.results.map((e: any) => ({
    title: e.title,
    release_date: e.release_date,
    episode_id: e.episode_id,
  }));
};
