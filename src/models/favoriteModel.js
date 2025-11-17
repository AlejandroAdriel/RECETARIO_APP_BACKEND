import mongoose from "mongoose";

const favoriteSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    recipeId: { type: String, required: true, ref: "Recipe" },
  },
  { timestamps: true }
);

favoriteSchema.index({ userId: 1, recipeId: 1 }, { unique: true });

const Favorite = mongoose.model("Favorite", favoriteSchema);
export default Favorite;