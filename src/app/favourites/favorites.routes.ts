import { Router } from "express";
import * as favorite from "./favorites.controller";
import { authenticateUser } from "../../infrastructure/middleware/authMiddleware";
// import { authenticateToken } from "../../infrastructure/middleware";

const FavoritesRouter = Router();

FavoritesRouter.post("/add/:userId",  favorite.addToFavorites);

FavoritesRouter.delete(
  "/remove", authenticateUser,
  favorite.removeFromFavorites
);

FavoritesRouter.get("/all", authenticateUser, favorite.getUserFavorites);

export default FavoritesRouter;
