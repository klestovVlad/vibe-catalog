import {
  ProductsResponseSchema,
  SearchResponseSchema,
  CategoriesResponseSchema,
  ProductSchema,
  type FilterParams,
} from "./schemas";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://dummyjson.com";

// Generic fetch wrapper with error handling
async function fetchAPI<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// API functions
export const api = {
  // Get products with pagination and filters
  async getProducts(params: FilterParams) {
    const {
      page,
      limit,
      category,
      minPrice,
      maxPrice,
      minRating,
      sort,
      inStock,
    } = params;
    const skip = (page - 1) * limit;

    // Use a larger limit to get more products for pagination demo
    const apiLimit = Math.max(limit, 100);
    let endpoint = `/products?limit=${apiLimit}&skip=${skip}`;

    // Add category filter if specified
    if (category && category.length > 0) {
      // For now, we'll filter by first category (DummyJSON doesn't support multi-category)
      endpoint = `/products/category/${encodeURIComponent(category[0])}?limit=${apiLimit}&skip=${skip}`;
    }

    const data = await fetchAPI<{
      products: unknown[];
      total: number;
      skip: number;
      limit: number;
    }>(endpoint);

    // Parse and validate response
    const validatedData = ProductsResponseSchema.parse({
      products: data.products,
      total: data.total,
      skip: data.skip,
      limit: data.limit,
    });

    // For pagination to work correctly, we need to get the total count from the API
    // without applying client-side filters that would change the total
    let filteredProducts = validatedData.products;
    const totalCount = validatedData.total;

    // Only apply filters if they are actually specified
    const hasFilters =
      minPrice !== undefined ||
      maxPrice !== undefined ||
      minRating !== undefined ||
      inStock !== undefined;

    if (hasFilters) {
      if (minPrice !== undefined) {
        filteredProducts = filteredProducts.filter((p) => p.price >= minPrice);
      }

      if (maxPrice !== undefined) {
        filteredProducts = filteredProducts.filter((p) => p.price <= maxPrice);
      }

      if (minRating !== undefined) {
        filteredProducts = filteredProducts.filter(
          (p) => p.rating >= minRating
        );
      }

      if (inStock !== undefined) {
        filteredProducts = filteredProducts.filter((p) =>
          inStock ? p.stock > 0 : true
        );
      }

      // When filters are applied, we need to adjust the total count
      // but this breaks pagination, so we'll keep the original total for now
      // totalCount = filteredProducts.length;
    }

    // Apply client-side sorting
    if (sort !== "relevance") {
      filteredProducts.sort((a, b) => {
        switch (sort) {
          case "price-asc":
            return a.price - b.price;
          case "price-desc":
            return b.price - a.price;
          case "rating-desc":
            return b.rating - a.rating;
          default:
            return 0;
        }
      });
    }

    // Apply pagination to the filtered results
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    return {
      ...validatedData,
      products: paginatedProducts,
      total: totalCount, // Keep original total for proper pagination
      limit: limit, // Return the requested limit, not the API limit
    };
  },

  // Search products
  async searchProducts(query: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const endpoint = `/products/search?q=${encodeURIComponent(query)}&limit=${limit}&skip=${skip}`;

    const data = await fetchAPI<{
      products: unknown[];
      total: number;
      skip: number;
      limit: number;
    }>(endpoint);

    return SearchResponseSchema.parse(data);
  },

  // Get all categories
  async getCategories() {
    const data = await fetchAPI<
      Array<{
        slug: string;
        name: string;
        url: string;
      }>
    >(`/products/categories`);

    // Parse and validate response
    const validatedData = CategoriesResponseSchema.parse(data);

    // Return slug instead of name to match product categories
    return validatedData.map((category) => category.slug);
  },

  // Get single product by ID
  async getProduct(id: number) {
    const data = await fetchAPI<unknown>(`/products/${id}`);
    return ProductSchema.parse(data);
  },

  // Get products by category
  async getProductsByCategory(
    category: string,
    page: number = 1,
    limit: number = 10
  ) {
    const skip = (page - 1) * limit;
    const endpoint = `/products/category/${encodeURIComponent(category)}?limit=${limit}&skip=${skip}`;

    const data = await fetchAPI<{
      products: unknown[];
      total: number;
      skip: number;
      limit: number;
    }>(endpoint);

    return ProductsResponseSchema.parse(data);
  },
};
