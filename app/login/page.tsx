"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { LogIn, ArrowLeft, UserPlus } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMsg(null);

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setError(error.message);
      } else {
        setSuccessMsg("Account created! You can now log in.");
        setIsSignUp(false); // Switch to login view
      }
      setIsLoading(false);
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        setIsLoading(false);
        return;
      }

      router.push("/admin");
      router.refresh();
    }
  };

  return (
    <div className="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50 h-full w-full">
      <div className="absolute top-4 left-4">
        <Link href="/" className="flex items-center gap-2 text-secondary-text hover:text-primary-text transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Map</span>
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-success rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-2xl leading-none mt-[2px]">R</span>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-primary-text">
          {isSignUp ? "Create Account" : "Admin Login"}
        </h2>
        <p className="mt-2 text-center text-sm text-secondary-text">
          {isSignUp 
            ? "Sign up to start managing rooms." 
            : "Sign in to access the RoomUndo dashboard."}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-border-color">
          <form className="space-y-6" onSubmit={handleAuth}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-primary-text mb-2">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full appearance-none rounded-xl border border-border-color px-4 py-2.5 placeholder-gray-400 focus:border-success focus:outline-none focus:ring-2 focus:ring-success/20 sm:text-sm transition-all"
                placeholder="admin@roomundo.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-primary-text mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete={isSignUp ? "new-password" : "current-password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full appearance-none rounded-xl border border-border-color px-4 py-2.5 placeholder-gray-400 focus:border-success focus:outline-none focus:ring-2 focus:ring-success/20 sm:text-sm transition-all"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="text-sm text-error bg-error/10 border border-error/20 rounded-lg p-3">
                {error}
              </div>
            )}
            
            {successMsg && (
              <div className="text-sm text-success bg-success/10 border border-success/20 rounded-lg p-3">
                {successMsg}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full justify-center items-center gap-2 rounded-xl bg-success px-4 py-3 text-sm font-bold text-white shadow-sm hover:bg-success/90 focus:outline-none focus:ring-2 focus:ring-success/20 disabled:opacity-50 transition-colors"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : isSignUp ? (
                  <>
                    <UserPlus className="w-5 h-5" />
                    Create Account
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    Sign in
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError(null);
                setSuccessMsg(null);
              }}
              className="text-sm font-medium text-secondary-text hover:text-success transition-colors"
            >
              {isSignUp 
                ? "Already have an account? Sign in" 
                : "Don't have an account? Create one"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
