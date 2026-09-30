import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(
      (u) =>
        u.email.toLowerCase() === formData.email.toLowerCase() &&
        u.password === formData.password
    );

    if (!user) {
      toast.error("Invalid credentials. Please register or check your entries.");
      return;
    }

    localStorage.setItem("currentUser", JSON.stringify(user));
    toast.success(`Welcome back, ${user.firstName}!`);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Left panel: branding banner */}
      <div className="hidden md:flex md:w-1/2 bg-slate-950 flex-col justify-between p-12 text-white relative overflow-hidden">
        {/* Abstract design elements */}
        <div className="absolute -left-12 -top-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute right-0 bottom-0 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl" />

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center font-bold text-lg shadow-lg shadow-indigo-500/20">
            B
          </div>
          <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-indigo-200 to-slate-200 bg-clip-text text-transparent">
            BudgetApp
          </span>
        </div>

        <div className="space-y-4 max-w-md">
          <h2 className="text-4xl font-extrabold leading-tight tracking-tight bg-gradient-to-r from-indigo-100 to-slate-100 bg-clip-text text-transparent">
            Smart financial tracking powered by AI.
          </h2>
          <p className="text-slate-400 text-base font-semibold leading-relaxed">
            Monitor your expenses, create budgets, and obtain intelligent spending insights to keep your personal wealth growing.
          </p>
        </div>

        <p className="text-xs text-slate-500 font-semibold">
          &copy; 2026 BudgetAI. All rights reserved.
        </p>
      </div>

      {/* Right panel: Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-slate-50">
        <div className="w-full max-w-md bg-white p-10 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] space-y-8">
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">
              Sign In
            </h2>
            <p className="text-slate-400 text-sm font-semibold mt-1">
              Enter your credentials to access your dashboard.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 p-3.5 rounded-xl outline-none transition duration-200 font-semibold text-slate-700"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 p-3.5 rounded-xl outline-none transition duration-200 font-semibold text-slate-700"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold p-3.5 rounded-xl shadow-lg shadow-indigo-500/15 hover:shadow-xl active:scale-95 transition-all duration-200 cursor-pointer"
            >
              Sign In
            </button>
          </form>

          <p className="text-center text-sm font-semibold text-slate-500">
            Don't have an account?
            <Link to="/signup" className="text-indigo-600 hover:underline ml-1.5 font-bold">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;