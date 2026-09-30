import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const COLORS = [
  "#6366f1",
  "#ec4899",
  "#f59e0b",
  "#10b981",
  "#06b6d4",
  "#8b5cf6",
  "#64748b",
];

function PieChartComponent({ transactions = [] }) {
  // Aggregate expenses by category
  const expenseMap = {};

  transactions
    .filter((tx) => (tx.type || "").toLowerCase() === "expense")
    .forEach((tx) => {
      const category = tx.category || "Other";
      const amount = Number(tx.amount || 0);
      expenseMap[category] = (expenseMap[category] || 0) + amount;
    });

  const chartData = Object.keys(expenseMap).map((cat) => ({
    name: cat,
    value: expenseMap[cat],
  }));

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 h-96 flex flex-col justify-between">
      <h3 className="text-lg font-bold text-slate-800 mb-2">
        Expense Breakdown
      </h3>

      {chartData.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
          No expenses recorded yet
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="85%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={4}
              dataKey="value"
            >
              {chartData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(val) => `₹${Number(val).toLocaleString("en-IN")}`}
              contentStyle={{
                backgroundColor: "#fff",
                borderRadius: "12px",
                border: "1px solid #f1f5f9",
              }}
            />
            <Legend verticalAlign="bottom" height={36} iconType="circle" />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export default PieChartComponent;