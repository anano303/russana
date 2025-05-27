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

      if (viewportWidth < 1100) {
        newSize = Math.max(100, size * 0.9);
        newWingSize = 105;
      }

      // Special adjustment for tablets around 700px
      if (viewportWidth <= 800 && viewportWidth >= 600) {
        newSize = Math.max(95, size * 0.85);
        newWingSize = 105;
      }

      if (viewportWidth < 768) {
        newSize = Math.max(90, size * 0.8);
        newWingSize = 90;
      }

      if (viewportWidth < 480) {
        newSize = Math.max(70, size * 0.7);
        newWingSize = 60;
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
