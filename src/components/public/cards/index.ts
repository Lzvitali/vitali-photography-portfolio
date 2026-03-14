import type { CardStyle, CategoryCardProps } from "@/lib/types";
import type { ComponentType } from "react";
import CategoryCard from "@/components/public/CategoryCard";
import StackCard from "./StackCard";
import AlbumCard from "./AlbumCard";
import PolaroidCard from "./PolaroidCard";
import RevealCard from "./RevealCard";
import FolderCard from "./FolderCard";
import FilmCard from "./FilmCard";

const CARD_MAP: Record<CardStyle, ComponentType<CategoryCardProps>> = {
  default: CategoryCard,
  stack: StackCard,
  album: AlbumCard,
  polaroid: PolaroidCard,
  reveal: RevealCard,
  folder: FolderCard,
  film: FilmCard,
};

export function getCardComponent(style: CardStyle): ComponentType<CategoryCardProps> {
  return CARD_MAP[style] ?? CategoryCard;
}

export function getGridGap(style: CardStyle): string {
  if (style === "polaroid") return "gap-6 md:gap-8";
  if (style === "album") return "gap-5 md:gap-7";
  if (style === "folder") return "gap-4 md:gap-5";
  return "gap-2 md:gap-3";
}
