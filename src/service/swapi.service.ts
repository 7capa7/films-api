import axios from "axios";
import { IFilm } from "../model/film.model";

export async function fetchFilms(characters: boolean) {
  const apiData = (await axios.get("https://swapi.dev/api/films/")).data
    .results;
  const films: IFilm[] = await mapApiResponseToFilms(
    apiData,
    characters,
    fetchCharacters
  );
  return films;
}

const mapApiResponseToFilms = async (
  apiData: any,
  chars: boolean,
  fetchCharacters: () => Promise<any[]>
): Promise<IFilm[]> => {
  const charactersApi: string[] = await fetchCharacters();

  const films = apiData.map((e: any) => {
    const characterUrls: string[] = e.characters;
    const charactersFiltered = charactersApi.filter((item: any) =>
      characterUrls.includes(item.url)
    );
    const characters = charactersFiltered.map((item: any) => item.name);

    const { episode_id, release_date, title } = e;
    return {
      episode_id,
      release_date,
      title,
      ...(chars && { characters }),
    };
  });

  return films;
};

const fetchCharacters = async () => {
  const response: any[] = (await axios.get("https://swapi.dev/api/people/"))
    .data.results;
  return response;
};
