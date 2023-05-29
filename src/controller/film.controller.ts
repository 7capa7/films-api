import { Request, Response } from "express";
import { fetchFilms } from "../service/swapi.service";
import { IFilm } from "../model/film.model";

export async function getFilms(req: Request, res: Response) {
  try {
    const films: IFilm[] = await fetchFilms(false);
    return res.status(200).json(films).send();
  } catch (e) {
    return res.status(500).send("unexpected error");
  }
}
