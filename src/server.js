import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./config/db.js";
import recipesRouter from "./routes/recipesRoutes.js";
import favoritesRouter from "./routes/favoritesRoutes.js";
import rdfRoutes from "./routes/rdfRoutes.js";
import authRoutes from "./routes/authRoutes.js";

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

// Configuración de rutas
app.use("/api/auth", authRoutes); 
app.use("/api/recipes", recipesRouter);
app.use("/api/favorites", favoritesRouter);
app.use("/rdf", rdfRoutes);

const PORT = process.env.PORT || 3001;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en puerto ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error al conectar a MongoDB:", error);
  });