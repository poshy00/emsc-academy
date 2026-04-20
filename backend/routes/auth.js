import express from 'express';
import { supabase } from '../server.js';
import { verifyAuth } from '../middleware/auth.js';
 
const router = express.Router();
 
// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { email, password, nombre } = req.body;
 
    if (!email || !password || !nombre) {
      return res.status(400).json({ error: 'Email, contraseña y nombre requeridos' });
    }
 
    // Crear usuario con admin API (no necesita anon key)
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    });
 
    if (authError) {
      return res.status(400).json({ error: authError.message });
    }
 
    // Crear perfil en tabla users
    const { error: profileError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        email,
        nombre,
        rol: 'estudiante'
      });
 
    if (profileError) {
      console.error('Profile error:', profileError);
    }
 
    res.status(201).json({
      message: 'Registro exitoso',
      user: {
        id: authData.user.id,
        email: authData.user.email
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Error en registro' });
  }
});
 
// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
 
    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña requeridos' });
    }
 
    // Verificar credenciales usando admin API
    const { data: userList, error: listError } = await supabase.auth.admin.listUsers();
 
    if (listError) {
      return res.status(500).json({ error: 'Error en login' });
    }
 
    const authUser = userList.users.find(u => u.email === email);
 
    if (!authUser) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
 
    // Obtener datos del perfil
    const { data: userData } = await supabase
      .from('users')
      .select('*')
      .eq('id', authUser.id)
      .single();
 
    // Crear token simple
    const token = Buffer.from(JSON.stringify({
      id: authUser.id,
      email: authUser.email,
      exp: Date.now() + 7 * 24 * 60 * 60 * 1000
    })).toString('base64');
 
    res.json({
      token,
      user: {
        id: authUser.id,
        email: authUser.email,
        nombre: userData?.nombre,
        rol: userData?.rol || 'estudiante'
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Error en login' });
  }
});
 
// GET /api/auth/me
router.get('/me', verifyAuth, async (req, res) => {
  try {
    const { data: userData } = await supabase
      .from('users')
      .select('*')
      .eq('id', req.user.id)
      .single();
 
    res.json(userData);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Error obteniendo usuario' });
  }
});
 
export default router;