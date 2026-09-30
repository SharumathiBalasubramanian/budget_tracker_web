import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";

import {
  getUsers,
  createUser,
} from "../api/authApi";

function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    let newErrors = {};

    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";

    if (!formData.lastName.trim())
      newErrors.lastName = "Last name is required";

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email";
    }

    if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const apiUsers = await getUsers();
      const localUsers = JSON.parse(localStorage.getItem("users")) || [];

      const exists =
        apiUsers.find((user) => user.email.toLowerCase() === formData.email.toLowerCase()) ||
        localUsers.find((user) => user.email.toLowerCase() === formData.email.toLowerCase());

      if (exists) {
        toast.error("Email is already registered. Please login.");
        navigate("/login");
        return;
      }

      const userData = {
        id: Date.now(),
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      };

      await createUser(userData);

      localUsers.push(userData);
      localStorage.setItem("users", JSON.stringify(localUsers));

      toast.success("Account created successfully!");
      navigate("/login");
    } catch (error) {
      console.error(error);
      toast.error("Registration failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Left panel: branding banner */}
      <div className="hidden md:flex md:w-1/2 bg-slate-950 flex-col justify-between p-12 text-white relative overflow-hidden">
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
            Join the smart way to budget.
          </h2>
          <p className="text-slate-400 text-base font-semibold leading-relaxed">
            Create an account in seconds to begin optimizing your spendings, configuring personalized category trackers, and securing your financial future.
          </p>
        </div>

        <p className="text-xs text-slate-500 font-semibold">
          &copy; 2026 BudgetAI. All rights reserved.
        </p>
      </div>

      {/* Right panel: Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-slate-50 overflow-y-auto">
        <div className="w-full max-w-md bg-white p-10 my-8 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] space-y-8">
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">
              Create Account
            </h2>
            <p className="text-slate-400 text-sm font-semibold mt-1">
              Fill in your details to open a free account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className={`w-full border ${errors.firstName ? 'border-red-400 focus:ring-red-400/10' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/10'} focus:ring-4 p-3 rounded-xl outline-none transition duration-200 font-semibold text-slate-700`}
                />
                {errors.firstName && <p className="text-red-500 text-xs font-semibold">{errors.firstName}</p>}
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className={`w-full border ${errors.lastName ? 'border-red-400 focus:ring-red-400/10' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/10'} focus:ring-4 p-3 rounded-xl outline-none transition duration-200 font-semibold text-slate-700`}
                />
                {errors.lastName && <p className="text-red-500 text-xs font-semibold">{errors.lastName}</p>}
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                placeholder="john.doe@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                className={`w-full border ${errors.email ? 'border-red-400 focus:ring-red-400/10' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/10'} focus:ring-4 p-3 rounded-xl outline-none transition duration-200 font-semibold text-slate-700`}
              />
              {errors.email && <p className="text-red-500 text-xs font-semibold">{errors.email}</p>}
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="Min 6 characters"
                value={formData.password}
                onChange={handleChange}
                required
                className={`w-full border ${errors.password ? 'border-red-400 focus:ring-red-400/10' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/10'} focus:ring-4 p-3 rounded-xl outline-none transition duration-200 font-semibold text-slate-700`}
              />
              {errors.password && <p className="text-red-500 text-xs font-semibold">{errors.password}</p>}
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Repeat password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className={`w-full border ${errors.confirmPassword ? 'border-red-400 focus:ring-red-400/10' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/10'} focus:ring-4 p-3 rounded-xl outline-none transition duration-200 font-semibold text-slate-700`}
              />
              {errors.confirmPassword && <p className="text-red-500 text-xs font-semibold">{errors.confirmPassword}</p>}
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold p-3.5 rounded-xl shadow-lg shadow-indigo-500/15 hover:shadow-xl active:scale-95 transition-all duration-200 cursor-pointer"
            >
              Register Account
            </button>
          </form>

          <p className="text-center text-sm font-semibold text-slate-500">
            Already have an account?
            <Link to="/login" className="text-indigo-600 hover:underline ml-1.5 font-bold">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;