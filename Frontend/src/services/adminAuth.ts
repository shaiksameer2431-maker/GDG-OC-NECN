// ==============================================================================
// Admin Authentication & Session Management
// ==============================================================================

const ADMIN_TOKEN_KEY = 'necn_admin_auth_token_v1';
const ADMIN_USER_KEY = 'necn_admin_auth_user_v1';

// Default secure admin credentials (customizable by administrator)
const AUTHORIZED_PASSWORDS = [
  'necn2026admin',
  'gdgnecn2026',
  'googlecloudnecn'
];

export interface AdminSession {
  email: string;
  name: string;
  role: 'super_admin' | 'admin';
  token: string;
  expiresAt: number;
}

export const adminAuth = {
  login(password: string): { success: boolean; session?: AdminSession; error?: string } {
    if (!password || !password.trim()) {
      return { success: false, error: 'Please enter the administrative master key.' };
    }

    const cleanInput = password.trim();
    if (AUTHORIZED_PASSWORDS.includes(cleanInput)) {
      const session: AdminSession = {
        email: 'gdg.necn@narayanagroup.com',
        name: 'GDG NECN Lead Admin',
        role: 'super_admin',
        token: `necn-sec-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        expiresAt: Date.now() + 1000 * 60 * 60 * 8 // 8 hours session
      };

      try {
        sessionStorage.setItem(ADMIN_TOKEN_KEY, session.token);
        sessionStorage.setItem(ADMIN_USER_KEY, JSON.stringify(session));
      } catch (e) {
        console.warn('SessionStorage failed:', e);
      }

      return { success: true, session };
    }

    return { success: false, error: 'Invalid master key. Access restricted to authorized GDG NECN administrators.' };
  },

  getCurrentSession(): AdminSession | null {
    try {
      const raw = sessionStorage.getItem(ADMIN_USER_KEY);
      if (!raw) return null;
      const session: AdminSession = JSON.parse(raw);
      if (Date.now() > session.expiresAt) {
        this.logout();
        return null;
      }
      return session;
    } catch {
      return null;
    }
  },

  isAuthenticated(): boolean {
    return this.getCurrentSession() !== null;
  },

  logout(): void {
    try {
      sessionStorage.removeItem(ADMIN_TOKEN_KEY);
      sessionStorage.removeItem(ADMIN_USER_KEY);
    } catch (e) {
      console.warn('Logout cleanup failed:', e);
    }
  }
};

