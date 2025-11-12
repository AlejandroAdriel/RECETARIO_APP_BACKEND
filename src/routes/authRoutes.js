import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { supabase } from '../supabaseClient.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  const { username, email, password, is_admin } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const { data, error } = await supabase
      .from('users')
      .insert([{ username, email, password_hash: hashedPassword, is_admin }])
      .select('id, username, email, is_admin');

    if (error) throw error;

    res.json(data[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !data)
      return res.status(401).json({ error: 'Usuario no encontrado' });

    const valid = await bcrypt.compare(password, data.password_hash);
    if (!valid) return res.status(401).json({ error: 'Contraseña incorrecta' });

    const token = jwt.sign(
      { id: data.id, is_admin: data.is_admin },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      token,
      user: {
        id: data.id,
        username: data.username,
        email: data.email,
        is_admin: data.is_admin
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ids de mongo para guardar recetas
router.put('/favorites/:id', async (req, res) => {
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


// Obtener todos los favoritos de un usuario
router.get('/favorites/:id', async (req, res) => {
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


// Eliminar un favorito
router.delete('/favorites/:id', async (req, res) => {
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
