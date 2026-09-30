import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import {
  getBudgets,
  createBudget,
  updateBudget,
  deleteBudget,
} from "../api/budgetApi";

const CATEGORIES = [
  "Food",
  "Transport",
  "Entertainment",
  "Grocery",
  "Travel",
  "Salary",
  "Other",
];

function Budgets() {
  const [budgets, setBudgets] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    category: "",
    limit: "",
    spent: "",
  });

  const [confirmModal, setConfirmModal] = useState({
    show: false,
    id: null,
  });

  const loadBudgets = async () => {
    try {
      const data = await getBudgets();
      const budgetList = Array.isArray(data) ? data : data.data || [];

      // Support MongoDB _id as well as id
      const cleanBudgets = budgetList.filter((budget) => {
        const id = budget._id || budget.id;
        return id && /^[0-9a-fA-F]{24}$/.test(id);
      });

      setBudgets(cleanBudgets);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load budgets.");
    }
  };

  useEffect(() => {
    loadBudgets();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setFormData({
      category: "",
      limit: "",
      spent: "",
    });
    setEditingId(null);
  };

  // --- FIX HERE: Send monthlyLimit instead of limit ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      category: formData.category,
      monthlyLimit: Number(formData.limit),
      spent: Number(formData.spent) || 0,
    };

    try {
      if (editingId) {
        await updateBudget(editingId, payload);
        toast.success("Budget updated successfully!");
      } else {
        await createBudget(payload);
        toast.success("Budget created successfully!");
      }
      resetForm();
      loadBudgets();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to save budget.");
    }
  };

  // --- FIX HERE: Handle monthlyLimit and _id ---
  const handleEdit = (budget) => {
    const id = budget._id || budget.id;
    setEditingId(id);
    setFormData({
      category: budget.category,
      limit: budget.monthlyLimit ?? budget.limit ?? "",
      spent: budget.spent ?? 0,
    });
  };

  const handleDeleteClick = (id) => {
    setConfirmModal({
      show: true,
      id,
    });
  };

  const handleConfirmDelete = async () => {
    const id = confirmModal.id;
    setConfirmModal({ show: false, id: null });
    try {
      await deleteBudget(id);
      toast.success("Budget deleted successfully.");
      loadBudgets();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete budget.");
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <div className="flex-1">
        <Navbar />

        <main className="p-8">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] p-8 space-y-8">
            {/* Header */}
            <div>
              <h2 className="text-3xl font-black text-slate-800 tracking-tight">
                Budget Planner
              </h2>
              <p className="text-slate-400 font-semibold mt-1">
                Configure limits to maintain control over your spending categories.
              </p>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-3 gap-5 bg-slate-50/50 p-6 rounded-2xl border border-slate-100"
            >
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full bg-white border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 p-3 rounded-xl outline-none transition font-semibold text-slate-700"
                >
                  <option value="">Select Category</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Budget Limit
                </label>
                <input
                  type="number"
                  name="limit"
                  placeholder="₹0.00"
                  value={formData.limit}
                  onChange={handleChange}
                  required
                  className="w-full bg-white border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 p-3 rounded-xl outline-none transition font-semibold text-slate-700"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Amount Spent
                </label>
                <input
                  type="number"
                  name="spent"
                  placeholder="₹0.00"
                  value={formData.spent}
                  onChange={handleChange}
                  required
                  className="w-full bg-white border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 p-3 rounded-xl outline-none transition font-semibold text-slate-700"
                />
              </div>

              <div className="md:col-span-3 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold p-3.5 rounded-xl shadow-md transition duration-200 cursor-pointer"
                >
                  {editingId ? "Update Budget" : "Add Budget"}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-6 py-3.5 rounded-xl transition cursor-pointer"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>

            {/* Budget Cards */}
            {budgets.length === 0 ? (
              <div className="text-center py-12 text-slate-400 font-medium bg-slate-50/50 border border-slate-100 rounded-3xl">
                No budgets set up yet. Create one above to get started.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {budgets.map((budget) => {
                  const id = budget._id || budget.id;
                  const limitVal = Number(budget.monthlyLimit ?? budget.limit ?? 0);
                  const spentVal = Number(budget.spent ?? 0);
                  const percentage = limitVal > 0 ? (spentVal / limitVal) * 100 : 0;

                  let gradient = "from-emerald-400 to-teal-500";
                  let percentColor = "text-emerald-500 bg-emerald-50 border-emerald-100";
                  if (percentage > 100) {
                    gradient = "from-rose-500 to-pink-600";
                    percentColor = "text-rose-500 bg-rose-50 border-rose-100";
                  } else if (percentage > 80) {
                    gradient = "from-amber-400 to-orange-500";
                    percentColor = "text-amber-500 bg-amber-50 border-amber-100";
                  }

                  return (
                    <div
                      key={id}
                      className="bg-white border border-slate-100/85 rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.015)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.035)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between space-y-6"
                    >
                      <div className="flex justify-between items-center">
                        <h3 className="font-extrabold text-xl text-slate-800 tracking-tight">
                          {budget.category}
                        </h3>

                        <span className={`text-xs font-black px-2.5 py-1 border rounded-full ${percentColor}`}>
                          {Math.round(percentage)}%
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <div>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Limit</p>
                          <h4 className="font-extrabold text-lg text-slate-800">
                            ₹{limitVal.toLocaleString("en-IN")}
                          </h4>
                        </div>

                        <div className="text-right">
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Spent</p>
                          <h4 className="font-extrabold text-lg text-slate-800">
                            ₹{spentVal.toLocaleString("en-IN")}
                          </h4>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-1.5">
                        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full rounded-full bg-gradient-to-r ${gradient} transition-all duration-500`}
                            style={{
                              width: `${Math.min(percentage, 100)}%`,
                            }}
                          />
                        </div>

                        {percentage > 100 && (
                          <p className="text-rose-500 text-[10px] font-black uppercase tracking-wider flex items-center gap-1 mt-1">
                            ⚠️ Over Limit by ₹{(spentVal - limitVal).toLocaleString("en-IN")}
                          </p>
                        )}
                      </div>

                      {/* Card Actions */}
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleEdit(budget)}
                          className="flex-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDeleteClick(id)}
                          className="flex-1 bg-rose-50 hover:bg-rose-100 text-rose-600 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Custom Confirmation Modal */}
      {confirmModal.show && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full border border-slate-100 shadow-2xl space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-xl font-bold text-slate-800">Delete Budget?</h3>
              <p className="text-slate-500 text-sm font-medium">
                Are you sure you want to delete this category budget? This will clear its track data.
              </p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setConfirmModal({ show: false, id: null })}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 px-4 rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-rose-500/15 transition cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Budgets;