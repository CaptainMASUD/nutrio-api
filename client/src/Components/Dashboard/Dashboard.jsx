// src/Components/Dashboard/Dashboard.jsx
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X, Users, Stethoscope, LayoutGrid, LogOut } from "lucide-react";

import UserManagement from "./UserPanel";
import AdminProvidersPanel from "./DoctorsPnale";

const Dashboard = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("users");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const user = useMemo(() => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleChangeTab = (tab) => {
    setActiveTab(tab);
    setIsSidebarOpen(false); // close sidebar on mobile
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden">
      {/* MOBILE BACKDROP */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className="flex min-h-screen">
        {/* SIDEBAR */}
        <aside
          className={`
            fixed inset-y-0 left-0 z-30 w-72
            bg-slate-900/70 backdrop-blur border-r border-emerald-500/15
            shadow-2xl shadow-emerald-500/10
            transform transition-transform duration-200 ease-in-out
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
            md:translate-x-0 md:relative
          `}
        >
          {/* Sidebar header */}
          <div className="px-5 py-5 border-b border-emerald-500/15 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-2xl bg-emerald-500/15 border border-emerald-400/20 flex items-center justify-center">
                <LayoutGrid className="h-5 w-5 text-emerald-300" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Admin Dashboard</h2>
                <p className="text-xs text-emerald-200/70">
                  {user?.email || "admin"}
                  {user?.role ? ` • ${user.role}` : ""}
                </p>
              </div>
            </div>

            {/* Mobile close */}
            <button
              className="md:hidden p-2 rounded-xl hover:bg-slate-950/60 transition"
              onClick={() => setIsSidebarOpen(false)}
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5 text-slate-200" />
            </button>
          </div>

          {/* Sidebar nav */}
          <nav className="px-4 py-4 space-y-2">
            <button
              onClick={() => handleChangeTab("users")}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-2xl border transition
                ${
                  activeTab === "users"
                    ? "bg-emerald-400 text-slate-950 border-emerald-300 shadow-lg shadow-emerald-500/20"
                    : "bg-slate-950/40 text-slate-200 border-emerald-500/15 hover:bg-slate-950/70"
                }`}
            >
              <Users className="w-5 h-5" />
              <div className="text-left">
                <div className="font-semibold leading-5">Users</div>
                <div className={`text-xs ${activeTab === "users" ? "text-slate-800/80" : "text-slate-400"}`}>
                  Manage users & roles
                </div>
              </div>
            </button>

            <button
              onClick={() => handleChangeTab("providers")}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-2xl border transition
                ${
                  activeTab === "providers"
                    ? "bg-emerald-400 text-slate-950 border-emerald-300 shadow-lg shadow-emerald-500/20"
                    : "bg-slate-950/40 text-slate-200 border-emerald-500/15 hover:bg-slate-950/70"
                }`}
            >
              <Stethoscope className="w-5 h-5" />
              <div className="text-left">
                <div className="font-semibold leading-5">Doctors & Counselors</div>
                <div className={`text-xs ${activeTab === "providers" ? "text-slate-800/80" : "text-slate-400"}`}>
                  CRUD providers list
                </div>
              </div>
            </button>
          </nav>

          {/* Logout */}
          <div className="mt-auto px-4 pb-5">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 rounded-2xl
                bg-rose-500/15 border border-rose-400/25 text-rose-200
                py-3 font-semibold hover:bg-rose-500/20 transition"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>

            <p className="mt-3 text-center text-xs text-slate-500">
              API: <span className="text-emerald-300/70">localhost:4000</span>
            </p>
          </div>
        </aside>

        {/* MAIN */}
        <main className="flex-1 min-h-screen md:ml-0">
          {/* Mobile top bar */}
          <div className="md:hidden sticky top-0 z-10 flex items-center justify-between px-4 py-3 bg-slate-950/80 backdrop-blur border-b border-emerald-500/15">
            <button
              className="p-2 rounded-xl border border-emerald-500/20 bg-slate-900/50 hover:bg-slate-900 transition"
              onClick={() => setIsSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5 text-emerald-200" />
            </button>

            <h1 className="font-semibold text-slate-200">
              {activeTab === "users" ? "Users" : "Doctors & Counselors"}
            </h1>

            <span className="w-9" />
          </div>

          {/* Page content */}
          <div className="p-4 md:p-6">
            {activeTab === "users" && <UserManagement />}
            {activeTab === "providers" && <AdminProvidersPanel />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
