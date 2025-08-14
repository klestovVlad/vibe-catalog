import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingStarsProps {
  rating: number;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function RatingStars({
  rating,
  className,
  size = "md",
}: RatingStarsProps) {
  const sizeClasses = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  const filledStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = 5 - filledStars - (hasHalfStar ? 1 : 0);

  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {/* Filled stars */}
      {Array.from({ length: filledStars }).map((_, i) => (
        <Star
          key={`filled-${i}`}
          className={cn(sizeClasses[size], "fill-yellow-400 text-yellow-400")}
        />
      ))}

      {/* Half star */}
      {hasHalfStar && (
        <div className="relative">
          <Star className={cn(sizeClasses[size], "text-gray-300")} />
          <Star
            className={cn(
              sizeClasses[size],
              "fill-yellow-400 text-yellow-400 absolute inset-0",
              "clip-path-[inset(0_50%_0_0)]"
            )}
          />
        </div>
      )}

      {/* Empty stars */}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <Star
          key={`empty-${i}`}
          className={cn(sizeClasses[size], "text-gray-300")}
        />
      ))}

      {/* Rating number */}
      <span className="ml-1 text-sm text-muted-foreground">
        {rating.toFixed(1)}
      </span>
    </div>
  );
}
