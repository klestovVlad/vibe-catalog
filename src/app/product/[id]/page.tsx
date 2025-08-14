"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RatingStars } from "@/components/RatingStars";
import { Price } from "@/components/Price";
import { ProductGrid } from "@/components/ProductGrid";
import { useCartStore } from "@/lib/store";
import { api } from "@/lib/api";
import { queryKeys } from "@/lib/queryKeys";
import { Cart } from "@/components/Cart";

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const productId = Number(params.id);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const addItem = useCartStore((state) => state.addItem);

  // Fetch product details
  const {
    data: product,
    isLoading,
    error,
  } = useQuery({
    queryKey: queryKeys.product(productId),
    queryFn: () => api.getProduct(productId),
    enabled: !!productId,
  });

  // Fetch related products
  const { data: relatedProducts } = useQuery({
    queryKey: queryKeys.productsByCategory(product?.category || "", 1, 4),
    queryFn: () => api.getProductsByCategory(product?.category || "", 1, 4),
    enabled: !!product?.category,
  });

  const handleAddToCart = () => {
    if (product) {
      addItem({
        id: product.id,
        title: product.title,
        price: product.price,
        thumbnail: product.thumbnail,
      });
    }
  };

  const nextImage = () => {
    if (product) {
      setSelectedImageIndex((prev) =>
        prev === product.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (product) {
      setSelectedImageIndex((prev) =>
        prev === 0 ? product.images.length - 1 : prev - 1
      );
    }
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Error loading product
          </h1>
          <p className="text-muted-foreground mb-4">
            {error instanceof Error
              ? error.message
              : "An unexpected error occurred"}
          </p>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-muted rounded w-32" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="aspect-square bg-muted rounded" />
            <div className="space-y-4">
              <div className="h-8 bg-muted rounded w-3/4" />
              <div className="h-4 bg-muted rounded w-1/2" />
              <div className="h-4 bg-muted rounded w-2/3" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const relatedProductsList =
    relatedProducts?.products.filter((p) => p.id !== product.id) || [];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => router.back()}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <h1 className="text-xl font-semibold truncate">
                {product.title}
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/" className="text-sm hover:text-primary">
                Catalog
              </Link>
              <Cart />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <nav className="mb-8 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link
            href={`/?category=${product.category}`}
            className="hover:text-foreground capitalize"
          >
            {product.category}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">{product.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted">
              <Image
                src={product.images[selectedImageIndex]}
                alt={product.title}
                fill
                className="object-cover"
                priority
              />

              {/* Navigation arrows */}
              {product.images.length > 1 && (
                <>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative aspect-square overflow-hidden rounded-lg border-2 transition-colors ${
                      index === selectedImageIndex
                        ? "border-primary"
                        : "border-transparent hover:border-muted-foreground"
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.title} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Brand and category */}
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="capitalize">
                {product.category}
              </Badge>
              <span className="text-sm text-muted-foreground">
                by {product.brand}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold leading-tight">
              {product.title}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <RatingStars rating={product.rating} size="lg" />
              <span className="text-sm text-muted-foreground">
                {product.rating} out of 5
              </span>
            </div>

            {/* Price */}
            <Price
              price={product.price}
              discountPercentage={product.discountPercentage}
              size="lg"
            />

            {/* Stock status */}
            <div className="flex items-center gap-2">
              <span
                className={`w-3 h-3 rounded-full ${
                  product.stock > 0 ? "bg-green-500" : "bg-red-500"
                }`}
              />
              <span
                className={
                  product.stock > 0 ? "text-green-600" : "text-red-600"
                }
              >
                {product.stock > 0
                  ? `${product.stock} in stock`
                  : "Out of stock"}
              </span>
            </div>

            {/* Description */}
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Add to cart */}
            <Button
              onClick={handleAddToCart}
              size="lg"
              className="w-full"
              disabled={product.stock === 0}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Add to Cart
            </Button>
          </div>
        </div>

        {/* Related Products */}
        {relatedProductsList.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Related Products</h2>
            <ProductGrid products={relatedProductsList} />
          </div>
        )}
      </div>
    </div>
  );
}
