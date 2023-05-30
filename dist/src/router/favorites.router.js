"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const favorites_controller_1 = require("../controller/favorites.controller");
const router = (0, express_1.Router)();
router.post("/api/favorites", favorites_controller_1.createFavorites);
router.get("/api/all-favorites/:page?", favorites_controller_1.getFavorites);
router.get("/api/favorites/:id", favorites_controller_1.getFavoritesWithGivenId);
router.get("/api/favorites/:id/file", favorites_controller_1.getFavoritesAsExcel);
const favoritesRouter = router;
exports.default = favoritesRouter;
