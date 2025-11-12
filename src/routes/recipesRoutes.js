import express from "express";
import Recipe from "../models/recipeModel.js";
import mongoose from "mongoose";

const router = express.Router();

// Crear una nueva receta
router.post("/", async (req, res) => {
  try {
    const {
      name,
      description,
      cookTime,
      servings,
      difficulty,
      category,
      restrictions,
      ingredients,
      instructions,
    } = req.body;

    if (!name || !description) {
      return res
        .status(400)
        .json({ error: "Nombre y descripción son requeridos" });
    }

    const recipe = new Recipe({
      name,
      description,
      cookTime,
      servings,
      difficulty,
      category,
      restrictions,
      ingredients,
      instructions,
    });

    const savedRecipe = await recipe.save();

    if (savedRecipe) {
      res.status(201).json({
        message: "Receta creada correctamente",
        recipe: savedRecipe,
      });
    }
  } catch (error) {
    console.error("Error al crear una receta", error);
    if (error.code === 11000) {
      return res.status(400).json({ error: "El ID de la receta ya existe" });
    }
    res.status(500).json({ error: "Internal server error" });
  }
});

// Obtener todas las recetas
router.get("/", async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.status(200).json(recipes);
  } catch (error) {
    console.error("Error al obtener las recetas", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Obtener una receta por id
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const recipe = await Recipe.findOne({ _id: id });
    if (!recipe) return res.status(404).json({ error: "Receta no encontrada" });
    res.status(200).json(recipe);
  } catch (error) {
    console.error("Error al obtener una receta por id", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Editar una receta (PUT - Reemplazo Completo)
router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const updateData = {
      ...req.body,
      _id: id,
    }; 

    const result = await Recipe.replaceOne({ _id: id }, updateData, {
      runValidators: true,
    });

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Receta no encontrada" });
    }

    const updatedRecipe = await Recipe.findOne({ _id: id });

    res.status(200).json({
      message: "Receta actualizada correctamente",
      recipe: updatedRecipe,
    });
  } catch (error) {
    console.error("Error al actualizar una receta", error);
    if (error.name === "ValidationError") {
      return res.status(400).json({
        error: "Error de validación: " + error.message,
      });
    }
    res.status(500).json({ error: "Internal server error" });
  }
});

// Actualización parcial de receta
router.patch("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const updateRecipe = await Recipe.findOneAndUpdate(
      { _id: id },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updateRecipe) {
      return res.status(404).json({ error: "Receta no encontrada" });
    }

    res.status(200).json({
      message: "Receta actualizada correctamente",
      recipe: updateRecipe,
    });
  } catch (error) {
    console.error("Error al actualizar parcialmente una receta", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Eliminar una receta
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const deletedRecipe = await Recipe.findOneAndDelete({ _id: id });

    if (!deletedRecipe) {
      return res.status(404).json({ error: "Receta no encontrada" });
    }

    res.status(200).json({
      message: "Receta eliminada correctamente",
      recipe: deletedRecipe,
    });
  } catch (error) {
    console.error("Error al eliminar una receta", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;