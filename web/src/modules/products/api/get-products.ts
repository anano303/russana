"use client";

import { fetchWithAuth } from "@/lib/fetch-with-auth";
import type { PaginatedResponse, Product } from "@/types";

export const getProducts = async (
  page: number = 1,
  limit: number = 10,
  keyword?: string,
  brand?: string,
  mainCategory?: string,
  subCategory?: string,
  sortBy?: string,
  sortDirection?: "asc" | "desc",
  ageGroup?: string
): Promise<PaginatedResponse<Product>> => {
  try {
    const searchParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (keyword) {
      searchParams.append("keyword", keyword);
    }

    if (brand) {
      searchParams.append("brand", brand);
    }

    if (mainCategory) {
      searchParams.append("mainCategory", mainCategory);
    }

    if (subCategory) {
      searchParams.append("subCategory", subCategory);
    }

    if (sortBy && sortDirection) {
      searchParams.append("sortBy", sortBy);
      searchParams.append("sortDirection", sortDirection);
    }

    if (ageGroup) {
      searchParams.append("ageGroup", ageGroup);
    }

    const response = await fetchWithAuth(
      `/products?${searchParams.toString()}`
    );
    const data = await response.json();

    // Return empty results instead of throwing error
    return {
      items: data.items || [],
      total: data.total || 0,
      page: data.page || page,
      pages: data.pages || 1,
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    // Return empty results on error
    return {
      items: [],
      total: 0,
      page: Number(page),
      pages: 1,
    };
  }
};
