import { useState } from "react";
import { CategoriesList } from "./categories-list";
import { AttributesManager } from "./attributes-manager";
import "./styles/categories-manager.css";

type Tab = "categories" | "attributes";

export const CategoriesManager = () => {
  const [activeTab, setActiveTab] = useState<Tab>("categories");

  return (
    <div className="categories-manager">
      <div className="admin-header">
        <h1 className="admin-title">კატეგორიების მართვა</h1>
        <div className="tabs">
          <button
            className={`tab-button ${
              activeTab === "categories" ? "active" : ""
            }`}
            onClick={() => setActiveTab("categories")}
          >
            კატეგორიები
          </button>
          <button
            className={`tab-button ${
              activeTab === "attributes" ? "active" : ""
            }`}
            onClick={() => setActiveTab("attributes")}
          >
            ატრიბუტები
          </button>
        </div>
      </div>

      <div className="tab-content">
        {activeTab === "categories" && <CategoriesList />}
        {activeTab === "attributes" && <AttributesManager />}
      </div>
    </div>
  );
};
