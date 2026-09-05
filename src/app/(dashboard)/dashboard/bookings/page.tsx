import { BookingsClient } from "./BookingsClient";
import { getBookings } from "./actions";

export const metadata = {
  title: "Pemesanan - MamiKos SaaS",
};

export default async function BookingsPage() {
  const { data, error } = await getBookings();

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Pengajuan Pemesanan</h1>
          <p className="text-gray-500 mt-2 text-base">Tinjau pengajuan sewa kamar dari calon penghuni melalui website publik.</p>
        </div>
      </div>

      {error ? (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 font-medium">
          Error memuat data pengajuan: {error}
        </div>
      ) : (
        <BookingsClient initialData={data || []} />
      )}
    </div>
  );
}
