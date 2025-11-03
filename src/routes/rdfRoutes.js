import express from 'express';
import Recipe from '../models/recipeModel.js';

const router = express.Router();

router.get('/:id', async (req, res) => {
  try {
    const receta = await Recipe.findById(req.params.id);

    if (!receta) {
      return res.status(404).send('Receta no encontrada');
    }

    const rdf = `<?xml version="1.0"?>
<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
         xmlns:ex="https://superrecetario.com/ontology/">

  <rdf:Description rdf:about="https://superrecetario.com/resource/${receta._id}">
    <ex:nombre>${receta.name}</ex:nombre>
    <ex:descripcion>${receta.description}</ex:descripcion>
    <ex:imagen>${receta.image}</ex:imagen>
    <ex:tiempoCoccion>${receta.cookTime}</ex:tiempoCoccion>
    <ex:porciones>${receta.servings}</ex:porciones>
    <ex:dificultad>${receta.difficulty}</ex:dificultad>
    <ex:categoria>${receta.category}</ex:categoria>
    ${receta.ingredients.map(i => `<ex:ingrediente>${i}</ex:ingrediente>`).join('\n    ')}
    ${receta.instructions.map((i, idx) => `<ex:paso${idx + 1}>${i}</ex:paso${idx + 1}>`).join('\n    ')}
  </rdf:Description>

</rdf:RDF>`;

    res.setHeader('Content-Type', 'application/rdf+xml');
    res.send(rdf);
  } catch (error) {
    console.error('Error generando RDF:', error);
    res.status(500).send('Error interno del servidor');
  }
});

export default router;
