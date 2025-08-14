"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUIStore } from "@/lib/store";
import { type FilterParams } from "@/lib/schemas";
import { cn } from "@/lib/utils";

interface FiltersProps {
  filters: FilterParams;
  onFiltersChange: (filters: Partial<FilterParams>) => void;
  categories: string[];
  className?: string;
}

export function Filters({
  filters,
  onFiltersChange,
  categories,
  className,
}: FiltersProps) {
  const { sidebarOpen, setSidebarOpen } = useUIStore();
  const [localFilters, setLocalFilters] = useState<FilterParams>(filters);

  // Sync local filters with external filters
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleFilterChange = (
    key: keyof FilterParams,
    value: FilterParams[keyof FilterParams]
  ) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      category: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      minRating: undefined,
      inStock: undefined,
    };
    setLocalFilters({ ...localFilters, ...resetFilters });
    onFiltersChange(resetFilters);
  };

  const hasActiveFilters =
    filters.category?.length ||
    filters.minPrice !== undefined ||
    filters.maxPrice !== undefined ||
    filters.minRating !== undefined ||
    filters.inStock !== undefined;

  return (
    <>
      {/* Mobile filter button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setSidebarOpen(true)}
        className="lg:hidden"
      >
        <Filter className="w-4 h-4 mr-2" />
        Filters
        {hasActiveFilters && (
          <Badge variant="secondary" className="ml-2">
            {Object.values(filters).filter(Boolean).length}
          </Badge>
        )}
      </Button>

      {/* Desktop filters */}
      <div className={cn("hidden lg:block space-y-6", className)}>
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Filters</h3>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={handleReset}>
              <X className="w-4 h-4 mr-1" />
              Clear
            </Button>
          )}
        </div>

        {/* Categories */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Categories</h4>

          {/* Search categories */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search categories..."
              className="w-full px-3 py-2 text-sm border rounded-md bg-background"
              onChange={() => {
                // You can add state for filtered categories if needed
              }}
            />
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto">
            {categories && categories.length > 0 ? (
              categories.map((category) => (
                <label
                  key={category}
                  className="flex items-center space-x-2 cursor-pointer hover:bg-muted/50 p-1 rounded"
                >
                  <input
                    type="checkbox"
                    checked={localFilters.category?.includes(category) || false}
                    onChange={(e) => {
                      const currentCategories = localFilters.category || [];
                      const newCategories = e.target.checked
                        ? [...currentCategories, category]
                        : currentCategories.filter((c) => c !== category);
                      handleFilterChange("category", newCategories);
                    }}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm capitalize">{category}</span>
                </label>
              ))
            ) : (
              <div className="text-sm text-muted-foreground">
                Loading categories...
              </div>
            )}
          </div>
        </div>

        {/* Price Range */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Price Range</h4>
          <div className="space-y-4">
            <Slider
              defaultValue={[0, 2000]}
              value={[
                localFilters.minPrice || 0,
                localFilters.maxPrice || 2000,
              ]}
              onValueChange={([min, max]) => {
                console.log("Slider values:", {
                  min,
                  max,
                  currentMin: localFilters.minPrice,
                  currentMax: localFilters.maxPrice,
                });

                // Update both values immediately
                setLocalFilters((prev) => ({
                  ...prev,
                  minPrice: min,
                  maxPrice: max,
                }));

                // Then notify parent component
                onFiltersChange({
                  minPrice: min,
                  maxPrice: max,
                });
              }}
              min={0}
              max={2000}
              step={10}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Min: ${localFilters.minPrice || 0}</span>
              <span>Max: ${localFilters.maxPrice || 2000}</span>
            </div>
            {/* Debug info */}
            <div className="text-xs text-muted-foreground">
              Debug: minPrice={localFilters.minPrice}, maxPrice=
              {localFilters.maxPrice}
            </div>
          </div>
        </div>

        {/* Rating */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Minimum Rating</h4>
          <Select
            value={localFilters.minRating?.toString() || "any"}
            onValueChange={(value) =>
              handleFilterChange(
                "minRating",
                value === "any" ? undefined : Number(value)
              )
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Any rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any rating</SelectItem>
              <SelectItem value="4">4+ stars</SelectItem>
              <SelectItem value="3">3+ stars</SelectItem>
              <SelectItem value="2">2+ stars</SelectItem>
              <SelectItem value="1">1+ star</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* In Stock */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Availability</h4>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={localFilters.inStock || false}
              onChange={(e) =>
                handleFilterChange(
                  "inStock",
                  e.target.checked ? true : undefined
                )
              }
              className="rounded border-gray-300"
            />
            <span className="text-sm">In stock only</span>
          </label>
        </div>
      </div>

      {/* Mobile sidebar */}
      {sidebarOpen &&
        typeof window !== "undefined" &&
        createPortal(
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/50 lg:hidden mobile-filters-backdrop"
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
              }}
              onClick={() => setSidebarOpen(false)}
            />

            {/* Sidebar */}
            <div
              className="lg:hidden mobile-filters-sidebar"
              style={{
                position: "fixed",
                top: 0,
                right: 0,
                height: "100vh",
                width: "320px",
                backgroundColor: "var(--background)",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                borderLeft: "1px solid var(--border)",
                padding: "24px",
                zIndex: 1000000,
              }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold">Filters</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Mobile filter content - same as desktop but in sidebar */}
              <div className="space-y-6">
                {/* Categories */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium">Categories</h4>

                  {/* Search categories */}
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search categories..."
                      className="w-full px-3 py-2 text-sm border rounded-md bg-background"
                      onChange={() => {
                        // You can add state for filtered categories if needed
                      }}
                    />
                  </div>

                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {categories && categories.length > 0 ? (
                      categories.map((category) => (
                        <label
                          key={category}
                          className="flex items-center space-x-2 cursor-pointer hover:bg-muted/50 p-1 rounded"
                        >
                          <input
                            type="checkbox"
                            checked={
                              localFilters.category?.includes(category) || false
                            }
                            onChange={(e) => {
                              const currentCategories =
                                localFilters.category || [];
                              const newCategories = e.target.checked
                                ? [...currentCategories, category]
                                : currentCategories.filter(
                                    (c) => c !== category
                                  );
                              handleFilterChange("category", newCategories);
                            }}
                            className="rounded border-gray-300"
                          />
                          <span className="text-sm capitalize">{category}</span>
                        </label>
                      ))
                    ) : (
                      <div className="text-sm text-muted-foreground">
                        Loading categories...
                      </div>
                    )}
                  </div>
                </div>

                {/* Price Range */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium">Price Range</h4>
                  <div className="space-y-4">
                    <Slider
                      defaultValue={[0, 2000]}
                      value={[
                        localFilters.minPrice || 0,
                        localFilters.maxPrice || 2000,
                      ]}
                      onValueChange={([min, max]) => {
                        console.log("Mobile slider values:", {
                          min,
                          max,
                          currentMin: localFilters.minPrice,
                          currentMax: localFilters.maxPrice,
                        });

                        // Update both values immediately
                        setLocalFilters((prev) => ({
                          ...prev,
                          minPrice: min,
                          maxPrice: max,
                        }));

                        // Then notify parent component
                        onFiltersChange({
                          minPrice: min,
                          maxPrice: max,
                        });
                      }}
                      min={0}
                      max={2000}
                      step={10}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Min: ${localFilters.minPrice || 0}</span>
                      <span>Max: ${localFilters.maxPrice || 2000}</span>
                    </div>
                  </div>
                </div>

                {/* Rating */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium">Minimum Rating</h4>
                  <Select
                    value={localFilters.minRating?.toString() || "any"}
                    onValueChange={(value) =>
                      handleFilterChange(
                        "minRating",
                        value === "any" ? undefined : Number(value)
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Any rating" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any rating</SelectItem>
                      <SelectItem value="4">4+ stars</SelectItem>
                      <SelectItem value="3">3+ stars</SelectItem>
                      <SelectItem value="2">2+ stars</SelectItem>
                      <SelectItem value="1">1+ star</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* In Stock */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium">Availability</h4>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localFilters.inStock || false}
                      onChange={(e) =>
                        handleFilterChange(
                          "inStock",
                          e.target.checked ? true : undefined
                        )
                      }
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm">In stock only</span>
                  </label>
                </div>

                {/* Clear filters */}
                {hasActiveFilters && (
                  <Button
                    variant="outline"
                    onClick={handleReset}
                    className="w-full"
                  >
                    Clear All Filters
                  </Button>
                )}
              </div>
            </div>
          </>,
          document.body
        )}
    </>
  );
}
