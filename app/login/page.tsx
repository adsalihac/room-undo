"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { LogIn, ArrowLeft, UserPlus } from "lucide-react";
import Link from "next/link";
import Logo from "@/components/Logo";

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
        setIsSignUp(false);
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
    <div className="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-background h-full w-full">
      <div className="absolute top-6 left-6">
        <Link href="/" className="flex items-center gap-2 text-[14px] text-secondary-text hover:text-primary-text transition-colors font-medium">
          <ArrowLeft className="w-4 h-4" />
          Back to Map
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Logo size={40} showWordmark={false} />
        </div>
        <h2 className="mt-5 text-center text-2xl font-bold text-primary-text">
          {isSignUp ? "Create Account" : "Login"}
        </h2>
        <p className="mt-1.5 text-center text-[15px] text-secondary-text">
          {isSignUp
            ? "Sign up to start managing rooms."
            : "Sign in to access the dashboard."}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-surface py-8 px-4 sm:px-10 rounded-2xl border border-border-color">
          <form className="space-y-5" onSubmit={handleAuth}>
            <div>
              <label htmlFor="email" className="block text-[13px] font-medium text-primary-text mb-1.5">
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
                className="block w-full rounded-xl border border-border-color px-4 py-2.5 text-[14px] text-primary-text placeholder:text-secondary-text/60 focus:border-primary-text/30 outline-none transition-all"
                placeholder="admin@roomundo.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-[13px] font-medium text-primary-text mb-1.5">
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
                className="block w-full rounded-xl border border-border-color px-4 py-2.5 text-[14px] text-primary-text placeholder:text-secondary-text/60 focus:border-primary-text/30 outline-none transition-all"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="text-[13px] text-error bg-error/5 border border-error/10 rounded-xl px-4 py-2.5">
                {error}
              </div>
            )}

            {successMsg && (
              <div className="text-[13px] text-primary-text bg-gray-50 border border-border-color rounded-xl px-4 py-2.5">
                {successMsg}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full justify-center items-center gap-2 h-[44px] rounded-xl text-white text-[14px] font-medium disabled:opacity-50 transition-colors"
                style={{ backgroundColor: '#0F172A' }}
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : isSignUp ? (
                  <>
                    <UserPlus className="w-4 h-4" />
                    Create Account
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
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
              className="text-[13px] font-medium text-secondary-text hover:text-primary-text transition-colors"
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
