import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { useAuth } from "../lib/auth-context";
import { AlertCircle, Loader2 } from "lucide-react";

export default function SignUp() {
  const navigate = useNavigate();
  const { signup, error, isLoading, clearError, isAuthenticated } = useAuth();

  const [fullName, setFullName] = React.useState("");
  const [email, setEmail] = React.useState(() => {
    try {
      return localStorage.getItem("joseph:signupEmail") || "";
    } catch {
      return "";
    }
  });
  const [password, setPassword] = React.useState("");
  const [localError, setLocalError] = React.useState("");
  const googleClientId = import.meta.env?.VITE_GOOGLE_CLIENT_ID as
    | string
    | undefined;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLocalError("");
    clearError();

    if (!fullName || !email || !password) {
      setLocalError("Please fill in all fields");
      return;
    }

    try {
      await signup(email, password, fullName);
      // Navigate to onboarding after successful signup
      navigate("/onboarding", { replace: true });
    } catch (err) {
      setLocalError(error || "Signup failed. Please try again.");
    }
  }

  // Google Identity Services: load script and render button if client id is provided
  React.useEffect(() => {
    if (!googleClientId) return;
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      // @ts-ignore
      if (window.google?.accounts?.id) {
        // @ts-ignore
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: (response: any) => {
            // Google credential handling - not yet implemented
            // The credential (JWT) would need to be exchanged for an auth token
            console.log(
              "Google sign-up - credential received but integration not yet implemented",
            );
            try {
              localStorage.setItem(
                "joseph:googleCredential",
                response?.credential || "",
              );
            } catch {}
            // Navigate to onboarding for Google auth flow
            navigate("/onboarding");
          },
        });
        // @ts-ignore
        window.google.accounts.id.renderButton(
          document.getElementById("googleSignInBtn"),
          { theme: "outline", size: "large", width: 360 },
        );
      }
    };
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, [googleClientId, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center px-3 sm:px-4 py-8">
      <Card className="w-full max-w-md shadow">
        <CardContent className="p-4 sm:p-6">
          <div className="text-center mb-4 sm:mb-6">
            <div className="text-lg sm:text-2xl font-bold">
              Create your Joseph account
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground mt-1">
              Access Solutions, Infrastructure, and Learn
            </div>
          </div>

          {/* Error Message */}
          {(localError || error) && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs sm:text-sm text-red-800">
                {localError || error}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <div>
              <label className="block text-xs sm:text-sm mb-1.5">
                Full name
              </label>
              <Input
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  setLocalError("");
                }}
                placeholder="Jane Doe"
                className="text-xs sm:text-sm h-9 sm:h-10"
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm mb-1.5">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setLocalError("");
                }}
                placeholder="you@example.com"
                required
                className="text-xs sm:text-sm h-9 sm:h-10"
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm mb-1.5">
                Password
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setLocalError("");
                }}
                placeholder="••••••••"
                required
                className="text-xs sm:text-sm h-9 sm:h-10"
                disabled={isLoading}
              />
            </div>
            <Button
              type="submit"
              disabled={isLoading || !fullName || !email || !password}
              className="w-full h-9 sm:h-10 text-xs sm:text-sm"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 mr-2 animate-spin" />
                  Creating account…
                </>
              ) : (
                "Create account"
              )}
            </Button>
          </form>

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

          <div className="mt-4 sm:mt-6">
            {googleClientId ? (
              <div id="googleSignInBtn" className="flex justify-center" />
            ) : (
              <div className="text-xs text-muted-foreground text-center">
                Set <b>VITE_GOOGLE_CLIENT_ID</b> in your environment to enable
                Google sign-in.
              </div>
            )}
          </div>

          {/* Sign In Link */}
          <div className="mt-4 sm:mt-6 text-center text-xs sm:text-sm text-gray-600">
            Already have an account?{" "}
            <Button
              variant="link"
              className="text-blue-600 hover:text-blue-700 p-0 h-auto font-semibold text-xs sm:text-sm"
              onClick={() => navigate("/login")}
            >
              Sign in
            </Button>
          </div>

          <div className="text-[10px] sm:text-xs text-muted-foreground mt-3 sm:mt-4 text-center leading-relaxed">
            By continuing you agree to our Terms and acknowledge our Privacy
            Policy.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
