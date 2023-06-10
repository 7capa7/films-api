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
import {
  getAllFavorites,
  getFavoritesById,
  saveFavorites,
} from "../service/favorites.service";
import * as exceljs from "exceljs";
import { log } from "../utils/logger";

export async function createFavorites(req: Request, res: Response) {
  try {
    const { listName, movieIds } = req.body;

    if (
      !listName ||
      typeof listName !== "string" ||
      listName.trim().length === 0 ||
      !movieIds ||
      !Array.isArray(movieIds) ||
      !movieIds.every((id) => typeof id === "number")
    ) {
      return res.status(400).json({ message: "Invalid data", code: 400 });
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

    const savedFavorites = await saveFavorites(savedFilms, listName.trim());

    return res.status(200).json(savedFavorites);
  } catch (e: any) {
    const errorMessage = e.message || "Unexpected error";
    log.error(errorMessage + " [createFavorites]");
    return res.status(500).send(errorMessage);
  }
}

export async function getFavorites(req: Request, res: Response) {
  try {
    const listName = req.query.listName;
    const page = Number(req.params.page) || 1;
    const favorites = await getAllFavorites(page, listName);
    let next = null;
    if ((await getAllFavorites(page + 1, listName)).length > 0)
      next = `http://localhost:8080/api/all-favorites/${
        page + 1
      }?listName=${listName}`;
    return res.status(200).json({
      ...(next !== null && { next }),
      favorites,
    });
  } catch (e: any) {
    const errorMessage = e.message || "Unexpected error";
    log.error(errorMessage + " [getFavorites]");
    return res.status(500).send(errorMessage);
  }
}

export async function getFavoritesWithGivenId(req: Request, res: Response) {
  try {
    const favoritesId = req.params.id;

    if (!isUUID(favoritesId)) {
      return res.status(400).json({ message: "Invalid ID", code: 400 });
    }

    const favorites = await getFavoritesById(favoritesId);
    if (favorites) {
      return res.status(200).json(favorites);
    } else {
      return res
        .status(404)
        .json({ message: "Favorites not found", code: 404 });
    }
  } catch (e: any) {
    const errorMessage = e.message || "Unexpected error";
    log.error(errorMessage + " [getFavoritesWithGivenId]");
    return res.status(500).send(errorMessage);
  }
}

export async function getFavoritesAsExcel(req: Request, res: Response) {
  const id = req.params.id;

  if (!isUUID(id)) {
    return res.status(400).json({ message: "Invalid ID", code: 400 });
  }

  try {
    const favorites = await getFavoritesById(id);

    if (!favorites) {
      return res
        .status(404)
        .json({ message: "Favorites not found", code: 404 });
    }

    const workbook = new exceljs.Workbook();
    const worksheet = workbook.addWorksheet("Favorites");

    worksheet.getCell("A1").value = "Characters";
    worksheet.getCell("B1").value = "Movie Titles";

    let row = 2;

    const charactersSet = new Set<string>();

    favorites.films.forEach((film) => {
      film.characters.forEach((character) => {
        charactersSet.add(character.name);
      });
    });

    const charactersArray = Array.from(charactersSet);
    charactersArray.forEach((character) => {
      worksheet.getCell(`A${row}`).value = character;
      row++;
    });

    const movieTitles = favorites.films.map((film) => film.title).join(", ");
    worksheet.getCell(`B2`).value = movieTitles;

    worksheet.getColumn("A").width = 20;
    worksheet.getColumn("B").width = 20 * favorites.films.length;
    const buffer = await workbook.xlsx.writeBuffer();

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", `attachment; filename=${id}.xlsx`);

    res.send(buffer);
  } catch (e: any) {
    const errorMessage = e.message || "Unexpected error";
    log.error(errorMessage + " [getFavoritesAsExcel]");
    return res.status(500).send(errorMessage);
  }
}

const createOrUpdateCharacters = async (characterNames: string[]) => {
  const uniqueCharacterNames = [...new Set(characterNames)];

  const characters: Character[] = [];

  await Promise.all(
    uniqueCharacterNames.map(async (name) => {
      try {
        if (!(await checkIfCharacterExist(name))) {
          characters.push(await createCharacter(name));
        } else {
          const character = await getCharacter(name);
          if (character) {
            characters.push(character);
          }
        }
      } catch (error) {}
    })
  );

  return characters;
};

const createOrUpdateFilm = async (
  filmData: IFilm,
  charactersData: Character[]
) => {
  try {
    if (!(await checkIfFilmExist(filmData))) {
      return await saveFilm(filmData, charactersData);
    } else {
      return await getFilm(filmData);
    }
  } catch (error) {}
};

const isUUID = (value: string): boolean => {
  const uuidRegex =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
  return uuidRegex.test(value);
};
