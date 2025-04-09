import Link from "next/link";
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

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const toggleSidebar = () => setCollapsed((prev) => !prev);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside
        className={`${
          collapsed ? "w-15" : "w-50"
        } bg-gray-100 p-4 shadow-md flex flex-col transition-all duration-200`}
      >
        {/* Collapse Toggle */}
        <button
          onClick={toggleSidebar}
          className={` text-gray-600 hover:text-blue-600 mb-6
          }`}
        >
          {collapsed ? <Menu size={20} /> : <X size={20} />}
          {!collapsed}
        </button>

        {/* User Info */}
        <div className={`flex items-center gap-2 text-gray-800 mb-6 `}>
          <User size={20} />
          {!collapsed && <span className="font-medium">User</span>}
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-4 text-gray-800 flex-grow">
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

          {/* Sign Out */}
          <button
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/auth/login";
            }}
            className="mt-6 flex items-center gap-2  text-red-500 hover:text-red-600"
          >
            <LogOut size={20} />
            {!collapsed && "Sign Out"}
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 bg-white">{children}</main>
    </div>
  );
}
