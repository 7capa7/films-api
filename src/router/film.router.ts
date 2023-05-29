import { Router } from "express";
import { getFilms } from "../controller/film.controller";

const router = Router();

router.get("/api/films", getFilms);

const filmRouter = router;
export default filmRouter;
