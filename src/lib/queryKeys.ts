import { type FilterParams } from "./schemas";

// Query keys for React Query
export const queryKeys = {
  // Products queries
  products: (params: FilterParams) => ["products", params] as const,
  product: (id: number) => ["product", id] as const,

  // Search queries
  search: (query: string, page: number, limit: number) =>
    ["search", query, page, limit] as const,

  // Category queries
  categories: () => ["categories"] as const,
  productsByCategory: (category: string, page: number, limit: number) =>
    ["productsByCategory", category, page, limit] as const,
};
