import { Link, useLocation } from "react-router";
import {
  FaHome,
  FaMoneyBillWave,
  FaWallet,
  FaUser,
} from "react-icons/fa";

function Sidebar() {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("currentUser")) || {
    firstName: "Guest",
    lastName: "",
    email: "",
  };

  const menus = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <FaHome />,
    },
    {
      name: "Transactions",
      path: "/transactions",
      icon: <FaMoneyBillWave />,
    },
    {
      name: "Budgets",
      path: "/budgets",
      icon: <FaWallet />,
    },
    {
      name: "Profile",
      path: "/profile",
      icon: <FaUser />,
    },
  ];

  return (
    <aside className="w-80 min-h-screen bg-slate-950 border-r border-slate-900 text-slate-100 flex flex-col justify-between">
      <div className="flex-1 flex flex-col">
        {/* Logo Branding */}
        <div className="px-8 py-8 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <span className="text-white font-black text-xl">B</span>
          </div>
          <h1 className="text-2xl font-black bg-gradient-to-r from-indigo-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent tracking-tight">
            BudgetApp
          </h1>
        </div>

        {/* Navigation Menu */}
        <nav className="px-4 py-2 flex-1">
          <div className="space-y-1">
            {menus.map((menu) => {
              const isActive = location.pathname === menu.path;
              return (
                <Link
                  key={menu.path}
                  to={menu.path}
                  className={`flex items-center gap-4 px-5 py-4 rounded-xl text-base font-semibold transition-all duration-200 border-l-4 ${
                    isActive
                      ? "bg-indigo-600/10 text-indigo-400 border-indigo-500 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-900 border-transparent"
                  }`}
                >
                  <span className={`text-lg transition-transform duration-200 ${isActive ? "scale-110" : ""}`}>
                    {menu.icon}
                  </span>
                  <span>{menu.name}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>

     
    </aside>
  );
}

export default Sidebar;