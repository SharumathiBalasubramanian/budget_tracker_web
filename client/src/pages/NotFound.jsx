import { Link } from "react-router";

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-slate-100">

      <h1 className="text-8xl font-bold text-indigo-600">
        404
      </h1>

      <h2 className="text-3xl font-semibold mt-4">
        Page Not Found
      </h2>

      <p className="text-slate-500 mt-2">
        The page you are looking for does not exist.
      </p>

      <Link
        to="/dashboard"
        className="mt-6 px-6 py-3 bg-indigo-600 text-white rounded-lg"
      >
        Go To Dashboard
      </Link>

    </div>
  );
}

export default NotFound;