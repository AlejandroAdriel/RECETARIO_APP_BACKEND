import express from "express";
import Favorite from "../models/favoriteModel.js";
import Recipe from "../models/recipeModel.js";

const router = express.Router();

// Añadir receta a favoritos
router.post("/", async (req, res) => {
  const { userId, recipeId } = req.body;

  if (!userId || !recipeId) {
    return res.status(400).json({ error: "userId y recipeId son requeridos" });
  }

  try {
    const exists = await Favorite.findOne({ userId, recipeId });
    if (exists) {
      return res.status(409).json({ error: "Ya está en favoritos" });
    }

    const favorito = await Favorite.create({ userId, recipeId });
    res.status(201).json(favorito);
  } catch (error) {
    console.error("Error al añadir favorito", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Obtener favoritos por usuario
router.get("/:userId", async (req, res) => {
  try {
    const favoritos = await Favorite.find({ userId: req.params.userId });
    const recetas = await Recipe.find({ _id: { $in: favoritos.map(f => f.recipeId) } });
    res.status(200).json(recetas);
  } catch (error) {
    console.error("Error al obtener favoritos", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Eliminar receta de favoritos
router.delete("/:recipeId/:userId", async (req, res) => {
  const { recipeId, userId } = req.params;

  try {
    const eliminado = await Favorite.deleteOne({ userId, recipeId });
    if (eliminado.deletedCount === 0) {
      return res.status(404).json({ error: "Favorito no encontrado" });
    }
    res.status(200).json({ message: "Favorito eliminado" });
  } catch (error) {
    console.error("Error al eliminar favorito", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

export default router;
