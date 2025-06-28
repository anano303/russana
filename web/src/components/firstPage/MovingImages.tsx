"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import "./MovingImages.css";
import Beep from "./beep";

import cap from "./assets/cap.png";
import bag from "./assets/bag.png";
import dress from "./assets/dress.png";
import dress2 from "./assets/dress2.png";
import dress3 from "./assets/dress3.png";
import dress4 from "./assets/dress4.png";
import swimsuit from "./assets/swimsuit.png";
import tshirt from "./assets/tshirt.png";
import tshirt2 from "./assets/tshirt2.png";

import { StaticImageData } from "next/image";

type ShapeType = "heart" | "star";

interface OverlayStyle {
  top: string;
  left: string;
  scale: number;
}

interface AnimatedImage {
  id: string;
  src: StaticImageData;
  shape: ShapeType;
  color: string;
  overlayStyle: OverlayStyle;
  popupOverlayStyle: OverlayStyle;
  x: string;
  y: string;
}

const imageConfigs: {
  src: StaticImageData;
  shape: ShapeType;
  color: string;
  overlayStyle: OverlayStyle;
  popupOverlayStyle: OverlayStyle;
}[] = [
  {
    src: dress,
    shape: "heart",
    color: "#333300",
    overlayStyle: { top: "-16px", left: "-0.5", scale: 0.05 },
    popupOverlayStyle: { top: "-115px", left: "4px", scale: 0.35 },
  },
  {
    src: swimsuit,
    shape: "heart",
    color: "#cc3366",
    overlayStyle: { top: "2px", left: "-1.5px", scale: 0.1 },
    popupOverlayStyle: { top: "12px", left: "-2px", scale: 0.6 },
  },
  {
    src: tshirt,
    shape: "star",
    color: "#ffcc33",
    overlayStyle: { top: "-2px", left: "0.5px", scale: 0.16 },
    popupOverlayStyle: { top: "-20px", left: "-4px", scale: 1.3 },
  },
  {
    src: bag,
    shape: "heart",
    color: "#cc0000",
    overlayStyle: { top: "10px", left: "-1px", scale: 0.1 },
    popupOverlayStyle: { top: "45px", left: "8px", scale: 0.6 },
  },
  {
    src: dress4,
    shape: "heart",
    color: "#cc6633",
    overlayStyle: { top: "-16px", left: "-0.5px", scale: 0.03 },
    popupOverlayStyle: { top: "-85px", left: "-1px", scale: 0.35 },
  },
  {
    src: dress3,
    shape: "heart",
    color: "#663333",
    overlayStyle: { top: "-16px", left: "-2px", scale: 0.05 },
    popupOverlayStyle: { top: "-115px", left: "-2px", scale: 0.35 },
  },
  {
    src: tshirt2,
    shape: "heart",
    color: "#cc0000",
    overlayStyle: { top: "-2px", left: "-2px", scale: 0.05 },
    popupOverlayStyle: { top: "-10px", left: "0.5px", scale: 0.5 },
  },
  {
    src: dress4,
    shape: "heart",
    color: "#cc3366",
    overlayStyle: { top: "-16px", left: "-0.5px", scale: 0.03 },
    popupOverlayStyle: { top: "-85px", left: "-1px", scale: 0.35 },
  },
  {
    src: swimsuit,
    shape: "heart",
    color: "#ffcc33",
    overlayStyle: { top: "2px", left: "-1.5px", scale: 0.1 },
    popupOverlayStyle: { top: "12px", left: "-2px", scale: 0.6 },
  },
  {
    src: dress2,
    shape: "heart",
    color: "#f44336",
    overlayStyle: { top: "-16px", left: "-2px", scale: 0.05 },
    popupOverlayStyle: { top: "-115px", left: "-2px", scale: 0.35 },
  },
];

const MovingImages = () => {
  const [animatedImages, setAnimatedImages] = useState<AnimatedImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<AnimatedImage | null>(null);

  const spawnImage = (index: number) => {
    const config = imageConfigs[index];
    const newImage: AnimatedImage = {
      id: `img-${Date.now()}`,
      src: config.src,
      shape: config.shape,
      color: config.color,
      overlayStyle: config.overlayStyle,
      popupOverlayStyle: config.popupOverlayStyle,
      x: `${Math.random() * 500 - 250}px`,
      y: `${Math.random() * 500 - 250}px`,
    };

    setAnimatedImages((prev) => {
      const updated = [...prev, newImage];
      if (updated.length > 10) updated.shift();
      return updated;
    });

    setTimeout(() => {
      setAnimatedImages((prev) => prev.filter((img) => img.id !== newImage.id));
    }, 30000);
  };

  useEffect(() => {
    let index = 0;
    spawnImage(index);
    index++;

    const interval = setInterval(() => {
      spawnImage(index);
      index = (index + 1) % imageConfigs.length;
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="moving-images-absolute-container">
        {animatedImages.map((img) => (
          <div
            key={img.id}
            className="floating-item"
            style={{
              ["--x" as string]: img.x,
              ["--y" as string]: img.y,
            }}
            onClick={() => setSelectedImage(img)}
          >
            <div
              className="image-wrapper2"
              style={{ position: "relative", width: "60px", height: "60px" }}
            >
              <Image
                src={img.src}
                alt="animated-img"
                className="floating-image"
                width={60}
                height={60}
              />
              <div
                className="overlay-icon"
                style={{
                  position: "absolute",
                  top: img.overlayStyle.top,
                  left: img.overlayStyle.left,
                  transform: `scale(${img.overlayStyle.scale})`,
                }}
              >
                <Beep
                  soundSrc="/beep.wav"
                  shape={img.shape}
                  color={img.color}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedImage && (
        <div className="popup-overlay" onClick={() => setSelectedImage(null)}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <div className="popup-image-wrapper">
              <Image
                src={selectedImage.src}
                alt="popup"
                fill
                style={{ objectFit: "contain" }}
              />
              <div
                className="popup-beep"
                style={{
                  position: "absolute",
                  top: selectedImage.popupOverlayStyle.top,
                  left: selectedImage.popupOverlayStyle.left,
                  transform: `scale(${selectedImage.popupOverlayStyle.scale})`,
                }}
              >
                <Beep
                  soundSrc="/beep.wav"
                  shape={selectedImage.shape}
                  color={selectedImage.color}
                />
              </div>
            </div>

            {/* ✅ X ღილაკი მობილურზე */}
            <button
              className="popup-close-button"
              onClick={() => setSelectedImage(null)}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default MovingImages;
