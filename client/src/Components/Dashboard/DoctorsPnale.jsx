import React, { useEffect, useMemo, useState } from "react";
import {
  UserPlus,
  Stethoscope,
  MapPin,
  Shield,
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
  Image as ImageIcon,
  RefreshCw,
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

export default function AdminProvidersPanel() {
  const token = getStored("token", "");
  const currentUser = getStored("user", null);
  const isAdmin = currentUser?.role === "admin";

  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [busyId, setBusyId] = useState("");
  const [toast, setToast] = useState({ type: "", text: "" });

  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("create"); // create | edit
  const [active, setActive] = useState(null);

  const [form, setForm] = useState({
    name: "",
    type: "doctor",
    specialist: "",
    location: "",
    image: null,
  });

  const headers = useMemo(() => {
    const h = {};
    if (token) h.Authorization = `Bearer ${token}`;
    return h;
  }, [token]);

  const showToast = (type, text) => {
    setToast({ type, text });
    setTimeout(() => setToast({ type: "", text: "" }), 2500);
  };

  const fetchProviders = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/providers`);
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Fetch failed");
      setProviders(data.providers || []);
    } catch (err) {
      showToast("error", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin && token) fetchProviders();
  }, [isAdmin, token]);

  const openCreate = () => {
    setMode("create");
    setActive(null);
    setForm({
      name: "",
      type: "doctor",
      specialist: "",
      location: "",
      image: null,
    });
    setOpen(true);
  };

  const openEdit = (p) => {
    setMode("edit");
    setActive(p);
    setForm({
      name: p.name || "",
      type: p.type || "doctor",
      specialist: p.specialist || "",
      location: p.location || "",
      image: null,
    });
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
    setActive(null);
  };

  const onChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const onFile = (e) => setForm((p) => ({ ...p, image: e.target.files[0] }));

  const submit = async (e) => {
    e.preventDefault();

    try {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("type", form.type);
      fd.append("specialist", form.specialist);
      fd.append("location", form.location);
      if (form.image) fd.append("image", form.image);

      const url =
        mode === "create"
          ? `${API_BASE}/providers`
          : `${API_BASE}/providers/${active._id}`;

      const res = await fetch(url, {
        method: mode === "create" ? "POST" : "PUT",
        headers,
        body: fd,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Save failed");

      showToast("success", mode === "create" ? "Provider added ✅" : "Updated ✅");
      closeModal();
      fetchProviders();
    } catch (err) {
      showToast("error", err.message);
    }
  };

  const remove = async (p) => {
    if (!window.confirm(`Delete ${p.name}?`)) return;

    setBusyId(p._id);
    try {
      const res = await fetch(`${API_BASE}/providers/${p._id}`, {
        method: "DELETE",
        headers,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Delete failed");

      showToast("success", "Deleted ✅");
      fetchProviders();
    } catch (err) {
      showToast("error", err.message);
    } finally {
      setBusyId("");
    }
  };

  // Guards
  if (!token || !isAdmin) {
    return (
      <div className="min-h-screen bg-slate-950 grid place-items-center p-6">
        <div className="rounded-2xl border border-emerald-500/20 bg-slate-900/60 p-6 max-w-md w-full">
          <div className="flex items-center gap-3">
            <Shield className="h-6 w-6 text-emerald-300" />
            <div>
              <h2 className="text-white font-semibold text-lg">Admin only</h2>
              <p className="text-slate-400 text-sm">
                You must be an admin to manage doctors & counselors.
              </p>
            </div>
          </div>
          <a
            href="/dashboard"
            className="mt-5 block text-center rounded-xl bg-emerald-400 py-3 font-semibold text-slate-950 hover:bg-emerald-300 transition"
          >
            Back to Dashboard
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-slate-950/80 backdrop-blur border-b border-emerald-500/15">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Stethoscope className="h-6 w-6 text-emerald-300" />
            <h1 className="text-xl font-semibold">Doctors & Counselors</h1>
          </div>
          <div className="flex gap-2">
            <button
              onClick={fetchProviders}
              className="rounded-xl border border-emerald-500/20 px-4 py-2 text-emerald-200 hover:bg-slate-900"
            >
              <RefreshCw className="h-4 w-4 inline" />
            </button>
            <button
              onClick={openCreate}
              className="rounded-xl bg-emerald-400 px-4 py-2 font-semibold text-slate-950 hover:bg-emerald-300"
            >
              <Plus className="h-4 w-4 inline" /> Add
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="rounded-2xl border border-emerald-500/15 bg-slate-900/40 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-900/70">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Specialist</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-slate-400">
                    Loading...
                  </td>
                </tr>
              ) : (
                providers.map((p) => (
                  <tr key={p._id} className="border-t border-emerald-500/10">
                    <td className="px-4 py-3 flex items-center gap-2">
                      <img
                        src={p.imageUrl}
                        alt={p.name}
                        className="h-9 w-9 rounded-lg object-cover border border-emerald-500/20"
                      />
                      {p.name}
                    </td>
                    <td className="px-4 py-3 capitalize">{p.type}</td>
                    <td className="px-4 py-3">{p.specialist}</td>
                    <td className="px-4 py-3 flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-emerald-300" />
                      {p.location}
                    </td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <button
                        onClick={() => openEdit(p)}
                        className="px-3 py-1 rounded-lg border border-emerald-500/20 text-emerald-200"
                      >
                        <Pencil className="h-4 w-4 inline" />
                      </button>
                      <button
                        onClick={() => remove(p)}
                        disabled={busyId === p._id}
                        className="px-3 py-1 rounded-lg border border-rose-500/30 text-rose-300"
                      >
                        <Trash2 className="h-4 w-4 inline" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm grid place-items-center p-4 z-40">
          <div className="bg-slate-900 rounded-2xl border border-emerald-500/20 w-full max-w-lg">
            <div className="p-5 border-b border-emerald-500/15 flex justify-between">
              <h2 className="font-semibold">
                {mode === "create" ? "Add Provider" : "Edit Provider"}
              </h2>
              <button onClick={closeModal}>
                <X />
              </button>
            </div>

            <form onSubmit={submit} className="p-5 space-y-4">
              <input
                name="name"
                value={form.name}
                onChange={onChange}
                placeholder="Name"
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-emerald-500/20"
              />
              <select
                name="type"
                value={form.type}
                onChange={onChange}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-emerald-500/20"
              >
                <option value="doctor">Doctor</option>
                <option value="counselor">Counselor</option>
              </select>
              <input
                name="specialist"
                value={form.specialist}
                onChange={onChange}
                placeholder="Specialist"
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-emerald-500/20"
              />
              <input
                name="location"
                value={form.location}
                onChange={onChange}
                placeholder="Location"
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-emerald-500/20"
              />

              <label className="flex items-center gap-2 text-sm text-emerald-200">
                <ImageIcon className="h-4 w-4" />
                Upload image
                <input type="file" onChange={onFile} hidden />
              </label>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded-xl border border-emerald-500/20"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-400 text-slate-950 font-semibold"
                >
                  <Check className="inline h-4 w-4" /> Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast.text && (
        <div className="fixed bottom-5 right-5">
          <div
            className={`px-4 py-3 rounded-xl border ${
              toast.type === "success"
                ? "bg-emerald-500/10 border-emerald-400/30 text-emerald-200"
                : "bg-rose-500/10 border-rose-400/30 text-rose-200"
            }`}
          >
            {toast.text}
          </div>
        </div>
      )}
    </div>
  );
}
