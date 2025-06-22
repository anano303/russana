"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { X } from "lucide-react"; // Added X icon for close button
import { motion, AnimatePresence } from "framer-motion";
import "./productDetails.css";
import { Product } from "@/types";
import { ShareButtons } from "@/components/share-buttons/share-buttons";
import { useLanguage } from "@/hooks/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { fetchWithAuth } from "@/lib/fetch-with-auth";
import { Color, AgeGroupItem } from "@/types";

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
  selectedAgeGroup = "",
  quantity = 1,
  disabled = false,
}: {
  productId: string;
  countInStock?: number;
  className?: string;
  selectedSize?: string;
  selectedColor?: string;
  selectedAgeGroup?: string;
  quantity?: number;
  disabled?: boolean;
}) {
  const [pending, setPending] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const { addToCart } = useCart();
  const { t, language } = useLanguage();
  const handleClick = async () => {
    setPending(true);
    try {
      // Add variant info including ageGroup if available
      await addToCart(
        productId,
        quantity,
        selectedSize,
        selectedColor,
        selectedAgeGroup
      );

      // Show success message
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000); // Hide after 3 seconds

      console.log("Success message shown"); // Debug log
    } catch (error) {
      console.error("Add to cart error:", error); // Debug log
      toast({
        title: language === "en" ? "Error" : "შეცდომა",
        description:
          error instanceof Error
            ? error.message
            : language === "en"
            ? "Failed to add product to cart"
            : "პროდუქტის კალათაში დამატება ვერ მოხერხდა",
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
    <>
      {/* Success Message */}
      {showSuccessMessage && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            backgroundColor: "#4CAF50",
            color: "white",
            padding: "15px 20px",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            zIndex: 9999,
            fontSize: "16px",
            fontWeight: "500",
            animation: "slideIn 0.3s ease-out",
          }}
        >
          ✅{" "}
          {language === "en"
            ? "Product successfully added to cart!"
            : "პროდუქტი წარმატებით დაემატა კალათაში!"}
        </div>
      )}

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

      {/* Add CSS animation */}
      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </>
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
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<string>(""); // Fetch all colors for proper nameEn support
  const { data: availableColors = [] } = useQuery<Color[]>({
    queryKey: ["colors"],
    queryFn: async () => {
      try {
        const response = await fetchWithAuth("/categories/attributes/colors");
        if (!response.ok) {
          return [];
        }
        return response.json();
      } catch {
        return [];
      }
    },
    retry: 1,
    refetchOnWindowFocus: false,
  });
  // Fetch all age groups for proper nameEn support
  const { data: availableAgeGroups = [] } = useQuery<AgeGroupItem[]>({
    queryKey: ["ageGroups"],
    queryFn: async () => {
      try {
        const response = await fetchWithAuth(
          "/categories/attributes/age-groups"
        );
        if (!response.ok) {
          return [];
        }
        return response.json();
      } catch {
        return [];
      }
    },
    retry: 1,
    refetchOnWindowFocus: false,
  });
  // Get localized color name based on current language
  const getLocalizedColorName = (colorName: string): string => {
    if (language === "en") {
      // Find the color in availableColors to get its English name
      const colorObj = availableColors.find(
        (color) => color.name === colorName
      );
      return colorObj?.nameEn || colorName;
    }
    return colorName;
  };

  // Get localized age group name based on current language
  const getLocalizedAgeGroupName = (ageGroupName: string): string => {
    if (language === "en") {
      // Find the age group in availableAgeGroups to get its English name
      const ageGroupObj = availableAgeGroups.find(
        (ageGroup) => ageGroup.name === ageGroupName
      );
      return ageGroupObj?.nameEn || ageGroupName;
    }
    return ageGroupName;
  };

  const availableQuantity = useMemo(() => {
    // Calculate available quantity based on selected attributes
    let stock = product.countInStock || 0;

    // If product has variants, adjust stock based on selected attributes
    if (product.variants && product.variants.length > 0) {
      const variant = product.variants.find(
        (v) =>
          (!v.size || v.size === selectedSize) &&
          (!v.color || v.color === selectedColor) &&
          (!v.ageGroup || v.ageGroup === selectedAgeGroup)
      );
      stock = variant ? variant.stock : 0;
    }

    return stock;
  }, [selectedSize, selectedColor, selectedAgeGroup, product]);

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

    // Set default age group if ageGroups array exists
    if (product.ageGroups && product.ageGroups.length > 0) {
      setSelectedAgeGroup(product.ageGroups[0]);
    }
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
          <h1 className="product-title">{displayName}</h1>{" "}
          <div className="price-section">
            <span className="price">
              {product.price} {language === "en" ? "GEL" : "ლარი"}{" "}
            </span>
          </div>
          <ShareButtons
            url={typeof window !== "undefined" ? window.location.href : ""}
            title={`Check out ${displayName} by ${product.brand} on Russana`}
          />
          {!isOutOfStock && (
            <div className="product-options-container">
              {" "}
              {/* Age Group Selector - only show if product has age groups */}
              {product.ageGroups && product.ageGroups.length > 0 && (
                <div className="select-container">
                  <select
                    className="option-select"
                    value={selectedAgeGroup}
                    onChange={(e) => setSelectedAgeGroup(e.target.value)}
                    disabled={isOutOfStock || product.ageGroups.length === 0}
                  >
                    <option value="">
                      {language === "en"
                        ? "Select age group"
                        : "აირჩიეთ ასაკობრივი ჯგუფი"}
                    </option>
                    {product.ageGroups.map((ageGroup) => (
                      <option key={ageGroup} value={ageGroup}>
                        {getLocalizedAgeGroupName(ageGroup)}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              {/* Size Selector - only show if product has sizes */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="select-container">
                  {" "}
                  <select
                    className="option-select"
                    value={selectedSize}
                    onChange={(e) => setSelectedSize(e.target.value)}
                    disabled={isOutOfStock || product.sizes.length === 0}
                  >
                    <option value="">
                      {language === "en" ? "Select size" : "აირჩიეთ ზომა"}
                    </option>
                    {product.sizes.map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </div>
              )}{" "}
              {/* Color selector - only show if product has colors */}
              {product.colors && product.colors.length > 0 && (
                <div className="select-container">
                  {" "}
                  <select
                    className="option-select2"
                    value={selectedColor}
                    onChange={(e) => setSelectedColor(e.target.value)}
                    disabled={isOutOfStock || product.colors.length === 0}
                  >
                    <option value="">
                      {language === "en" ? "Select color" : "აირჩიეთ ფერი"}
                    </option>
                    {product.colors.map((color) => (
                      <option key={color} value={color}>
                        {getLocalizedColorName(color)}
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
              selectedAgeGroup={selectedAgeGroup}
              quantity={quantity}
              disabled={
                availableQuantity <= 0 ||
                (product.sizes && product.sizes.length > 0 && !selectedSize) ||
                (product.colors &&
                  product.colors.length > 0 &&
                  !selectedColor) ||
                (product.ageGroups &&
                  product.ageGroups.length > 0 &&
                  !selectedAgeGroup)
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
