import { Router } from "express";
import {
  createFavorites,
  getFavorites,
  getFavoritesAsExcel,
  getFavoritesWithGivenId,
} from "../controller/favorites.controller";

const router = Router();

router.post("/api/favorites", createFavorites);
router.get("/api/all-favorites/:page?", getFavorites);
router.get("/api/favorites/:id", getFavoritesWithGivenId);
router.get("/api/favorites/:id/file", getFavoritesAsExcel);

const favoritesRouter = router;
export default favoritesRouter;
