import {
  createLazyComponent,
  GallerySkeleton,
  FormSkeleton,
  SectionSkeleton,
} from "@/components/utils/LazyLoad";

export const LazyInteractivePriceGallery = createLazyComponent(
  () =>
    import("@/components/sections/InteractivePriceGallery").then((mod) => ({
      default: mod.InteractivePriceGallery,
    })),
  <GallerySkeleton />
);

export const LazyContactFormSection = createLazyComponent(
  () =>
    import("@/components/sections/ContactFormSection").then((mod) => ({
      default: mod.ContactFormSection,
    })),
  <FormSkeleton />
);

export const LazyContactInfoSection = createLazyComponent(
  () =>
    import("@/components/sections/ContactInfoSection").then((mod) => ({
      default: mod.ContactInfoSection,
    })),
  <SectionSkeleton />
);

export const LazyAboutSection = createLazyComponent(
  () =>
    import("@/components/sections/AboutSection").then((mod) => ({
      default: mod.AboutSection,
    })),
  <SectionSkeleton />
);

export const LazyLogoCarousel = createLazyComponent(
  () =>
    import("@/components/ui/logo-carousel").then((mod) => ({
      default: mod.LogoCarousel,
    })),
  <SectionSkeleton />
);

export const LazyItemDetailView = createLazyComponent(
  () =>
    import("@/components/ui/ItemDetailView").then((mod) => ({
      default: mod.ItemDetailView,
    })),
  null
);

export const LazyRegionSelectionModal = createLazyComponent(
  () => import("@/components/ui/RegionSelectionModal"),
  null
);

export const LazySmoothFrameAnimation = createLazyComponent(
  () =>
    import("@/components/ui/smooth-frame-animation").then((mod) => ({
      default: mod.SmoothFrameAnimation,
    })),
  <div className="w-[400px] h-[400px] bg-gray-200 animate-pulse rounded-lg"></div>
);

export const LazyPortfolioGallery = createLazyComponent(
  () =>
    import("@/components/sections/PortfolioGallery").then((mod) => ({
      default: mod.PortfolioGallery,
    })),
  <GallerySkeleton />
);
