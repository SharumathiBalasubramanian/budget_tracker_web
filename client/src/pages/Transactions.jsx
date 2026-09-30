import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from "../api/transactionApi";

// Categories தனி folder இல்லாமல் இந்த ஃபைலிலேயே உள்ளது
const CATEGORIES = [
  "Food",
  "Transport",
  "Entertainment",
  "Grocery",
  "Travel",
  "Salary",
  "Other",
];

const getId = (item) => String(item?._id || item?.id || "");

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? "" : d.toISOString().split("T")[0];
};

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [filterType, setFilterType] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [sortBy, setSortBy] = useState("recent");

  const [formData, setFormData] = useState({
    amount: "",
    type: "Expense",
    category: "",
    date: new Date().toISOString().split("T")[0],
    note: "",
  });

  const [confirmModal, setConfirmModal] = useState({ show: false, id: null });

  const loadTransactions = async () => {
    try {
      const data = await getTransactions();
      setTransactions(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Load error:", error);
      toast.error("Failed to load transactions.");
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setFormData({
      amount: "",
      type: "Expense",
      category: "",
      date: new Date().toISOString().split("T")[0],
      note: "",
    });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateTransaction(editingId, formData);
        toast.success("Updated successfully!");
      } else {
        await createTransaction(formData);
        toast.success("Added successfully!");
      }
      resetForm();
      await loadTransactions(); // உடனே Database-லிருந்து புதுப்பிக்கிறது
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("Failed to save transaction.");
    }
  };

  const handleEdit = (transaction) => {
    const id = getId(transaction);
    setEditingId(id);
    setFormData({
      amount: transaction.amount,
      type: transaction.type,
      category: transaction.category,
      date: formatDate(transaction.date),
      note: transaction.note || "",
    });
  };

  const handleDeleteClick = (id) => {
    setConfirmModal({ show: true, id });
  };

  const handleConfirmDelete = async () => {
    const id = confirmModal.id;
    setConfirmModal({ show: false, id: null });
    try {
      await deleteTransaction(id);
      toast.success("Deleted successfully.");
      await loadTransactions();
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete transaction.");
    }
  };

  const filteredTransactions = transactions
    .filter((item) => {
      const typeMatch = filterType === "" ? true : item.type === filterType;
      const categoryMatch =
        filterCategory === "" ? true : item.category === filterCategory;
      return typeMatch && categoryMatch;
    })
    .sort((a, b) => {
      if (sortBy === "recent") return new Date(b.date) - new Date(a.date);
      if (sortBy === "old") return new Date(a.date) - new Date(b.date);
      if (sortBy === "category") return (a.category || "").localeCompare(b.category || "");
      return 0;
    });

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <div className="flex-1">
        <Navbar />

        <main className="p-8">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] p-8 space-y-8">
            <div>
              <h2 className="text-3xl font-black text-slate-800 tracking-tight">
                Transactions
              </h2>
              <p className="text-slate-400 font-semibold mt-1">
                Record and manage your cash flow streams.
              </p>
            </div>

            {/* Input Form */}
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-5 gap-5 bg-slate-50/50 p-6 rounded-2xl border border-slate-100"
            >
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Amount</label>
                <input
                  type="number"
                  step="any"
                  name="amount"
                  placeholder="₹0.00"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                  className="w-full bg-white border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 p-3 rounded-xl outline-none font-semibold text-slate-700"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Type</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full bg-white border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 p-3 rounded-xl outline-none font-semibold text-slate-700"
                >
                  <option value="Expense">Expense</option>
                  <option value="Income">Income</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full bg-white border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 p-3 rounded-xl outline-none font-semibold text-slate-700"
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
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="w-full bg-white border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 p-3 rounded-xl outline-none font-semibold text-slate-700"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Note</label>
                <input
                  type="text"
                  name="note"
                  placeholder="Optional detail..."
                  value={formData.note}
                  onChange={handleChange}
                  className="w-full bg-white border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 p-3 rounded-xl outline-none font-semibold text-slate-700"
                />
              </div>

              <div className="md:col-span-5 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold p-3.5 rounded-xl shadow-md transition cursor-pointer"
                >
                  {editingId ? "Update Transaction" : "Add Transaction"}
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

            {/* Filter Bar */}
            <div className="flex flex-wrap gap-4 border-b border-slate-100 pb-5 items-center">
              <span className="text-sm font-bold text-slate-400 uppercase tracking-wide mr-2">Filters:</span>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="bg-slate-50 border border-slate-100 px-4 py-2.5 rounded-xl outline-none text-slate-700 font-bold"
              >
                <option value="">All Types</option>
                <option value="Income">Income</option>
                <option value="Expense">Expense</option>
              </select>

              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="bg-slate-50 border border-slate-100 px-4 py-2.5 rounded-xl outline-none text-slate-700 font-bold"
              >
                <option value="">All Categories</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-slate-50 border border-slate-100 px-4 py-2.5 rounded-xl outline-none text-slate-700 font-bold ml-auto"
              >
                <option value="recent">Recent Date</option>
                <option value="old">Old Date</option>
                <option value="category">Category A-Z</option>
              </select>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-2xl border border-slate-100">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-100">
                    <th className="p-4 text-center text-xs font-bold text-slate-400 uppercase">Amount</th>
                    <th className="p-4 text-center text-xs font-bold text-slate-400 uppercase">Type</th>
                    <th className="p-4 text-center text-xs font-bold text-slate-400 uppercase">Category</th>
                    <th className="p-4 text-center text-xs font-bold text-slate-400 uppercase">Date</th>
                    <th className="p-4 text-center text-xs font-bold text-slate-400 uppercase">Note</th>
                    <th className="p-4 text-center text-xs font-bold text-slate-400 uppercase">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredTransactions.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center p-12 text-slate-400 font-medium">
                        No Transactions Found
                      </td>
                    </tr>
                  ) : (
                    filteredTransactions.map((item) => {
                      const id = getId(item);
                      const isIncome = String(item.type).toLowerCase() === "income";
                      return (
                        <tr key={id} className="border-b border-slate-50 hover:bg-slate-50/50">
                          <td className="p-4 text-center font-bold text-slate-800">
                            ₹{Number(item.amount || 0).toLocaleString("en-IN")}
                          </td>
                          <td className="p-4 text-center">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-extrabold border ${
                                isIncome
                                  ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                  : "bg-rose-50 text-rose-600 border-rose-100"
                              }`}
                            >
                              {item.type}
                            </span>
                          </td>
                          <td className="p-4 text-center font-semibold text-slate-600">{item.category}</td>
                          <td className="p-4 text-center font-semibold text-slate-500">{formatDate(item.date)}</td>
                          <td className="p-4 text-center text-slate-500 italic">{item.note || "-"}</td>
                          <td className="p-4">
                            <div className="flex justify-center gap-2">
                              <button
                                onClick={() => handleEdit(item)}
                                className="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteClick(id)}
                                className="bg-rose-50 hover:bg-rose-100 text-rose-600 px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Delete Confirmation Modal */}
      {confirmModal.show && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full border border-slate-100 shadow-2xl space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-xl font-bold text-slate-800">Delete Transaction?</h3>
              <p className="text-slate-500 text-sm font-medium">Are you sure you want to delete this transaction?</p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setConfirmModal({ show: false, id: null })}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 px-4 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-rose-500/15 cursor-pointer"
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