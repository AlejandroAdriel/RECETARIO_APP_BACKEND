import express from "express";
import recipesRouter from "./routes/recipesRoutes.js";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import cors from "cors";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: [
        "http://localhost:3000", 
        "https://myproductiondomain.com",
    ],
  })
);

app.use(express.json());

app.use("/api/recipes", recipesRouter);

const PORT = process.env.PORT || 3001;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`servidor corriendo en puerto http://localhost:${PORT}`);
  });
});
