import React, { useEffect, useMemo, useState } from "react";
import {
  Shield,
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
  Image as ImageIcon,
  RefreshCw,
  Stethoscope,
  MapPin,
  Loader2,
  Eye,
} from "lucide-react";

const API_BASE = "https://nutrio-api.vercel.app/api";

const BD_LOCATIONS = [
  // Dhaka area
  "Dhaka",
  "Mirpur",
  "Uttara",
  "Tongi",
  "Gulshan",
  "Banani",
  "Badda",
  "Mohakhali",
  "Farmgate",
  "Tejgaon",
  "Dhanmondi",
  "Mohammadpur",
  "Motijheel",
  "Ramna",
  "Shahbagh",
  "Jatrabari",
  "Khilgaon",
  "Malibagh",
  "Banasree",
  "Kallyanpur",
  "Shyamoli",
  "Adabor",
  "Savar",
  "Ashulia",
  "Keraniganj",
  "Narayanganj",
  "Gazipur",
  "Narsingdi",
  "Munshiganj",
  "Manikganj",
  "Tangail",
  "Faridpur",
  "Gopalganj",
  "Madaripur",
  "Shariatpur",
  "Rajbari",
  "Kishoreganj",

  // Chattogram division
  "Chattogram",
  "Cox's Bazar",
  "Cumilla",
  "Noakhali",
  "Feni",
  "Rangamati",
  "Khagrachari",
  "Bandarban",
  "Chandpur",
  "Brahmanbaria",
  "Lakshmipur",

  // Sylhet division
  "Sylhet",
  "Moulvibazar",
  "Habiganj",
  "Sunamganj",

  // Rajshahi division
  "Rajshahi",
  "Bogura",
  "Pabna",
  "Natore",
  "Naogaon",
  "Sirajganj",
  "Joypurhat",
  "Chapainawabganj",

  // Khulna division
  "Khulna",
  "Jashore",
  "Kushtia",
  "Satkhira",
  "Bagerhat",
  "Jhenaidah",
  "Magura",
  "Narail",
  "Chuadanga",
  "Meherpur",

  // Barishal division
  "Barishal",
  "Bhola",
  "Patuakhali",
  "Barguna",
  "Jhalokathi",
  "Pirojpur",

  // Rangpur division
  "Rangpur",
  "Dinajpur",
  "Kurigram",
  "Lalmonirhat",
  "Nilphamari",
  "Gaibandha",
  "Panchagarh",
  "Thakurgaon",

  // Mymensingh division
  "Mymensingh",
  "Jamalpur",
  "Netrokona",
  "Sherpur",

  "Other",
];

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

  // Create/Edit modal
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("create"); // create | edit
  const [active, setActive] = useState(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    type: "doctor",
    specialist: "",
    location: "Dhaka",
    image: null,
    otherLocation: "",
  });

  const [previewUrl, setPreviewUrl] = useState("");

  // Preview modal
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewItem, setPreviewItem] = useState(null);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin, token]);

  const openCreate = () => {
    setMode("create");
    setActive(null);
    setForm({
      name: "",
      type: "doctor",
      specialist: "",
      location: "Dhaka",
      image: null,
      otherLocation: "",
    });
    setPreviewUrl("");
    setOpen(true);
  };

  const openEdit = (p) => {
    setMode("edit");
    setActive(p);
    setForm({
      name: p.name || "",
      type: p.type || "doctor",
      specialist: p.specialist || "",
      location: BD_LOCATIONS.includes(p.location) ? p.location : "Other",
      image: null,
      otherLocation: BD_LOCATIONS.includes(p.location) ? "" : (p.location || ""),
    });
    setPreviewUrl(p.imageUrl || "");
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
    setActive(null);
    setSaving(false);
    setPreviewUrl("");
    setForm({
      name: "",
      type: "doctor",
      specialist: "",
      location: "Dhaka",
      image: null,
      otherLocation: "",
    });
  };

  const onChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const onFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast("error", "Please select an image file");
      return;
    }

    setForm((p) => ({ ...p, image: file }));

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (saving) return;

    try {
      setSaving(true);

      if (!form.name || !form.type || !form.specialist) {
        setSaving(false);
        return showToast("error", "Name, type and specialist are required");
      }

      if (mode === "create" && !form.image) {
        setSaving(false);
        return showToast("error", "Image is required for creating a provider");
      }

      const finalLocation =
        form.location === "Other"
          ? (form.otherLocation || "").trim()
          : form.location;

      if (!finalLocation) {
        setSaving(false);
        return showToast("error", "Location is required");
      }

      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("type", form.type);
      fd.append("specialist", form.specialist);
      fd.append("location", finalLocation);
      if (form.image) fd.append("image", form.image);

      const url =
        mode === "create"
          ? `${API_BASE}/providers`
          : `${API_BASE}/providers/${active?._id}`;

      const res = await fetch(url, {
        method: mode === "create" ? "POST" : "PUT",
        headers, // don't set content-type
        body: fd,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Save failed");

      showToast("success", mode === "create" ? "Provider added ✅" : "Updated ✅");
      closeModal();
      fetchProviders();
    } catch (err) {
      showToast("error", err.message);
      setSaving(false);
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

  const openPreview = (p) => {
    setPreviewItem(p);
    setPreviewOpen(true);
  };

  const closePreview = () => {
    setPreviewOpen(false);
    setPreviewItem(null);
  };

  // Guards
  if (!token) {
    return (
      <div className="min-h-screen bg-slate-950 grid place-items-center p-6">
        <div className="rounded-2xl border border-emerald-500/20 bg-slate-900/60 p-6 max-w-md w-full">
          <div className="flex items-center gap-3">
            <Shield className="h-6 w-6 text-emerald-300" />
            <div>
              <h2 className="text-white font-semibold text-lg">Not logged in</h2>
              <p className="text-slate-400 text-sm">Login to manage providers.</p>
            </div>
          </div>
          <a
            href="/login"
            className="mt-5 block text-center rounded-xl bg-emerald-400 py-3 font-semibold text-slate-950 hover:bg-emerald-300 transition"
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
            <div className="h-11 w-11 rounded-2xl bg-emerald-500/15 border border-emerald-400/20 flex items-center justify-center">
              <Stethoscope className="h-5 w-5 text-emerald-300" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">Doctors & Counselors</h1>
              <p className="text-sm text-emerald-200/70">Admin manage providers</p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={fetchProviders}
              className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-slate-900/50 px-4 py-2.5 text-emerald-200 hover:bg-slate-900 transition"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>

            <button
              onClick={openCreate}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-400 px-4 py-2.5 font-semibold text-slate-950 hover:bg-emerald-300 transition shadow-lg shadow-emerald-500/20"
            >
              <Plus className="h-4 w-4" />
              Add
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="rounded-2xl border border-emerald-500/15 bg-slate-900/40 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-900/70">
              <tr className="text-left text-slate-300">
                <th className="px-4 py-3">Profile</th>
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
                  <td colSpan={6} className="text-center py-10 text-slate-400">
                    Loading...
                  </td>
                </tr>
              ) : providers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-400">
                    No providers found.
                  </td>
                </tr>
              ) : (
                providers.map((p) => (
                  <tr
                    key={p._id}
                    className="border-t border-emerald-500/10 hover:bg-slate-950/30 transition"
                  >
                    <td className="px-4 py-3">
                      <img
                        src={p.imageUrl}
                        alt={p.name}
                        className="h-10 w-10 rounded-xl object-cover border border-emerald-500/20"
                      />
                    </td>
                    <td className="px-4 py-3 font-medium">{p.name}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs border ${
                          p.type === "doctor"
                            ? "bg-emerald-500/10 border-emerald-400/25 text-emerald-200"
                            : "bg-sky-500/10 border-sky-400/25 text-sky-200"
                        }`}
                      >
                        {p.type === "doctor" ? "Doctor" : "Counselor"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-300">{p.specialist}</td>
                    <td className="px-4 py-3 text-slate-300">
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-4 w-4 text-emerald-300" />
                        {p.location}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openPreview(p)}
                          className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-slate-950/40 px-3 py-2 text-emerald-200 hover:bg-slate-950/70 transition"
                        >
                          <Eye className="h-4 w-4" />
                          Preview
                        </button>

                        <button
                          onClick={() => openEdit(p)}
                          className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-slate-950/40 px-3 py-2 text-emerald-200 hover:bg-slate-950/70 transition"
                        >
                          <Pencil className="h-4 w-4" />
                          Edit
                        </button>

                        <button
                          onClick={() => remove(p)}
                          disabled={busyId === p._id}
                          className="inline-flex items-center gap-2 rounded-xl border border-rose-500/25 bg-rose-500/10 px-3 py-2 text-rose-200 hover:bg-rose-500/15 transition disabled:opacity-60"
                        >
                          <Trash2 className="h-4 w-4" />
                          {busyId === p._id ? "Deleting..." : "Delete"}
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

      {/* Create/Edit Modal */}
      {open && (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl rounded-2xl border border-emerald-500/20 bg-slate-900 shadow-2xl shadow-emerald-500/10 overflow-hidden">
            <div className="p-5 border-b border-emerald-500/15 flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-lg">
                  {mode === "create" ? "Add Provider" : "Edit Provider"}
                </h2>
                <p className="text-sm text-emerald-200/70">
                  Upload a profile image, choose location from Bangladesh options.
                </p>
              </div>
              <button
                onClick={closeModal}
                className="p-2 rounded-xl hover:bg-slate-950/60 transition"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={submit} className="p-5 space-y-4">
              {/* Image preview */}
              <div className="flex items-center gap-4">
                <div className="h-20 w-20 rounded-2xl border border-emerald-500/20 bg-slate-950/40 overflow-hidden flex items-center justify-center">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <ImageIcon className="h-7 w-7 text-emerald-300/70" />
                  )}
                </div>

                <div className="flex-1">
                  <label className="text-sm text-emerald-100/80">Profile image</label>
                  <div className="mt-1 flex items-center gap-2">
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-emerald-500/20 bg-slate-950/40 px-4 py-2 text-emerald-200 hover:bg-slate-950/70 transition">
                      <ImageIcon className="h-4 w-4" />
                      Choose Image
                      <input type="file" accept="image/*" onChange={onFile} hidden />
                    </label>
                    <span className="text-xs text-slate-400 truncate">
                      {form.image?.name ||
                        (mode === "edit" ? "Keep current image" : "No file chosen")}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-emerald-100/80">Name</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={onChange}
                    placeholder="Dr. Rahim"
                    className="mt-1 w-full px-4 py-3 rounded-xl bg-slate-950/60 border border-emerald-500/20 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  />
                </div>

                <div>
                  <label className="text-sm text-emerald-100/80">Type</label>
                  <select
                    name="type"
                    value={form.type}
                    onChange={onChange}
                    className="mt-1 w-full px-4 py-3 rounded-xl bg-slate-950/60 border border-emerald-500/20 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  >
                    <option value="doctor">Doctor</option>
                    <option value="counselor">Counselor</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="text-sm text-emerald-100/80">Specialist</label>
                  <input
                    name="specialist"
                    value={form.specialist}
                    onChange={onChange}
                    placeholder="Cardiologist / Therapist / Psychologist..."
                    className="mt-1 w-full px-4 py-3 rounded-xl bg-slate-950/60 border border-emerald-500/20 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  />
                </div>

                <div>
                  <label className="text-sm text-emerald-100/80">Location</label>
                  <select
                    name="location"
                    value={form.location}
                    onChange={onChange}
                    className="mt-1 w-full px-4 py-3 rounded-xl bg-slate-950/60 border border-emerald-500/20 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  >
                    {BD_LOCATIONS.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>

                {form.location === "Other" && (
                  <div>
                    <label className="text-sm text-emerald-100/80">Other location</label>
                    <input
                      name="otherLocation"
                      value={form.otherLocation}
                      onChange={onChange}
                      placeholder="Type location..."
                      className="mt-1 w-full px-4 py-3 rounded-xl bg-slate-950/60 border border-emerald-500/20 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-slate-950/40 px-4 py-2.5 text-emerald-200 hover:bg-slate-950/70 transition disabled:opacity-60"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-400 px-4 py-2.5 font-semibold text-slate-950 hover:bg-emerald-300 transition shadow-lg shadow-emerald-500/20 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4" />
                      Save
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewOpen && previewItem && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={closePreview}
        >
          <div
            className="w-full max-w-xl rounded-2xl border border-emerald-500/20 bg-slate-900 shadow-2xl shadow-emerald-500/10 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-emerald-500/15 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Provider Preview</h3>
                <p className="text-sm text-emerald-200/70">
                  Doctor / Counselor details
                </p>
              </div>
              <button
                onClick={closePreview}
                className="p-2 rounded-xl hover:bg-slate-950/60 transition"
                aria-label="Close preview"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-5">
              <div className="flex flex-col sm:flex-row gap-5">
                <div className="sm:w-40">
                  <div className="h-44 w-full sm:h-40 sm:w-40 rounded-2xl overflow-hidden border border-emerald-500/20 bg-slate-950/40">
                    <img
                      src={previewItem.imageUrl}
                      alt={previewItem.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-2xl font-semibold text-white">
                        {previewItem.name}
                      </h2>
                      <p className="mt-1 text-slate-300">
                        {previewItem.specialist}
                      </p>
                    </div>

                    <span
                      className={`shrink-0 inline-flex items-center rounded-full px-3 py-1 text-xs border ${
                        previewItem.type === "doctor"
                          ? "bg-emerald-500/10 border-emerald-400/25 text-emerald-200"
                          : "bg-sky-500/10 border-sky-400/25 text-sky-200"
                      }`}
                    >
                      {previewItem.type === "doctor" ? "Doctor" : "Counselor"}
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-emerald-500/15 bg-slate-950/30 p-4">
                      <div className="text-xs text-slate-400">Specialist</div>
                      <div className="mt-1 text-sm text-slate-200">
                        {previewItem.specialist || "—"}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-emerald-500/15 bg-slate-950/30 p-4">
                      <div className="text-xs text-slate-400">Location</div>
                      <div className="mt-1 text-sm text-slate-200 inline-flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-emerald-300" />
                        {previewItem.location || "—"}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-emerald-500/15 bg-slate-950/30 p-4 sm:col-span-2">
                      <div className="text-xs text-slate-400">Record ID</div>
                      <div className="mt-1 text-xs text-slate-300 break-all">
                        {previewItem._id}
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2 justify-end">
                    <button
                      onClick={() => {
                        closePreview();
                        openEdit(previewItem);
                      }}
                      className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-slate-950/40 px-4 py-2.5 text-emerald-200 hover:bg-slate-950/70 transition"
                    >
                      <Pencil className="h-4 w-4" />
                      Edit
                    </button>

                    <button
                      onClick={closePreview}
                      className="inline-flex items-center gap-2 rounded-xl bg-emerald-400 px-4 py-2.5 font-semibold text-slate-950 hover:bg-emerald-300 transition shadow-lg shadow-emerald-500/20"
                    >
                      <X className="h-4 w-4" />
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast.text && (
        <div className="fixed bottom-5 right-5 z-50">
          <div
            className={`px-4 py-3 rounded-2xl border shadow-xl ${
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
