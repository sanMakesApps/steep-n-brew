import { ShoppingCart, UserPlus, LogIn, LogOut, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import useUserStore from "../stores/useUserStore";

function Navbar() {
  const { user, logout } = useUserStore();
  const isAdmin = user?.role === "admin";

  return (
    <header className="fixed top-0 left-0 w-full bg-white/90 backdrop-blur-md shadow-md z-40 border-b border-gray-200 transition-all duration-300">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-bold text-emerald-600 flex items-center gap-2"
          >
            LuxeLayer
          </Link>

          {/* Navigation */}
          <nav className="flex flex-wrap items-center gap-4 text-sm sm:text-base">
            {/* Home */}
            <Link
              to="/"
              className="text-gray-700 hover:text-emerald-600 transition-colors duration-200"
            >
              Home
            </Link>

            {/* Cart (if logged in) */}
            {user && (
              <Link
                to="/cart"
                className="relative group text-gray-700 hover:text-emerald-600 transition-colors duration-200"
              >
                <ShoppingCart
                  className="inline-block mr-1 group-hover:text-emerald-600"
                  size={20}
                />
                <span className="hidden sm:inline">Cart</span>
                {/* Replace static 3 with dynamic cart count */}
                {3 > 0 && (
                  <span className="absolute -top-2 -left-2 bg-emerald-600 text-white rounded-full px-2 py-0.5 text-xs">
                    3
                  </span>
                )}
              </Link>
            )}

            {/* Admin Dashboard */}
            {isAdmin && (
              <Link
                to="/secret-dashboard"
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-md font-medium transition duration-200 flex items-center"
              >
                <Lock className="mr-1" size={18} />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
            )}

            {/* Auth Buttons */}
            {user ? (
              <button
                onClick={logout}
                className="bg-gray-700 hover:bg-gray-800 text-white py-2 px-4 rounded-md flex items-center transition duration-200"
              >
                <LogOut size={18} />
                <span className="hidden sm:inline ml-2">Log Out</span>
              </button>
            ) : (
              <>
                <Link
                  to="/signup"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-md flex items-center transition duration-200"
                >
                  <UserPlus className="mr-2" size={18} />
                  Sign Up
                </Link>
                <Link
                  to="/login"
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-md flex items-center transition duration-200"
                >
                  <LogIn className="mr-2" size={18} />
                  Login
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
