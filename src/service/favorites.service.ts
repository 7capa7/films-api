import { Favorites } from "../entity/Favorites";
import { Film } from "../entity/Film";

export async function saveFavorites(films: Film[], name: string) {
  const favorites = Favorites.create({ name, films });
  return favorites.save();
}

export async function getAllFavorites(page: number, name: any) {
  const repository = Favorites.getRepository();
  const skip = (page - 1) * 5;
  const take = 5;
  if (name) return await repository.find({ where: { name }, skip, take });
  else return await repository.find({ skip, take });
}
