import { Router } from "express";
import Favorite from "../models/favoriteModel.js";

const router = Router();

router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const favs = await Favorite.find({ userId }).lean();
    res.status(200).json(favs);
  } catch (err) {
    console.error("GET /favorites error:", err);
    res.status(500).json({ error: "Error al obtener favoritos" });
  }
});

router.post("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { recipeId } = req.body;
    if (!recipeId) return res.status(400).json({ error: "recipeId es requerido" });

    const created = await Favorite.create({ userId, recipeId });
    res.status(201).json(created);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(200).json({ message: "Ya estaba en favoritos" });
    }
    console.error("POST /favorites error:", err);
    res.status(500).json({ error: "Error al agregar a favoritos" });
  }
});

router.delete("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { recipeId } = req.body;
    if (!recipeId) return res.status(400).json({ error: "recipeId es requerido" });

    const result = await Favorite.findOneAndDelete({ userId, recipeId }).lean();
    if (!result) return res.status(404).json({ error: "Favorito no encontrado" });
    res.status(200).json({ message: "Eliminado de favoritos" });
  } catch (err) {
    console.error("DELETE /favorites error:", err);
    res.status(500).json({ error: "Error al eliminar de favoritos" });
  }
});

export default router;