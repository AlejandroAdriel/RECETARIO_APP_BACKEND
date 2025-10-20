// models/recipeModel.js
import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true
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
      required: true
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
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    ingredients: [String],
    instructions: [String]
  },
  { 
    timestamps: true,
    _id: false 
  }
);

recipeSchema.pre('validate', async function(next) {
  if (this.isNew && !this._id) {
    try {
      const lastRecipe = await mongoose.model('Recipe')
        .findOne()
        .sort({ _id: -1 });
      
      let nextNumber = 1;
      if (lastRecipe && lastRecipe._id) {
        nextNumber = parseInt(lastRecipe._id) + 1;
      }
      
      const recipeId = String(nextNumber).padStart(6, '0');
      this._id = recipeId;
      this.image = `/assets/images/recipes/${recipeId}.jpg`;
      
      next();
    } catch (error) {
      console.error('Error generando ID:', error);
      next(error);
    }
  } else {
    next();
  }
});

const Recipe = mongoose.model("Recipe", recipeSchema);
export default Recipe;