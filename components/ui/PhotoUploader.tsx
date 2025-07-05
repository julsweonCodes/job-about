import React, { useRef } from "react";
import { X, Plus } from "lucide-react";

interface PhotoUploaderProps {
  photos: File[];
  setPhotos: (files: File[]) => void;
  maxCount?: number;
}

export default function PhotoUploader({ photos, setPhotos, maxCount = 5 }: PhotoUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  // 파일 추가
  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const arr = Array.from(files);
    const newPhotos = [...photos, ...arr].slice(0, maxCount);
    setPhotos(newPhotos);
  };

  // 드래그 앤 드롭 순서 변경
  const handleDrag = (from: number, to: number) => {
    if (from === to) return;
    const updated = [...photos];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    setPhotos(updated);
  };

  // 삭제
  const handleRemove = (idx: number) => {
    setPhotos(photos.filter((_, i) => i !== idx));
  };

  // 모바일에서 grid-cols-N 명시적으로 적용
  const gridColsClass =
    maxCount === 2
      ? "grid-cols-2"
      : maxCount === 3
        ? "grid-cols-3"
        : maxCount === 4
          ? "grid-cols-4"
          : maxCount === 5
            ? "grid-cols-5"
            : "";

  return (
    <div>
      <div className={`mb-2 gap-2 grid ${gridColsClass} sm:flex sm:flex-wrap`}>
        {photos.map((file, idx) => (
          <div
            key={idx}
            className="relative group w-16 h-16 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center cursor-move"
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData("from", idx.toString());
            }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              const from = Number(e.dataTransfer.getData("from"));
              handleDrag(from, idx);
            }}
          >
            <img
              src={URL.createObjectURL(file)}
              alt="preview"
              className="object-cover w-full h-full"
            />
            <button
              type="button"
              className="absolute top-1 right-1 bg-white/80 rounded-full w-4 h-4 sm:w-6 sm:h-6 flex items-center justify-center text-gray-700 hover:bg-red-100 p-0"
              onClick={() => handleRemove(idx)}
            >
              <X className="w-3 h-3 sm:w-4 sm:h-4" strokeWidth={2.2} />
            </button>
          </div>
        ))}
        {photos.length < maxCount && (
          <button
            type="button"
            className="w-16 h-16 sm:w-24 sm:h-24 md:w-28 md:h-28 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 hover:border-indigo-400"
            onClick={() => inputRef.current?.click()}
          >
            <Plus className="w-5 h-5 sm:w-7 sm:h-7" strokeWidth={2.2} />
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
        disabled={photos.length >= maxCount}
      />
    </div>
  );
}
