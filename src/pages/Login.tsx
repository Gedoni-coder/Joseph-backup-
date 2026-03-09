import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { AlertCircle, Mail, Lock, Loader2 } from "lucide-react";
import { useAuth } from "../lib/auth-context";

declare global {
  interface Window {
    google?: {
      accounts?: {
        id?: {
          initialize: (config: any) => void;
          renderButton: (element: HTMLElement | null, options?: any) => void;
        };
      };
    };
  }
}

export default function Login() {
  const navigate = useNavigate();
  const { login, error, isLoading, clearError, isAuthenticated } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const googleClientId = import.meta.env?.VITE_GOOGLE_CLIENT_ID as
    | string
    | undefined;

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/home", { replace: true });
    }
  }, []);

  const handleGoogleSignIn = useCallback(
    async (response: any) => {
      setGoogleLoading(true);
      setLocalError("");
      clearError();

      try {
        // The response.credential is a JWT token from Google
        // This would need to be sent to your backend to authenticate the user
        // For now, store it and show implementation guidance
        const credential = response?.credential;

        if (!credential) {
          setLocalError("Failed to get Google credentials");
          return;
        }

        // TODO: Implement backend endpoint to exchange Google JWT for auth token
        // This should:
        // 1. Verify the Google JWT signature
        // 2. Find or create a user in your backend database with the Google account info
        // 3. Return an authToken to store in localStorage
        // 4. Call the useAuth().login or directly set user state

        console.log(
          "Google Sign-In credential received, integration not yet implemented",
        );
        console.log("Credential:", credential.substring(0, 20) + "...");

        // For now, show a helpful message
        setLocalError(
          "Google Sign-In integration not yet implemented. Please use email/password login.",
        );
      } catch (err) {
        setLocalError(
          "Google Sign-In failed. Please try username/password login.",
        );
      } finally {
        setGoogleLoading(false);
      }
    },
    [clearError],
  );

  // Load Google Identity Services script
  useEffect(() => {
    if (!googleClientId) return;

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: handleGoogleSignIn,
        });
        window.google.accounts.id.renderButton(
          document.getElementById("googleSignInBtn"),
          { theme: "outline", size: "large", width: "100%" },
        );
      }
    };
    document.body.appendChild(script);

    return () => {
      try {
        document.body.removeChild(script);
      } catch {
        // Script already removed
      }
    };
  }, [googleClientId, handleGoogleSignIn]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");
    clearError();

    if (!email || !password) {
      setLocalError("Please fill in all fields");
      return;
    }

    try {
      await login(email, password);
      // Navigate to home after successful login
      navigate("/home", { replace: true });
    } catch (err) {
      setLocalError(error || "Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center py-8 px-3 sm:px-4 lg:px-8">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl border-0">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 sm:p-6">
            <div>
              <CardTitle className="text-xl sm:text-2xl mb-1 sm:mb-2">
                Welcome Back
              </CardTitle>
              <p className="text-blue-100 text-xs sm:text-sm">
                Sign in to your account to continue to Joseph AI
              </p>
            </div>
          </CardHeader>

          <CardContent className="p-4 sm:p-8">
            {/* Error Message */}
            {(localError || error) && (
              <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 sm:gap-3">
                <AlertCircle className="h-4 sm:h-5 w-4 sm:w-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm text-red-800">
                  {localError || error}
                </p>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              {/* Email Field */}
              <div>
                <Label
                  htmlFor="email"
                  className="text-xs sm:text-sm font-medium"
                >
                  Email Address
                </Label>
                <div className="relative mt-1.5 sm:mt-2">
                  <Mail className="absolute left-3 top-2.5 sm:top-3 h-4 sm:h-5 w-4 sm:w-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setLocalError("");
                    }}
                    placeholder="you@example.com"
                    className="pl-9 sm:pl-10 h-9 sm:h-11 text-xs sm:text-sm"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <div className="flex items-center justify-between gap-2">
                  <Label
                    htmlFor="password"
                    className="text-xs sm:text-sm font-medium"
                  >
                    Password
                  </Label>
                  <Button
                    type="button"
                    variant="link"
                    className="text-xs text-blue-600 hover:text-blue-700 p-0 h-auto"
                    onClick={() => navigate("/forgot-password")}
                  >
                    Forgot?
                  </Button>
                </div>
                <div className="relative mt-1.5 sm:mt-2">
                  <Lock className="absolute left-3 top-2.5 sm:top-3 h-4 sm:h-5 w-4 sm:w-5 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setLocalError("");
                    }}
                    placeholder="••••••••"
                    className="pl-9 sm:pl-10 pr-12 h-9 sm:h-11 text-xs sm:text-sm"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 sm:right-3 top-2.5 sm:top-3 text-xs text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {/* Sign In Button */}
              <Button
                type="submit"
                disabled={isLoading || !email || !password}
                className="w-full h-9 sm:h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs sm:text-sm"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-3.5 sm:h-4 w-3.5 sm:w-4 mr-2 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>

              {/* Divider */}
              <div className="relative my-4 sm:my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-xs sm:text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>

              {/* Google OAuth Button */}
              {googleClientId ? (
                <div id="googleSignInBtn" />
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  disabled={true}
                  className="w-full h-9 sm:h-11 border-gray-300 text-xs sm:text-sm"
                >
                  <svg
                    className="h-3.5 sm:h-5 w-3.5 sm:w-5 mr-2"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  <span className="hidden sm:inline">
                    Google (Not configured)
                  </span>
                </Button>
              )}
            </form>

            {/* Sign Up Link */}
            <p className="text-center text-xs sm:text-sm text-gray-600 mt-4 sm:mt-6">
              Don't have an account?{" "}
              <Button
                variant="link"
                className="text-blue-600 hover:text-blue-700 p-0 h-auto font-semibold text-xs sm:text-sm"
                onClick={() => navigate("/signup")}
              >
                Sign up
              </Button>
            </p>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-gray-500 mt-4 sm:mt-6">
          © 2024 Joseph AI. All rights reserved.
        </p>
      </div>
    </div>
  );
}
