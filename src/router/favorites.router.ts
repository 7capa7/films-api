import { Router } from "express";
import {
  createFavorites,
  getFavorites,
  getFavoritesWithGivenId,
} from "../controller/favorites.controller";

const router = Router();

router.post("/api/favorites/", createFavorites);
router.get("/api/all-favorites/:page?", getFavorites);
router.get("/api/favorites/:id", getFavoritesWithGivenId);

const favoritesRouter = router;
export default favoritesRouter;
