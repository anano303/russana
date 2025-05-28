import { useState } from "react";
import { CategoriesList } from "./categories-list";
import { AttributesManager } from "./attributes-manager";

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

      <style jsx>{`
        .categories-manager {
          font-family: system-ui, sans-serif;
        }

        .admin-header {
          margin-bottom: 20px;
          display: flex;
          flex-direction: column;
        }

        .admin-title {
          font-size: 24px;
          margin-bottom: 16px;
          color: #333;
        }

        .tabs {
          display: flex;
          border-bottom: 1px solid #ccc;
          margin-bottom: 20px;
        }

        .tab-button {
          padding: 10px 20px;
          border: none;
          background: none;
          cursor: pointer;
          font-size: 16px;
          color: #666;
          position: relative;
        }

        .tab-button.active {
          color: #cf0a0a;
          font-weight: bold;
        }

        .tab-button.active::after {
          content: "";
          position: absolute;
          bottom: -1px;
          left: 0;
          width: 100%;
          height: 2px;
          background-color: #cf0a0a;
        }

        .tab-button:hover {
          color: #cf0a0a;
        }
      `}</style>
    </div>
  );
};
