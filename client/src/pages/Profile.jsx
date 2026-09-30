import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import {
  FaCamera,
  FaTrashAlt,
  FaSignOutAlt,
  FaExclamationTriangle,
} from "react-icons/fa";

function Profile() {
  const navigate = useNavigate();

  const currentUser =
    JSON.parse(
      localStorage.getItem(
        "currentUser"
      )
    ) || {};

  const [user, setUser] =
    useState({
      firstName:
        currentUser.firstName || "",
      lastName:
        currentUser.lastName || "",
      email:
        currentUser.email || "",
      photo:
        currentUser.photo || "",
    });

  const [dragActive, setDragActive] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]:
        e.target.value,
    });
  };

  const handlePhoto = (e) => {
    const file =
      e.target.files[0];

    if (!file) return;

    const reader =
      new FileReader();

    reader.onloadend =
      () => {
        setUser({
          ...user,
          photo:
            reader.result,
        });
      };

    reader.readAsDataURL(
      file
    );
  };

  const handleRemovePhoto = () => {
    setUser({
      ...user,
      photo: "",
    });
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setUser((prev) => ({
            ...prev,
            photo: reader.result,
          }));
        };
        reader.readAsDataURL(file);
      } else {
        toast.error("Please drop an image file.");
      }
    }
  };

  const handleSave = () => {
    const updatedUser = {
      ...currentUser,
      ...user,
    };

    localStorage.setItem(
      "currentUser",
      JSON.stringify(
        updatedUser
      )
    );

    const users =
      JSON.parse(
        localStorage.getItem(
          "users"
        )
      ) || [];

    const updatedUsers =
      users.map((item) =>
        item.email ===
        currentUser.email
          ? updatedUser
          : item
      );

    localStorage.setItem(
      "users",
      JSON.stringify(
        updatedUsers
      )
    );

    toast.success("Profile updated successfully!");

    // Reload the page after a brief delay so navbar/sidebar update their visual states
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const handleLogout = () => {
    localStorage.removeItem(
      "currentUser"
    );
    toast.info("Logged out successfully.");
    navigate("/login");
  };

  const handleClearAllData = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmClear = () => {
    localStorage.clear();
    toast.success("All local storage data cleared successfully.");
    setShowConfirmModal(false);
    setTimeout(() => {
      navigate("/signup");
    }, 1000);
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <div className="flex-1">
        <Navbar />

        <main className="p-8 space-y-8">
          {/* Header */}
          <div>
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">
              Profile Settings
            </h2>
            <p className="text-slate-400 font-semibold mt-1">
              Manage your account credentials, profile picture, and app preferences.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Panel: Profile Picture */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] p-8 flex flex-col items-center space-y-6">
              <div className="text-center">
                <h3 className="font-extrabold text-lg text-slate-800 tracking-tight">Profile Photo</h3>
                <p className="text-slate-400 text-xs font-semibold mt-0.5">Customize your account avatar</p>
              </div>

              {/* Drag and Drop Zone */}
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                className={`w-full border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center transition-all duration-300 relative ${
                  dragActive
                    ? "border-indigo-500 bg-indigo-50/30 scale-[1.02] shadow-[0_0_20px_rgba(99,102,241,0.1)]"
                    : "border-slate-200 hover:border-slate-300 bg-slate-50/50"
                }`}
              >
                {user.photo ? (
                  <div className="relative group">
                    <img
                      src={user.photo}
                      alt="profile"
                      className="w-32 h-32 rounded-2xl object-cover border-4 border-white shadow-xl transition group-hover:brightness-90 duration-300"
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
                      <button
                        type="button"
                        onClick={handleRemovePhoto}
                        className="bg-rose-600 hover:bg-rose-700 text-white p-2.5 rounded-xl shadow-lg transition duration-200 cursor-pointer"
                        title="Remove Photo"
                      >
                        <FaTrashAlt className="text-sm" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="w-32 h-32 rounded-2xl bg-gradient-to-tr from-indigo-500 to-violet-600 text-white flex items-center justify-center text-5xl font-black shadow-xl shadow-indigo-500/10 border-4 border-white">
                    {user.firstName ? user.firstName.charAt(0).toUpperCase() : "U"}
                  </div>
                )}

                <div className="text-center mt-5 space-y-1">
                  <p className="text-xs font-bold text-slate-500">
                    {dragActive ? "Drop image here" : "Drag & drop image here"}
                  </p>
                  <p className="text-[10px] font-semibold text-slate-400">or click button below</p>
                </div>
              </div>

              <div className="flex gap-2 w-full">
                <label className="flex-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 py-3 rounded-xl text-xs font-extrabold text-center transition cursor-pointer flex items-center justify-center gap-2">
                  <FaCamera className="text-sm" />
                  Upload Photo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhoto}
                    hidden
                  />
                </label>
              </div>
            </div>

            {/* Right Panel: Account Info & Danger Zone */}
            <div className="lg:col-span-2 space-y-8">
              {/* Account Info Card */}
              <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] p-8 space-y-6">
                <h3 className="text-2xl font-black text-slate-800 tracking-tight">
                  Account Information
                </h3>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={user.firstName}
                      onChange={handleChange}
                      className="w-full bg-white border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 p-3.5 rounded-xl outline-none transition font-semibold text-slate-700"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={user.lastName}
                      onChange={handleChange}
                      className="w-full bg-white border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 p-3.5 rounded-xl outline-none transition font-semibold text-slate-700"
                    />
                  </div>

                  <div className="md:col-span-2 space-y-1.5">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={user.email}
                      onChange={handleChange}
                      className="w-full bg-white border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 p-3.5 rounded-xl outline-none transition font-semibold text-slate-700"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleSave}
                    className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-indigo-500/15 transition duration-200 cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </div>

              {/* Danger Zone Card */}
              <div className="bg-rose-50/20 border border-rose-100 rounded-3xl p-8 space-y-6">
                <div className="flex items-center gap-3 text-rose-600">
                  <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center border border-rose-100 text-lg">
                    <FaExclamationTriangle />
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold tracking-tight">Danger Zone</h3>
                    <p className="text-[11px] font-bold text-rose-500/80 uppercase tracking-wider mt-0.5">Critical Account Controls</p>
                  </div>
                </div>

                <p className="text-slate-500 text-sm font-medium">
                  Perform critical system tasks. Clearing application data resets local databases, transactions, and budgets.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                  <button
                    onClick={handleLogout}
                    className="bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 font-bold px-6 py-3.5 rounded-xl shadow-sm transition duration-200 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <FaSignOutAlt className="text-slate-400" />
                    Logout
                  </button>

                  <button
                    onClick={handleClearAllData}
                    className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-6 py-3.5 rounded-xl shadow-lg shadow-rose-500/15 transition duration-200 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <FaTrashAlt />
                    Clear All App Data
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Custom Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full border border-slate-100 shadow-2xl space-y-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-rose-50 border border-rose-100 rounded-full flex items-center justify-center text-rose-500 mx-auto mb-2 text-xl">
                <FaExclamationTriangle />
              </div>
              <h3 className="text-xl font-bold text-slate-800">Clear All App Data?</h3>
              <p className="text-slate-500 text-sm font-medium">Are you sure you want to clear all data? This will clear all local storage and reset the application.</p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 px-4 rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmClear}
                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-rose-500/15 transition cursor-pointer"
              >
                Clear Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;