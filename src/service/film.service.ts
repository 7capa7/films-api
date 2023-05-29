import { Character } from "../entity/Character";
import { Film } from "../entity/Film";
import { IFilm } from "../model/film.model";

export async function checkIfFilmExist(filmData: IFilm) {
  const repository = Film.getRepository();
  const film = await repository.findOne({
    where: { episode_id: filmData.episode_id },
  });

  return film != null;
}

export async function saveFilm(filmData: IFilm, characters: Character[]) {
  const film = Film.create({
    episode_id: filmData.episode_id,
    release_date: filmData.release_date,
    title: filmData.title,
    characters: characters,
  });
  return await film.save();
}
export async function getFilm(filmData: IFilm) {
  const repository = Film.getRepository();
  return await repository.findOne({
    where: { episode_id: filmData.episode_id },
    relations: ["characters"],
  });
}
