import { supabase } from '../server.js';

export async function verifyAuth(req, res, next) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Token requerido' });
    }

    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: 'Token inválido' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({ error: 'Error de autenticación' });
  }
}

export async function adminOnly(req, res, next) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    const { data: userData, error } = await supabase
      .from('users')
      .select('rol')
      .eq('id', req.user.id)
      .single();

    if (error || userData?.rol !== 'admin') {
      return res.status(403).json({ error: 'Acceso denegado - Solo administrador' });
    }

    next();
  } catch (error) {
    console.error('Admin check error:', error);
    res.status(403).json({ error: 'Error verificando permisos' });
  }
}
