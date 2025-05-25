"use client";

import Link from "next/link";
import { useRouter } from "next/router";
import { ReactNode, useState } from "react";
import {
  LayoutDashboard,
  Banknote,
  Wallet,
  Target,
  BarChart2,
  User,
  LogOut,
  Menu,
  X,
} from "lucide-react";

// ===========================
// Dashboard Layout Component
// ===========================

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const toggleSidebar = () => setCollapsed((prev) => !prev);

  const router = useRouter();
  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/auth/login");
  };

  return (
    <div className="flex min-h-screen">
      {/* ================= Sidebar ================= */}
      <aside
        className={`${
          collapsed ? "w-15" : "w-50"
        } bg-gray-100 p-4 shadow-md flex flex-col transition-all duration-200`}
      >
        {/* ===== Toggle Collapse Button ===== */}
        <button
          onClick={toggleSidebar}
          className="text-gray-600 hover:text-blue-600 mb-6"
        >
          {collapsed ? <Menu size={20} /> : <X size={20} />}
        </button>

        {/* ================= Navigation Links ================= */}
        <nav className="flex flex-col gap-4 text-gray-800 flex-grow">
          {/* ===== Profile Link ===== */}
          <Link
            href="/dashboard/profile"
            className="flex items-center gap-2 hover:text-blue-600"
          >
            <User size={20} />
            {!collapsed && "Profile"}
          </Link>

          {/* ===== Dashboard Pages ===== */}
          <Link
            href="/dashboard"
            className="flex items-center gap-2 hover:text-blue-600"
          >
            <LayoutDashboard size={20} />
            {!collapsed && "Dashboard"}
          </Link>

          <Link
            href="/dashboard/transactions"
            className="flex items-center gap-2 hover:text-blue-600"
          >
            <Banknote size={20} />
            {!collapsed && "Transactions"}
          </Link>

          <Link
            href="/dashboard/budgets"
            className="flex items-center gap-2 hover:text-blue-600"
          >
            <Wallet size={20} />
            {!collapsed && "Budgets"}
          </Link>

          <Link
            href="/dashboard/goals"
            className="flex items-center gap-2 hover:text-blue-600"
          >
            <Target size={20} />
            {!collapsed && "Goals"}
          </Link>

          <Link
            href="/dashboard/reports"
            className="flex items-center gap-2 hover:text-blue-600"
          >
            <BarChart2 size={20} />
            {!collapsed && "Reports"}
          </Link>

          {/* ===== File Upload Page ===== */}
          <Link
            href="/dashboard/files"
            className="flex items-center gap-2 hover:text-blue-600"
          >
            <Wallet size={20} />
            {!collapsed && "Files"}
          </Link>

          {/* ===== Sign Out Button ===== */}
          <button
            onClick={handleLogout}
            className="mt-6 flex items-center gap-2 text-red-500 hover:text-red-600"
          >
            <LogOut size={20} />
            {!collapsed && "Sign Out"}
          </button>
        </nav>
      </aside>

      {/* ================= Main Content Area ================= */}
      <main className="flex-1 p-8 bg-white">{children}</main>
    </div>
  );
}
