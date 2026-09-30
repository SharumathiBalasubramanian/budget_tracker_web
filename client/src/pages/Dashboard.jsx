import { useEffect, useState, useCallback } from "react";
import axios from "axios";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import SummaryCards from "../components/SummaryCards";
import PieChartComponent from "../components/PieChartComponent";
import LineChartComponent from "../components/LineChartComponent";
import BudgetProgress from "../components/BudgetProgress";
import SpendingInsights from "../components/SpendingInsights";
import IncomeExpenseChart from "../components/IncomeExpenseChart";

import { getTransactions } from "../api/transactionApi";
import { getBudgets } from "../api/budgetApi";

const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  // Initialized to an empty string to accept text/markdown from the backend
  const [insights, setInsights] = useState("");
  const [loading, setLoading] = useState(true);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [error, setError] = useState("");

  // Direct backend call for Gemini insights
  const fetchAiInsights = useCallback(async (currentTransactions, currentBudgets) => {
    if (!currentTransactions.length && !currentBudgets.length) return;

    setIsGeneratingAi(true);
    try {
      const response = await axios.post(`${BACKEND_URL}/insights/gemini`, {
        transactions: currentTransactions,
        budgets: currentBudgets,
      });

      // Extract the insight string or fallback to empty string
      const result =
        response.data?.insights ??
        response.data?.reply ??
        (typeof response.data === "string" ? response.data : "");

      setInsights(result);
    } catch (aiErr) {
      console.error("AI Insights fetch failed:", aiErr);
    } finally {
      setIsGeneratingAi(false);
    }
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const [transactionRes, budgetRes] = await Promise.allSettled([
        getTransactions(),
        getBudgets(),
      ]);

      const rawTransactions =
        transactionRes.status === "fulfilled"
          ? Array.isArray(transactionRes.value)
            ? transactionRes.value
            : transactionRes.value?.data || []
          : [];

      const rawBudgets =
        budgetRes.status === "fulfilled"
          ? Array.isArray(budgetRes.value)
            ? budgetRes.value
            : budgetRes.value?.data || []
          : [];

      // 1. Clean transactions & normalize IDs
      const cleanTransactions = rawTransactions
        .filter((item) => {
          const id = item._id || item.id;
          return id && /^[0-9a-fA-F]{24}$/.test(id);
        })
        .map((item) => ({
          ...item,
          id: item._id || item.id,
          amount: Number(item.amount || 0),
          type: item.type?.toLowerCase(),
        }));

      // 2. Clean budgets & normalize limits
      const cleanBudgets = rawBudgets
        .filter((item) => {
          const id = item._id || item.id;
          return id && /^[0-9a-fA-F]{24}$/.test(id);
        })
        .map((budget) => ({
          ...budget,
          id: budget._id || budget.id,
          limit: Number(budget.monthlyLimit ?? budget.limit ?? 0),
          spent: Number(budget.spent ?? 0),
        }));

      setTransactions(cleanTransactions);
      setBudgets(cleanBudgets);
      setLoading(false);

      // Trigger AI insights from backend after data renders
      fetchAiInsights(cleanTransactions, cleanBudgets);
    } catch (err) {
      console.error("Dashboard primary load error:", err);
      setError("Failed to load dashboard data. Please try again.");
      setLoading(false);
    }
  };

  const handleRefreshAi = () => {
    fetchAiInsights(transactions, budgets);
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  // Summary Metrics
  const totalIncome = transactions
    .filter((item) => item.type === "income")
    .reduce((sum, item) => sum + item.amount, 0);

  const totalExpense = transactions
    .filter((item) => item.type === "expense")
    .reduce((sum, item) => sum + item.amount, 0);

  const balance = totalIncome - totalExpense;

  // Recent 5 Transactions
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
    .slice(0, 5);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-violet-600 animate-spin flex items-center justify-center text-white shadow-xl shadow-indigo-500/20">
            <span className="font-black text-xl">B</span>
          </div>
          <h2 className="text-lg font-semibold text-slate-700">
            Loading your financial dashboard...
          </h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-slate-50 gap-4">
        <h2 className="text-rose-500 text-lg font-semibold">{error}</h2>
        <button
          onClick={loadDashboard}
          className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <div className="flex-1 overflow-hidden relative">
        <Navbar />

        <main className="p-8 space-y-6 max-w-7xl mx-auto">
          {/* Top Summary Cards */}
          <SummaryCards
            income={totalIncome}
            expense={totalExpense}
            balance={balance}
          />

          {/* Income vs Expense & Breakdown */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2">
              <IncomeExpenseChart transactions={transactions} />
            </div>

            <PieChartComponent transactions={transactions} />
          </div>

          {/* Monthly Trend */}
          <LineChartComponent transactions={transactions} />

          {/* Budgets & Backend AI Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <BudgetProgress budgets={budgets} />

            <SpendingInsights
              insights={insights}
              onRefresh={handleRefreshAi}
              isGenerating={isGeneratingAi}
            />
          </div>

          {/* Recent Transactions List */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
            <h3 className="text-xl font-semibold mb-4 text-slate-800">
              Recent Transactions
            </h3>

            {recentTransactions.length === 0 ? (
              <p className="text-slate-400 text-sm">No transactions found.</p>
            ) : (
              recentTransactions.map((item) => {
                const isIncome = item.type === "income";
                return (
                  <div
                    key={item.id}
                    className="flex justify-between items-center py-3 border-b border-slate-100 last:border-0 hover:bg-slate-50/50 px-2 rounded-xl transition"
                  >
                    <div>
                      <h4 className="font-semibold text-slate-800">
                        {item.category || "Uncategorized"}
                      </h4>
                      <p className="text-xs text-slate-400">
                        {item.date ? new Date(item.date).toLocaleDateString() : "No date"}
                      </p>
                    </div>

                    <div
                      className={`font-bold text-sm ${
                        isIncome ? "text-emerald-600" : "text-rose-500"
                      }`}
                    >
                      {isIncome ? "+" : "-"} ₹{item.amount.toLocaleString()}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;