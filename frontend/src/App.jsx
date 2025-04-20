import { lazy, Suspense } from "react";

const HomePage = lazy(() => import("./Pages/HomePage"));
const SignUpPage = lazy(() => import("./Pages/SignUpPage"));
const LoginPage = lazy(() => import("./Pages/LoginPage"));
const AdminPage = lazy(() => import("./Pages/AdminPage"));
const CategoryPage = lazy(() => import("./Pages/CategoryPage"));
const CartPage = lazy(() => import("./Pages/CartPage"));
const PurchaseSuccessPage = lazy(() => import("./Pages/PurchaseSuccessPage"));
const PurchaseCancelPage = lazy(() => import("./Pages/PurchaseCancelPage"));

import Navbar from "./Components/Navbar";

import LoadingSpinner from "./Components/LoadingSpinner";

import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import useInitializeUser from "./hooks/useInitializeUser";

function App() {
  const { user, checkingAuth } = useInitializeUser();
  if (checkingAuth) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
      <div className="relative z-50 ">
        <Navbar />
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/signup"
              element={!user ? <SignUpPage /> : <Navigate to="/" />}
            />
            <Route
              path="/login"
              element={!user ? <LoginPage /> : <Navigate to="/" />}
            />
            <Route
              path="/secret-dashboard"
              element={
                user?.role === "admin" ? (
                  <AdminPage />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route path="/category/:category" element={<CategoryPage />} />
            <Route
              path="/cart"
              element={user ? <CartPage /> : <Navigate to="/login" />}
            />
            <Route
              path="/purchase-success"
              element={
                user ? <PurchaseSuccessPage /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/purchase-cancel"
              element={user ? <PurchaseCancelPage /> : <Navigate to="/login" />}
            />
          </Routes>
        </Suspense>
      </div>
      <Toaster />
    </div>
  );
}

export default App;
