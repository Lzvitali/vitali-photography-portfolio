export interface FocalPoint {
  x: number;
  y: number;
}

export interface CoverCrop {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface PortfolioImage {
  id: string;
  url: string;
  public_id: string;
  title: string;
  categoryId: string;
  width: number;
  height: number;
  order: number;
  focalPoint: FocalPoint;
}

export type CardLayout = "landscape" | "portrait" | "square" | "wide" | "auto";

export const CARD_LAYOUT_OPTIONS: { value: CardLayout; label: string }[] = [
  { value: "landscape", label: "Landscape (16:10)" },
  { value: "portrait", label: "Portrait (3:4)" },
  { value: "square", label: "Square (1:1)" },
  { value: "wide", label: "Wide (2:1, spans 2 cols)" },
  { value: "auto", label: "Auto (original ratio)" },
];

export interface Category {
  id: string;
  name: string;
  slug: string;
  order: number;
  coverImageId: string | null;
  coverUrl: string | null;
  coverFocalPoint: FocalPoint;
  coverCrop: CoverCrop;
  cardLayout: CardLayout;
}

export interface PortfolioData {
  categories: Category[];
  images: PortfolioImage[];
}

export type CardStyle = "default" | "stack" | "album" | "polaroid" | "reveal" | "folder" | "film";

export const CARD_STYLE_OPTIONS: { value: CardStyle; label: string }[] = [
  { value: "default", label: "Default (overlay)" },
  { value: "stack", label: "Photo Stack" },
  { value: "album", label: "Album Book" },
  { value: "polaroid", label: "Polaroid" },
  { value: "reveal", label: "Minimal Reveal" },
  { value: "folder", label: "Folder Tab" },
  { value: "film", label: "Film Strip" },
];

export interface CategoryCardProps {
  category: Category;
  coverImage: PortfolioImage | null;
  imageCount: number;
  className?: string;
}

export interface SiteContact {
  email: string;
  phone: string;
  instagram: string;
  tiktok: string;
}

export interface SiteData {
  name: string;
  tagline: string;
  about: string;
  portraitUrl: string;
  cardStyle: CardStyle;
  contact: SiteContact;
}
