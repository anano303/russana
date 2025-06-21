"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import "./loading.css";
import HeartLoading from "@/components/HeartLoading/HeartLoading";

export default function Loading() {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => {
        if (prev === "...") return "";
        return prev + ".";
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="loading-container">
      <div className="heart-beat">
        <Image
          src="/heart-icon.png"
          alt="Loading heart"
          width={32}
          height={32}
          className="heart-icon"
        />
      </div>
      <div className="loading-text">
        <HeartLoading size="medium" />
        <span className="dots">{dots}</span>
      </div>

      <div className="loading-wrapper">
        <div className="card">
          <div className="card-header">
            <div className="skeleton skeleton-header"></div>
          </div>
          <div className="card-content">
            <div className="skeleton-list">
              <div className="skeleton skeleton-item"></div>
              <div className="skeleton skeleton-item"></div>
              <div className="skeleton skeleton-item"></div>
              <div className="skeleton skeleton-item"></div>
              <div className="skeleton skeleton-item"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
