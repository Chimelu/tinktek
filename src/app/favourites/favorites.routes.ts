import { Router } from "express";
import * as favorite from "./favorites.controller";
import { authenticateToken } from "../../infrastructure/middleware";

const FavoritesRouter = Router();

FavoritesRouter.post("/add", authenticateToken, favorite.addToFavorites);

FavoritesRouter.delete(
  "/remove/:id",
  authenticateToken,
  favorite.removeFromFavorites
);

FavoritesRouter.get("/all", authenticateToken, favorite.getUserFavorites);

export default FavoritesRouter;
