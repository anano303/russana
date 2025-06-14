"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import "./homePageShop.css";
import "../../app/(pages)/shop/ShopPage.css";
import "../../app/(pages)/shop/ShopAnimatedIcons.css";
import { ProductGrid } from "@/modules/products/components/product-grid";
import { getProducts } from "@/modules/products/api/get-products";
import { Category, Product } from "@/types";
import { useLanguage } from "@/hooks/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { fetchWithAuth } from "@/lib/fetch-with-auth";
// import { Shirt, ShoppingBag, Footprints } from "lucide-react";

interface CategoryProducts {
  category: string;
  categoryId: string;
  products: Product[];
}

export default function HomePageShop() {
  const { t, language } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);
  const [categoryProducts, setCategoryProducts] = useState<CategoryProducts[]>(
    []
  );

  // Fetch all categories first
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["home-categories"],
    queryFn: async () => {
      try {
        const response = await fetchWithAuth(
          "/categories?includeInactive=false"
        );
        return response.json();
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        return [];
      }
    },
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    async function fetchProducts() {
      try {
        setIsLoading(true);

        // First fetch all products
        const response = await getProducts(1, 50); // Fetch more to have enough for each category
        const allProducts = response.items || response.products || [];

        if (!categories || categories.length === 0) {
          setIsLoading(false);
          return;
        }

        // Group products by category
        const productsByCategory: CategoryProducts[] = [];

        // Process each category
        for (const category of categories) {
          // If category has an ID, use it to filter products
          if (category.id || category._id) {
            const categoryId = category.id || category._id || "";

            // Filter products that belong to this category
            const categoryProds = allProducts
              .filter((product) => {
                // Check mainCategory field
                if (
                  typeof product.mainCategory === "object" &&
                  product.mainCategory
                ) {
                  return (
                    product.mainCategory.id === categoryId ||
                    product.mainCategory._id === categoryId
                  );
                }

                // If mainCategory is a string, compare directly
                if (typeof product.mainCategory === "string") {
                  return product.mainCategory === categoryId;
                }

                return false;
              })
              .slice(0, 6); // Take only 6 products per category

            // Only add categories that have products
            if (categoryProds.length > 0) {
              productsByCategory.push({
                category:
                  language === "en" && category.nameEn
                    ? category.nameEn
                    : category.name,
                categoryId: categoryId,
                products: categoryProds,
              });
            }
          }
        }

        setCategoryProducts(productsByCategory);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setIsLoading(false);
      }
    }

    if (categories && categories.length > 0) {
      fetchProducts();
    }
  }, [categories, language]);


  return (
    <div className="container shop-container">


      <div className="content">
        {/* <div style={{ display: "flex", alignItems: "center", gap: 10 }}> */}
          {/* <h1
            className="title"
            style={{
              marginBottom: 40,
              marginTop: 70,
              zIndex: 9,
              textAlign: "left",
            }}
          > */}
            {/* {t("shop.allArtworks")} */}
          {/* </h1> */}
        {/* </div> */}

        {isLoading ? (
          <div className="loading-container">
            <p>{t("shop.loading")}</p>
          </div>
        ) : (
          <div className="product-sections">
            {categoryProducts.length > 0 ? (
              categoryProducts.map((categoryData, index) => (
                <div key={index} className="product-section">
                  <div className="section-header">
                  <h2 className="section-title">
                    {t("shop.newest")} {categoryData.category}
                  </h2>

                      <div className="see-more-desktop see-more">
                    <Link
                      href={`/shop?page=1&mainCategory=${categoryData.categoryId}`}
                    >
                      <button className="see-more-btn">
                        {t("shop.seeAll")}
                      </button>
                    </Link>
                  </div>
                  </div>
                  <ProductGrid
                    products={categoryData.products.slice(0, 3)} // Only take first 3 products
                    theme="default"
                    isShopPage={false}
                  />
                       <div className="see-more-mobile see-more">
                    <Link
                      href={`/shop?page=1&mainCategory=${categoryData.categoryId}`}
                    >
                      <button className="see-more-btn">
                        {t("shop.seeAll")}
                      </button>
                    </Link>
                  </div>
              
                </div>
              ))
            ) : (
              <div className="empty-state">
                <p>{t("shop.emptyDescription")}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
