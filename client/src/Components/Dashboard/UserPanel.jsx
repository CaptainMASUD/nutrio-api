import React, { useEffect, useMemo, useState } from "react";
import {
  Shield,
  Users,
  Search,
  Plus,
  Trash2,
  Pencil,
  X,
  Check,
  RefreshCw,
  UserCog,
  Mail,
  KeyRound,
} from "lucide-react";

const API_BASE = "https://nutrio-api.vercel.app/api";

const getStored = (key, fallback = null) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return key === "user" ? JSON.parse(raw) : raw;
  } catch {
    return fallback;
  }
};

export default function AdminUsersPanel() {
  const token = getStored("token", "");
  const currentUser = getStored("user", null);

  const isAdmin = currentUser?.role === "admin";

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [busyId, setBusyId] = useState("");
  const [query, setQuery] = useState("");

  const [toast, setToast] = useState({ type: "", text: "" });

  // modal state
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("create"); // create | edit
  const [activeUser, setActiveUser] = useState(null);

  // form state
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "user",
    password: "",
  });

  const headers = useMemo(() => {
    const h = { "Content-Type": "application/json" };
    if (token) h.Authorization = `Bearer ${token}`;
    return h;
  }, [token]);

  const showToast = (type, text) => {
    setToast({ type, text });
    setTimeout(() => setToast({ type: "", text: "" }), 2500);
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/users/admin/users`, { headers });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to load users");
      setUsers(data.users || []);
    } catch (err) {
      showToast("error", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin && token) fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin, token]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) => {
      const name = (u.name || "").toLowerCase();
      const email = (u.email || "").toLowerCase();
      const role = (u.role || "").toLowerCase();
      return name.includes(q) || email.includes(q) || role.includes(q);
    });
  }, [users, query]);

  const openCreate = () => {
    setMode("create");
    setActiveUser(null);
    setForm({ name: "", email: "", role: "user", password: "" });
    setOpen(true);
  };

  const openEdit = (u) => {
    setMode("edit");
    setActiveUser(u);
    setForm({
      name: u.name || "",
      email: u.email || "",
      role: u.role || "user",
      password: "", // only set if admin wants to change
    });
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
    setActiveUser(null);
    setForm({ name: "", email: "", role: "user", password: "" });
  };

  const onChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();

    try {
      if (mode === "create") {
        if (!form.email || !form.password) {
          return showToast("error", "Email and password are required");
        }

        const res = await fetch(`${API_BASE}/users/admin/users`, {
          method: "POST",
          headers,
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            password: form.password,
            role: form.role,
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data?.message || "Create failed");

        showToast("success", "User created ✅");
        closeModal();
        fetchUsers();
      } else {
        // edit
        const id = activeUser?._id;
        if (!id) return;

        const payload = {
          name: form.name,
          email: form.email,
          role: form.role,
        };
        if (form.password) payload.password = form.password; // optional

        const res = await fetch(`${API_BASE}/users/admin/users/${id}`, {
          method: "PUT",
          headers,
          body: JSON.stringify(payload),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data?.message || "Update failed");

        showToast("success", "User updated ✅");
        closeModal();
        fetchUsers();
      }
    } catch (err) {
      showToast("error", err.message);
    }
  };

  const removeUser = async (u) => {
    const id = u?._id;
    if (!id) return;

    // optional safety: prevent deleting yourself (UI-side)
    if (currentUser?.id && currentUser.id === id) {
      return showToast("error", "You cannot delete yourself");
    }

    const ok = window.confirm(`Delete ${u.email}?`);
    if (!ok) return;

    setBusyId(id);
    try {
      const res = await fetch(`${API_BASE}/users/admin/users/${id}`, {
        method: "DELETE",
        headers,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Delete failed");

      showToast("success", "User deleted ✅");
      fetchUsers();
    } catch (err) {
      showToast("error", err.message);
    } finally {
      setBusyId("");
    }
  };

  // Guards
  if (!token) {
    return (
      <div className="min-h-screen bg-slate-950 grid place-items-center p-6">
        <div className="max-w-md w-full rounded-2xl border border-emerald-500/20 bg-slate-900/60 p-6">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-emerald-500/15 border border-emerald-400/20 flex items-center justify-center">
              <Shield className="h-5 w-5 text-emerald-300" />
            </div>
            <div>
              <h2 className="text-white font-semibold text-lg">You’re not logged in</h2>
              <p className="text-slate-400 text-sm">Login first to access admin panel.</p>
            </div>
          </div>
          <a
            href="/login"
            className="mt-5 inline-flex w-full justify-center rounded-xl bg-emerald-400 py-3 font-semibold text-slate-950 hover:bg-emerald-300 transition"
          >
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-950 grid place-items-center p-6">
        <div className="max-w-md w-full rounded-2xl border border-emerald-500/20 bg-slate-900/60 p-6">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-emerald-500/15 border border-emerald-400/20 flex items-center justify-center">
              <Shield className="h-5 w-5 text-emerald-300" />
            </div>
            <div>
              <h2 className="text-white font-semibold text-lg">Access denied</h2>
              <p className="text-slate-400 text-sm">Admin role required to manage users.</p>
            </div>
          </div>
          <a
            href="/dashboard"
            className="mt-5 inline-flex w-full justify-center rounded-xl bg-emerald-400 py-3 font-semibold text-slate-950 hover:bg-emerald-300 transition"
          >
            Back to Dashboard
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Top bar */}
      <div className="sticky top-0 z-10 bg-slate-950/75 backdrop-blur border-b border-emerald-500/15">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-emerald-500/15 border border-emerald-400/20 flex items-center justify-center">
              <UserCog className="h-5 w-5 text-emerald-300" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">User Management</h1>
              <p className="text-sm text-emerald-200/70">
                Admin panel • {currentUser?.email || "admin"}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={fetchUsers}
              className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-slate-900/50 px-4 py-2.5 text-emerald-200 hover:bg-slate-900 transition"
              title="Refresh"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>

            <button
              onClick={openCreate}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-400 px-4 py-2.5 font-semibold text-slate-950 hover:bg-emerald-300 transition shadow-lg shadow-emerald-500/20"
            >
              <Plus className="h-4 w-4" />
              Add User
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Search */}
        <div className="rounded-2xl border border-emerald-500/15 bg-slate-900/40 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-300/70" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name, email, role..."
                className="w-full pl-10 pr-3 py-3 rounded-xl bg-slate-950/60 border border-emerald-500/20 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
              />
            </div>

            <div className="text-sm text-slate-400">
              Total: <span className="text-emerald-200">{users.length}</span> • Showing:{" "}
              <span className="text-emerald-200">{filtered.length}</span>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="mt-4 rounded-2xl border border-emerald-500/15 bg-slate-900/40 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-900/70">
                <tr className="text-left text-slate-300">
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Created</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-10 text-center text-slate-400">
                      Loading users...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-10 text-center text-slate-400">
                      No users found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((u) => (
                    <tr
                      key={u._id}
                      className="border-t border-emerald-500/10 hover:bg-slate-950/30 transition"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-400/15 flex items-center justify-center">
                            <Users className="h-4 w-4 text-emerald-300" />
                          </div>
                          <div className="font-medium text-white">{u.name || "—"}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-300">{u.email}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs border ${
                            u.role === "admin"
                              ? "bg-emerald-500/10 border-emerald-400/25 text-emerald-200"
                              : "bg-slate-500/10 border-slate-400/20 text-slate-200"
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-400">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => openEdit(u)}
                            className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-slate-950/40 px-3 py-2 text-emerald-200 hover:bg-slate-950/70 transition"
                          >
                            <Pencil className="h-4 w-4" />
                            Edit
                          </button>

                          <button
                            onClick={() => removeUser(u)}
                            disabled={busyId === u._id}
                            className="inline-flex items-center gap-2 rounded-xl border border-rose-500/25 bg-rose-500/10 px-3 py-2 text-rose-200 hover:bg-rose-500/15 transition disabled:opacity-60"
                          >
                            <Trash2 className="h-4 w-4" />
                            {busyId === u._id ? "Deleting..." : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast.text ? (
        <div className="fixed bottom-5 right-5 z-50">
          <div
            className={`rounded-2xl px-4 py-3 text-sm border shadow-xl ${
              toast.type === "success"
                ? "bg-emerald-500/10 border-emerald-400/30 text-emerald-200"
                : "bg-rose-500/10 border-rose-400/30 text-rose-200"
            }`}
          >
            {toast.text}
          </div>
        </div>
      ) : null}

      {/* Modal */}
      {open ? (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl border border-emerald-500/20 bg-slate-900 shadow-2xl shadow-emerald-500/10 overflow-hidden">
            <div className="p-5 border-b border-emerald-500/15 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-emerald-500/15 border border-emerald-400/20 flex items-center justify-center">
                  {mode === "create" ? (
                    <Plus className="h-5 w-5 text-emerald-300" />
                  ) : (
                    <Pencil className="h-5 w-5 text-emerald-300" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold">
                    {mode === "create" ? "Create user" : "Edit user"}
                  </h3>
                  <p className="text-sm text-emerald-200/70">
                    {mode === "create"
                      ? "Add a new user/admin"
                      : "Update user details (password optional)"}
                  </p>
                </div>
              </div>

              <button
                onClick={closeModal}
                className="p-2 rounded-xl hover:bg-slate-950/60 transition text-slate-300"
                title="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={submit} className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-1">
                  <label className="text-sm text-emerald-100/80">Name</label>
                  <div className="mt-1 relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-300/70" />
                    <input
                      name="name"
                      value={form.name}
                      onChange={onChange}
                      placeholder="Full name"
                      className="w-full pl-10 pr-3 py-3 rounded-xl bg-slate-950/60 border border-emerald-500/20 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                    />
                  </div>
                </div>

                <div className="sm:col-span-1">
                  <label className="text-sm text-emerald-100/80">Role</label>
                  <div className="mt-1 relative">
                    <Shield className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-300/70" />
                    <select
                      name="role"
                      value={form.role}
                      onChange={onChange}
                      className="w-full pl-10 pr-3 py-3 rounded-xl bg-slate-950/60 border border-emerald-500/20 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                    >
                      <option value="user">user</option>
                      <option value="admin">admin</option>
                    </select>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="text-sm text-emerald-100/80">Email</label>
                  <div className="mt-1 relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-300/70" />
                    <input
                      name="email"
                      value={form.email}
                      onChange={onChange}
                      placeholder="user@email.com"
                      className="w-full pl-10 pr-3 py-3 rounded-xl bg-slate-950/60 border border-emerald-500/20 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="text-sm text-emerald-100/80">
                    Password{" "}
                    <span className="text-slate-400">
                      {mode === "edit" ? "(leave empty to keep same)" : ""}
                    </span>
                  </label>
                  <div className="mt-1 relative">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-300/70" />
                    <input
                      name="password"
                      value={form.password}
                      onChange={onChange}
                      placeholder={mode === "edit" ? "New password (optional)" : "Password"}
                      type="password"
                      className="w-full pl-10 pr-3 py-3 rounded-xl bg-slate-950/60 border border-emerald-500/20 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-slate-950/40 px-4 py-2.5 text-emerald-200 hover:bg-slate-950/70 transition"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </button>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-400 px-4 py-2.5 font-semibold text-slate-950 hover:bg-emerald-300 transition shadow-lg shadow-emerald-500/20"
                >
                  <Check className="h-4 w-4" />
                  {mode === "create" ? "Create" : "Save changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
