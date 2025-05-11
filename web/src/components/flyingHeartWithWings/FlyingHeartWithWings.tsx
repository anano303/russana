"use client";

import React, { useEffect, useState } from "react";
import "./FlyingHeartWithWings.css";
import Image from "next/image";

interface FlyingHeartWithWingsProps {
  size?: number;
}

const FlyingHeartWithWings: React.FC<FlyingHeartWithWingsProps> = ({
  size = 120,
}) => {
  const [dynamicSize, setDynamicSize] = useState(size);
  const [wingSize, setWingSize] = useState(size * 0.8);

  // Adjust size based on viewport width
  useEffect(() => {
    const handleResize = () => {
      const viewportWidth = window.innerWidth;
      let newSize = size;
      let newWingSize = size * 0.8;

      if (viewportWidth < 1024) {
        newSize = Math.max(100, size * 0.9);
        newWingSize = newSize * 0.82;
      }

      // Special adjustment for tablets around 700px
      if (viewportWidth <= 800 && viewportWidth >= 600) {
        newSize = Math.max(95, size * 0.85);
        newWingSize = newSize * 0.9; // Larger wings for better visibility
      }

      if (viewportWidth < 768) {
        newSize = Math.max(90, size * 0.8);
        newWingSize = newSize * 0.85; // Slightly larger wings for better visibility
      }

      if (viewportWidth < 480) {
        newSize = Math.max(70, size * 0.7);
        newWingSize = newSize * 0.85; // Larger wings for better visibility
      }

      setDynamicSize(newSize);
      setWingSize(newWingSize);
    };

    handleResize(); // Initial call
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [size]);

  return (
    <div
      className="heart-container"
      style={{ width: dynamicSize, height: dynamicSize }}
    >
      <div className="heart2" />

      <div
        className="wing left-wing flapping"
        style={{
          width: wingSize,
          height: wingSize,
          position: "absolute",
          zIndex: -81,
        }}
      >
        <Image
          src="/wing.png"
          alt="left wing"
          fill
          style={{ objectFit: "contain" }}
        />
      </div>

      <div
        className="wing right-wing flapping"
        style={{
          width: wingSize,
          height: wingSize,
          position: "absolute",
          zIndex: -81,
        }}
      >
        <Image
          src="/wing.png"
          alt="right wing"
          fill
          style={{ objectFit: "contain", transform: "scaleX(-1)" }}
        />
      </div>
    </div>
  );
};

export default FlyingHeartWithWings;
