"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import "./MovingImages.css";
import Beep from "./beep";

import cap from "./assets/cap.png";
import bag from "./assets/bag.png";
import dress from "./assets/dress.png";
import swimsuit from "./assets/swimsuit.png";
import tshirt from "./assets/t-shirt.png";

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
  overlayStyle: OverlayStyle;
  popupOverlayStyle: OverlayStyle;
  x: string;
  y: string;
}

import { StaticImageData } from "next/image";

const imageConfigs: {
  src: StaticImageData;
  shape: ShapeType;
  overlayStyle: OverlayStyle;
  popupOverlayStyle: OverlayStyle;
}[] = [
  {
    src: cap,
    shape: "heart",
    overlayStyle: {
      top: "-2px",
      left: "-4px",
      scale: 0.1,
    },
    popupOverlayStyle: {
      top: "-40px",
      left: "-40px",
      scale: 1.01,
    },
  },
  {
    src: bag,
    shape: "heart",
    overlayStyle: {
      top: "10px",
      left: "-4px",
      scale: 0.1,
    },
    popupOverlayStyle: {
      top: "45px",
      left: "-24px",
      scale: 0.6,
    },
  },
  {
    src: dress,
    shape: "heart",
    overlayStyle: {
      top: "-8px",
      left: "-6px",
      scale: 0.1,
    },
    popupOverlayStyle: {
      top: "-85px",
      left: "-22px",
      scale: 0.45,
    },
  },
  {
    src: swimsuit,
    shape: "heart",
    overlayStyle: {
      top: "2px",
      left: "-6px",
      scale: 0.1,
    },
    popupOverlayStyle: {
      top: "12px",
      left: "-32px",
      scale: 0.6,
    },
  },
  {
    src: tshirt,
    shape: "star",
    overlayStyle: {
      top: "-6px",
      left: "-2px",
      scale: 0.16,
    },
    popupOverlayStyle: {
      top: "-80px",
      left: "-4px",
      scale: 0.8,
    },
  },
];

const MovingImages = () => {
  const [animatedImages, setAnimatedImages] = useState<AnimatedImage[]>([]);
  const [imageIndex, setImageIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState<AnimatedImage | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const config = imageConfigs[imageIndex];
      const newImage: AnimatedImage = {
        id: `img-${Date.now()}`,
        src: config.src,
        shape: config.shape,
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

      setImageIndex((prev) => (prev + 1) % imageConfigs.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [imageIndex]);

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
            <div className="image-wrapper2" style={{ position: "relative", width: "60px", height: "60px" }}>
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
                <Beep soundSrc="/beep.wav" shape={img.shape} />
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
                <Beep soundSrc="/beep.wav" shape={selectedImage.shape} />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MovingImages;
