import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { toast } from 'react-toastify';
import { authApi, api } from '../lib/api';

interface User {
  id: string;
  email: string;
  name: string;
  image?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  organizationId: string | null;
  role: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
  isDoctor: boolean;
  isAdmin: boolean;
  isOwner: boolean;
  isReceptionist: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('sessionToken'));
  const [organizationId, setOrganizationId] = useState<string | null>(localStorage.getItem('organizationId'));
  const [role, setRole] = useState<string | null>(localStorage.getItem('role'));
  const [isLoading, setIsLoading] = useState(true);

  const normalizedRole = role?.toUpperCase();
  const isDoctor = normalizedRole === 'DOCTOR';
  const isAdmin = normalizedRole === 'ADMIN' || normalizedRole === 'OWNER';
  const isOwner = normalizedRole === 'OWNER';
  const isReceptionist = normalizedRole === 'RECEPTIONIST';

  const refreshSession = useCallback(async () => {
    try {
      const storedToken = localStorage.getItem('sessionToken');
      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      const response = await authApi.getSession();
      if (response?.user) {
        setUser({
          id: response.user.id,
          email: response.user.email,
          name: response.user.name || response.user.email.split('@')[0],
          image: response.user.image,
        });
        setOrganizationId(response.session?.activeOrganizationId || localStorage.getItem('organizationId'));
        setToken(storedToken);
      }
    } catch (error) {
      console.error('Session refresh failed:', error);
      logout();
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await authApi.signIn(email, password);
      
      if (response?.token || response?.session?.token) {
        const authToken = response.token || response.session.token;
        localStorage.setItem('sessionToken', authToken);
        setToken(authToken);

        const sessionResponse = await authApi.getSession();
        if (sessionResponse?.user) {
          setUser({
            id: sessionResponse.user.id,
            email: sessionResponse.user.email,
            name: sessionResponse.user.name || sessionResponse.user.email.split('@')[0],
            image: sessionResponse.user.image,
          });
          localStorage.setItem('user', JSON.stringify(sessionResponse.user));
        }

        if (sessionResponse.session?.activeOrganizationId) {
          setOrganizationId(sessionResponse.session.activeOrganizationId);
          localStorage.setItem('organizationId', sessionResponse.session.activeOrganizationId);
        }

        const memberResponse = await api.get('/api/members/me');
        if (memberResponse.data) {
          setRole(memberResponse.data.role);
          localStorage.setItem('role', memberResponse.data.role);
        }

        toast.success('Login successful!');
        return true;
      }
      
      toast.error('Invalid credentials');
      return false;
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.message || 'Login failed');
      return false;
    }
  };

  const logout = async () => {
    try {
      await authApi.signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      setUser(null);
      setToken(null);
      setOrganizationId(null);
      setRole(null);
      localStorage.removeItem('sessionToken');
      localStorage.removeItem('user');
      localStorage.removeItem('organizationId');
      localStorage.removeItem('role');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        organizationId,
        role,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        logout,
        refreshSession,
        isDoctor,
        isAdmin,
        isOwner,
        isReceptionist,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
