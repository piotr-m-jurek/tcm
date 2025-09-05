import { Link, useLocation } from "react-router";
import { isAdmin } from "../lib";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col size-full">
      <Header />
      {children}
    </div>
  );
}

function Header() {
  const location = useLocation();
  return (
    <header
      className={`text-white p-4 flex justify-between items-center ${
        location.pathname === "/" ? "bg-gray-800" : "bg-amber-400"
      }`}
    >
      <Link to="/">
        <h1 className="text-2xl font-bold">Foods</h1>
      </Link>
      {location.pathname === "/admin" && (
        <div className="flex items-center gap-4">IN ADMIN MODE</div>
      )}
      {isAdmin() && location.pathname !== "/admin" && (
        <div className="flex items-center gap-4">
          <Link
            to="/admin"
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Admin
          </Link>
        </div>
      )}
    </header>
  );
}
