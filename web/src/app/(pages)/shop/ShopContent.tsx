"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useRef, useCallback } from "react";
import { ProductGrid } from "@/modules/products/components/product-grid";
import { ProductFilters } from "@/modules/products/components/product-filters";
import { getProducts } from "@/modules/products/api/get-products";
import { Product, MainCategory, AgeGroup } from "@/types";
import { useLanguage } from "@/hooks/LanguageContext";
import "./ShopPage.css";
import "./ShopAnimatedIcons.css";
import { Shirt, ShoppingBag } from "lucide-react";

const ShopContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLanguage();

  const brand = searchParams ? searchParams.get("brand") : null;
  const pageParam = searchParams
    ? parseInt(searchParams.get("page") || "1")
    : 1;
  const mainCategoryParam = searchParams
    ? searchParams.get("mainCategory")
    : null;

  const initializedRef = useRef(false);

  const initialCategory = brand ? "all" : "";

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortOption, setSortOption] = useState<"asc" | "desc" | "">("");
  const [selectedMainCategory, setSelectedMainCategory] =
    useState<MainCategory>(
      mainCategoryParam === MainCategory.CLOTHING.toString()
        ? MainCategory.CLOTHING
        : MainCategory.ACCESSORIES
    );

  const [selectedAgeGroup, setSelectedAgeGroup] = useState<
    AgeGroup | undefined
  >();

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    console.log("Initial setup with URL params:", {
      page: pageParam,
      mainCategory: mainCategoryParam,
    });

    setCurrentPage(pageParam);

    const mainCat =
      mainCategoryParam === MainCategory.CLOTHING.toString()
        ? MainCategory.CLOTHING
        : MainCategory.ACCESSORIES;
    setSelectedMainCategory(mainCat);
  }, [pageParam, mainCategoryParam]);

  const fetchProducts = useCallback(async () => {
    if (!initializedRef.current) return;

    console.log(`Fetching products for page ${currentPage}`);
    setIsLoading(true);

    try {
      const paramsObject = {
        brand: brand || undefined,
        mainCategory: selectedMainCategory.toString(),
        subcategory: selectedCategory !== "all" ? selectedCategory : undefined,
        sortField: sortOption !== "" ? "price" : "createdAt",
        sortOrder: sortOption !== "" ? sortOption : undefined,
        ageGroup: selectedAgeGroup,
      };

      // Filter out undefined values to create a valid Record<string, string>
      const searchParams: Record<string, string> = {};
      for (const [key, value] of Object.entries(paramsObject)) {
        if (value !== undefined) {
          searchParams[key] = String(value);
        }
      }

      const response = await getProducts(currentPage, 30, searchParams);

      console.log(
        `Got ${response.items?.length || 0} products for page ${currentPage}`
      );

      // Ensure we always set products (even empty array)
      setProducts(response.items || []);
      setTotalPages(response.pages || 1);
    } catch (error) {
      console.error(`Failed to fetch products:`, error);
      // Set empty products array on error
      setProducts([]);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  }, [
    currentPage,
    brand,
    selectedMainCategory,
    selectedCategory,
    sortOption,
    selectedAgeGroup,
  ]);

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      fetchProducts();
    }
    return () => {
      mounted = false;
    };
  }, [fetchProducts]);

  const handlePageChange = (page: number) => {
    if (page === currentPage || page < 1 || page > totalPages) return;

    console.log(`Changing page to ${page}`);
    setCurrentPage(page);

    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());

    router.replace(`/shop?${params.toString()}`);

    window.scrollTo(0, 0);
  };

  const handleCategoryChange = (category: string) => {
    if (category === selectedCategory) return;

    console.log(`Changing category to: ${category}`);
    setSelectedCategory(category);

    if (currentPage !== 1) {
      setCurrentPage(1);

      const params = new URLSearchParams(searchParams.toString());

      if (category && category !== "all") {
        params.set("category", category);
      } else {
        params.delete("category");
      }

      params.set("page", "1");
      router.replace(`/shop?${params.toString()}`);
    } else {
      const params = new URLSearchParams(searchParams.toString());

      if (category && category !== "all") {
        params.set("category", category);
      } else {
        params.delete("category");
      }

      router.replace(`/shop?${params.toString()}`);
    }
  };

  const handleMainCategoryChange = (mainCategory: MainCategory) => {
    if (mainCategory === selectedMainCategory) return;

    console.log(`Changing main category to: ${mainCategory}`);
    setSelectedMainCategory(mainCategory);
    setSelectedCategory("all");
    setCurrentPage(1);

    const params = new URLSearchParams(searchParams.toString());
    params.set("mainCategory", mainCategory.toString());
    params.set("page", "1");
    params.delete("category");

    router.replace(`/shop?${params.toString()}`);
  };

  const handleSortChange = (option: "asc" | "desc" | "") => {
    setSortOption(option);
  };

  const handleArtistChange = (artist: string) => {
    if (!artist) return;

    console.log(`Changing artist filter to: ${artist}`);

    // Reset to page 1
    setCurrentPage(1);

    // Update URL with brand parameter and navigate
    const params = new URLSearchParams();
    params.set("brand", artist);
    params.set("page", "1");

    // Use router.push since we're changing to a fundamentally different view
    router.push(`/shop?${params.toString()}`);
  };

  const handleAgeGroupChange = (ageGroup: AgeGroup | undefined) => {
    setSelectedAgeGroup(ageGroup);
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  };

  const getTheme = () => {
    // Always return "default" since we've removed the other theme option
    return "default";
  };

  const renderAnimatedIcons = () => {
    // Updated with clothing-focused icons
    return (
      <div className="shop-animated-icons modern">
        <div className="icon clothing-icon">
          <Shirt />
        </div>
        <div className="icon accessories-icon">
          <ShoppingBag />
        </div>
      </div>
    );
  };

  return (
    <div className={`shop-container ${getTheme()}`}>
      {renderAnimatedIcons()}

      {/* Add 3D decorative elements */}
      <div className="shop-3d-cube">
        <div className="face front"></div>
        <div className="face back"></div>
        <div className="face right"></div>
        <div className="face left"></div>
        <div className="face top"></div>
        <div className="face bottom"></div>
      </div>

      <div className="shop-3d-sphere"></div>
      <div className="shop-3d-pyramid"></div>

      <div className="content">
        <h1
          className="title"
          style={{ marginBottom: 40, marginTop: 70, zIndex: 9 }}
        >
          {brand ? `${brand}${t("shop.artistWorks")}` : t("shop.allArtworks")}
        </h1>

        <ProductFilters
          products={products}
          onCategoryChange={handleCategoryChange}
          onArtistChange={handleArtistChange}
          onSortChange={handleSortChange}
          selectedCategory={selectedCategory}
          selectedMainCategory={selectedMainCategory}
          onMainCategoryChange={handleMainCategoryChange}
          selectedAgeGroup={selectedAgeGroup}
          onAgeGroupChange={handleAgeGroupChange}
        />
        {isLoading ? (
          <div className="loading-state">{t("shop.loading")}</div>
        ) : products.length > 0 ? (
          <ProductGrid
            products={products}
            theme="default" // Always use default theme
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            isShopPage={true}
            selectedAgeGroup={selectedAgeGroup}
          />
        ) : (
          <div className="empty-state">
            <p>{t("shop.emptyDescription")}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopContent;
