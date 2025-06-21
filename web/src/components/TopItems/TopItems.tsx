"use client";

import React, { useRef, useEffect, useState } from "react";
// import Link from "next/link";
import "./TopItems.css";
import { useQuery } from "@tanstack/react-query";
import { fetchWithAuth } from "@/lib/fetch-with-auth";
import { Product } from "@/types";
// import LoadingAnim from "../loadingAnim/loadingAnim";
import { ProductCard } from "@/modules/products/components/product-card";
import HeartLoading from "../HeartLoading/HeartLoading";

const TopItems: React.FC = () => {
  const [isScrolling, setIsScrolling] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
      // Handle both response formats (items array or products array)
      const products = data.items || data.products || [];
      return products.slice(0, 6);
    },
  });

  // Handle scroll event to show/hide scrollbar
  useEffect(() => {
    const gridElement = gridRef.current;

    const handleScroll = () => {
      setIsScrolling(true);

      // Clear previous timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      // Set a timeout to hide the scrollbar after scrolling stops
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 1000); // Hide after 1 second of no scrolling
    };

    if (gridElement) {
      gridElement.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (gridElement) {
        gridElement.removeEventListener("scroll", handleScroll);
      }

      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  if (isLoading) {
    return (
      <div className="top-items-container loading">
        <HeartLoading size="medium" />
      </div>
    );
  }

  return (
    <div className="top-items-container">
      <div className="top-items-title-container">
        <h2 className="top-items-title">ყველაზე პოპულარული</h2>
      </div>

      <div
        ref={gridRef}
        className={`top-items-grid ${isScrolling ? "scrolling" : ""}`}
      >
        {topProducts?.map((product: Product, index: number) => (
          <div
            key={product._id}
            className={`product-card-wrapper ${
              index === 0 ? "first-product" : ""
            }`}
            style={index === 0 ? { paddingLeft: "5px" } : {}}
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopItems;
