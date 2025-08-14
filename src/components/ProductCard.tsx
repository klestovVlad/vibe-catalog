"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Eye } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RatingStars } from "@/components/RatingStars";
import { Price } from "@/components/Price";
import { useCartStore } from "@/lib/store";
import { type Product } from "@/lib/schemas";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      id: product.id,
      title: product.title,
      price: product.price,
      thumbnail: product.thumbnail,
    });
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Navigate to product page
    window.location.href = `/product/${product.id}`;
  };

  return (
    <Link href={`/product/${product.id}`} className="group">
      <Card
        className={cn(
          "h-full transition-all duration-200 hover:shadow-lg hover:-translate-y-1",
          "border-0 shadow-sm bg-card/50 backdrop-blur-sm",
          className
        )}
      >
        <CardHeader className="p-3 sm:p-4 pb-2">
          <div className="relative aspect-square overflow-hidden rounded-lg">
            <Image
              src={product.thumbnail}
              alt={product.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 475px) 100vw, (max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            />

            {/* Quick view overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center pointer-events-none">
              <Button
                size="sm"
                variant="secondary"
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-auto text-xs sm:text-sm"
                onClick={handleQuickView}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onPointerDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                Quick View
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-3 sm:p-4 pt-0 pb-2">
          <div className="space-y-1.5 sm:space-y-2">
            {/* Brand and category */}
            <div className="flex items-center gap-1.5 sm:gap-2 text-xs text-muted-foreground">
              <span className="font-medium truncate">{product.brand}</span>
              <span className="flex-shrink-0">•</span>
              <Badge variant="secondary" className="text-xs flex-shrink-0">
                {product.category}
              </Badge>
            </div>

            {/* Title */}
            <h3 className="font-semibold text-xs sm:text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors">
              {product.title}
            </h3>

            {/* Rating */}
            <RatingStars rating={product.rating} size="sm" />

            {/* Stock status */}
            <div className="flex items-center justify-between">
              <span
                className={cn(
                  "text-xs",
                  product.stock > 0
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                )}
              >
                {product.stock > 0
                  ? `${product.stock} in stock`
                  : "Out of stock"}
              </span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-3 sm:p-4 pt-0">
          <div className="w-full space-y-2 sm:space-y-3">
            {/* Price */}
            <Price
              price={product.price}
              discountPercentage={product.discountPercentage}
              size="md"
              className="flex-wrap"
            />

            {/* Add to cart button */}
            <Button
              onClick={handleAddToCart}
              className="w-full text-xs sm:text-sm h-8 sm:h-10"
              disabled={product.stock === 0}
            >
              <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
              Add to Cart
            </Button>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
