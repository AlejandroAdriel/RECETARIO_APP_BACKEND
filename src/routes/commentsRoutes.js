import { Router } from "express";
import { supabase } from "../supabaseClient.js";

const router = Router();

router.get("/:recipeId", async (req, res) => {
  try {
    const { recipeId } = req.params;

    const { data, error } = await supabase
      .from("comments")
      .select("id, created_at, content, recipe_id, users(id, username)")
      .eq("recipe_id", recipeId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    res.status(200).json(data);
  } catch (err) {
    console.error("GET /comments error:", err);
    res.status(500).json({ error: "Error al obtener comentarios" });
  }
});

router.post("/:recipeId", async (req, res) => { 
  try {
    const { recipeId } = req.params;
    const { content, userId } = req.body; 

    if (!content || !userId) {
      return res.status(400).json({ error: "content y userId son requeridos" });
    }

    const { data, error } = await supabase
      .from("comments")
      .insert([
        { 
          recipe_id: recipeId, 
          user_id: userId,
          content: content 
        }
      ])
      .select("id, created_at, content, recipe_id, users(id, username)")
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    console.error("POST /comments error:", err);
    res.status(500).json({ error: "Error al crear comentario" });
  }
});

router.delete("/:commentId", async (req, res) => {
  try {
    const { commentId } = req.params;
    const { userId } = req.body;

    if (!userId) {
       return res.status(401).json({ error: "No autenticado" });
    }

    const { error, data } = await supabase
      .from("comments")
      .delete()
      .eq('id', commentId)     
      .eq('user_id', userId)   
      .select()
      .single();

    if (error) throw error;
    
    if (!data) {
      return res.status(404).json({ error: "Comentario no encontrado o sin permisos" });
    }

    res.status(200).json({ message: "Comentario eliminado", deletedComment: data });

  } catch (err) {
    console.error("DELETE /comments error:", err);
    res.status(500).json({ error: "Error al borrar comentario" });
  }
});

export default router;