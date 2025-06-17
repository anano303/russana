"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import "./ad-slideshow.css";

interface AdSlide {
  id: number;
  imageUrl: string;
  title: string;
  description?: string;
  link?: string;
}

interface AdSlideshowProps {
  slides: AdSlide[];
  autoplaySpeed?: number; // in milliseconds
  height?: string;
}

export default function AdSlideshow({
  slides,
  autoplaySpeed = 5000,
  height = "400px",
}: AdSlideshowProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isTouched, setIsTouched] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const slideTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto rotate slides unless hovered
  useEffect(() => {
    if (isHovered || isTouched) {
      if (slideTimerRef.current) {
        clearInterval(slideTimerRef.current);
        slideTimerRef.current = null;
      }
      return;
    }

    slideTimerRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, autoplaySpeed);

    return () => {
      if (slideTimerRef.current) {
        clearInterval(slideTimerRef.current);
      }
    };
  }, [autoplaySpeed, isHovered, isTouched, slides.length]);

  // Reset touch state after a delay
  useEffect(() => {
    if (isTouched) {
      const touchTimeout = setTimeout(() => {
        setIsTouched(false);
      }, 5000);

      return () => clearTimeout(touchTimeout);
    }
  }, [isTouched]);

  const goToPrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    setIsTouched(true);
  };

  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    setIsTouched(true);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsTouched(true);
  };

  // Touch event handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current - touchEndX.current > 50) {
      // Swipe left
      goToNextSlide();
    } else if (touchEndX.current - touchStartX.current > 50) {
      // Swipe right
      goToPrevSlide();
    }
    setIsTouched(true);
  };

  return (
    <div
      className="ad-slideshow-container"
      style={{ height }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="slideshow-wrapper">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`slide ${index === currentSlide ? "active" : ""}`}
            style={{
              transform: `translateX(${(index - currentSlide) * 100}%)`,
            }}
          >
            <div className="slide-content">
              {slide.link ? (
                <Link href={slide.link} className="slide-link">
                  <Image
                    src={slide.imageUrl}
                    alt={slide.title}
                    fill
                    sizes="100vw"
                    priority={index === 0}
                    className="slide-image"
                  />
                  <div className="slide-text-overlay">
                    <h2 className="slide-title">{slide.title}</h2>
                    {slide.description && (
                      <p className="slide-description">{slide.description}</p>
                    )}
                  </div>
                </Link>
              ) : (
                <>
                  <Image
                    src={slide.imageUrl}
                    alt={slide.title}
                    fill
                    sizes="100vw"
                    priority={index === 0}
                    className="slide-image"
                  />
                  <div className="slide-text-overlay">
                    <h2 className="slide-title">{slide.title}</h2>
                    {slide.description && (
                      <p className="slide-description">{slide.description}</p>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Navigation arrows */}
      <button
        className="slideshow-nav prev"
        onClick={goToPrevSlide}
        aria-label="Previous slide"
      >
        &#10094;
      </button>

      <button
        className="slideshow-nav next"
        onClick={goToNextSlide}
        aria-label="Next slide"
      >
        &#10095;
      </button>

      {/* Slide indicators */}
      <div className="slide-indicators">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`indicator ${index === currentSlide ? "active" : ""}`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Heart decorations */}
      <div className="slide-decoration left-heart"></div>
      <div className="slide-decoration right-heart"></div>
    </div>
  );
}
