"use client";

import { ArrowUpDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type FilterParams } from "@/lib/schemas";

interface SortControlProps {
  value: FilterParams["sort"];
  onChange: (sort: FilterParams["sort"]) => void;
  className?: string;
}

export function SortControl({ value, onChange, className }: SortControlProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
      <Select
        value={value}
        onValueChange={(value) => onChange(value as FilterParams["sort"])}
      >
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="relevance">Relevance</SelectItem>
          <SelectItem value="price-asc">Price: Low to High</SelectItem>
          <SelectItem value="price-desc">Price: High to Low</SelectItem>
          <SelectItem value="rating-desc">Rating: High to Low</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
