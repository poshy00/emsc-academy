import { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { v4 as uuidv4 } from 'uuid';

/**
 * Payment Controller - Handles payment-related operations
 */

// POST /api/pagos/crear-sesion - Crear sesión de checkout [ESTUDIANTE]
export const createPaymentSession = async (req: Request, res: Response): Promise<void> => {
  try {
    const { cursoIds } = req.body;
    const userId = req.user?.id;

    if (!cursoIds || cursoIds.length === 0) {
      res.status(400).json({ error: 'Se requieren cursos' });
      return;
    }

    if (!userId) {
      res.status(401).json({ error: 'No autorizado' });
      return;
    }

    // Obtener información de cursos
    const { data: cursos, error: cursosError } = await supabase
      .from('cursos')
      .select('id, titulo, precio')
      .in('id', cursoIds);

    if (cursosError) {
      res.status(500).json({ error: 'Error obteniendo cursos' });
      return;
    }

    const montoTotal = cursos.reduce((sum, c) => sum + parseFloat(c.precio), 0);

    // Crear sesión de pago (placeholder - en prod iría con Stripe)
    const { data: pago, error: pagoError } = await supabase
      .from('pagos')
      .insert({
        id: uuidv4(),
        estudiante_id: userId,
        curso_id: cursoIds[0], // Para V1 solo un curso
        monto_total: montoTotal,
        monto_dinero: montoTotal,
        estado: 'pendiente',
      })
      .select()
      .single();

    if (pagoError) {
      res.status(500).json({ error: 'Error creando pago' });
      return;
    }

    res.json({
      message: 'Sesión de pago creada',
      pago,
      checkout_url: `https://checkout.stripe.com/dummy?session=${pago.id}`,
    });
  } catch (error) {
    console.error('Create payment session error:', error);
    res.status(500).json({ error: 'Error creando sesión de pago' });
  }
};

// POST /api/pagos/webhook-stripe - Webhook Stripe (sin autenticación)
export const stripeWebhook = async (req: Request, res: Response): Promise<void> => {
  try {
    // En producción verificar firma de Stripe
    console.log('Webhook Stripe recibido');

    // Parse raw body
    const sig = req.headers['stripe-signature'] as string;

    // Here you would verify the webhook signature with stripe.webhooks.constructEvent
    // For now we just log and acknowledge
    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Error procesando webhook' });
  }
};
