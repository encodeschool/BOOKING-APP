import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail } from "lucide-react";
import toast from "react-hot-toast";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success("Password recovery email sent.");
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center py-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="rounded-[2rem] bg-white p-10 shadow-xl border border-slate-200">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary-600">Reset password</p>
            <h1 className="mt-4 text-4xl font-bold text-slate-900">Forgot your password?</h1>
            <p className="mt-4 text-slate-600">Enter your email address and we’ll send you instructions to reset your password.</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email address</label>
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
            <button className="btn-primary w-full" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : "Send reset email"}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-slate-600">
            Remembered it? <Link to="/login" className="text-primary-600 hover:text-primary-700">Return to sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
