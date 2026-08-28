import { HelpCircle } from "lucide-react";

export default async function SupportPage() {
  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Bantuan & Dukungan (Support)</h1>
        <p className="text-gray-500 mt-1">
          Hubungi tim dukungan kami jika Anda mengalami kendala teknis atau pertanyaan seputar aplikasi.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
          <HelpCircle className="w-8 h-8 text-indigo-600" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">Pusat Bantuan</h3>
        <p className="text-gray-500 max-w-md mb-6">
          Kirimkan email ke tim support kami dan kami akan membalasnya sesegera mungkin.
        </p>
        <a href="mailto:support@pintuberkah.com" className="px-6 py-2 bg-[#3b23c6] text-white font-medium rounded-lg hover:bg-[#321ca8] transition-colors">
          Hubungi Dukungan
        </a>
      </div>
    </div>
  );
}
