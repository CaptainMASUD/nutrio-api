import React, { useState } from "react";
import { User, Mail, Lock, UserPlus, Eye, EyeOff } from "lucide-react";

const API_BASE = "https://nutrio-api.vercel.app/api";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });

  const onChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg({ type: "", text: "" });
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Register failed");

      // ✅ Save token + user
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setMsg({ type: "success", text: "Account created ✅" });

      // ✅ Redirect (change this to your route)
      window.location.href = "/dashboard";
    } catch (err) {
      setMsg({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl bg-slate-900/60 border border-emerald-500/20 shadow-2xl shadow-emerald-500/10 overflow-hidden">
          <div className="p-6 border-b border-emerald-500/15">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-xl bg-emerald-500/15 border border-emerald-400/20 flex items-center justify-center">
                <UserPlus className="h-5 w-5 text-emerald-300" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-white">Create account</h1>
                <p className="text-sm text-emerald-200/70">Register as a user</p>
              </div>
            </div>
          </div>

          <form onSubmit={onSubmit} className="p-6 space-y-4">
            <div>
              <label className="text-sm text-emerald-100/80">Name</label>
              <div className="mt-1 relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-300/70" />
                <input
                  name="name"
                  value={form.name}
                  onChange={onChange}
                  placeholder="Your name"
                  className="w-full pl-10 pr-3 py-3 rounded-xl bg-slate-950/60 border border-emerald-500/20 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-emerald-100/80">Email</label>
              <div className="mt-1 relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-300/70" />
                <input
                  name="email"
                  value={form.email}
                  onChange={onChange}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-3 py-3 rounded-xl bg-slate-950/60 border border-emerald-500/20 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-emerald-100/80">Password</label>
              <div className="mt-1 relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-300/70" />
                <input
                  name="password"
                  value={form.password}
                  onChange={onChange}
                  type={show ? "text" : "password"}
                  placeholder="Minimum 6 characters"
                  className="w-full pl-10 pr-12 py-3 rounded-xl bg-slate-950/60 border border-emerald-500/20 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                />
                <button
                  type="button"
                  onClick={() => setShow((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-200/70 hover:text-emerald-200"
                >
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/20"
            >
              {loading ? "Creating..." : "Register"}
            </button>

            {msg.text ? (
              <div
                className={`rounded-xl px-4 py-3 text-sm border ${
                  msg.type === "success"
                    ? "bg-emerald-500/10 border-emerald-400/30 text-emerald-200"
                    : "bg-rose-500/10 border-rose-400/30 text-rose-200"
                }`}
              >
                {msg.text}
              </div>
            ) : null}

            <p className="text-center text-sm text-slate-400">
              Already have an account?{" "}
              <a href="/login" className="text-emerald-300 hover:text-emerald-200 font-medium">
                Login
              </a>
            </p>
          </form>
        </div>

        <p className="mt-4 text-center text-xs text-slate-500">
          API: <span className="text-emerald-300/70">{API_BASE}</span>
        </p>
      </div>
    </div>
  );
}
