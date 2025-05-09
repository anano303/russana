"use client";

import React from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import "./TopItems.css";
import { useQuery } from "@tanstack/react-query";
import { fetchWithAuth } from "@/lib/fetch-with-auth";
import { Product } from "@/types";
import LoadingAnim from "../loadingAnim/loadingAnim";
import { ProductCard } from "@/modules/products/components/product-card";

const TopItems: React.FC = () => {
  const { data: topProducts, isLoading } = useQuery({
    queryKey: ["topProducts"],
    queryFn: async () => {
      const searchParams = new URLSearchParams({
        page: "1",
        limit: "20",
        sort: "-rating",
      });
      const response = await fetchWithAuth(
        `/products?${searchParams.toString()}`
      );
      const data = await response.json();
      return data.items.slice(0, 6);
    },
  });

  if (isLoading) {
    return (
      <div className="top-items-container loading">
        <LoadingAnim />
      </div>
    );
  }

  return (
    <div className="top-items-container">
      <div className="top-items-title-container">
        <h2 className="top-items-title">
          <Heart className="title-heart-icon" fill="#e91e63" color="#e91e63" />
          ყველაზე პოპულარული
          <Heart className="title-heart-icon" fill="#e91e63" color="#e91e63" />
        </h2>
      </div>

      <div className="top-items-grid">
        {topProducts?.map((product: Product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      <div className="view-all-products">
        <Link href="/shop" className="view-all-button">
          იხილეთ ყველა პროდუქტი
        </Link>
      </div>
    </div>
  );
};

export default TopItems;
