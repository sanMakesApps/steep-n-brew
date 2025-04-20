import { lazy, Suspense } from "react";

import { BarChart, PlusCircle, ShoppingBasket } from "lucide-react";
import { useEffect, useState } from "react";
import { useProductStore } from "../stores/useProductStore";
import LoadingSpinner from "../Components/LoadingSpinner";
import PageHeaders from "../Components/PageHeaders";

const CreateProductForm = lazy(() => import("../Components/CreateProductForm"));
const ProductsList = lazy(() => import("../Components/ProductsList"));
const AnalyticsTab = lazy(() => import("../Components/AnalyticsTab"));

const tabs = [
  { id: "create", label: "Create Product", icon: PlusCircle },
  { id: "products", label: "Products", icon: ShoppingBasket },
  { id: "analytics", label: "Analytics", icon: BarChart },
];

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("create");

  const { fetchAllProducts } = useProductStore();

  useEffect(() => {
    fetchAllProducts();
  }, [fetchAllProducts]);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="relative z-10 container mx-auto px-4 py-16">
        <PageHeaders pageHeader={"Admin Dashboard"} />

        <div className="flex justify-center mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-4 py-2 mx-2 rounded-md transition-colors duration-200 ${
                activeTab === tab.id
                  ? "bg-emerald-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              <tab.icon className="mr-2 h-5 w-5" />
              {tab.label}
            </button>
          ))}
        </div>
        <Suspense
          fallback={
            <div className="text-center text-gray-400">
              <LoadingSpinner />
            </div>
          }
        >
          {activeTab === "create" && <CreateProductForm />}
          {activeTab === "products" && <ProductsList />}
          {activeTab === "analytics" && <AnalyticsTab />}
        </Suspense>
      </div>
    </div>
  );
};

export default AdminPage;
