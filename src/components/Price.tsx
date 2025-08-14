import { cn } from "@/lib/utils";

interface PriceProps {
  price: number;
  discountPercentage?: number;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function Price({
  price,
  discountPercentage,
  className,
  size = "md",
}: PriceProps) {
  const hasDiscount = discountPercentage && discountPercentage > 0;
  const discountedPrice = hasDiscount
    ? price * (1 - discountPercentage / 100)
    : price;

  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  return (
    <div
      className={cn("flex items-center gap-1.5 sm:gap-2 flex-wrap", className)}
    >
      {/* Current price */}
      <span className={cn("font-semibold", sizeClasses[size])}>
        ${discountedPrice.toFixed(2)}
      </span>

      {/* Original price (if discounted) */}
      {hasDiscount && (
        <span
          className={cn(
            "text-muted-foreground line-through",
            sizeClasses[size]
          )}
        >
          ${price.toFixed(2)}
        </span>
      )}

      {/* Discount badge */}
      {hasDiscount && (
        <span className="px-1.5 py-0.5 text-xs font-medium bg-red-100 text-red-800 rounded-full dark:bg-red-900 dark:text-red-200 flex-shrink-0">
          -{discountPercentage}%
        </span>
      )}
    </div>
  );
}
