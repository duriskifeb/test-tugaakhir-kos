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

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");

  // Feedback states
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

        const { error: signUpError } = await supabase.auth.signUp({
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
        setMessage(
          "Registrasi berhasil! Silakan cek email Anda untuk verifikasi (jika diaktifkan di Supabase), atau langsung login."
        );
        setView("sign_in");
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) throw signInError;
        setMessage("Login berhasil! Mengalihkan ke dashboard...");
        setTimeout(() => {
          router.push("/dashboard");
        }, 1500);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Terjadi kesalahan yang tidak terduga.";
      setError(message);
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
      {/* Kolom Kiri - Visuals & Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-black overflow-hidden m-4 rounded-[2rem]">
        <Image
          src="/auth_bg_fluid.png"
          alt="Fluid Art Background"
          fill
          sizes="50vw"
          className="object-cover opacity-90"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80" />
        <div className="absolute top-12 left-12 flex items-center gap-4">
          <span className="text-white text-xs font-bold tracking-widest uppercase">
            A Wise Quote
          </span>
          <div className="h-[1px] w-12 bg-white/50" />
        </div>
        <div className="absolute bottom-16 left-12 right-12">
          <h1
            className={`${playfair.className} text-6xl font-bold text-white mb-6 leading-[1.1]`}
          >
            Get
            <br />
            Everything
            <br />
            You Want
          </h1>
          <p className="text-gray-300 text-sm max-w-md leading-relaxed font-light">
            You can get everything you want if you work hard,
            <br />
            trust the process, and stick to the plan.
          </p>
        </div>
      </div>

      {/* Kolom Kanan - Form Login/Register */}
      <div className="flex-1 flex flex-col pt-12 pb-8 px-8 sm:px-16 lg:px-24 relative overflow-y-auto">
        <div className="w-full max-w-[380px] mx-auto flex flex-col min-h-full">
          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-12">
            <Fingerprint className="w-5 h-5 text-black" />
            <span className="text-lg font-bold text-black tracking-tight">
              Cogie
            </span>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h2
              className={`${playfair.className} text-4xl font-semibold text-gray-900 mb-3`}
            >
              {view === "sign_in" ? "Welcome Back" : "Create Account"}
            </h2>
            <p className="text-gray-500 text-sm">
              {view === "sign_in"
                ? "Enter your email and password to access your account"
                : "Register as a property owner to manage your boarding house"}
            </p>
          </div>

          {/* Custom Form */}
          <div className="flex-1 w-full">
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              {view === "sign_up" && (
                <>
                  {/* Nama Lengkap Input */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Masukkan nama lengkap"
                      className="w-full bg-[#f8f9fa] border-none rounded-xl px-4 py-3.5 text-sm focus:ring-1 focus:ring-gray-300 outline-none transition-all placeholder:text-gray-400"
                    />
                  </div>

                  {/* No Telepon Input */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                      No Telepon
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Masukkan no telpon aktif"
                      className="w-full bg-[#f8f9fa] border-none rounded-xl px-4 py-3.5 text-sm focus:ring-1 focus:ring-gray-300 outline-none transition-all placeholder:text-gray-400"
                    />
                  </div>
                </>
              )}

              {/* Email Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full bg-[#f8f9fa] border-none rounded-xl px-4 py-3.5 text-sm focus:ring-1 focus:ring-gray-300 outline-none transition-all placeholder:text-gray-400"
                />
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full bg-[#f8f9fa] border-none rounded-xl pl-4 pr-12 py-3.5 text-sm focus:ring-1 focus:ring-gray-300 outline-none transition-all placeholder:text-gray-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {view === "sign_up" && (
                /* Konfirmasi Password Input */
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Ulangi password"
                      className="w-full bg-[#f8f9fa] border-none rounded-xl pl-4 pr-12 py-3.5 text-sm focus:ring-1 focus:ring-gray-300 outline-none transition-all placeholder:text-gray-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Remember Me & Forgot Password (Only for Sign In) */}
              {view === "sign_in" && (
                <div className="flex items-center justify-between mt-1 mb-2">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <div className="relative flex items-center justify-center">
                      <input
                        type="checkbox"
                        className="peer appearance-none w-4 h-4 border border-gray-300 rounded bg-white checked:bg-black checked:border-black focus:outline-none focus:ring-2 focus:ring-black/20 transition-all cursor-pointer"
                      />
                      <svg
                        className="absolute w-2.5 h-2.5 text-white pointer-events-none opacity-0 peer-checked:opacity-100"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <span className="text-xs font-semibold text-gray-600 group-hover:text-gray-800 transition-colors">
                      Remember me
                    </span>
                  </label>
                  <a
                    href="#"
                    className="text-xs font-semibold text-gray-800 hover:underline"
                  >
                    Forgot Password
                  </a>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-2 flex flex-col gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-black text-white rounded-xl py-3.5 font-semibold text-sm hover:bg-gray-900 transition-all shadow-sm disabled:opacity-50"
                >
                  {loading ? "Memproses..." : view === "sign_in" ? "Sign In" : "Register"}
                </button>

                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  className="w-full bg-white border border-gray-200 text-gray-800 rounded-xl py-3.5 font-semibold text-sm hover:bg-gray-50 transition-all shadow-sm flex items-center justify-center gap-3"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  {view === "sign_in" ? "Sign In with Google" : "Register with Google"}
                </button>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center text-sm text-gray-500 pb-4">
            {view === "sign_in" ? (
              <p>
                Don&apos;t have an account?{" "}
                <button
                  onClick={() => setView("sign_up")}
                  className="font-bold text-black hover:underline"
                >
                  Sign Up
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{" "}
                <button
                  onClick={() => setView("sign_in")}
                  className="font-bold text-black hover:underline"
                >
                  Sign In
                </button>
              </p>
            )}
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
              <h3
                className={`text-sm font-bold ${error ? "text-gray-900" : "text-white"}`}
              >
                {error ? "Oops! Terjadi Kesalahan" : "Berhasil!"}
              </h3>
              <p
                className={`text-xs mt-1 leading-relaxed ${
                  error ? "text-gray-600" : "text-gray-300"
                }`}
              >
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
