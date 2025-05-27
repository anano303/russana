"use client";

import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react"; // Added X icon for close button
import { motion, AnimatePresence } from "framer-motion";
// import { ReviewForm } from "./review-form";
// import { ProductReviews } from "./product-reviews";
// import { useRouter } from "next/navigation";
import "./productDetails.css";
import { Product } from "@/types";
import { AddToCartButton } from "./AddToCartButton";

import { ShareButtons } from "@/components/share-buttons/share-buttons";

import { useLanguage } from "@/hooks/LanguageContext";

interface ProductDetailsProps {
  product: Product;
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  // const [activeTab, setActiveTab] = useState("details");

  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false); // New state for fullscreen modal

  // const router = useRouter();
  const { t, language } = useLanguage();

  // Display name and description based on selected language
  const displayName =
    language === "en" && product.nameEn ? product.nameEn : product.name;

  const displayDescription =
    language === "en" && product.descriptionEn
      ? product.descriptionEn
      : product.description;

  const isOutOfStock = product.countInStock === 0;

  // Function to open fullscreen image
  const openFullscreen = () => {
    setIsFullscreenOpen(true);
  };

  // Function to close fullscreen image
  const closeFullscreen = () => {
    setIsFullscreenOpen(false);
  };

  return (
    <div className="container">
      <div className="grid">
        {/* Left Column - Thumbnails */}
        <div className="thumbnail-container">
          {product.images.map((image, index) => (
            <motion.button
              key={image}
              onClick={() => setCurrentImageIndex(index)}
              className={`thumbnail ${
                index === currentImageIndex ? "active" : ""
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Image
                src={image}
                alt={`${displayName} view ${index + 1}`}
                fill
                className="object-cover"
              />
            </motion.button>
          ))}
        </div>

        {/* Center Column - Main Image */}
        <div className="image-section">
          <div className="image-container">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentImageIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="image-wrapper"
                onClick={openFullscreen} // Add click handler to open fullscreen
              >
                <Image
                  src={product.images[currentImageIndex]}
                  alt={displayName}
                  fill
                  quality={90}
                  priority
                  className="details-image"
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Right Column - Product Info */}
        <div className="product-info-details">
          {/* <div className="brand-container">
            <span className="text-muted">
              {t("product.ref")} {product._id}
            </span>
          </div> */}

          <h1 className="product-title">{displayName}</h1>

          {/* <div className="rating-container">
            <div className="rating-stars">
              {Array.from({ length: 5 }).map((_, i) => (
                <StarIcon
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.floor(product.rating)
                      ? "text-rose-500 fill-rose-500"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div> */}
          {/* <span className="review-count">
              {product.numReviews} {t("product.reviews")}
            </span>
          </div> */}

          <div className="price-section">
            <span className="price">{product.price} ლარი </span>
            {/* {product.discount > 0 && (
              <>
                <span className="original-price">
                  ₾{(product.price / (1 - product.discount / 100)).toFixed(2)}
                </span>
                <span className="discount-badge">-{product.discount}%</span>
              </>
            )} */}
          </div>

          <ShareButtons
            url={typeof window !== "undefined" ? window.location.href : ""}
            title={`Check out ${displayName} by ${product.brand} on Russana`}
          />

          {!isOutOfStock && (
            <div className="product-options-container">
              <div className="select-container">
                {/* <label>{t("product.size") || "ზომა"}:</label> */}
                <select className="option-select">
                  <option value="S">S</option>
                  <option value="M">M</option>
                  <option value="L">L</option>
                </select>
              </div>

              {/* Color selector */}
              <div className="select-container">
                <select className="option-select2">
                  <option value="red">წითელი</option>
                  <option value="black">შავი</option>
                  <option value="white">თეთრი</option>
                </select>
              </div>
              <div className="select-container">
                {/* <label>{t("product.quantity")}:</label> */}
                <select
                  className="option-select"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                >
                  {Array.from(
                    { length: product.countInStock },
                    (_, i) => i + 1
                  ).map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <div className="tabs">
            <h3>{t("product.details") || "აღწერა"} : </h3>
            <p>{displayDescription}</p>

            {/* <div className="tabs">
            <div className="tabs-list">
              <button
                className={`tabs-trigger ${
                  activeTab === "details" ? "active" : ""
                }`}
                onClick={() => setActiveTab("details")}
              >
                {t("product.details")}
              </button>
              <button
                className={`tabs-trigger ${
                  activeTab === "reviews" ? "active" : ""
                }`}
                onClick={() => setActiveTab("reviews")}
              >
                {t("product.reviews")} ({product.numReviews})
              </button>
            </div>

            <div
              className={`tab-content ${
                activeTab === "details" ? "active" : ""
              }`}
            >
              <div className="prose">
                <p>{displayDescription}</p>
              </div>
            </div> */}
            <div className="stock-info">
              {isOutOfStock ? (
                <span className="stock-badge out-of-stock">
                  {t("shop.outOfStock")}
                </span>
              ) : (
                <span className="stock-badge in-stock">
                  {t("shop.inStock")}
                </span>
              )}
            </div>
            <AddToCartButton
              productId={product._id}
              countInStock={product.countInStock}
              className="custom-style-2"
            />
          </div>

          {/* Fullscreen Image Modal */}
          {isFullscreenOpen && (
            <div className="fullscreen-modal" onClick={closeFullscreen}>
              <button
                className="fullscreen-close"
                onClick={(e) => {
                  e.stopPropagation();
                  closeFullscreen();
                }}
              >
                <X />
              </button>
              <div
                className="fullscreen-image-container"
                onClick={(e) => e.stopPropagation()}
              >
                <Image
                  src={product.images[currentImageIndex]}
                  alt={displayName}
                  width={1200}
                  height={1200}
                  quality={100}
                  className="fullscreen-image"
                />
              </div>
            </div>
          )}

          {/* 
          <div
            className={`tab-content ${activeTab === "reviews" ? "active" : ""}`}
          >
            <ReviewForm
              productId={product._id}
              onSuccess={() => router.refresh()}
            />
            <ProductReviews product={product} />
          </div> */}
        </div>
      </div>
    </div>
  );
}
