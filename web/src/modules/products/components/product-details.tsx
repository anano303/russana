"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X } from "lucide-react"; // Added X icon for close button
import { motion, AnimatePresence } from "framer-motion";
import "./productDetails.css";
import { Product } from "@/types";
import { ShareButtons } from "@/components/share-buttons/share-buttons";
import { useLanguage } from "@/hooks/LanguageContext";

import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useCart } from "@/modules/cart/context/cart-context";

// Custom AddToCartButton component that uses the cart context
function AddToCartButton({
  productId,
  countInStock = 0,
  className = "",
  selectedSize = "",
  selectedColor = "",
  quantity = 1,
  disabled = false,
}: {
  productId: string;
  countInStock?: number;
  className?: string;
  selectedSize?: string;
  selectedColor?: string;
  quantity?: number;
  disabled?: boolean;
}) {
  const [pending, setPending] = useState(false);
  const { addToCart } = useCart();
  const { t } = useLanguage();

  const handleClick = async () => {
    setPending(true);
    try {
      // Add variant info if available
      await addToCart(productId, quantity, selectedSize, selectedColor);
      toast({
        title: "პროდუქტი დაემატა",
        description: "პროდუქტი წარმატებით დაემატა კალათაში",
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to add product to cart",
        variant: "destructive",
      });
    } finally {
      setPending(false);
    }
  };

  if (countInStock === 0 || disabled) {
    return (
      <button
        className={`add-to-cart-button out-of-stock ${className}`}
        disabled
      >
        {t("shop.outOfStock") || "არ არის მარაგში"}
      </button>
    );
  }

  return (
    <button
      className={`add-to-cart-button ${className}`}
      onClick={handleClick}
      disabled={pending}
    >
      {pending ? (
        <Loader2 className="animate-spin" />
      ) : (
        t("cart.addToCart") || "კალათაში დამატება"
      )}
    </button>
  );
}

interface ProductDetailsProps {
  product: Product;
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [availableQuantity, setAvailableQuantity] = useState<number>(
    product.countInStock || 0
  );

  const { t, language } = useLanguage();

  // Display name and description based on selected language
  const displayName =
    language === "en" && product.nameEn ? product.nameEn : product.name;

  const displayDescription =
    language === "en" && product.descriptionEn
      ? product.descriptionEn
      : product.description;

  const isOutOfStock = product.countInStock === 0;

  // Initialize default selections based on product data
  useEffect(() => {
    // Set default size if sizes array exists
    if (product.sizes && product.sizes.length > 0) {
      setSelectedSize(product.sizes[0]);
    }

    // Set default color if colors array exists
    if (product.colors && product.colors.length > 0) {
      setSelectedColor(product.colors[0]);
    }

    // Set available quantity based on product's countInStock
    setAvailableQuantity(product.countInStock);
  }, [product]);

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
          <h1 className="product-title">{displayName}</h1>

          <div className="price-section">
            <span className="price">{product.price} ლარი </span>
          </div>

          <ShareButtons
            url={typeof window !== "undefined" ? window.location.href : ""}
            title={`Check out ${displayName} by ${product.brand} on Russana`}
          />

          {!isOutOfStock && (
            <div className="product-options-container">
              {/* Size Selector - only show if product has sizes */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="select-container">
                  <select
                    className="option-select"
                    value={selectedSize}
                    onChange={(e) => setSelectedSize(e.target.value)}
                    disabled={isOutOfStock || product.sizes.length === 0}
                  >
                    <option value=""></option>
                    {product.sizes.map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Color selector - only show if product has colors */}
              {product.colors && product.colors.length > 0 && (
                <div className="select-container">
                  <select
                    className="option-select2"
                    value={selectedColor}
                    onChange={(e) => setSelectedColor(e.target.value)}
                    disabled={isOutOfStock || product.colors.length === 0}
                  >
                    <option value="">აირჩიეთ ფერი</option>
                    {product.colors.map((color) => (
                      <option key={color} value={color}>
                        {color}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Quantity Selector */}
              {availableQuantity > 0 && (
                <div className="select-container">
                  <select
                    className="option-select"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    disabled={availableQuantity <= 0}
                  >
                    {Array.from(
                      { length: availableQuantity },
                      (_, i) => i + 1
                    ).map((num) => (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Age Group Display - if product has age groups */}
              {/* {product.ageGroups && product.ageGroups.length > 0 && (
                <div className="age-group-info">
             
                  <div className="age-group-tags">
                    {product.ageGroups.map((ageGroup) => (
                      <span key={ageGroup} className="age-group-tag">
                        {language === "en"
                          ? ageGroup === "ADULTS"
                            ? "Adults"
                            : ageGroup === "KIDS"
                            ? "Kids"
                            : ageGroup
                          : ageGroup === "ADULTS"
                          ? "უფროსები"
                          : ageGroup === "KIDS"
                          ? "ბავშვები"
                          : ageGroup}
                      </span>
                    ))}
                  </div>
                </div>
              )} */}

              {/* Stock Status */}
              {availableQuantity <= 0 && (
                <div className="out-of-stock-message">
                  {t("shop.outOfStock") || "არ არის მარაგში"}
                </div>
              )}
            </div>
          )}

          <div className="tabs">
            <h3>{t("product.details") || "აღწერა"} : </h3>
            <p>{displayDescription}</p>

            <AddToCartButton
              productId={product._id}
              countInStock={availableQuantity}
              className="custom-style-2"
              selectedSize={selectedSize}
              selectedColor={selectedColor}
              quantity={quantity}
              disabled={
                availableQuantity <= 0 ||
                (product.sizes && product.sizes.length > 0 && !selectedSize) ||
                (product.colors && product.colors.length > 0 && !selectedColor)
              }
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
        </div>
      </div>
    </div>
  );
}
