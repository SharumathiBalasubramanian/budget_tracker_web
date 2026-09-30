import {
  Navigate,
} from "react-router";

function ProtectedRoute({
  children,
}) {
  const user =
    localStorage.getItem(
      "currentUser"
    );

  return user ? (
    children
  ) : (
    <Navigate
      to="/login"
      replace
    />
  );
}

export default ProtectedRoute;