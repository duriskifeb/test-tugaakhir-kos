"use client";

import { Search, Bell, HelpCircle, LogOut } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

// Inisialisasi Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://dummy-project.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "dummy-anon-key";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function Topbar() {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Menutup dropdown jika klik di luar
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/"); // Kembali ke halaman login
  };

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

        {/* Avatar Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="relative w-9 h-9 rounded-full overflow-hidden border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#3b23c6] focus:ring-offset-2 hover:border-gray-300 transition-colors"
          >
            <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-600 font-bold text-sm">
              AL
            </div>
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-900">Alex Johnson</p>
                <p className="text-xs text-gray-500 truncate">alex@example.com</p>
              </div>
              <div className="py-1">
                <button 
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
