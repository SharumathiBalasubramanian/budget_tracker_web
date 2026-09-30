import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

// Helper to extract a standard month key and readable display label
const getMonthInfo = (rawDate) => {
  if (!rawDate) return { key: "unknown", label: "Other" };

  // Handle custom date formats or ISO strings
  let parsedDate = new Date(rawDate);

  // If format is DD-MM-YYYY (like 29-09-2026), parse manually
  if (isNaN(parsedDate.getTime()) && typeof rawDate === "string") {
    const parts = rawDate.split("T")[0].split("-");
    if (parts.length === 3) {
      if (parts[0].length === 4) {
        // YYYY-MM-DD
        parsedDate = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
      } else {
        // DD-MM-YYYY
        parsedDate = new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
      }
    }
  }

  if (isNaN(parsedDate.getTime())) {
    return { key: "unknown", label: "Other" };
  }

  const year = parsedDate.getFullYear();
  const month = parsedDate.getMonth(); // 0 to 11
  const sortKey = `${year}-${String(month + 1).padStart(2, "0")}`;
  const label = parsedDate.toLocaleDateString("en-IN", {
    month: "short",
    year: "numeric",
  }); // e.g. "Sep 2026"

  return { key: sortKey, label };
};

function IncomeExpenseChart({ transactions = [] }) {
  const monthlyMap = {};

  transactions.forEach((tx) => {
    const { key, label } = getMonthInfo(tx.date);
    const type = (tx.type || "").toLowerCase();
    const amount = Number(tx.amount || 0);

    if (!monthlyMap[key]) {
      monthlyMap[key] = {
        sortKey: key,
        name: label,
        Income: 0,
        Expense: 0,
      };
    }

    if (type === "income") {
      monthlyMap[key].Income += amount;
    } else if (type === "expense") {
      monthlyMap[key].Expense += amount;
    }
  });

  // Sort months chronologically
  const chartData = Object.values(monthlyMap).sort((a, b) =>
    a.sortKey.localeCompare(b.sortKey)
  );

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 h-96 flex flex-col justify-between">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-slate-800">
          Monthly Income vs Expense
        </h3>
        <span className="text-xs font-semibold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
          Monthly View
        </span>
      </div>

      {chartData.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
          No transaction data available
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="85%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="name"
              stroke="#94a3b8"
              fontSize={12}
              tickLine={false}
            />
            <YAxis
              stroke="#94a3b8"
              fontSize={12}
              tickLine={false}
              tickFormatter={(v) => `₹${v.toLocaleString("en-IN")}`}
            />
            <Tooltip
              formatter={(val) => [`₹${Number(val).toLocaleString("en-IN")}`]}
              contentStyle={{
                backgroundColor: "#fff",
                borderRadius: "12px",
                border: "1px solid #f1f5f9",
                boxShadow: "0 10px 15px -3px rgba(0,0,0,0.05)",
              }}
            />
            <Legend verticalAlign="bottom" />
            <Bar dataKey="Income" fill="#10b981" radius={[6, 6, 0, 0]} />
            <Bar dataKey="Expense" fill="#f43f5e" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export default IncomeExpenseChart;