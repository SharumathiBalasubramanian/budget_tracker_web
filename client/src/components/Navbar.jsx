import { useState } from "react";
import { Link } from "react-router";

function Navbar() {
  const [showMenu, setShowMenu] = useState(false);

  const user = JSON.parse(
    localStorage.getItem("currentUser")
  ) || {};

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    window.location.href = "/login";
  };

  return (
    <header className="sticky top-0 z-40 bg-white/70 backdrop-blur-xl border-b border-slate-100/80 px-8 py-5 flex justify-between items-center shadow-[0_2px_12px_-5px_rgba(0,0,0,0.02)]">
      <div>
        <p className="text-sm font-medium text-slate-400">
          Overview
        </p>
        <h2 className="text-xl font-bold text-slate-800">
          Welcome back, <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent font-black">{user.firstName || "Guest"}</span> ✨
        </h2>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right hidden sm:block">
          <h4 className="font-bold text-sm text-slate-800">
            {user.firstName} {user.lastName}
          </h4>
          <p className="text-xs font-semibold text-indigo-500">
            Premium Account
          </p>
        </div>

        <div className="relative">
          <button
            onClick={() =>
              setShowMenu(!showMenu)
            }
            className="w-10 h-10 rounded-xl overflow-hidden cursor-pointer hover:scale-105 active:scale-95 transition-all duration-200 shadow-md shadow-indigo-500/10 focus:outline-none"
          >
            {user.photo ? (
              <img
                src={user.photo}
                alt="avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-tr from-indigo-500 to-violet-600 text-white flex items-center justify-center font-bold">
                {user.firstName?.charAt(0).toUpperCase() || "G"}
              </div>
            )}
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-2.5 w-48 bg-white border border-slate-100 rounded-2xl shadow-xl shadow-slate-200/50 z-50 py-2">
              <div className="px-4 py-2.5 border-b border-slate-50">
                <p className="text-xs font-semibold text-slate-400">Signed in as</p>
                <p className="font-bold text-sm text-slate-800 truncate">
                  {user.firstName} {user.lastName}
                </p>
              </div>

              <Link
                to="/profile"
                className="block px-4 py-2.5 text-sm font-semibold text-slate-600 hover:text-indigo-600 hover:bg-slate-50 transition"
                onClick={() =>
                  setShowMenu(false)
                }
              >
                Profile Settings
              </Link>

              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-50/50 transition cursor-pointer"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;