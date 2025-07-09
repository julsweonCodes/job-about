"use client";

import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface PhotoComponentProps {
  photos: (File | string)[];
  setPhotos: React.Dispatch<React.SetStateAction<(File | string)[]>>;
  maxCount?: number;
  onRemove?: (urlOrFile: File | string) => void;
}

function SortableImage({
                         item,
                         index,
                         onRemove,
                       }: {
  item: File | string;
  index: number;
  onRemove: (item: File | string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: index });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const src = typeof item === "string" ? item : URL.createObjectURL(item);

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      style={style}
      className="relative group"
    >
      <img
        src={src}
        alt="photo"
        className="w-28 h-28 object-cover rounded border"
        {...listeners}
      />
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onRemove(item);
        }}
        className="absolute top-1 right-1 bg-black bg-opacity-60 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
      >
        ×
      </button>
    </div>
  );
}

export default function PhotoComponent({
                                         photos,
                                         setPhotos,
                                         maxCount = 5,
                                         onRemove,
                                       }: PhotoComponentProps) {
  const sensors = useSensors(useSensor(PointerSensor));
  const [activeId, setActiveId] = useState<number | null>(null);

  const handleRemove = (item: File | string) => {
    if (onRemove) {
      onRemove(item);
    }

    setPhotos((prev) =>
      prev.filter((photo) => {
        if (typeof item === "string" && typeof photo === "string") {
          return photo !== item;
        }
        if (item instanceof File && photo instanceof File) {
          return photo.name !== item.name || photo.lastModified !== item.lastModified;
        }
        return true;
      })
    );
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files).slice(
      0,
      maxCount - photos.length
    );
    setPhotos((prev) => [...prev, ...newFiles]);
    e.target.value = "";
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = active.id;
    const newIndex = over.id;

    setPhotos((items) => arrayMove(items, oldIndex, newIndex));
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-4 flex-wrap">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={photos.map((_, idx) => idx)}
            strategy={verticalListSortingStrategy}
          >
            {photos.map((photo, idx) => (
              <SortableImage
                key={idx}
                item={photo}
                index={idx}
                onRemove={handleRemove}
              />
            ))}
          </SortableContext>
        </DndContext>

        {photos.length < maxCount && (
          <label className="w-28 h-28 flex items-center justify-center border border-dashed border-gray-300 rounded cursor-pointer bg-gray-50 hover:bg-gray-100">
            <span className="text-sm text-gray-500">+</span>
            <input
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={handleUpload}
            />
          </label>
        )}
      </div>
    </div>
  );
}
