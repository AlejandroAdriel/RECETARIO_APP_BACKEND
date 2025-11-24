import express from "express";
import Recipe from "../models/recipeModel.js";

const router = express.Router();

const xmlEscape = (s = "") =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

router.get("/:id", async (req, res) => {
  try {
    const receta = await Recipe.findById(req.params.id);
    if (!receta) return res.status(404).send("Receta no encontrada");

    const base = "https://superrecetario.com";
    const resourceURI = `${base}/resource/${receta._id}`;
    const ontology = `${base}/ontology/`;

    const rdf = `<?xml version="1.0"?>
<rdf:RDF
  xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
  xmlns:rdfs="http://www.w3.org/2000/01/rdf-schema#"
  xmlns:owl="http://www.w3.org/2002/07/owl#"
  xmlns:xsd="http://www.w3.org/2001/XMLSchema#"
  xmlns:ex="${ontology}"
>

  <rdf:Description rdf:about="${resourceURI}">
    <rdf:type rdf:resource="${ontology}Receta"/>
    <ex:nombre>${xmlEscape(receta.name)}</ex:nombre>
    <ex:descripcion>${xmlEscape(receta.description)}</ex:descripcion>
    <ex:imagen>${xmlEscape(receta.image)}</ex:imagen>
    <ex:tiempoCoccion>${receta.cookTime}</ex:tiempoCoccion>
    <ex:porciones>${receta.servings}</ex:porciones>
    <ex:dificultad>${xmlEscape(receta.difficulty)}</ex:dificultad>
    <ex:categoria>${xmlEscape(receta.category)}</ex:categoria>

    ${Array.isArray(receta.ingredients)
      ? receta.ingredients
          .map((i) => `    <ex:ingrediente>${xmlEscape(i)}</ex:ingrediente>`)
          .join("\n")
      : ""}

    ${Array.isArray(receta.instructions)
      ? receta.instructions
          .map(
            (i, idx) =>
              `    <ex:paso${idx + 1}>${xmlEscape(i)}</ex:paso${idx + 1}>`
          )
          .join("\n")
      : ""}

    ${
      receta.restrictions
        ? `    <ex:restricciones>${xmlEscape(receta.restrictions)}</ex:restricciones>`
        : ""
    }
  </rdf:Description>

</rdf:RDF>`;

    res.setHeader("Content-Type", "application/rdf+xml; charset=utf-8");
    res.status(200).send(rdf);
  } catch (error) {
    console.error("Error generando RDF:", error);
    res.status(500).send("Error interno del servidor");
  }
});

export default router;