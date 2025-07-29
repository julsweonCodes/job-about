import React from "react";

interface ImageWithSkeletonProps {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  skeletonClassName?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export const ImageWithSkeleton: React.FC<ImageWithSkeletonProps> = ({
  src,
  alt,
  className = "w-full h-full object-cover",
  fallbackSrc,
  skeletonClassName = "bg-gray-200 animate-pulse",
  onLoad,
  onError,
}) => {
  const [currentSrc, setCurrentSrc] = React.useState(src);
  const [hasError, setHasError] = React.useState(false);

  // src가 변경되면 상태 리셋
  React.useEffect(() => {
    setCurrentSrc(src);
    setHasError(false);
  }, [src]);

  const handleLoad = React.useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      // 스켈레톤 제거
      const skeleton = e.currentTarget.previousElementSibling as HTMLElement;
      if (skeleton) {
        skeleton.style.opacity = "0";
        setTimeout(() => {
          skeleton.remove();
        }, 300);
      }

      // 이미지 표시
      e.currentTarget.style.opacity = "1";
      onLoad?.();
    },
    [onLoad]
  );

  const handleError = React.useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      if (fallbackSrc && currentSrc !== fallbackSrc) {
        setCurrentSrc(fallbackSrc);
        setHasError(false);
      } else {
        setHasError(true);
        onError?.();
      }
    },
    [fallbackSrc, currentSrc, onError]
  );

  return (
    <div className="relative">
      {/* 스켈레톤 - CSS로 처리 */}
      <div
        className={`absolute inset-0 ${skeletonClassName} z-10 rounded-full transition-opacity duration-300`}
      />

      {/* 이미지 */}
      <img
        src={currentSrc}
        alt={alt}
        className={`relative z-20 ${className} opacity-0 transition-opacity duration-300`}
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  );
};
