import { IFilm } from "./film.model";

export interface IFavorites {
  listName: string;
  films: IFilm[];
}
