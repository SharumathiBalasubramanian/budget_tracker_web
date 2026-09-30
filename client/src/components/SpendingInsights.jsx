import React from "react";

function SpendingInsights({ insights, onRefresh, isGenerating }) {
  // Helper to normalize content whether it's an array or a raw Gemini string
  const renderContent = () => {
    if (isGenerating) {
      return (
        <div className="flex items-center gap-3 py-6 text-slate-500">
          <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium">Analyzing budget & generating insights...</p>
        </div>
      );
    }

    if (!insights || (Array.isArray(insights) && insights.length === 0)) {
      return (
        <p className="text-sm text-slate-400 py-4">
          No insights available right now. Click Refresh to analyze your spending.
        </p>
      );
    }

    // Case 1: If insights is an Array (e.g. [{ id, tip }] or ['tip 1', 'tip 2'])
    if (Array.isArray(insights)) {
      return (
        <ul className="space-y-3 mt-2">
          {insights.map((item, idx) => (
            <li
              key={idx}
              className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-sm text-slate-700 leading-relaxed"
            >
              {typeof item === "string" ? item : item.tip || item.message || JSON.stringify(item)}
            </li>
          ))}
        </ul>
      );
    }

    // Case 2: If insights is a String from Gemini
    if (typeof insights === "string") {
      // Split by double newline or bullet markers if present, or display with whitespace
      return (
        <div className="mt-2 text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-2xl border border-slate-100">
          {insights}
        </div>
      );
    }

    // Fallback if insights is an unexpected object
    return (
      <div className="mt-2 text-sm text-slate-600">
        {JSON.stringify(insights)}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
            <h3 className="text-xl font-semibold text-slate-800">AI Spending Insights</h3>
          </div>

          <button
            onClick={onRefresh}
            disabled={isGenerating}
            className="text-xs px-3.5 py-1.5 bg-indigo-50 text-indigo-600 font-semibold rounded-xl hover:bg-indigo-100 transition disabled:opacity-50"
          >
            {isGenerating ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {renderContent()}
      </div>
    </div>
  );
}

export default SpendingInsights;