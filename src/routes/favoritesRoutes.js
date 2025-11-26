import express from 'express';
import { supabase } from '../supabaseClient.js';

const router = express.Router();


router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { recipeId } = req.body;

  try {
    const { data, error } = await supabase.rpc('append_recipe', {
      user_id: id,
      recipe_id: recipeId
    });
    if (error) throw error;
    res.json({ favorite_recipes: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const { data, error } = await supabase
      .from('favorites')
      .select('*')
      .eq('user_id', id);

    if (error) throw error;

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const { recipeId } = req.body;

  try {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', id)
      .eq('recipe_id', recipeId);

    if (error) throw error;

    res.json({ message: 'Favorito eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;