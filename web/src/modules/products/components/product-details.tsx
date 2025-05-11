"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { StarIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ReviewForm } from "./review-form";
import { ProductReviews } from "./product-reviews";
import { useRouter } from "next/navigation";
import "./productDetails.css";
import { Product } from "@/types";
import { AddToCartButton } from "./AddToCartButton";

import { ShareButtons } from "@/components/share-buttons/share-buttons";
import { RoomViewer } from "@/components/room-viewer/room-viewer";
import { useLanguage } from "@/hooks/LanguageContext";

interface ProductDetailsProps {
  product: Product;
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("details");
  const [isRoomViewerOpen, setIsRoomViewerOpen] = useState(false);
  const [dimensions, setDimensions] = useState<{
    width?: number;
    height?: number;
    depth?: number;
  } | null>(null);
  const router = useRouter();
  const { t, language } = useLanguage();

  // Display name and description based on selected language
  const displayName =
    language === "en" && product.nameEn ? product.nameEn : product.name;

  const displayDescription =
    language === "en" && product.descriptionEn
      ? product.descriptionEn
      : product.description;

  // Parse dimensions if they are stored as a string
  useEffect(() => {
    if (!product.dimensions) {
      setDimensions(null);
      return;
    }

    try {
      if (typeof product.dimensions === "string") {
        const parsed = JSON.parse(product.dimensions);
        setDimensions(parsed);
      } else {
        setDimensions(product.dimensions);
      }
    } catch (e) {
      console.error("Error parsing dimensions:", e);
      setDimensions(null);
    }
  }, [product.dimensions]);

  if (!product) return null;

  const isOutOfStock = product.countInStock === 0;

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
              >
                <Image
                  src={product.images[currentImageIndex]}
                  alt={displayName}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  quality={90}
                  priority
                  className="object-contain"
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Right Column - Product Info */}
        <div className="product-info">
          <div className="brand-container">
            <span className="text-muted">
              {t("product.ref")} {product._id}
            </span>
          </div>

          <h1 className="product-title">{displayName}</h1>

          <div className="rating-container">
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
            </div>
            <span className="review-count">
              {product.numReviews} {t("product.reviews")}
            </span>
          </div>

          <div className="price-section">
            <span className="price">₾{product.price}</span>
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
            title={`Check out ${displayName} by ${product.brand} on SoulArt`}
          />

          {/* Product Dimensions */}
          {dimensions && (
            <div className="product-card dimensions-info">
              <h3 className="info-title">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 3v18h18"></path>
                  <path d="M3 9h18"></path>
                  <path d="M15 3v18"></path>
                </svg>
                {t("product.dimensions")}
              </h3>
              <div className="dimensions-details">
                {dimensions.width && <span>{dimensions.width} სმ *</span>}
                {dimensions.height && <span> {dimensions.height} სმ *</span>}
                {dimensions.depth && <span>{dimensions.depth} სმ</span>}
              </div>
            </div>
          )}

          <div className="stock-info">
            {isOutOfStock ? (
              <span className="stock-badge out-of-stock">
                {t("shop.outOfStock")}
              </span>
            ) : (
              <span className="stock-badge in-stock">{t("shop.inStock")}</span>
            )}
          </div>

          {!isOutOfStock && (
            <div className="select-container">
              <label>{t("product.quantity")}:</label>
              <select
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
          )}

          <AddToCartButton
            productId={product._id}
            countInStock={product.countInStock}
            className="custom-style-2"
          />
        </div>

        {/* Tabs - Full Width */}
        <div className="tabs">
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
            className={`tab-content ${activeTab === "details" ? "active" : ""}`}
          >
            <div className="prose">
              <p>{displayDescription}</p>
            </div>
          </div>

          <div
            className={`tab-content ${activeTab === "reviews" ? "active" : ""}`}
          >
            <ReviewForm
              productId={product._id}
              onSuccess={() => router.refresh()}
            />
            <ProductReviews product={product} />
          </div>
        </div>
      </div>

      {/* Room Viewer Modal */}
      <RoomViewer
        productImage={product.images[currentImageIndex]}
        isOpen={isRoomViewerOpen}
        onClose={() => setIsRoomViewerOpen(false)}
      />
    </div>
  );
}
