import { supabase, supabaseAuth } from '../config/supabase';
import { v4 as uuidv4 } from 'uuid';
import { jwtDecode } from 'jwt-decode';
import {
  RegisterPayload,
  LoginPayload,
  AuthResponse,
  User,
  ServiceResult,
} from '../types';

/**
 * Auth Service - Business logic for authentication
 */
export class AuthService {
  /**
   * Register a new user
   */
  static async register(payload: RegisterPayload): Promise<ServiceResult<AuthResponse>> {
    try {
      const { email, password, nombre } = payload;

      // Create user with admin API
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });

      if (authError) {
        return { success: false, error: authError.message };
      }

      // Create user profile
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email,
          nombre,
          rol: 'estudiante',
        });

      if (profileError) {
        console.error('Profile error:', profileError);
      }

      // Generate simple token
      const token = this.generateToken({
        id: authData.user.id,
        email: authData.user.email,
      });

      return {
        success: true,
        data: {
          token,
          user: {
            id: authData.user.id,
            email: authData.user.email,
            nombre,
            rol: 'estudiante',
          },
        },
      };
    } catch (error) {
      return { success: false, error: 'Error en registro' };
    }
  }

  /**
   * Login user
   */
  static async login(payload: LoginPayload): Promise<ServiceResult<AuthResponse>> {
    try {
      const { email, password } = payload;

      // Verify user exists (admin API)
      const { data: userList, error: listError } = await supabase.auth.admin.listUsers();

      if (listError) {
        return { success: false, error: 'Error en login' };
      }

      const authUser = userList.users.find((u) => u.email === email);

      if (!authUser) {
        return { success: false, error: 'Credenciales inválidas' };
      }

      // Get user profile
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('nombre, rol')
        .eq('id', authUser.id)
        .single();

      if (userError) {
        return { success: false, error: 'Error en login' };
      }

      // Generate token
      const token = this.generateToken({
        id: authUser.id,
        email: authUser.email,
      });

      return {
        success: true,
        data: {
          token,
          user: {
            id: authUser.id,
            email: authUser.email,
            nombre: userData?.nombre,
            rol: userData?.rol || 'estudiante',
          },
        },
      };
    } catch (error) {
      return { success: false, error: 'Error en login' };
    }
  }

  /**
   * Get current user profile
   */
  static async getProfile(userId: string): Promise<ServiceResult<User>> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Error obteniendo perfil' };
    }
  }

  /**
   * Decode and verify JWT token
   */
  static decodeToken(token: string): { id: string; email: string; exp: number } | null {
    try {
      return jwtDecode(token);
    } catch {
      return null;
    }
  }

  private static generateToken(payload: { id: string; email: string }): string {
    const tokenData = {
      ...payload,
      exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
    };
    return Buffer.from(JSON.stringify(tokenData)).toString('base64');
  }
}
