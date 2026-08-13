import { createClient } from "@/lib/supabase/server";
import { Users, Home, CheckCircle2, Clock } from "lucide-react";
import Link from "next/link";

export default async function AdminDashboardOverview() {
  const supabase = await createClient();

  // 1. Fetch statistics
  const { count: totalTenants } = await supabase
    .from("tenants")
    .select("*", { count: "exact", head: true });

  const { count: verifiedTenants } = await supabase
    .from("tenants")
    .select("*", { count: "exact", head: true })
    .eq("status", "VERIFIED");

  const { count: unverifiedTenants } = await supabase
    .from("tenants")
    .select("*", { count: "exact", head: true })
    .eq("status", "UNVERIFIED");

  const { count: totalUsers } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("role", "owner");

  // 2. Fetch latest 5 registrations
  const { data: latestTenants } = await supabase
    .from("tenants")
    .select(`
      id,
      name,
      status,
      created_at,
      profiles!tenants_owner_id_fkey (full_name)
    `)
    .order("created_at", { ascending: false })
    .limit(5);

  const stats = [
    {
      name: "Total Pemilik Kos",
      value: totalUsers || 0,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      name: "Total Kos (Tenant)",
      value: totalTenants || 0,
      icon: Home,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    {
      name: "Kos Terverifikasi",
      value: verifiedTenants || 0,
      icon: CheckCircle2,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      name: "Menunggu Verifikasi",
      value: unverifiedTenants || 0,
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
  ];

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Ringkasan Sistem</h1>
        <p className="text-gray-500 mt-1">Pantau statistik pendaftaran dan stabilitas platform Anda.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.bg}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
              <h3 className="text-gray-500 text-sm font-medium mb-1">{stat.name}</h3>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
          <h2 className="font-semibold text-gray-900">Pendaftaran Terbaru</h2>
          <Link href="/admin/verifikasi" className="text-sm text-black font-medium hover:underline">
            Lihat Semua &rarr;
          </Link>
        </div>
        <div className="p-0">
          {latestTenants && latestTenants.length > 0 ? (
            <ul className="divide-y divide-gray-100">
              {latestTenants.map((tenant: any) => (
                <li key={tenant.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{tenant.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">Oleh: {tenant.profiles?.full_name || "Unknown"}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400">
                      {new Date(tenant.created_at).toLocaleDateString("id-ID", { day: 'numeric', month: 'short' })}
                    </span>
                    {tenant.status === "VERIFIED" ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-green-50 text-green-700">
                        Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700">
                        Unverified
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-8 text-center text-gray-500 text-sm">Belum ada aktivitas pendaftaran.</div>
          )}
        </div>
      </div>
    </div>
  );
}
