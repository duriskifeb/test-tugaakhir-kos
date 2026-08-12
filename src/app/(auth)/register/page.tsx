import Link from "next/link";
import { register } from "./actions"; // Memanggil fungsi dari actions.ts

export default function RegisterPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900">Daftar Pintu Berkah</h2>
                    <p className="text-sm text-gray-500 mt-2">Buat akun untuk mengelola kos Anda.</p>
                </div>

                {/* Form akan memanggil fungsi register saat di-submit */}
                <form action={register} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                        <input
                            type="text"
                            name="fullName"
                            required
                            placeholder="John Doe"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            required
                            placeholder="nama@email.com"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Kata Sandi</label>
                        <input
                            type="password"
                            name="password"
                            required
                            placeholder="Minimal 6 karakter"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-[#3b23c6] hover:bg-[#2f1c9e] text-white font-semibold py-2.5 rounded-lg transition-colors"
                    >
                        Daftar Sekarang
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-600">
                    Sudah punya akun?{" "}
                    <Link href="/login" className="text-[#3b23c6] font-semibold hover:underline">
                        Masuk di sini
                    </Link>
                </p>
            </div>
        </div>
    );
}
