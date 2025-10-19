import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: false,
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

recipeSchema.pre('save', async function(next) {
  if (!this._id) {
    const lastRecipe = await mongoose.model('Recipe')
      .findOne()
      .sort({ _id: -1 });
    
    let nextNumber = 1;
    if (lastRecipe && lastRecipe._id) {
      nextNumber = parseInt(lastRecipe._id) + 1;
    }
    
    this._id = String(nextNumber).padStart(6, '0');
  }
  next();
});

const Recipe = mongoose.model("Recipe", recipeSchema);
export default Recipe;