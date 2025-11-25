import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    cookTime: {
      type: Number,
      required: true,
    },
    servings: {
      type: Number,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ["Fácil", "Intermedio", "Difícil"],
    },
    category: {
      type: String,
    },
    ingredients: {
      type: [String],
    },
    instructions: {
      type: [String],
    },
    restrictions: {
      type: [String],
    },
  }
);

recipeSchema.pre("validate", async function (next) {
  if (this.isNew && !this._id) {
    try {
      const lastRecipe = await mongoose
        .model("Recipe")
        .findOne()
        .sort({ _id: -1 });
      const nextNumber = lastRecipe ? parseInt(lastRecipe._id, 10) + 1 : 1;
      const recipeId = String(nextNumber).padStart(6, "0");
      this._id = recipeId;
      if (!this.image) {
        this.image = `/assets/images/recipes/${recipeId}.jpg`;
      }

      next();
    } catch (error) {
      console.error("Error generando ID:", error);
      next(error);
    }
  } else if (!this.isNew && this._id) {
    if (!this.image) {
      this.image = `/assets/images/recipes/${this._id}.jpg`;
    }
    next();
  } else {
    next();
  }
});

const Recipe = mongoose.model("Recipe", recipeSchema);
export default Recipe;