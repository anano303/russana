"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import "./homePageShop.css";
import "../../app/(pages)/shop/ShopPage.css";
import "../../app/(pages)/shop/ShopAnimatedIcons.css";
import { ProductGrid } from "@/modules/products/components/product-grid";
import { getProducts } from "@/modules/products/api/get-products";
import { Product, MainCategory } from "@/types";
import { useLanguage } from "@/hooks/LanguageContext";
import { Paintbrush, Palette, Printer, Square, Heart } from "lucide-react";

export default function HomePageShop() {
  const { t } = useLanguage();
  const [clothingProducts, setClothingProducts] = useState<Product[]>([]);
  const [accessoriesProducts, setAccessoriesProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setIsLoading(true);
        const { items } = await getProducts(1, 18);
        console.log("Fetched products:", items);

        const processedItems = items.map((item) => {
          if (!item.categoryStructure) {
            const clothingCategories = [
              "მაისურები",
              "კაბები",
              "ჰუდები",
              "სხვა",
            ];
            const accessoriesCategories = ["კეპები", "პანამები", "სხვა"];
            const footwearCategories = ["სპორტული", "ყოველდღიური", "სხვა"];

            let mainCategory = MainCategory.SWIMWEAR; // Default

            if (clothingCategories.includes(item.category)) {
              mainCategory = MainCategory.CLOTHING;
            } else if (accessoriesCategories.includes(item.category)) {
              mainCategory = MainCategory.ACCESSORIES;
            } else if (footwearCategories.includes(item.category)) {
              mainCategory = MainCategory.FOOTWEAR;
            }

            return {
              ...item,
              categoryStructure: {
                main: mainCategory,
                sub: item.category,
              },
            };
          }
          return item;
        });

        // Split products by main category
        const clothing = processedItems
          .filter((product) => {
            const productMain = product.categoryStructure?.main
              ?.toString()
              ?.toLowerCase();
            return productMain === MainCategory.CLOTHING.toLowerCase();
          })
          .slice(0, 6);

        const accessories = processedItems
          .filter((product) => {
            const productMain = product.categoryStructure?.main
              ?.toString()
              ?.toLowerCase();
            return productMain === MainCategory.ACCESSORIES.toLowerCase();
          })
          .slice(0, 6);

        // Update state with the filtered products
        setClothingProducts(clothing);
        setAccessoriesProducts(accessories);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setIsLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const renderAnimatedIcons = () => {
    return (
      <div className="shop-animated-icons-container">
        <div className="shop-animated-icons default">
          <div className="icon brush-icon">
            <Paintbrush />
          </div>
          <div className="icon palette-icon">
            <Palette />
          </div>
          <div className="icon canvas-icon">
            <Square />
          </div>
          <div className="icon frame-icon">
            <Printer />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container shop-container">
      {renderAnimatedIcons()}

      <div className="content">
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Heart
            className="title-heart-icon"
            fill="#e91e63"
            color="#e91e63"
            display="inline"
          />
          <h1
            className="title"
            style={{
              marginBottom: 40,
              marginTop: 70,
              zIndex: 9,
              textAlign: "left",
            }}
          >
            {t("shop.allArtworks")}
          </h1>
          <Heart
            className="title-heart-icon"
            fill="#e91e63"
            color="#e91e63"
            display="inline"
          />
        </div>
        {isLoading ? (
          <div className="loading-container">
            <p>{t("shop.loading")}</p>
          </div>
        ) : (
          <div className="product-sections">
            {/* Clothing Section */}
            {clothingProducts && clothingProducts.length > 0 && (
              <div className="product-section">
                <h2 className="section-title">
                  <Heart
                    className="title-heart-icon"
                    fill="#e91e63"
                    color="#e91e63"
                  />
                  ყველაზე ახალი {t("categories.clothing")}
                </h2>
                <ProductGrid
                  products={clothingProducts}
                  theme="default"
                  isShopPage={false}
                />
                <div className="see-more">
                  <Link href={`/shop?page=1&mainCategory=CLOTHING`}>
                    <button className="see-more-btn">{t("shop.seeAll")}</button>
                  </Link>
                </div>
              </div>
            )}

            {/* Accessories Section */}
            {accessoriesProducts && accessoriesProducts.length > 0 && (
              <div className="product-section">
                <h2 className="section-title">
                  <Heart
                    className="title-heart-icon"
                    fill="#e91e63"
                    color="#e91e63"
                  />
                  ყველაზე ახალი {t("categories.accessories")}
                </h2>
                <ProductGrid
                  products={accessoriesProducts}
                  theme="handmade-theme"
                  isShopPage={false}
                />
                <div className="see-more">
                  <Link href={`/shop?page=1&mainCategory=ACCESSORIES`}>
                    <button className="see-more-btn">{t("shop.seeAll")}</button>
                  </Link>
                </div>
              </div>
            )}

            {/* Show empty state if no products in any category */}
            {(!clothingProducts || clothingProducts.length === 0) &&
              (!accessoriesProducts || accessoriesProducts.length === 0) && (
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
