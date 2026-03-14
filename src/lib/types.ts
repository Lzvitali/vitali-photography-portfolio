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
  contact: SiteContact;
}
