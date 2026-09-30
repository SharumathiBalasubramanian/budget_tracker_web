function BudgetProgress({
  budgets,
}) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
      <h3 className="text-xl font-bold text-slate-800 mb-6">
        Budget Tracks
      </h3>

      {budgets.length === 0 ? (
        <div className="py-12 text-center text-slate-400 font-medium">
          No budgets set up yet.
        </div>
      ) : (
        <div className="space-y-5">
          {budgets.map(
            (budget) => {
              const percent = (Number(budget.spent) / Number(budget.limit)) * 100;
              
              let gradient = "from-emerald-400 to-teal-500";
              let badgeBg = "bg-emerald-50 text-emerald-600";
              if (percent > 100) {
                gradient = "from-rose-500 to-pink-600";
                badgeBg = "bg-rose-50 text-rose-600";
              } else if (percent >= 80) {
                gradient = "from-amber-400 to-orange-500";
                badgeBg = "bg-amber-50 text-amber-600";
              }

              return (
                <div
                  key={budget.id || budget.category}
                  className="space-y-2"
                >
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800">
                        {budget.category}
                      </span>
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${badgeBg}`}>
                        {Math.round(percent)}%
                      </span>
                    </div>

                    <span className="font-semibold text-slate-500">
                      <span className="text-slate-800 font-bold">₹{Number(budget.spent).toLocaleString("en-IN")}</span>
                      {" "}/{" "}
                      <span>₹{Number(budget.limit).toLocaleString("en-IN")}</span>
                    </span>
                  </div>

                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${gradient} transition-all duration-500`}
                      style={{
                        width: `${Math.min(percent, 100)}%`,
                      }}
                    />
                  </div>
                </div>
              );
            }
          )}
        </div>
      )}
    </div>
  );
}

export default BudgetProgress;