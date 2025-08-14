"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { SearchBar } from "@/components/SearchBar";
import { Filters } from "@/components/Filters";
import { SortControl } from "@/components/SortControl";
import { ProductGrid } from "@/components/ProductGrid";
import { Pagination } from "@/components/Pagination";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Cart } from "@/components/Cart";
import { api } from "@/lib/api";
import { queryKeys } from "@/lib/queryKeys";
import { FilterSchema, type FilterParams } from "@/lib/schemas";

function CatalogContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Parse URL params into filters
  const [filters, setFilters] = useState<FilterParams>(() => {
    const params: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });

    // Pre-process params to handle arrays properly
    const processedParams: Record<string, string | string[]> = { ...params };
    if (params.category) {
      // Handle both single category and multiple categories
      const categoryValue = params.category;
      processedParams.category = Array.isArray(categoryValue)
        ? categoryValue
        : [categoryValue];
    }

    return FilterSchema.parse(processedParams);
  });

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== "" && value !== false) {
        if (Array.isArray(value)) {
          value.forEach((v) => params.append(key, v));
        } else {
          params.set(key, String(value));
        }
      }
    });

    const newUrl = `${pathname}?${params.toString()}`;
    router.replace(newUrl);
  }, [filters, pathname, router]);

  // Fetch products
  const {
    data: productsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: queryKeys.products(filters),
    queryFn: () => api.getProducts(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch categories
  const { data: categories = [] } = useQuery<string[]>({
    queryKey: queryKeys.categories(),
    queryFn: () => api.getCategories(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  const handleSearch = (query: string) => {
    setFilters((prev) => ({ ...prev, q: query, page: 1 }));
  };

  const handleFiltersChange = (newFilters: Partial<FilterParams>) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handleSortChange = (sort: FilterParams["sort"]) => {
    setFilters((prev) => ({ ...prev, sort }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Error loading products
          </h1>
          <p className="text-muted-foreground mb-4">
            {error instanceof Error
              ? error.message
              : "An unexpected error occurred"}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const totalPages = productsData
    ? Math.ceil(productsData.total / filters.limit)
    : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Product Catalog</h1>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Cart />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-80 flex-shrink-0">
            <div className="sticky top-24">
              <Filters
                filters={filters}
                onFiltersChange={handleFiltersChange}
                categories={categories}
              />
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1">
            {/* Search and controls */}
            <div className="mb-8 space-y-4">
              <SearchBar
                value={filters.q || ""}
                onSearch={handleSearch}
                className="max-w-md"
              />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <SortControl
                    value={filters.sort}
                    onChange={handleSortChange}
                  />
                </div>

                {productsData && (
                  <div className="text-sm text-muted-foreground text-right">
                    <p>{productsData.total} products found</p>
                    {totalPages > 1 && (
                      <>
                        {/* Desktop version - full info */}
                        <p className="hidden md:block">
                          Page {filters.page} of {totalPages}(
                          {Math.min(
                            filters.limit,
                            productsData.products.length
                          )}{" "}
                          products on this page)
                        </p>
                        {/* Mobile version - shortened info */}
                        <p className="md:hidden">
                          {filters.page}/{totalPages}
                        </p>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Products grid */}
            <ProductGrid
              products={productsData?.products || []}
              loading={isLoading}
              className="mb-8"
            />

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={filters.page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default function CatalogPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background">
          <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40">
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Product Catalog</h1>
                <div className="flex items-center gap-4">
                  <ThemeToggle />
                  <Cart />
                </div>
              </div>
            </div>
          </header>
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
        </div>
      }
    >
      <CatalogContent />
    </Suspense>
  );
}
