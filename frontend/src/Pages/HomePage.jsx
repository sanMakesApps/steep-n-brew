import React, { useEffect, lazy, Suspense } from "react";
import { useProductStore } from "../stores/useProductStore";
import HeroSection from "../Components/HeroSection";


const CatItem = lazy(() => import("../Components/CatItem"));

const ProductsFeatured = lazy(() => import("../Components/ProductsFeatured"));

const categories = [
  {
    href: "/coffees",
    name: "Coffee Beans & Blends",
    imageUrl: "/coffee-cat.jpg",
  },
  { href: "/teas", name: "Artisan Tea", imageUrl: "/tea-cat.jpg" },
  {
    href: "/gears",
    name: "Brewing Gear",
    imageUrl: "/gear.jpg",
  },
  { href: "/mugs", name: "Mugs & Drinkware", imageUrl: "/mug.jpg" },
  {
    href: "/samples",
    name: "Curated Sampler",
    imageUrl: "/gift-box.jpg",
  },
  {
    href: "/enhancers",
    name: "Enhancers",
    imageUrl: "/honey-milk.jpg",
  },
];

const HomePage = () => {
  const { fetchFeaturedProducts, products, isLoading } = useProductStore();

  useEffect(() => {
    fetchFeaturedProducts();
  }, [fetchFeaturedProducts]);

  return (
    <div className="min-h-screen bg-black/40 backdrop-blur-sm">
      <HeroSection />

      <div
        id="categories"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
      >
        <h2 className="text-center text-4xl sm:text-5xl font-semibold text-gray-200 mb-4">
          Explore Our Categories
        </h2>

        <p className="text-center text-lg text-gray-500 mb-12">
          Discover coffee beans, tea leaves & morning essentials.
        </p>
        <Suspense
          fallback={
            <div className="text-white text-center py-10">
              Loading categories...
            </div>
          }
        >
          <div className="grid sm:grid-cols-2  gap-2">
            {categories.map((category) => (
              <CatItem category={category} key={category.name} />
            ))}
          </div>
        </Suspense>
      </div>

      {!isLoading && products.length > 0 && (
        <Suspense
          fallback={
            <div className="text-white text-center py-10">
              Loading featured products...
            </div>
          }
        >
          <ProductsFeatured featProducts={products} />
        </Suspense>
      )}
    </div>
  );
};

export default HomePage;
