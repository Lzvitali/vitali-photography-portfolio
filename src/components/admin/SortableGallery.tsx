"use client";

import React, { useCallback, useMemo } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  GripVertical,
  Trash2,
  Crosshair,
  Star,
} from "lucide-react";
import type { PortfolioImage } from "@/lib/types";

function thumbUrl(url: string): string {
  return url.replace("/upload/", "/upload/c_fill,w_300,h_300,f_auto,q_auto/");
}

interface SortableItemProps {
  image: PortfolioImage;
  isCover: boolean;
  onDelete: (id: string) => void;
  onSetFocalPoint: (image: PortfolioImage) => void;
  onSetCover: (id: string) => void;
}

const SortableItem = React.memo(function SortableItem({
  image,
  isCover,
  onDelete,
  onSetFocalPoint,
  onSetCover,
}: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : ("auto" as const),
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group relative rounded-md overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900"
    >
      <div className="aspect-square relative">
        <img
          src={thumbUrl(image.url)}
          alt={image.title || "Photo"}
          className="w-full h-full object-cover"
          style={{
            objectPosition: `${image.focalPoint?.x ?? 50}% ${
              image.focalPoint?.y ?? 50
            }%`,
          }}
          loading="lazy"
          decoding="async"
        />
        {isCover && (
          <div className="absolute top-1.5 left-1.5 bg-amber-500 text-white text-[10px] px-1.5 py-0.5 rounded font-medium flex items-center gap-0.5">
            <Star size={10} />
            Cover
          </div>
        )}
      </div>
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
      <div className="absolute top-1.5 right-1.5 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          {...attributes}
          {...listeners}
          className="w-7 h-7 rounded bg-white/90 dark:bg-neutral-900/90 flex items-center justify-center cursor-grab active:cursor-grabbing shadow-sm"
          aria-label="Drag to reorder"
        >
          <GripVertical size={12} />
        </button>
        <button
          onClick={() => onSetCover(image.id)}
          className="w-7 h-7 rounded bg-white/90 dark:bg-neutral-900/90 flex items-center justify-center hover:bg-amber-50 dark:hover:bg-amber-900/30 shadow-sm"
          title="Set as cover"
          aria-label="Set as cover"
        >
          <Star size={12} />
        </button>
        <button
          onClick={() => onSetFocalPoint(image)}
          className="w-7 h-7 rounded bg-white/90 dark:bg-neutral-900/90 flex items-center justify-center hover:bg-blue-50 dark:hover:bg-blue-900/30 shadow-sm"
          title="Set focal point"
          aria-label="Set focal point"
        >
          <Crosshair size={12} />
        </button>
        <button
          onClick={() => onDelete(image.id)}
          className="w-7 h-7 rounded bg-white/90 dark:bg-neutral-900/90 flex items-center justify-center hover:bg-red-50 dark:hover:bg-red-900/30 text-red-500 shadow-sm"
          aria-label="Delete"
        >
          <Trash2 size={12} />
        </button>
      </div>
    </div>
  );
});

interface SortableGalleryProps {
  images: PortfolioImage[];
  coverImageId: string | null;
  onReorder: (images: PortfolioImage[]) => void;
  onDelete: (id: string) => void;
  onSetFocalPoint: (image: PortfolioImage) => void;
  onSetCover: (id: string) => void;
}

export default function SortableGallery({
  images,
  coverImageId,
  onReorder,
  onDelete,
  onSetFocalPoint,
  onSetCover,
}: SortableGalleryProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const itemIds = useMemo(() => images.map((i) => i.id), [images]);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (over && active.id !== over.id) {
        const oldIndex = images.findIndex((i) => i.id === active.id);
        const newIndex = images.findIndex((i) => i.id === over.id);
        const reordered = arrayMove(images, oldIndex, newIndex).map(
          (img, idx) => ({ ...img, order: idx })
        );
        onReorder(reordered);
      }
    },
    [images, onReorder]
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={itemIds} strategy={rectSortingStrategy}>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
          {images.map((img) => (
            <SortableItem
              key={img.id}
              image={img}
              isCover={img.id === coverImageId}
              onDelete={onDelete}
              onSetFocalPoint={onSetFocalPoint}
              onSetCover={onSetCover}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
