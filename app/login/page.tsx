"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import Logo from "@/components/Logo";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-full flex flex-col justify-center py-12 px-4 bg-background h-full w-full">
      <div className="absolute top-5 left-5">
        <Link href="/" className="flex items-center gap-1.5 text-[12px] text-secondary-text hover:text-primary-text transition-colors font-medium">
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Map
        </Link>
      </div>

      <div className="w-full max-w-sm mx-auto">
        <div className="flex flex-col items-center mb-8">
          <Logo size={36} showWordmark={false} />
          <h2 className="mt-4 text-xl font-bold text-primary-text">Login</h2>
          <p className="mt-1 text-[13px] text-secondary-text">Sign in to access the dashboard.</p>
        </div>

        <div className="bg-surface p-6 rounded-lg border border-border-color">
          {error && (
            <div className="mb-4 text-[12px] text-error bg-error-bg border border-error/10 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-2.5 h-[42px] rounded-lg border border-border-color text-[13px] font-medium text-primary-text hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-primary-text/20 border-t-primary-text rounded-full animate-spin" />
            ) : (
              <>
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Sign in with Google
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
