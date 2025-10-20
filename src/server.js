import express from "express";
import recipesRouter from "./routes/recipesRoutes.js";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(
  cors({
    origin: [
        "http://localhost:3000", 
        "http://localhost:5173",
        "https://super-recetario.vercel.app",
    ],
  })
);

app.use(express.json());

app.use("/assets", express.static(path.join(__dirname, "../assets")));

app.use("/api/recipes", recipesRouter);

const PORT = process.env.PORT || 3001;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
  });
});