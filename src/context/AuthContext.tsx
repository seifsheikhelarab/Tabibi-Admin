import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { toast } from 'react-toastify';
import { api } from '../lib/api';
import { authClient } from '../lib/auth';

interface User {
  id: string;
  email: string;
  name: string;
  image?: string;
}

interface AuthContextType {
  user: User | null;
  session: any;
  organizationId: string | null;
  organizations: any[];
  role: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  setActiveOrganization: (orgId: string) => Promise<void>;
  isDoctor: boolean;
  isAdmin: boolean;
  isOwner: boolean;
  isReceptionist: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: sessionData, isPending: isSessionLoading } = authClient.useSession();
  const { data: organizationsData, isPending: isOrgsLoading } = authClient.useListOrganizations();
  const [role, setRole] = useState<string | null>(localStorage.getItem('role'));
  const [organizationId, setOrganizationId] = useState<string | null>(localStorage.getItem('organizationId'));

  const isLoading = isSessionLoading || (!!sessionData?.user && isOrgsLoading);

  const user = sessionData?.user ? {
    id: sessionData.user.id,
    email: sessionData.user.email,
    name: sessionData.user.name,
    image: sessionData.user.image,
  } : null;

  const organizations = organizationsData || [];

  const normalizedRole = role?.toUpperCase();
  const isDoctor = normalizedRole === 'DOCTOR';
  const isAdmin = normalizedRole === 'ADMIN' || normalizedRole === 'OWNER';
  const isOwner = normalizedRole === 'OWNER';
  const isReceptionist = normalizedRole === 'RECEPTIONIST';

  useEffect(() => {
    if (sessionData?.session?.activeOrganizationId) {
      setOrganizationId(sessionData.session.activeOrganizationId);
      localStorage.setItem('organizationId', sessionData.session.activeOrganizationId);
    }
  }, [sessionData]);

  useEffect(() => {
    const fetchRole = async () => {
      if (user && !role) {
        try {
          const response = await api.get('/api/members/me');
          // Handle standardized response { success, data }
          const memberData = response.data?.data || response.data;
          if (memberData?.role) {
            setRole(memberData.role);
            localStorage.setItem('role', memberData.role);
          }
        } catch (error) {
          console.error('Failed to fetch role:', error);
        }
      }
    };
    fetchRole();
  }, [user, role]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { error } = await authClient.signIn.email({
        email,
        password,
      });

      if (error) {
        toast.error(error.message || 'Invalid credentials');
        return false;
      }

      const memberResponse = await api.get('/api/members/me');
      const memberData = memberResponse.data?.data || memberResponse.data;
      
      if (memberData?.role) {
        const userRole = memberData.role;
        setRole(userRole);
        localStorage.setItem('role', userRole);

        toast.success('Login successful!');
        
        const normalizedRole = userRole.toUpperCase();
        const isDoctorRole = normalizedRole === 'DOCTOR';
        const isAdminRole = normalizedRole === 'ADMIN' || normalizedRole === 'OWNER';
        
        const redirectPath = normalizedRole === 'RECEPTIONIST' 
          ? '/reception-appointments' 
          : isAdminRole 
            ? '/admin-dashboard' 
            : isDoctorRole 
              ? '/doctor-dashboard'
              : '/login';
        
        setTimeout(() => {
          window.location.href = redirectPath;
        }, 100);
        
        return true;
      }
      
      return true;
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error('Login failed');
      return false;
    }
  };

  const logout = async () => {
    try {
      await authClient.signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      setRole(null);
      setOrganizationId(null);
      localStorage.removeItem('organizationId');
      localStorage.removeItem('role');
      window.location.href = '/login';
    }
  };

  const setActiveOrganization = async (orgId: string) => {
    try {
      const { error } = await authClient.organization.setActive({
        organizationId: orgId
      });
      if (error) {
        toast.error(error.message);
        return;
      }
      
      // Refresh role for new organization
      setRole(null);
      localStorage.removeItem('role');
      
      const memberResponse = await api.get('/api/members/me');
      const memberData = memberResponse.data?.data || memberResponse.data;
      if (memberData?.role) {
        setRole(memberData.role);
        localStorage.setItem('role', memberData.role);
      }
      
      toast.success('Organization switched');
      window.location.reload();
    } catch (error: any) {
      console.error('Switch organization error:', error);
      toast.error('Failed to switch organization');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session: sessionData?.session,
        organizationId,
        organizations,
        role,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        setActiveOrganization,
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
