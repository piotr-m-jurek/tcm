import { Link } from "react-router";
import { isAdmin } from "../lib";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}

function Header() {
  return (
    <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <Link to="/">
        <h1 className="text-2xl font-bold">Foods</h1>
      </Link>
      {isAdmin() && window.location.pathname !== "/admin" && (
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
