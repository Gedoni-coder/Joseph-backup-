import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import * as authService from "./api/auth-service";
import type { UserRecord } from "./api/auth-service";

export type AuthUser = UserRecord;

export interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_STORAGE_KEY = "authToken";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check authentication on mount
  useEffect(() => {
    checkAuthOnMount();
  }, []);

  const checkAuthOnMount = async () => {
    setIsLoading(true);
    try {
      const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
      if (storedToken) {
        try {
          const userRecord = await authService.getMe(storedToken);
          setUser(userRecord);
          setError(null);
        } catch {
          // Token is invalid or expired — clear it
          localStorage.removeItem(TOKEN_STORAGE_KEY);
          setUser(null);
        }
      }
    } catch (err) {
      console.error("Failed to check auth on mount:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.login({ email, password });

      // Store real DRF token
      localStorage.setItem(TOKEN_STORAGE_KEY, response.authToken);
      setUser(response.user);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Login failed";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signup = useCallback(
    async (email: string, password: string, name: string) => {
      setIsLoading(true);
      setError(null);
      try {
        // Clear any previous user's company data before setting up the new account
        localStorage.removeItem("joseph:companyInfo");

        const response = await authService.signup({ email, password, name });

        // Store real DRF token
        localStorage.setItem(TOKEN_STORAGE_KEY, response.authToken);
        setUser(response.user);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Signup failed";
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const logout = useCallback(() => {
    authService.logout();
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem("joseph:companyInfo");
    setUser(null);
    setError(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const checkAuth = useCallback(async () => {
    const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (!storedToken) {
      setUser(null);
      return;
    }

    try {
      const userRecord = await authService.getMe(storedToken);
      setUser(userRecord);
      setError(null);
    } catch {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      setUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        clearError,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

/**
 * Get the current auth token
 * Used by API services to include in Authorization header
 */
export function getAuthToken(): string | null {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}
