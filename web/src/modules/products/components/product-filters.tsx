"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchWithAuth } from "@/lib/fetch-with-auth";
import "./product-filters.css";
import { useLanguage } from "@/hooks/LanguageContext";
import { Category, SubCategory, Color, AgeGroupItem } from "@/types";
import HeartLoading from "@/components/HeartLoading/HeartLoading";

interface FilterProps {
  onCategoryChange: (categoryId: string) => void;
  onSubCategoryChange: (subcategoryId: string) => void;
  onAgeGroupChange: (ageGroup: string) => void;
  onSizeChange: (size: string) => void;
  onColorChange: (color: string) => void;
  onSortChange: (sortOption: {
    field: string;
    direction: "asc" | "desc";
  }) => void;
  onBrandChange: (brand: string) => void;
  selectedCategoryId?: string;
  selectedSubCategoryId?: string;
  selectedAgeGroup?: string;
  selectedSize?: string;
  selectedColor?: string;
  selectedBrand?: string;
  priceRange?: [number, number]; // min, max
  onPriceRangeChange: (range: [number, number]) => void;
}

export function ProductFilters({
  onCategoryChange,
  onSubCategoryChange,
  onAgeGroupChange,
  onSizeChange,
  onColorChange,
  onSortChange,
  onBrandChange,
  onPriceRangeChange,
  selectedCategoryId,
  selectedSubCategoryId,
  selectedAgeGroup,
  selectedSize,
  selectedColor,
  selectedBrand,
  priceRange = [0, 1000],
}: FilterProps) {
  const { language, t } = useLanguage();
  const [minPrice, setMinPrice] = useState(priceRange[0]);
  const [maxPrice, setMaxPrice] = useState(priceRange[1]);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  // Update local state when props change
  useEffect(() => {
    setMinPrice(priceRange[0]);
    setMaxPrice(priceRange[1]);
  }, [priceRange]);

  // Fetch all categories with error handling
  const {
    data: categories = [],
    isLoading: isCategoriesLoading,
    // Removing unused error variable
  } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      try {
        const response = await fetchWithAuth(
          "/categories?includeInactive=false"
        );
        if (!response.ok) {
          throw new Error(`Error fetching categories: ${response.status}`);
        }
        return response.json();
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        setError(t("shop.errorLoadingCategories"));
        return [];
      }
    },
    retry: 2,
    refetchOnWindowFocus: false,
  });

  // Fetch subcategories based on selected category with error handling
  const {
    data: subcategories = [],
    isLoading: isSubcategoriesLoading,
    // Removing unused error variable
  } = useQuery<SubCategory[]>({
    queryKey: ["subcategories", selectedCategoryId],
    queryFn: async () => {
      try {
        if (!selectedCategoryId) return [];
        const response = await fetchWithAuth(
          `/subcategories?categoryId=${selectedCategoryId}&includeInactive=false`
        );
        if (!response.ok) {
          throw new Error(`Error fetching subcategories: ${response.status}`);
        }
        return response.json();
      } catch (err) {
        console.error("Failed to fetch subcategories:", err);
        setError(t("shop.errorLoadingSubcategories"));
        return [];
      }
    },
    enabled: !!selectedCategoryId,
    retry: 2,
    refetchOnWindowFocus: false,
  });
  // Fetch all available brands for filtering with error handling
  const {
    data: availableBrands = [],
    isLoading: isBrandsLoading,
    // Removing unused error variable
  } = useQuery<string[]>({
    queryKey: ["brands"],
    queryFn: async () => {
      try {
        const response = await fetchWithAuth("/products/");
        if (!response.ok) {
          return []; // Silently fail if brands endpoint doesn't exist
        }
        return response.json();
      } catch (err) {
        console.error("Failed to fetch brands:", err);
        return [];
      }
    },
    retry: 1,
    refetchOnWindowFocus: false,
  });
  // Fetch all colors for filtering with proper nameEn support
  const { data: availableColors = [] } = useQuery<Color[]>({
    queryKey: ["colors"],
    queryFn: async () => {
      try {
        const response = await fetchWithAuth("/categories/attributes/colors");
        if (!response.ok) {
          console.error("Failed to fetch colors:", response.status);
          return [];
        }
        return response.json();
      } catch (err) {
        console.error("Failed to fetch colors:", err);
        return [];
      }
    },
    retry: 1,
    refetchOnWindowFocus: false,
  });
  // Fetch all age groups for filtering with proper nameEn support
  const { data: availableAgeGroups = [] } = useQuery<AgeGroupItem[]>({
    queryKey: ["ageGroups"],
    queryFn: async () => {
      try {
        const response = await fetchWithAuth(
          "/categories/attributes/age-groups"
        );
        if (!response.ok) {
          console.error("Failed to fetch age groups:", response.status);
          return [];
        }
        return response.json();
      } catch (err) {
        console.error("Failed to fetch age groups:", err);
        return [];
      }
    },
    retry: 1,
    refetchOnWindowFocus: false,
  });

  // Get available attributes based on selected subcategory
  const getAvailableAttributes = (
    attributeType: "ageGroups" | "sizes" | "colors"
  ): string[] => {
    if (!selectedSubCategoryId || !subcategories || subcategories.length === 0)
      return [];

    const selectedSubCategory = subcategories.find(
      (sub) =>
        sub.id === selectedSubCategoryId || sub._id === selectedSubCategoryId
    );

    if (!selectedSubCategory) return [];

    return selectedSubCategory[attributeType] || [];
  }; // Get localized color name based on current language
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

  // Handle price range changes with validation
  const handlePriceChange = () => {
    // Validation
    if (minPrice < 0) {
      setMinPrice(0);
      return;
    }

    if (maxPrice < minPrice) {
      setMaxPrice(minPrice);
      return;
    }

    onPriceRangeChange([minPrice, maxPrice]);
  };

  // Translate category/subcategory names based on language
  const getLocalizedName = (
    name: string,
    originalItem?: { nameEn?: string }
  ): string => {
    if (language === "en") {
      // First check if the item has an English name field
      if (originalItem && originalItem.nameEn) {
        return originalItem.nameEn;
      }
      return name;
    }
    return name;
  };

  // Handle clearing specific filters
  const clearCategoryFilter = () => {
    onCategoryChange("");
    onSubCategoryChange("");
    onAgeGroupChange("");
    onSizeChange("");
    onColorChange("");
  };

  // const clearSubcategoryFilter = () => {
  //   onSubCategoryChange("");
  //   onAgeGroupChange("");
  //   onSizeChange("");
  //   onColorChange("");
  // };

  // Reset all filters to default values
  const resetAllFilters = () => {
    onCategoryChange("");
    onSubCategoryChange("");
    onAgeGroupChange("");
    onSizeChange("");
    onColorChange("");
    onBrandChange("");
    setMinPrice(0);
    setMaxPrice(1000);
    onPriceRangeChange([0, 1000]);
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowFilters(false);
      setIsClosing(false);
    }, 500); // matches animation duration
  };

  return (
    <div className="product-filters">
      {/* Categories section */}
      <div className="categories-section">
        {error && (
          <div className="filter-error">
            <p>{error}</p>
            <button onClick={() => setError(null)}>{t("shop.close")}</button>
          </div>
        )}

        <div className="filter-section">
          <div className="filter-header">
            {/* <h3 className="filter-title">კატეგორიები</h3> */}{" "}
            {selectedCategoryId && (
              <button
                className="filter-clear-btn"
                onClick={clearCategoryFilter}
                aria-label="Clear category filter"
              >
                {t("shop.clear")}
              </button>
            )}
          </div>
          <div className="filter-options">
            <div className="main-categories-grid">
              {isCategoriesLoading ? (
                <div className="loading">
                  <HeartLoading size="medium" />
                </div>
              ) : categories.length > 0 ? (
                categories.map((category) => (
                  <div
                    key={category.id || category._id}
                    className={`main-category-option ${
                      selectedCategoryId === category.id ||
                      selectedCategoryId === category._id
                        ? "selected"
                        : ""
                    }`}
                    onClick={() =>
                      onCategoryChange(category.id || category._id || "")
                    }
                  >
                    <div className="category-content">
                      <span className="category-name">
                        {getLocalizedName(category.name, category)}
                      </span>
                    </div>
                    {subcategories.length > 0 &&
                      selectedCategoryId === (category.id || category._id) && (
                        <div className="subcategories-overlay">
                          {isSubcategoriesLoading ? (
                            <div className="loading">
                              <HeartLoading size="medium" />
                            </div>
                          ) : (
                            subcategories.map((sub) => (
                              <div
                                key={sub.id || sub._id}
                                className="subcategory-item"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onSubCategoryChange(sub.id || sub._id || "");
                                }}
                              >
                                {getLocalizedName(sub.name, sub)}
                              </div>
                            ))
                          )}
                        </div>
                      )}
                  </div>
                ))
              ) : (
                <div className="no-data">{t("shop.noCategories")}</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Filter toggle button */}
      {!showFilters && (
        <button
          className="filter-toggle-btn"
          onClick={() => setShowFilters(true)}
        >
          {t("shop.filterToggle")}
        </button>
      )}

      {/* Additional filters section */}
      {showFilters && (
        <div className={`additional-filters ${isClosing ? "closing" : ""}`}>
          <div className="filters-header">
            <button
              className="filters-close-btn"
              onClick={handleClose}
              aria-label="Close filters"
            >
              ✕
            </button>
          </div>
          {/* Age Group Filter */}
          {selectedSubCategoryId &&
            getAvailableAttributes("ageGroups").length > 0 && (
              <div className="filter-section">
                <div className="filter-header">
                  {" "}
                  <h3 className="filter-title">{t("shop.ageGroupFilter")}</h3>
                  {selectedAgeGroup && (
                    <button
                      className="filter-clear-btn"
                      onClick={() => onAgeGroupChange("")}
                      aria-label="Clear age group filter"
                    >
                      {t("shop.clear")}
                    </button>
                  )}
                </div>
                <div className="filter-options">
                  <div className="filter-group">
                    {getAvailableAttributes("ageGroups").map((ageGroup) => (
                      <div
                        key={ageGroup}
                        className={`filter-option ${
                          selectedAgeGroup === ageGroup ? "selected" : ""
                        }`}
                        onClick={() =>
                          onAgeGroupChange(
                            ageGroup === selectedAgeGroup ? "" : ageGroup
                          )
                        }
                      >
                        {" "}
                        {getLocalizedAgeGroupName(ageGroup)}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          {/* Size Filter */}
          {selectedSubCategoryId &&
            getAvailableAttributes("sizes").length > 0 && (
              <div className="filter-section">
                <div className="filter-header">
                  {" "}
                  <h3 className="filter-title">{t("shop.sizes")}</h3>
                  {selectedSize && (
                    <button
                      className="filter-clear-btn"
                      onClick={() => onSizeChange("")}
                      aria-label="Clear size filter"
                    >
                      {t("shop.clear")}
                    </button>
                  )}
                </div>
                <div className="filter-options">
                  <div className="filter-group size-group">
                    {getAvailableAttributes("sizes").map((size) => (
                      <div
                        key={size}
                        className={`filter-option size ${
                          selectedSize === size ? "selected" : ""
                        }`}
                        onClick={() =>
                          onSizeChange(size === selectedSize ? "" : size)
                        }
                      >
                        {size}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}{" "}
          {/* Color Filter */}
          {selectedSubCategoryId &&
            getAvailableAttributes("colors").length > 0 && (
              <div className="filter-section">
                <div className="filter-header">
                  {" "}
                  <h3 className="filter-title">{t("shop.colors")}</h3>
                  {selectedColor && (
                    <button
                      className="filter-clear-btn"
                      onClick={() => onColorChange("")}
                      aria-label="Clear color filter"
                    >
                      {t("shop.clear")}
                    </button>
                  )}
                </div>
                <div className="filter-options">
                  <div className="filter-group color-group">
                    {getAvailableAttributes("colors").map((color) => (
                      <div
                        key={color}
                        className={`filter-option color ${
                          selectedColor === color ? "selected" : ""
                        }`}
                        onClick={() =>
                          onColorChange(color === selectedColor ? "" : color)
                        }
                      >
                        {getLocalizedColorName(color)}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          {/* Brand Filter */}
          {!isBrandsLoading &&
            availableBrands &&
            availableBrands.length > 0 && (
              <div className="filter-section">
                <div className="filter-header">
                  {" "}
                  <h3 className="filter-title">{t("shop.brands")}</h3>
                  {selectedBrand && (
                    <button
                      className="filter-clear-btn"
                      onClick={() => onBrandChange("")}
                      aria-label="Clear brand filter"
                    >
                      {t("shop.clear")}
                    </button>
                  )}
                </div>
                <div className="filter-options">
                  <div className="filter-group">
                    {availableBrands.slice(0, 10).map((brand) => (
                      <div
                        key={brand}
                        className={`filter-option ${
                          selectedBrand === brand ? "selected" : ""
                        }`}
                        onClick={() =>
                          onBrandChange(brand === selectedBrand ? "" : brand)
                        }
                      >
                        {brand}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}{" "}
          {/* Price Range Filter */}
          <div className="filter-section">
            {" "}
            <h3 className="filter-title">{t("shop.priceRange")}</h3>
            <div className="price-range">
              <div className="price-inputs">
                <input
                  type="number"
                  value={minPrice}
                  min={0}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    setMinPrice(value >= 0 ? value : 0);
                  }}
                  placeholder={t("shop.min")}
                  className="price-input"
                />
                <span className="price-separator">-</span>
                <input
                  type="number"
                  value={maxPrice}
                  min={minPrice}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    setMaxPrice(value >= minPrice ? value : minPrice);
                  }}
                  placeholder={t("shop.max")}
                  className="price-input"
                />
                <button
                  className="price-apply-btn"
                  onClick={handlePriceChange}
                  aria-label="Apply price filter"
                >
                  {t("shop.applyPrice")}
                </button>
              </div>
            </div>
          </div>{" "}
          {/* Sort Options */}
          <div className="filter-section">
            {" "}
            <h3 className="filter-title">{t("shop.sortBy")}</h3>
            <div className="sort-options">
              <select
                className="sort-select"
                onChange={(e) => {
                  const value = e.target.value;
                  const [field, direction] = value.split("-");
                  onSortChange({
                    field,
                    direction: direction as "asc" | "desc",
                  });
                }}
              >
                {" "}
                <option value="createdAt-desc">{t("shop.newest")}</option>{" "}
                <option value="price-asc">{t("shop.priceLowHigh")}</option>{" "}
                <option value="price-desc">{t("shop.priceHighLow")}</option>{" "}
                <option value="name-asc">{t("shop.nameAZ")}</option>{" "}
                <option value="name-desc">{t("shop.nameZA")}</option>{" "}
                <option value="rating-desc">{t("shop.ratingHigh")}</option>
              </select>
            </div>
          </div>
          {/* Clear All Filters Button */}
          {(selectedCategoryId ||
            selectedSubCategoryId ||
            selectedAgeGroup ||
            selectedSize ||
            selectedColor ||
            selectedBrand ||
            minPrice > 0 ||
            maxPrice < 1000) && (
            <div className="filter-section">
              <button
                className="clear-filters-btn"
                onClick={resetAllFilters}
                aria-label="Clear all filters"
              >
                {t("shop.clearAllFilters")}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
