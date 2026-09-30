import { useState } from "react";
import { Link } from "react-router";
import {
  Wallet,
  PieChart,
  BrainCircuit,
  ArrowRight,
  TrendingUp,
  Shield,
  Zap,
  Sparkles,
  Layers,
 
} from "lucide-react";

function Home() {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <div className="min-h-screen bg-[#070b15] text-slate-100 font-sans selection:bg-indigo-500 selection:text-white relative overflow-hidden">
      
      {/* Background Decorative Glow Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[30%] -left-[100px] w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-100px] right-[-100px] w-[500px] h-[500px] bg-fuchsia-500/10 rounded-full blur-[130px] pointer-events-none" />
      
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-[#070b15]/75 backdrop-blur-xl border-b border-white/[0.06] transition-all">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          
          <Link to="/" className="flex items-center gap-2 font-black text-2xl tracking-tight text-white hover:opacity-95 transition-all">
            
             <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center font-bold text-lg shadow-lg shadow-indigo-500/20">
            B
          </div>
            <span className="font-extrabold">BudgetApp</span>
          </Link>

          <div className="flex items-center gap-5">
            <Link
              to="/login"
              className="text-sm font-semibold text-slate-300 hover:text-white transition-all duration-200"
            >
              Login
            </Link>

            <Link
              to="/signup"
              className="px-5 py-2.5 bg-white text-slate-950 font-bold text-sm rounded-xl shadow-lg hover:bg-slate-100 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
              Sign Up
            </Link>
          </div>

        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-6 pt-24 pb-20 z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          <div className="space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Next-Generation Budget Intelligence
            </div>

            <h1 className="text-5xl lg:text-6xl font-black text-white leading-[1.1] tracking-tight">
              Master Your Wealth
              <br />
              With <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">Autonomous AI</span>
            </h1>

            <p className="text-lg text-slate-400 leading-relaxed max-w-lg">
              Track transactions seamlessly, manage strict budgets in real-time, and let our predictive AI model analyze spending trends to grow your wealth automatically.
            </p>

            <div className="pt-4 flex flex-wrap gap-4">
              <Link
                to="/signup"
                className="bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-bold px-6 py-4 rounded-xl flex items-center gap-2 shadow-lg shadow-indigo-500/15 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer"
              >
                Start for Free
                <ArrowRight className="w-4.5 h-4.5" />
              </Link>

              <Link
                to="/login"
                className="border border-slate-800 hover:border-slate-700 bg-slate-900/60 text-slate-300 font-semibold px-6 py-4 rounded-xl hover:bg-slate-900 transition-all duration-200"
              >
                Sign In to Dashboard
              </Link>
            </div>
          </div>

          {/* Interactive CSS Dashboard Mockup */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-violet-500 rounded-3xl blur-[50px] opacity-20 pointer-events-none" />
            
            <div className="relative bg-[#0d1326] border border-white/10 rounded-3xl shadow-2xl p-6 overflow-hidden max-w-lg mx-auto">
              {/* Mockup Window Header */}
              <div className="flex justify-between items-center border-b border-white/[0.06] pb-4 mb-5">
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <div className="px-3 py-1 bg-white/[0.04] border border-white/[0.08] rounded-lg text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                  Live Dashboard Preview
                </div>
              </div>
              
              {/* Mock Dashboard Grid */}
              <div className="space-y-4">
                {/* Stats row */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-4">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total Balance</span>
                    <p className="text-2xl font-black text-white mt-1">₹45,280</p>
                    <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-0.5 mt-1.5">
                      +12.4% this month
                    </span>
                  </div>
                  <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-4">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Monthly Savings</span>
                    <p className="text-2xl font-black text-indigo-400 mt-1">₹18,120</p>
                    <span className="text-[10px] text-indigo-300 font-semibold flex items-center gap-0.5 mt-1.5">
                      Active Target Goal
                    </span>
                  </div>
                </div>

                {/* Analytical Visual Graph */}
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Expense Analytics</span>
                    <span className="px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[9px] font-bold rounded">AI Core Enabled</span>
                  </div>
                  <div className="h-28 flex items-end justify-between gap-1.5 pt-4 border-b border-white/[0.04] px-2">
                    <div className="w-[12%] bg-slate-800 rounded-t h-[40%] hover:bg-indigo-500 transition-all duration-300 cursor-pointer" />
                    <div className="w-[12%] bg-slate-800 rounded-t h-[60%] hover:bg-indigo-500 transition-all duration-300 cursor-pointer" />
                    <div className="w-[12%] bg-slate-800 rounded-t h-[35%] hover:bg-indigo-500 transition-all duration-300 cursor-pointer" />
                    <div className="w-[12%] bg-slate-800 rounded-t h-[75%] hover:bg-indigo-500 transition-all duration-300 cursor-pointer" />
                    <div className="w-[12%] bg-gradient-to-t from-indigo-500 to-violet-600 rounded-t h-[90%] shadow-[0_0_10px_rgba(99,102,241,0.2)]" />
                    <div className="w-[12%] bg-slate-800 rounded-t h-[50%] hover:bg-indigo-500 transition-all duration-300 cursor-pointer" />
                    <div className="w-[12%] bg-slate-800 rounded-t h-[80%] hover:bg-indigo-500 transition-all duration-300 cursor-pointer" />
                  </div>
                </div>

                {/* Bottom Insight Feed item */}
                <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-4 flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                    <BrainCircuit className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">AI Suggestion</p>
                    <p className="text-[11px] text-indigo-200/80 mt-0.5 leading-relaxed">
                      "You're spending 15% less than last week on Dining Out. Keep this pace to save ₹2,400 this month."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Features Section */}
      <section className="relative max-w-7xl mx-auto px-6 py-20 z-10">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Supercharge Your Finances
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto font-medium">
            Take advantage of cutting-edge tech that makes budget management fast, beautiful, and insights-driven.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          
          {/* Card 1 */}
          <div className="bg-[#0e1528]/50 border border-white/[0.06] rounded-2xl p-8 hover:border-indigo-500/40 hover:shadow-[0_0_30px_rgba(99,102,241,0.05)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl flex items-center justify-center mb-6">
                <Wallet className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">
                Expense Tracking
              </h3>
              <p className="text-slate-400 mt-3 text-sm leading-relaxed">
                Record income and expenses by category and date. Maintain visual records of all transactions effortlessly.
              </p>
            </div>
            <div className="pt-6">
              <span className="text-xs font-bold text-indigo-400 flex items-center gap-1">
                Real-time tracking <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-[#0e1528]/50 border border-white/[0.06] rounded-2xl p-8 hover:border-violet-500/40 hover:shadow-[0_0_30px_rgba(139,92,246,0.05)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 bg-violet-500/10 border border-violet-500/20 text-violet-400 rounded-xl flex items-center justify-center mb-6">
                <PieChart className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">
                Interactive Charts
              </h3>
              <p className="text-slate-400 mt-3 text-sm leading-relaxed">
                Visualize spending trends using elegant custom pie and line charts. Identify key categories in a single tap.
              </p>
            </div>
            <div className="pt-6">
              <span className="text-xs font-bold text-violet-400 flex items-center gap-1">
                Dynamic analytics <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-[#0e1528]/50 border border-white/[0.06] rounded-2xl p-8 hover:border-fuchsia-500/40 hover:shadow-[0_0_30px_rgba(217,70,239,0.05)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-400 rounded-xl flex items-center justify-center mb-6">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">
                AI Spending Insights
              </h3>
              <p className="text-slate-400 mt-3 text-sm leading-relaxed">
                Get real-time saving suggestions, alert notifications, and overspending warnings triggered by our smart AI.
              </p>
            </div>
            <div className="pt-6">
              <span className="text-xs font-bold text-fuchsia-400 flex items-center gap-1">
                Predictive reasoning <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-white/[0.01] border-y border-white/[0.04] py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
              Why Choose BudgetAI?
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto font-medium">
              We provide the framework, data privacy, and tools you need to succeed in your financial journey.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            
            <div className="bg-[#0e1528]/25 border border-white/[0.03] p-8 rounded-2xl flex gap-4">
              <div className="w-10 h-10 bg-indigo-500/10 text-indigo-400 rounded-xl flex items-center justify-center shrink-0">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-white">
                  Monthly Budget Planner
                </h3>
                <p className="text-slate-400 mt-2 text-sm leading-relaxed">
                  Set specific budgets for shopping, rent, utilities, and dining. Track dynamic progress bars as transactions roll in.
                </p>
              </div>
            </div>

            <div className="bg-[#0e1528]/25 border border-white/[0.03] p-8 rounded-2xl flex gap-4">
              <div className="w-10 h-10 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center shrink-0">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-white">
                  Real-Time Alerts
                </h3>
                <p className="text-slate-400 mt-2 text-sm leading-relaxed">
                  Receive visual alerts when your category spending reaches 80% or overflows 100% of your budget limit.
                </p>
              </div>
            </div>

            <div className="bg-[#0e1528]/25 border border-white/[0.03] p-8 rounded-2xl flex gap-4">
              <div className="w-10 h-10 bg-violet-500/10 text-violet-400 rounded-xl flex items-center justify-center shrink-0">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-white">
                  Secure Authentication
                </h3>
                <p className="text-slate-400 mt-2 text-sm leading-relaxed">
                  Your financial records are kept private. Credentials and entries are encrypted and securely stored for safety.
                </p>
              </div>
            </div>

            <div className="bg-[#0e1528]/25 border border-white/[0.03] p-8 rounded-2xl flex gap-4">
              <div className="w-10 h-10 bg-rose-500/10 text-rose-400 rounded-xl flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-white">
                  Export & Reports
                </h3>
                <p className="text-slate-400 mt-2 text-sm leading-relaxed">
                  Download fully comprehensive spreadsheet-ready transaction logs to parse or file taxes with absolute speed.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

     
      {/* CTA section */}
      <section className="relative py-24 z-10">
        <div className="absolute inset-0 bg-indigo-600/5 rounded-3xl blur-[40px] pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center px-6 space-y-6">
          <h2 className="text-4xl font-extrabold text-white tracking-tight sm:text-5xl">
            Start Managing Your Money Today
          </h2>
          <p className="text-slate-400 max-w-lg mx-auto font-medium">
            Take control of your finances with AI-powered insights. Upgrading takes seconds.
          </p>
          <div className="pt-4">
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 bg-white hover:bg-slate-100 text-slate-950 font-bold px-8 py-4 rounded-xl shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer"
            >
              Create Your Account
              <ArrowRight className="w-4.5 h-4.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
<footer className="bg-slate-950/60 border-t border-white/[0.04] text-white py-12 relative z-10">
  <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-center">
    <p className="text-slate-500 text-sm text-center">
      © 2026 BudgetApp. All rights reserved.
    </p>
  </div>
</footer>
 
    </div>
  );
}

export default Home;