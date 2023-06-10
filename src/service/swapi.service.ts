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
  fetchCharacters: (characters: boolean) => Promise<any[]>
): Promise<IFilm[]> => {
  const charactersApi: string[] = await fetchCharacters(chars);

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

const fetchCharacters = async (chars: boolean) => {
  if (chars) {
    const characters: any[] = [];
    let url = "https://swapi.dev/api/people/";
    while (url) {
      const response = await axios.get(url);
      const data = response.data;
      characters.push(...data.results);
      url = data.next;
    }
    return characters;
  } else return [];
};
