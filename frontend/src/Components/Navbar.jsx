import { ShoppingCart, UserPlus, LogIn, LogOut, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";

const Navbar = () => {
  const { user, logout } = useUserStore();
  const isAdmin = user?.role === "admin";
  const { cart } = useCartStore();

  return (
    <header className="absolute top-0 left-0 w-full sm:px-10 px-5 py-4 z-40 flex justify-between items-center">
      <div className="container mx-auto ">
        <div className="flex flex-wrap gap-x-4 sm:gap-x-2 gap-y-4 justify-center sm:justify-between items-center">
          <Link
            to="/"
            className="text-xl font-bold text-white items-center flex"
          >
            Steep & Brew
          </Link>

          <nav className="flex flex-wrap items-center gap-8 sm:gap-4">
            <Link
              to={"/"}
              className="px-5 text-lg cursor-pointer text-gray-300 hover:text-white transition-all"
            >
              Home
            </Link>
            {user && (
              <Link
                to={"/cart"}
                className="relative group text-gray-300 hover:text-emerald-400 transition duration-300 
							ease-in-out"
              >
                <ShoppingCart
                  className="inline-block mr-1 cursor-pointer text-gray-300 group-hover:text-white transition-all"
                  size={20}
                />
                {cart.length > 0 && (
                  <span
                    className="absolute -top-2 -left-2 bg-emerald-500 text-white rounded-full px-2 py-0.5 
									text-xs group-hover:bg-emerald-400 transition duration-300 ease-in-out"
                  >
                    {cart.length}
                  </span>
                )}
              </Link>
            )}
            {isAdmin && (
              <Link
                className="bg-emerald-700 hover:bg-emerald-600 text-white px-3 py-1 rounded-md font-medium
								 transition duration-300 ease-in-out flex items-center"
                to={"/secret-dashboard"}
              >
                <Lock className="inline-block mr-1" size={18} />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
            )}

            {user ? (
              <button
                className="px-2 cursor-pointer text-gray-300 hover:text-white transition-all"
                onClick={logout}
              >
                <LogOut size={18} />
              </button>
            ) : (
              <>
                <Link
                  to={"/signup"}
                  className="px-2 cursor-pointer text-gray-300 hover:text-white transition-all"
                >
                  <UserPlus className="mr-2" size={18} />
                </Link>
                <Link
                  to={"/login"}
                  className="px-2 cursor-pointer text-gray-300 hover:text-white transition-all"
                >
                  <LogIn className="mr-2" size={18} />
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};
export default Navbar;
