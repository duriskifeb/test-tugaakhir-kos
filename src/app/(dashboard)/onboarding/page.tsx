import { createTenant } from "./actions"; // Memanggil fungsi dari actions.ts

export default function OnboardingPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900">Halo, Pemilik Kos! 👋</h2>
                    <p className="text-sm text-gray-500 mt-2">Mari buat ruang kerja (workspace) untuk manajemen kos Anda.</p>
                </div>

                <form action={createTenant} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nama Kos Anda</label>
                        <input
                            type="text"
                            name="name"
                            required
                            placeholder="Cth: Kos Pintu Berkah Indah"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Subdomain (Untuk Link Website)</label>
                        <div className="flex items-center">
                            <input
                                type="text"
                                name="subdomain"
                                required
                                placeholder="kos-pintu-berkah"
                                className="w-full px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-600 outline-none"
                            />
                            <span className="bg-gray-100 px-3 py-2 border border-l-0 border-gray-300 rounded-r-lg text-gray-500 text-sm">
                                .pintuberkah.com
                            </span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">Hanya huruf, angka, dan strip (-)</p>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-[#3b23c6] hover:bg-[#2f1c9e] text-white font-semibold py-2.5 rounded-lg transition-colors mt-4"
                    >
                        Buat Ruang Kerja
                    </button>
                </form>
            </div>
        </div>
    );
}
