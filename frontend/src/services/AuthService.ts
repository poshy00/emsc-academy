import { createClient } from '@supabase/supabase-js';
import { User, LoginFormData, RegisterFormData, LoginResponse } from '@/types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and ANON_KEY must be set in environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export const AuthService = {
  /**
   * Register new user
   */
  async register(data: RegisterFormData): Promise<LoginResponse> {
    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          nombre: data.nombre,
          rol: 'estudiante', // default role
        },
      },
    });

    if (error) throw error;
    if (!authData.user) throw new Error('No se pudo crear el usuario');

    // Additional profile data is handled via database trigger or edge function
    
    return {
      user: {
        id: authData.user.id,
        email: authData.user.email!,
        nombre: data.nombre,
        rol: 'estudiante',
      } as User,
      session: {
        access_token: authData.session?.access_token || '',
        refresh_token: authData.session?.refresh_token || '',
        expires_in: authData.session?.expires_in || 3600,
        token_type: 'bearer',
      },
    };
  },

  /**
   * Login user
   */
  async login(data: LoginFormData): Promise<LoginResponse> {
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) throw error;
    if (!authData.user) throw new Error('Credenciales inválidas');

    // Get user profile from database
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (profileError) throw profileError;

    const user: User = {
      id: profile.id,
      email: profile.email,
      nombre: profile.nombre,
      rol: profile.rol,
      avatar_url: profile.avatar_url,
      bio: profile.bio,
      es_verificado: profile.es_verificado,
    };

    return {
      user,
      session: {
        access_token: authData.session?.access_token || '',
        refresh_token: authData.session?.refresh_token || '',
        expires_in: authData.session?.expires_in || 3600,
        token_type: 'bearer',
      },
    };
  },

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    await supabase.auth.signOut();
  },

  /**
   * Get current user session
   */
  async getCurrentUser(): Promise<User | null> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return null;

    const { data: profile, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error || !profile) return null;

    return {
      id: profile.id,
      email: profile.email,
      nombre: profile.nombre,
      rol: profile.rol,
      avatar_url: profile.avatar_url,
      bio: profile.bio,
      es_verificado: profile.es_verificado,
    } as User;
  },

  /**
   * Refresh session
   */
  async refreshSession(): Promise<boolean> {
    const { error } = await supabase.auth.refreshSession();
    return !error;
  },

  /**
   * Reset password
   */
  async resetPassword(email: string): Promise<void> {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) throw error;
  },

  /**
   * Update password (after reset)
   */
  async updatePassword(newPassword: string): Promise<void> {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    if (error) throw error;
  },

  /**
   * Verify email (resend)
   */
  async resendVerificationEmail(): Promise<void> {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: (await supabase.auth.getUser()).data.user?.email,
    });
    if (error) throw error;
  },

  /**
   * Social auth - Google
   */
  async signInWithGoogle(redirectTo?: string): Promise<void> {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectTo || `${window.location.origin}/auth/callback`,
      },
    });
    if (error) throw error;
  },
};

export default AuthService;
