import express from "express";
import Recipe from "../models/recipeModel.js";
import { now } from "mongoose";

const router = express.Router();

//obtener todas las recetas
router.get("/", async (req, res) => {
  try {
    const recipe = await Recipe.find();
    res.status(200).json(recipe);
  } catch (error) {
    console.error("Error al obtener la receta", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//obtener una receta por id
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const recipe = await Recipe.findById(id);
    if (!recipe) return res.status(404).json({ error: "Receta no encontrada" });
    res.status(200).json(recipe);
  } catch (error) {
    console.error("Error al obtener una nota por id", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//Crear una nueva receta
router.post("/", async (req, res) => {
  try {
    const { name, description } = req.body;
    const recipe = new Recipe({ name, description });

    const savedRecipe = await recipe.save();

    if (savedRecipe) {
      res
        .status(201)
        .json({ message: "Receta creada correctamente ", Recipe: savedRecipe });
    }
  } catch (error) {
    console.error("Error al crear una nota", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//Eliminar una receta
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const deletedNote = await Recipe.findByIdAndDelete(id);
    if (!deletedNote)
      return res.status(404).json({ error: "Receta no eliminada" });
    res.status(200).json({ message: "Nota eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar una nota", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//Editar una receta
router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { name, description } = req.body;
    const updateRecipe = await Recipe.findByIdAndUpdate(
      id,
      { name, description },
      { new: true }
    );
    if (!updateRecipe)
      return res
        .status(404)
        .json({ error: "Error receta no actualizada correctamente" });
    res
      .status(200)
      .json({
        message: "Receta actualizada correctamente",
        recipe: updateRecipe,
      });
  } catch (error) {
    console.error("Error al actualixar una nota", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
