"use client";

import { useEffect, useState, useCallback } from "react";

import "./product-filters.css";
import { Product, MainCategory, AgeGroup } from "@/types";

import { useLanguage } from "@/hooks/LanguageContext";

interface FilterProps {
  products: Product[];
  onCategoryChange: (category: string) => void;
  onArtistChange: (artist: string) => void;
  onSortChange?: (sortOption: "asc" | "desc" | "") => void;
  selectedCategory?: string;
  selectedMainCategory?: MainCategory;
  onMainCategoryChange?: (mainCategory: MainCategory) => void;
  onAgeGroupChange?: (ageGroup: AgeGroup | undefined) => void;
  selectedAgeGroup?: AgeGroup;
}

export function ProductFilters({
  onCategoryChange,
  onArtistChange,
  onSortChange,
  selectedCategory: initialCategory = "all",
  selectedMainCategory: initialMainCategory = MainCategory.CLOTHING,
  onMainCategoryChange,
  onAgeGroupChange,
  selectedAgeGroup,
}: FilterProps) {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedArtist, setSelectedArtist] = useState("all");

  const [sortOption, setSortOption] = useState<"asc" | "desc" | "">("");
  const [selectedMainCategory, setSelectedMainCategory] =
    useState(initialMainCategory);

  const categoriesByType: Record<MainCategory, string[]> = {
    [MainCategory.CLOTHING]: ["მაისურები", "კაბები", "ჰუდები", "სხვა"],
    [MainCategory.ACCESSORIES]: ["კეპები", "პანამები", "სხვა"],
    [MainCategory.FOOTWEAR]: ["სპორტული", "ყოველდღიური", "სხვა"],
    [MainCategory.SWIMWEAR]: ["საცურაო კოსტუმები", "სხვა"],
    [MainCategory.PAINTINGS]: ["ნახატები", "სხვა"],
    [MainCategory.HANDMADE]: ["ხელნაკეთი", "სხვა"],
  };

  // Helper function to translate category names
  const translateCategory = (category: string) => {
    if (category === "all") return t("shop.allArtworks");
    return t(`productCategories.${category}`);
  };

  // Main category translation mapping
  const mainCategoryLabels: Record<MainCategory, string> = {
    [MainCategory.CLOTHING]: t("categories.clothing"),
    [MainCategory.ACCESSORIES]: t("categories.accessories"),
    [MainCategory.FOOTWEAR]: t("categories.footwear"),
    [MainCategory.SWIMWEAR]: t("categories.swimwear"),
    [MainCategory.PAINTINGS]: t("categories.paintings"),
    [MainCategory.HANDMADE]: t("categories.handmade"),
  };

  const categories = ["all", ...(categoriesByType[selectedMainCategory] || [])];

  const handleArtistChange = useCallback(
    (artist: string) => {
      const newArtist = artist === "all" ? "" : artist;
      setSelectedArtist(artist);
      onArtistChange(newArtist);

      if (selectedCategory !== "all") {
        setSelectedCategory("all");
        onCategoryChange("");
      }
    },
    [selectedCategory, onArtistChange, onCategoryChange]
  );

  const handleCategoryChange = useCallback(
    (category: string) => {
      const newCategory = category === "all" ? "" : category;
      setSelectedCategory(category);
      onCategoryChange(newCategory);

      if (selectedArtist !== "all") {
        handleArtistChange("all");
      }
    },
    [selectedArtist, onCategoryChange, handleArtistChange]
  );

  const handleMainCategoryChange = (mainCategory: MainCategory) => {
    setSelectedMainCategory(mainCategory);
    setSelectedCategory("all");
    onCategoryChange("");

    if (onMainCategoryChange) {
      onMainCategoryChange(mainCategory);
    }
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const option = event.target.value as "asc" | "desc" | "";
    setSortOption(option);
    if (onSortChange) {
      onSortChange(option);
    }
  };

  useEffect(() => {
    if (initialCategory !== "all") {
      handleCategoryChange(initialCategory);
    }
  }, [initialCategory, handleCategoryChange]);

  // Determine the theme class based on the selected main category
  const themeClass = `${selectedMainCategory.toString().toLowerCase()}-theme`;

  return (
    <div className={`filters-container ${themeClass}`}>
      <div className="filter-section">
        <h3 className="filter-title">{t("shop.mainCategory")}</h3>
        <div className="filter-options">
          <div
            className={`filter-option ${
              selectedMainCategory === MainCategory.CLOTHING ? "active" : ""
            }`}
            onClick={() => handleMainCategoryChange(MainCategory.CLOTHING)}
          >
            {mainCategoryLabels[MainCategory.CLOTHING]}
          </div>
          <div
            className={`filter-option ${
              selectedMainCategory === MainCategory.ACCESSORIES ? "active" : ""
            }`}
            onClick={() => handleMainCategoryChange(MainCategory.ACCESSORIES)}
          >
            {mainCategoryLabels[MainCategory.ACCESSORIES]}
          </div>
          <div
            className={`filter-option ${
              selectedMainCategory === MainCategory.FOOTWEAR ? "active" : ""
            }`}
            onClick={() => handleMainCategoryChange(MainCategory.FOOTWEAR)}
          >
            {mainCategoryLabels[MainCategory.FOOTWEAR]}
          </div>
          <div
            className={`filter-option ${
              selectedMainCategory === MainCategory.SWIMWEAR ? "active" : ""
            }`}
            onClick={() => handleMainCategoryChange(MainCategory.SWIMWEAR)}
          >
            {mainCategoryLabels[MainCategory.SWIMWEAR]}
          </div>
        </div>
      </div>

      <div className="filter-section">
        <h3 className="filter-title">{t("shop.categories")}</h3>
        <div className="filter-options">
          {categories.map((category) => (
            <button
              key={category}
              className={`filter-btn ${
                selectedCategory === category ? "active" : ""
              }`}
              onClick={() => handleCategoryChange(category)}
            >
              {translateCategory(category)}
            </button>
          ))}
        </div>
        {selectedCategory !== "all" && (
          <div className="selected-filter">
            <button
              className="clear-filter"
              onClick={() => handleCategoryChange("all")}
            >
              × {translateCategory(selectedCategory)}
            </button>
          </div>
        )}
      </div>

      {/* Age Group Filter */}
      <div className="filter-section">
        <h3 className="filter-title">{t("shop.ageGroup")}</h3>
        <div className="filter-options">
          <div
            className={`filter-option ${!selectedAgeGroup ? "active" : ""}`}
            onClick={() => onAgeGroupChange && onAgeGroupChange(undefined)}
          >
            {t("shop.allAges")}
          </div>
          <div
            className={`filter-option ${
              selectedAgeGroup === AgeGroup.ADULTS ? "active" : ""
            }`}
            onClick={() =>
              onAgeGroupChange && onAgeGroupChange(AgeGroup.ADULTS)
            }
          >
            {t("shop.adults")}
          </div>
          <div
            className={`filter-option ${
              selectedAgeGroup === AgeGroup.KIDS ? "active" : ""
            }`}
            onClick={() => onAgeGroupChange && onAgeGroupChange(AgeGroup.KIDS)}
          >
            {t("shop.kids")}
          </div>
        </div>
      </div>

      {/* Sort dropdown as normal flow element with inline layout */}
      <div className="filter-section sort-section">
        <h3 className="filter-title sort-title">{t("shop.sort")}</h3>
        <div className="sort-dropdown inline">
          <select
            className="sort-dropdown-select inline"
            value={sortOption}
            onChange={handleSortChange}
            title={t("shop.sort")}
          >
            <option value={undefined}>{t("shop.defaultSort")}</option>
            <option value="asc">{t("shop.priceLowToHigh")}</option>
            <option value="desc">{t("shop.priceHighToLow")}</option>
          </select>
        </div>
      </div>
    </div>
  );
}
