import { z } from "zod";

// Product schema matching DummyJSON API response
export const ProductSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  price: z.number(),
  discountPercentage: z.number(),
  rating: z.number(),
  stock: z.number(),
  brand: z
    .string()
    .optional()
    .nullable()
    .transform((val) => val || "Unknown brand"),
  category: z.string(),
  thumbnail: z.string(),
  images: z.array(z.string()),
});

// Products list response schema
export const ProductsResponseSchema = z.object({
  products: z.array(ProductSchema),
  total: z.number(),
  skip: z.number(),
  limit: z.number(),
});

// Categories response schema
export const CategoriesResponseSchema = z.array(
  z.object({
    slug: z.string(),
    name: z.string(),
    url: z.string(),
  })
);

// Search response schema
export const SearchResponseSchema = z.object({
  products: z.array(ProductSchema),
  total: z.number(),
  skip: z.number(),
  limit: z.number(),
});

// Filter schema for URL params
export const FilterSchema = z.object({
  q: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  category: z.array(z.string()).optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  minRating: z.coerce.number().min(0).max(5).optional(),
  sort: z
    .enum(["relevance", "price-asc", "price-desc", "rating-desc"])
    .default("relevance"),
  inStock: z.coerce.boolean().optional(),
});

// Types derived from schemas
export type Product = z.infer<typeof ProductSchema>;
export type ProductsResponse = z.infer<typeof ProductsResponseSchema>;
export type CategoriesResponse = z.infer<typeof CategoriesResponseSchema>;
export type SearchResponse = z.infer<typeof SearchResponseSchema>;
export type FilterParams = z.infer<typeof FilterSchema>;

// Helper type for category names (what we actually use in the UI)
export type CategoryNames = string[];
