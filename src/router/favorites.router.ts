import { Router } from "express";
import { createFavorites, getFavorites } from "../controller/favorites.controller";

const router = Router();

router.post("/api/favorites/", createFavorites);
router.get("/api/favorites/:page?", getFavorites);

const favoritesRouter = router;
export default favoritesRouter;
