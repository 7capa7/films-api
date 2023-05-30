"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const film_controller_1 = require("../controller/film.controller");
const router = (0, express_1.Router)();
router.get("/api/films", film_controller_1.getFilms);
const filmRouter = router;
exports.default = filmRouter;
