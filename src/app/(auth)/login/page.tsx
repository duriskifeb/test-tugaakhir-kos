"use client";

import Image from "next/image";
import { Fingerprint, Eye, XCircle, CheckCircle2, X } from "lucide-react";
import { Playfair_Display } from "next/font/google";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const playfair = Playfair_Display({ subsets: ["latin"] });

export default function LoginPage() {
  const router = useRouter();
  const [view, setView] = useState<"sign_in" | "sign_up">("sign_in");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      if (view === "sign_up") {
        if (password !== confirmPassword) {
          throw new Error("Password dan Konfirmasi Password tidak cocok.");
        }

        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              phone: phone,
            },
          },
        });

        if (signUpError) throw signUpError;

        if (signUpData.user) {
          const { data: staffCheck } = await supabase
            .from("tenant_staffs")
            .select("id")
            .eq("email", email)
            .maybeSingle();

          const userRole = staffCheck ? "staff" : "owner";

          await supabase.from("profiles").upsert({
            id: signUpData.user.id,
            full_name: fullName,
            phone: phone,
            role: userRole,
            updated_at: new Date().toISOString()
          });

          if (staffCheck) {
            await supabase.from("tenant_staffs")
              .update({ status: "active" })
              .eq("email", email);
          }
        }

        setMessage(
          "Registrasi berhasil! Silakan cek email Anda untuk verifikasi (jika diaktifkan di Supabase), atau langsung login."
        );
        setView("sign_in");
      } else {
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) throw signInError;

        let redirectUrl = "/dashboard";
        if (signInData.user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", signInData.user.id)
            .single();

          if (profile?.role === "admin") {
            redirectUrl = "/admin/dashboard";
          }
        }

        setMessage("Login berhasil! Mengalihkan ke dashboard...");
        setTimeout(() => {
          router.push(redirectUrl);
        }, 1500);
      }
    } catch (err: any) {
      console.error("Login/Register error full object:", err);
      let errorMsg = "Terjadi kesalahan yang tidak terduga.";

      if (err?.message) {
        errorMsg = err.message;
      } else if (typeof err === "string") {
        errorMsg = err;
      } else if (err && typeof err === "object") {
        try {
          const keys = Object.keys(err);
          errorMsg = keys.length ? JSON.stringify(err) : String(err);
          if (err.name) errorMsg = `${err.name}: ${errorMsg}`;
          if (err.status) errorMsg = `Status ${err.status}: ${errorMsg}`;
        } catch (e) {
          errorMsg = "Gagal memproses detail error.";
        }
      }

      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });
      if (error) throw error;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Terjadi kesalahan.";
      setError(message);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Panel Kiri - Ilustrasi */}
      <div
        className="hidden lg:flex lg:w-[45%] relative overflow-hidden m-5 rounded-3xl"
        style={{ background: "linear-gradient(135deg, #c8b6e2 0%, #a78fd4 40%, #9b72cf 70%, #b89ce0 100%)" }}
      >
        <div className="absolute top-6 left-6 z-10 flex items-center gap-2">
          <Fingerprint className="w-4 h-4 text-white/80" />
          <span className="text-white/80 text-xs font-semibold tracking-wide">Pintu Berkah</span>
        </div>

        <Image
          src="/auth_illustration.jpg"
          alt="Login Illustration"
          fill
          sizes="45vw"
          className="object-cover object-center"
          priority
        />

        <div
          className="absolute bottom-0 left-0 right-0 h-24"
          style={{ background: "linear-gradient(to top, rgba(167,143,212,0.5), transparent)" }}
        />
      </div>

      {/* Panel Kanan - Form */}
      <div className="flex-1 flex flex-col justify-center items-center px-8 sm:px-16 py-12 relative overflow-y-auto">
        {/* Link atas kanan */}
        <div className="absolute top-6 right-8 text-sm text-gray-500">
          {view === "sign_in" ? (
            <>
              Not a member?{" "}
              <button
                onClick={() => setView("sign_up")}
                className="font-semibold text-[#e05c5c] hover:underline"
              >
                Register now
              </button>
            </>
          ) : (
            <>
              Already a member?{" "}
              <button
                onClick={() => setView("sign_in")}
                className="font-semibold text-[#e05c5c] hover:underline"
              >
                Sign In
              </button>
            </>
          )}
        </div>

        <div className="w-full max-w-[360px]">
          {/* Header */}
          <div className="mb-8">
            <h2 className={`${playfair.className} text-4xl font-bold text-gray-900 mb-2`}>
              {view === "sign_in" ? "Hello Again!" : "Create Account"}
            </h2>
            <p className="text-gray-400 text-sm">
              {view === "sign_in"
                ? "Welcome back you've been missed!"
                : "Register as a property owner to manage your boarding house"}
            </p>
          </div>

          {/* Form */}
          <form className="flex flex-col gap-3.5" onSubmit={handleSubmit}>
            {view === "sign_up" && (
              <>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter full name"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-sm text-gray-700 focus:outline-none focus:border-[#c8b6e2] focus:ring-2 focus:ring-[#c8b6e2]/20 transition-all placeholder:text-gray-400 bg-white"
                />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter phone number"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-sm text-gray-700 focus:outline-none focus:border-[#c8b6e2] focus:ring-2 focus:ring-[#c8b6e2]/20 transition-all placeholder:text-gray-400 bg-white"
                />
              </>
            )}

            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter username"
              className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-sm text-gray-700 focus:outline-none focus:border-[#c8b6e2] focus:ring-2 focus:ring-[#c8b6e2]/20 transition-all placeholder:text-gray-400 bg-white"
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full border border-gray-200 rounded-xl pl-4 pr-12 py-3.5 text-sm text-gray-700 focus:outline-none focus:border-[#c8b6e2] focus:ring-2 focus:ring-[#c8b6e2]/20 transition-all placeholder:text-gray-400 bg-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>

            {view === "sign_up" && (
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm password"
                  className="w-full border border-gray-200 rounded-xl pl-4 pr-12 py-3.5 text-sm text-gray-700 focus:outline-none focus:border-[#c8b6e2] focus:ring-2 focus:ring-[#c8b6e2]/20 transition-all placeholder:text-gray-400 bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            )}

            {view === "sign_in" && (
              <div className="flex justify-end">
                <a href="#" className="text-xs text-gray-500 hover:text-gray-800 transition-colors">
                  Recovery Password
                </a>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full text-white rounded-xl py-3.5 font-semibold text-sm transition-all shadow-md disabled:opacity-60 mt-1"
              style={{ background: "linear-gradient(135deg, #f07070 0%, #e05c5c 100%)" }}
            >
              {loading ? "Memproses..." : view === "sign_in" ? "Sign In" : "Register"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">Or continue with</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* OAuth Buttons */}
          <div className="flex justify-center gap-4">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="w-14 h-14 rounded-2xl border border-gray-200 bg-white hover:bg-gray-50 transition-all shadow-sm flex items-center justify-center"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
            </button>

            <button
              type="button"
              className="w-14 h-14 rounded-2xl border border-gray-200 bg-white hover:bg-gray-50 transition-all shadow-sm flex items-center justify-center"
            >
              <svg className="w-5 h-5 text-gray-800" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.7 9.05 7.4c1.39.07 2.35.74 3.16.78 1.2-.24 2.35-.93 3.65-.84 1.56.12 2.73.72 3.51 1.91-3.19 1.93-2.42 5.89.68 7.03-.5 1.35-1.16 2.68-3 4zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
              </svg>
            </button>

            <button
              type="button"
              className="w-14 h-14 rounded-2xl border border-gray-200 bg-white hover:bg-gray-50 transition-all shadow-sm flex items-center justify-center"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1877F2">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Toast Popup */}
      {(error || message) && (
        <div className="fixed top-6 right-6 z-50 animate-in fade-in slide-in-from-top-5 duration-300">
          <div
            className={`rounded-xl shadow-2xl border p-4 max-w-[320px] w-full flex items-start gap-3 backdrop-blur-md ${
              error
                ? "bg-white/90 border-red-200 text-gray-900"
                : "bg-gray-900/95 border-gray-800 text-white"
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {error ? (
                <XCircle className="w-5 h-5 text-red-500" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-green-400" />
              )}
            </div>
            <div className="flex-1">
              <h3 className={`text-sm font-bold ${error ? "text-gray-900" : "text-white"}`}>
                {error ? "Oops! Terjadi Kesalahan" : "Berhasil!"}
              </h3>
              <p className={`text-xs mt-1 leading-relaxed ${error ? "text-gray-600" : "text-gray-300"}`}>
                {error || message}
              </p>
            </div>
            <button
              onClick={() => {
                setError(null);
                setMessage(null);
              }}
              className={`shrink-0 p-1 rounded-md transition-colors ${
                error
                  ? "text-gray-400 hover:bg-gray-100"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
