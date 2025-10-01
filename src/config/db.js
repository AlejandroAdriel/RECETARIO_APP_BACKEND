import mongoose, { trusted } from "mongoose"

export const connectDB = async () => {
    try {
        const dbURI = process.env.MONGODB_URI

        mongoose.connect(dbURI)
        console.log("Conectado a MongoDB correctamente")
    } catch (error) {
        console.error("Error al conectar con MongoDB", error)
        process.exit(1)
    }
}