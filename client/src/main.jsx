import React from "react";
import ReactDOM from "react-dom/client";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import App from "./App";
import "./index.css";
import"./App"
import { AuthProvider } from "./context/AuthContext";

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnHover theme="light" />
    </AuthProvider>
  </React.StrictMode>
);