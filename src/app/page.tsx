import { getPortfolioData, getSiteData } from "@/lib/data";
import CategoryCard from "@/components/public/CategoryCard";
import AboutSection from "@/components/public/AboutSection";
import type { CardLayout, PortfolioImage } from "@/lib/types";

function getAspectClass(layout: CardLayout, coverImage: PortfolioImage | null): string {
  switch (layout) {
    case "landscape":
      return "aspect-[16/10]";
    case "portrait":
      return "sm:row-span-2 aspect-[3/4] sm:aspect-auto sm:h-full";
    case "square":
      return "aspect-square";
    case "wide":
      return "sm:col-span-2 lg:col-span-2 aspect-[2/1]";
    case "auto": {
      if (!coverImage) return "aspect-[4/3]";
      const ratio = coverImage.width / coverImage.height;
      if (ratio > 1.6) return "sm:col-span-2 lg:col-span-2 aspect-[2/1]";
      if (ratio < 0.8) return "sm:row-span-2 aspect-[3/4] sm:aspect-auto sm:h-full";
      return "aspect-[4/3]";
    }
    default:
      return "aspect-[4/3]";
  }
}

export default function Home() {
  const portfolio = getPortfolioData();
  const site = getSiteData();

  const sortedCategories = [...portfolio.categories].sort(
    (a, b) => a.order - b.order
  );

  return (
    <>
      {/* Hero */}
      <section className="px-5 md:px-8 pt-20 md:pt-28 pb-10 md:pb-14 text-center animate-fadeUp">
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light tracking-wide leading-tight">
          {site.name}
        </h1>
        <p className="mt-3 text-xs md:text-sm tracking-[0.2em] uppercase text-neutral-500 dark:text-neutral-400">
          {site.tagline}
        </p>
      </section>

      {/* Category Cards */}
      <section className="px-4 md:px-8 pb-8 md:pb-12">
        <h2 className="font-display text-xs tracking-[0.2em] uppercase text-neutral-400 dark:text-neutral-500 font-normal mb-6 md:mb-8 text-center">
          Explore Collections
        </h2>
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3 stagger-children">
          {sortedCategories.map((cat) => {
            const coverImage =
              portfolio.images.find((img) => img.id === cat.coverImageId) ||
              null;
            const imageCount = portfolio.images.filter(
              (img) => img.categoryId === cat.id
            ).length;
            const aspectClass = getAspectClass(cat.cardLayout || "landscape", coverImage);

            return (
              <CategoryCard
                key={cat.id}
                category={cat}
                coverImage={coverImage}
                imageCount={imageCount}
                className={aspectClass}
              />
            );
          })}
        </div>
      </section>

      {/* About */}
      <AboutSection
        about={site.about}
        portraitUrl={site.portraitUrl}
        name={site.name}
      />
    </>
  );
}
