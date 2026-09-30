import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function LineChartComponent({ transactions = [] }) {
  // Sort transactions by date ascending
  const sorted = [...transactions].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  const dataMap = {};

  sorted.forEach((tx) => {
    const dateLabel = tx.date || "N/A";
    const amount = Number(tx.amount || 0);
    const type = (tx.type || "").toLowerCase();

    if (!dataMap[dateLabel]) {
      dataMap[dateLabel] = { date: dateLabel, spending: 0 };
    }

    if (type === "expense") {
      dataMap[dateLabel].spending += amount;
    }
  });

  const chartData = Object.values(dataMap);

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 h-80 flex flex-col justify-between">
      <h3 className="text-lg font-bold text-slate-800 mb-2">
        Spending Trend
      </h3>

      {chartData.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
          No trend data available
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="85%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} />
            <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
            <Tooltip
              formatter={(val) => `₹${Number(val).toLocaleString("en-IN")}`}
              contentStyle={{
                backgroundColor: "#fff",
                borderRadius: "12px",
                border: "1px solid #f1f5f9",
              }}
            />
            <Line
              type="monotone"
              dataKey="spending"
              stroke="#6366f1"
              strokeWidth={3}
              dot={{ r: 4, fill: "#6366f1" }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export default LineChartComponent;