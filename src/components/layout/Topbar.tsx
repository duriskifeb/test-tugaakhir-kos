"use client";

import { Search, Bell, HelpCircle } from "lucide-react";
import Image from "next/image";

export function Topbar() {
  return (
    <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-10">
      
      {/* Search Bar */}
      <div className="flex-1 max-w-xl relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search properties, tenants, or invoices..."
          className="w-full pl-10 pr-4 py-2.5 bg-[#f3f4f6] border-transparent rounded-full text-sm focus:border-[#3b23c6] focus:bg-white focus:ring-1 focus:ring-[#3b23c6] outline-none transition-all placeholder:text-gray-500"
        />
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-6 ml-4">
        {/* Icons */}
        <div className="flex items-center gap-4">
          <button className="text-gray-500 hover:text-gray-900 transition-colors">
            <Bell className="w-5 h-5" />
          </button>
          <button className="text-gray-500 hover:text-gray-900 transition-colors">
            <HelpCircle className="w-5 h-5" />
          </button>
        </div>

        {/* Support Text */}
        <span className="text-sm font-medium text-gray-700 hidden lg:block cursor-pointer hover:text-black">
          Support
        </span>

        {/* Upgrade Button */}
        <button className="hidden sm:block bg-[#3b23c6] text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-[#2a1796] transition-colors shadow-sm">
          Upgrade
        </button>

        {/* Avatar */}
        <button className="relative w-9 h-9 rounded-full overflow-hidden border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#3b23c6] focus:ring-offset-2">
          {/* Menggunakan image placeholder karena kita belum punya avatar user */}
          <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-600 font-bold text-sm">
            AL
          </div>
        </button>
      </div>
    </header>
  );
}
