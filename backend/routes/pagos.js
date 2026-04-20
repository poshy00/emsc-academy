import express from 'express';
import { supabase } from '../server.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// POST /api/pagos/crear-sesion - Crear sesión de checkout [ESTUDIANTE]
router.post('/crear-sesion', async (req, res) => {
  try {
    const { cursoIds } = req.body;
    const userId = req.user.id;

    if (!cursoIds || cursoIds.length === 0) {
      return res.status(400).json({ error: 'Se requieren cursos' });
    }

    // Obtener información de cursos
    const { data: cursos } = await supabase
      .from('cursos')
      .select('id, titulo, precio')
      .in('id', cursoIds);

    const montoTotal = cursos.reduce((sum, c) => sum + parseFloat(c.precio), 0);

    // Crear sesión de pago (placeholder - en prod iría con Stripe)
    const { data: pago } = await supabase
      .from('pagos')
      .insert({
        id: uuidv4(),
        estudiante_id: userId,
        curso_id: cursoIds[0], // Para V1 solo un curso
        monto_total: montoTotal,
        monto_dinero: montoTotal,
        estado: 'pendiente'
      })
      .select()
      .single();

    res.json({
      message: 'Sesión de pago creada',
      pago,
      // En producción retornaría URL de Stripe checkout
      checkout_url: `https://checkout.stripe.com/dummy?session=${pago.id}`
    });
  } catch (error) {
    console.error('Create session error:', error);
    res.status(500).json({ error: 'Error creando sesión de pago' });
  }
});

// POST /api/webhooks/stripe - Webhook Stripe (sin autenticación)
router.post('/webhook-stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    // En producción verificar firma de Stripe
    console.log('Webhook Stripe recibido');
    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Error procesando webhook' });
  }
});

export default router;
