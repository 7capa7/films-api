import { Request, Response } from "express";
import { fetchFilms } from "../service/swapi.service";
import { IFilm } from "../model/film.model";
import { log } from "../utils/logger";

export async function getFilms(req: Request, res: Response) {
  try {
    const films: IFilm[] = await fetchFilms(false);
    return res.status(200).json(films);
  } catch (e: any) {
    const errorMessage = e.message || "Unexpected error";
    log.error(errorMessage + " [getFilms]");
    return res.status(500).send(errorMessage);
  }
}
