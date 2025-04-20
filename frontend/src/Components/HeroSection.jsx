import { memo } from "react";

const HeroSection = () => {
  return (
    <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      {/* Background image with AVIF + fallback */}
      <picture>
        <source srcSet="/bg-hero-tea.avif" type="image/avif" />
        <source srcSet="/bg-hero-tea.jpg" type="image/jpeg" />
        <img
          src="/bg-hero-tea.jpg"
          alt="Tea background"
          className="absolute inset-0 w-full h-full object-cover object-center"
          aria-hidden="true"
          loading="lazy"
        />
      </picture>

      {/* Overlay content */}
      <div className="relative z-10 text-center bg-black/40 backdrop-blur-sm px-6 py-10 rounded-xl max-w-xl">
        <h1 className="text-xl sm:text-3xl text-white font-light mb-4">
          Start Your Morning Right
        </h1>
        <p className="text-md text-gray-200 mb-6">
          Discover coffee beans, tea leaves & morning essentials.
        </p>
        <a
          href="#categories"
          className="inline-block bg-white text-black font-medium px-6 py-3 rounded-full hover:bg-gray-200 transition"
        >
          Shop Now
        </a>
      </div>

      {/* Optional gradient or overlay enhancement */}
      <div className="absolute inset-0 bg-black/20" />
    </section>
  );
};

export default memo(HeroSection);
