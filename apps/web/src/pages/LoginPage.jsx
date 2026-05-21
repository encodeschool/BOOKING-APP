import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../app/providers/AuthProvider";
import { Mail, Lock } from "lucide-react";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await login({ email, password });
      navigate("/");
    } catch (err) {
      setError(err.message || "Failed to sign in");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] items-center rounded-[2rem] bg-white p-8 shadow-xl border border-slate-200">
          <div className="space-y-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary-600">Welcome back</p>
              <h1 className="mt-4 text-4xl font-bold text-slate-900">Sign in to your account</h1>
              <p className="mt-4 text-slate-600">Continue booking the latest wellness and beauty services with your account.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-slate-50 p-5">
                <p className="text-sm text-slate-500">Fast booking</p>
                <p className="mt-2 font-semibold text-slate-900">Save time and schedule quickly.</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-5">
                <p className="text-sm text-slate-500">Saved details</p>
                <p className="mt-2 font-semibold text-slate-900">Keep preferences in one place.</p>
              </div>
            </div>
          </div>

          <div className="rounded-[1.5rem] bg-slate-50 p-8 shadow-inner border border-slate-200">
            <h2 className="text-2xl font-semibold text-slate-900 mb-6">Sign in</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field pl-12"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field pl-12"
                    required
                  />
                </div>
              </div>
              {error && <p className="text-sm text-rose-600">{error}</p>}
              <div className="flex items-center justify-between text-sm text-slate-600">
                <Link to="/forgot-password" className="hover:text-slate-900">
                  Forgot password?
                </Link>
                <span>
                  New here? <Link to="/register" className="text-primary-600 hover:text-primary-700">Create account</Link>
                </span>
              </div>
              <button className="btn-primary w-full" type="submit">
                Sign in
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
