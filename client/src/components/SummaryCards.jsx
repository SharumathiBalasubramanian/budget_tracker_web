import { TrendingUp, TrendingDown, Wallet } from "lucide-react";

function SummaryCards({
  income,
  expense,
}) {
  const balance = income - expense;

  const cards = [
    {
      title: "Total Income",
      value: income,
      gradient: "from-emerald-500 to-teal-600",
      shadow: "shadow-emerald-500/20",
      icon: <TrendingUp className="w-6 h-6 text-white" />,
    },
    {
      title: "Total Expense",
      value: expense,
      gradient: "from-rose-500 to-pink-600",
      shadow: "shadow-rose-500/20",
      icon: <TrendingDown className="w-6 h-6 text-white" />,
    },
    {
      title: "Net Balance",
      value: balance,
      gradient: "from-indigo-500 to-violet-600",
      shadow: "shadow-indigo-500/20",
      icon: <Wallet className="w-6 h-6 text-white" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((card) => (
        <div
          key={card.title}
          className={`bg-gradient-to-br ${card.gradient} ${card.shadow} text-white p-6 rounded-2xl shadow-lg border border-white/10 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 relative overflow-hidden group`}
        >
          {/* Subtle decorative background glow */}
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-xl group-hover:scale-125 transition-transform duration-500" />
          
          <div className="flex justify-between items-start">
            <div>
              <p className="text-white/80 text-sm font-semibold tracking-wide uppercase">
                {card.title}
              </p>
              <h2 className="text-3xl font-black mt-2 tracking-tight">
                ₹{card.value.toLocaleString("en-IN")}
              </h2>
            </div>
            <div className="p-3 bg-white/15 rounded-xl backdrop-blur-md border border-white/10">
              {card.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default SummaryCards;