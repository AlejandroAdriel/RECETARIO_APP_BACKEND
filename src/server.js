import express from "express"
import recipesRouter from "./routes/recipesRoutes.js"
import dotenv from "dotenv"
import { connectDB } from "./config/db.js"

dotenv.config()

const app = express()

app.use(express.json())

app.use("/api/recipes", recipesRouter)

const PORT = process.env.PORT || 3001

console.log(process.env.PORT)

connectDB()
.then(() => {

    app.listen(PORT, () => {
    console.log(`servidor corriendo en puerto http://localhost:${PORT}`)
    })

})

