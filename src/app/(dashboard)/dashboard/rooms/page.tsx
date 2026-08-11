"use client";

import { useState } from "react";
import { Plus, Search, Filter, MoreVertical, Edit2, Trash2 } from "lucide-react";

// Data statis untuk skeleton
const mockRooms = [
  { id: "1", number: "A-01", type: "VIP Room", price: 2500000, status: "Occupied", tenant: "Alex Johnson" },
  { id: "2", number: "A-02", type: "VIP Room", price: 2500000, status: "Empty", tenant: null },
  { id: "3", number: "B-01", type: "Standard", price: 1500000, status: "Occupied", tenant: "Sarah Parker" },
  { id: "4", number: "B-02", type: "Standard", price: 1500000, status: "Empty", tenant: null },
  { id: "5", number: "C-01", type: "Economy", price: 1000000, status: "Occupied", tenant: "Michael Chen" },
];

export default function RoomsPage() {
  const [filter, setFilter] = useState("All");

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Rooms Management</h1>
          <p className="text-gray-500 mt-1">Manage your property&apos;s room inventory and availability.</p>
        </div>
        <button className="bg-[#3b23c6] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#2a1796] transition-colors shadow-sm flex items-center gap-2 w-fit">
          <Plus className="w-4 h-4" />
          Add New Room
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search room number or type..." 
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:border-[#3b23c6] focus:ring-1 focus:ring-[#3b23c6] outline-none transition-all"
          />
        </div>
        <div className="flex gap-2">
          {["All", "Empty", "Occupied"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                filter === f 
                  ? "bg-[#ede9fe] text-[#3b23c6] border border-[#d8b4fe]" 
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {f}
            </button>
          ))}
          <button className="px-4 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm font-medium">
            <Filter className="w-4 h-4" />
            More Filters
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="p-4 pl-6">Room Number</th>
                <th className="p-4">Type</th>
                <th className="p-4">Monthly Price</th>
                <th className="p-4">Status</th>
                <th className="p-4">Current Tenant</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {mockRooms
                .filter(room => filter === "All" || room.status === filter)
                .map((room) => (
                <tr key={room.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center border border-gray-200">
                        <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <span className="font-bold text-gray-900">{room.number}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-600">{room.type}</td>
                  <td className="p-4 text-sm font-medium text-gray-900">Rp {room.price.toLocaleString("id-ID")}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                      room.status === "Occupied" 
                        ? "bg-red-50 text-red-700 border-red-200" 
                        : "bg-green-50 text-green-700 border-green-200"
                    }`}>
                      {room.status === "Occupied" ? "Terisi" : "Kosong"}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-500">
                    {room.tenant ? (
                      <span className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-bold">
                          {room.tenant.charAt(0)}
                        </div>
                        {room.tenant}
                      </span>
                    ) : (
                      <span className="text-gray-400 italic">No tenant</span>
                    )}
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 text-gray-400 hover:text-[#3b23c6] hover:bg-[#ede9fe] rounded-md transition-colors" title="Edit">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <button className="p-1.5 text-gray-400 hover:text-gray-900 rounded-md sm:hidden">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Skeleton */}
        <div className="p-4 border-t border-gray-200 flex items-center justify-between text-sm text-gray-500">
          <span>Showing 1 to 5 of 24 results</span>
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50">Previous</button>
            <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
