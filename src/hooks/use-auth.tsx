'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import type { User, Session } from '@supabase/supabase-js';
import type { Role } from '@/lib/types';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  role: Role;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  setRole: (role: Role) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [role, setRoleState] = useState<Role>('cashier');

  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  // Load user from session (non-sensitive data only)
  const loadUser = useCallback(async () => {
    try {
      // Check if we have valid auth tokens in cookies (handled by browser automatically)
      // Make a request to verify session is valid
      const response = await fetch('/api/auth/me', {
        method: 'GET',
        credentials: 'include', // Send cookies
      }).catch(() => null);

      if (response?.ok) {
        const data = await response.json();
        setUser(data.user as unknown as User);
        setIsAuthenticated(true);
        if (data.role) {
          setRoleState(data.role as Role);
          console.log('👤 User loaded with role:', data.role);
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (e) {
      console.warn('Error loading user:', e);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  // Redirect based on auth state
  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated && pathname !== '/login') router.push('/login');
    if (isAuthenticated && pathname === '/login') router.push('/');
  }, [isAuthenticated, isLoading, pathname, router]);

  // Login with secure cookie handling
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Validate input
      if (!email || !password) {
        toast({
          title: 'Validation Error',
          description: 'Email and password are required',
          variant: 'destructive',
        });
        return false;
      }

      if (email.length > 255) {
        toast({
          title: 'Validation Error',
          description: 'Email is too long',
          variant: 'destructive',
        });
        return false;
      }

      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include', // Include cookies in request
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        toast({
          title: 'Authentication Error',
          description: errorData.message || 'Incorrect email or password',
          variant: 'destructive',
        });
        return false;
      }

      const { user: apiUser } = await res.json();
      console.log('🔑 Login successful:', apiUser.email, 'Role:', apiUser.role);
      
      setUser(apiUser as unknown as User);
      setIsAuthenticated(true);
      setRoleState(apiUser.role as Role);

      toast({
        title: 'Login Successful',
        description: `Welcome ${apiUser.email}`,
      });
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: 'Error',
        description: 'Could not connect to server',
        variant: 'destructive',
      });
      return false;
    }
  };

  // Logout with proper cleanup
  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include', // Include cookies
      }).catch(() => null);
    } catch {}
    
    setUser(null);
    setSession(null);
    setIsAuthenticated(false);
    router.push('/login');
  };

  const setRole = (newRole: Role) => setRoleState(newRole);

  return (
    <AuthContext.Provider value={{ user, session, role, isAuthenticated, isLoading, login, logout, setRole }}>
      {isLoading ? (
        <div className="flex h-screen items-center justify-center">Loading...</div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
