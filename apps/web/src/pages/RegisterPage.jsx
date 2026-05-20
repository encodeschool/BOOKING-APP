import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../app/providers/AuthProvider";
import { UserPlus, Mail, Lock } from "lucide-react";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({ fullName: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords must match.");
      return;
    }

    try {
      await register(formData);
      navigate("/");
    } catch (err) {
      setError(err.message || "Failed to register");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] items-center rounded-[2rem] bg-white p-8 shadow-xl border border-slate-200">
          <div className="space-y-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary-600">Join Enroll</p>
              <h1 className="mt-4 text-4xl font-bold text-slate-900">Create your account</h1>
              <p className="mt-4 text-slate-600">Create a profile and start booking the best local services immediately.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-slate-50 p-5">
                <p className="text-sm text-slate-500">Ready to book</p>
                <p className="mt-2 font-semibold text-slate-900">Easy management of appointments.</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-5">
                <p className="text-sm text-slate-500">Saved preferences</p>
                <p className="mt-2 font-semibold text-slate-900">Store details for faster checkout.</p>
              </div>
            </div>
          </div>

          <div className="rounded-[1.5rem] bg-slate-50 p-8 shadow-inner border border-slate-200">
            <h2 className="text-2xl font-semibold text-slate-900 mb-6">Create account</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                <div className="relative">
                  <UserPlus className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="input-field pl-12"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="input-field pl-12"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="input-field pl-12"
                    required
                  />
                </div>
              </div>
              {error && <p className="text-sm text-rose-600">{error}</p>}
              <div className="flex items-center justify-between text-sm text-slate-600">
                <Link to="/login" className="hover:text-slate-900">
                  Already have an account?
                </Link>
              </div>
              <button className="btn-primary w-full" type="submit">
                Create account
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
