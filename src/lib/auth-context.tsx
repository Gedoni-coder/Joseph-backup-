import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import * as authService from "./api/auth-service";

export interface AuthUser {
  id: number;
  created_at: string;
  name: string;
  email: string;
  account_id: number;
  role: string;
}

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
const TOKEN_EXPIRY_KEY = "authTokenExpiry";
const REFRESH_INTERVAL = 7 * 60 * 1000; // 7 minutes (refresh 1 minute before 8 minute expiry)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check authentication on mount
  useEffect(() => {
    checkAuthOnMount();
  }, []);

  // Refresh token periodically
  useEffect(() => {
    if (!user) return;

    const refreshInterval = setInterval(() => {
      refreshTokenIfNeeded();
    }, REFRESH_INTERVAL);

    return () => clearInterval(refreshInterval);
  }, [user]);

  const checkAuthOnMount = async () => {
    setIsLoading(true);
    try {
      // Check if we have a stored token that's still valid
      const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
      const storedExpiry = localStorage.getItem(TOKEN_EXPIRY_KEY);

      if (storedToken && storedExpiry) {
        const expiryTime = parseInt(storedExpiry, 10);
        if (expiryTime > Date.now()) {
          // Token is still valid, try to get user info
          try {
            const userRecord = await authService.getMe(storedToken);
            setUser(userRecord);
            setError(null);
          } catch (err) {
            // Token might be invalid, clear it
            localStorage.removeItem(TOKEN_STORAGE_KEY);
            localStorage.removeItem(TOKEN_EXPIRY_KEY);
            setUser(null);
          }
        } else {
          // Token expired
          localStorage.removeItem(TOKEN_STORAGE_KEY);
          localStorage.removeItem(TOKEN_EXPIRY_KEY);
        }
      }
    } catch (err) {
      console.error("Failed to check auth on mount:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshTokenIfNeeded = async () => {
    const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
    const storedExpiry = localStorage.getItem(TOKEN_EXPIRY_KEY);

    if (!storedToken || !storedExpiry) return;

    const expiryTime = parseInt(storedExpiry, 10);
    const timeUntilExpiry = expiryTime - Date.now();

    // If token expires in less than 1 minute, try to refresh
    if (timeUntilExpiry < 60 * 1000) {
      try {
        // Set a new expiry time (8 minutes from now)
        const newExpiryTime = Date.now() + 8 * 60 * 1000;
        localStorage.setItem(TOKEN_EXPIRY_KEY, newExpiryTime.toString());
      } catch (err) {
        console.error("Failed to refresh token:", err);
        logout();
      }
    }
  };

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.login({ email, password });

      // Store token and set expiry (8 minutes)
      const tokenExpiry = Date.now() + 8 * 60 * 1000;
      localStorage.setItem(TOKEN_STORAGE_KEY, response.authToken);
      localStorage.setItem(TOKEN_EXPIRY_KEY, tokenExpiry.toString());

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
        const response = await authService.signup({ email, password, name });

        // Store token and set expiry (8 minutes)
        const tokenExpiry = Date.now() + 8 * 60 * 1000;
        localStorage.setItem(TOKEN_STORAGE_KEY, response.authToken);
        localStorage.setItem(TOKEN_EXPIRY_KEY, tokenExpiry.toString());

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
    localStorage.removeItem(TOKEN_EXPIRY_KEY);
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
    } catch (err) {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      localStorage.removeItem(TOKEN_EXPIRY_KEY);
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
