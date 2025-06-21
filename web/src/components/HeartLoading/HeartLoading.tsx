"use client";

import { useEffect, useState } from "react";
import "./heartLoading.css";
import Image from "next/image";

export default function HeartLoading({ size = "small" }) {
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
    <div className={`heart-loading ${size}`}>
      <div className="heart-spin">
        <Image
          src="/heart-icon.png"
          alt="Loading heart"
          width={size === "small" ? 24 : size === "medium" ? 32 : 40}
          height={size === "small" ? 24 : size === "medium" ? 32 : 40}
          className="heart-icon"
        />
      </div>
      <div className="loading-text">
        იტვირთება
        <span className="dots">{dots}</span>
      </div>
    </div>
  );
}
