import { Request, Response } from "express";
import { IFilm } from "../model/film.model";
import { fetchFilms } from "../service/swapi.service";
import { IFavorites } from "../model/favorites.model";
import {
  checkIfCharacterExist,
  createCharacter,
  getCharacter,
} from "../service/characters.service";
import { Character } from "../entity/Character";
import { checkIfFilmExist, getFilm, saveFilm } from "../service/film.service";
import { Film } from "../entity/Film";
import { getAllFavorites, saveFavorites } from "../service/favorites.service";

export async function createFavorites(req: Request, res: Response) {
  const { listName, movieIds } = req.body;

  if (
    !listName ||
    !movieIds ||
    !Array.isArray(movieIds) ||
    !movieIds.every((id) => typeof id === "number")
  ) {
    return res.status(400).json({ message: "Invalid data", code: 400 }).send();
  }

  const fetchedFilms: IFilm[] = await fetchFilms(true);
  const films = fetchedFilms.filter((film) =>
    movieIds.includes(film.episode_id)
  );

  const favorites: IFavorites = { listName, films };

  const savedFilms: Film[] = [];

  for (const film of favorites.films) {
    const allCharacters = film.characters ?? [];

    const characters = await createOrUpdateCharacters(allCharacters);

    const savedFilm = await createOrUpdateFilm(film, characters);
    if (savedFilm) {
      savedFilms.push(savedFilm);
    }
  }

  const savedFavorites = await saveFavorites(savedFilms, listName);

  return res.status(200).json(savedFavorites).send();
}

export async function getFavorites(req: Request, res: Response) {
  const listName = req.query.listName;
  const page = Number(req.params.page) || 1;
  const favorites = await getAllFavorites(page, listName);
  let next = null;
  if ((await getAllFavorites(page + 1, listName)).length > 0) next = page + 1;
  return res
    .status(200)
    .json({
      ...(next !== null && { next }),
      favorites,
    })
    .send();
}

const createOrUpdateCharacters = async (characterNames: string[]) => {
  const uniqueCharacterNames = [...new Set(characterNames)];

  const characters: Character[] = [];

  await Promise.all(
    uniqueCharacterNames.map(async (name) => {
      if (!(await checkIfCharacterExist(name))) {
        try {
          characters.push(await createCharacter(name));
        } catch (error) {}
      } else {
        const character = await getCharacter(name);
        if (character) {
          characters.push(character);
        }
      }
    })
  );

  return characters;
};

const createOrUpdateFilm = async (
  filmData: IFilm,
  charactersData: Character[]
) => {
  if (!(await checkIfFilmExist(filmData))) {
    try {
      return await saveFilm(filmData, charactersData);
    } catch (error) {}
  } else {
    return await getFilm(filmData);
  }
};
