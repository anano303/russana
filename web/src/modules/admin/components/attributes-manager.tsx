import { useState } from "react";
import {
  useColors,
  useSizes,
  useAgeGroups,
  useCreateColor,
  useUpdateColor,
  useDeleteColor,
  useCreateSize,
  useUpdateSize,
  useDeleteSize,
  useCreateAgeGroup,
  useUpdateAgeGroup,
  useDeleteAgeGroup,
  AttributeInput,
} from "../hooks/use-categories";
import { Loader } from "lucide-react";

type AttributeType = "color" | "size" | "ageGroup";

export const AttributesManager = () => {
  const [activeTab, setActiveTab] = useState<AttributeType>("color");
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");

  // Colors
  const { data: colors, isLoading: isLoadingColors } = useColors();
  const createColor = useCreateColor();
  const updateColor = useUpdateColor();
  const deleteColor = useDeleteColor();

  // Sizes
  const { data: sizes, isLoading: isLoadingSizes } = useSizes();
  const createSize = useCreateSize();
  const updateSize = useUpdateSize();
  const deleteSize = useDeleteSize();

  // Age Groups
  const { data: ageGroups, isLoading: isLoadingAgeGroups } = useAgeGroups();
  const createAgeGroup = useCreateAgeGroup();
  const updateAgeGroup = useUpdateAgeGroup();
  const deleteAgeGroup = useDeleteAgeGroup();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputValue.trim()) return;

    const data: AttributeInput = { value: inputValue.trim() };

    try {
      if (isEditing) {
        // Update existing attribute
        if (activeTab === "color") {
          await updateColor.mutateAsync({ color: isEditing, data });
        } else if (activeTab === "size") {
          await updateSize.mutateAsync({ size: isEditing, data });
        } else if (activeTab === "ageGroup") {
          await updateAgeGroup.mutateAsync({ ageGroup: isEditing, data });
        }
        setIsEditing(null);
      } else {
        // Create new attribute
        if (activeTab === "color") {
          await createColor.mutateAsync(data);
        } else if (activeTab === "size") {
          await createSize.mutateAsync(data);
        } else if (activeTab === "ageGroup") {
          await createAgeGroup.mutateAsync(data);
        }
        setIsAdding(false);
      }

      setInputValue("");
    } catch (error) {
      console.error("Error submitting attribute:", error);
    }
  };

  const startEditing = (value: string) => {
    setIsAdding(false);
    setIsEditing(value);
    setInputValue(value);
  };

  const handleDelete = async (value: string) => {
    if (!window.confirm(`დარწმუნებული ხართ, რომ გსურთ წაშლა?`)) return;

    try {
      if (activeTab === "color") {
        await deleteColor.mutateAsync(value);
      } else if (activeTab === "size") {
        await deleteSize.mutateAsync(value);
      } else if (activeTab === "ageGroup") {
        await deleteAgeGroup.mutateAsync(value);
      }
    } catch (error) {
      console.error("Error deleting attribute:", error);
    }
  };

  const isLoading = isLoadingColors || isLoadingSizes || isLoadingAgeGroups;
  const isPending =
    createColor.isPending ||
    updateColor.isPending ||
    deleteColor.isPending ||
    createSize.isPending ||
    updateSize.isPending ||
    deleteSize.isPending ||
    createAgeGroup.isPending ||
    updateAgeGroup.isPending ||
    deleteAgeGroup.isPending;

  let attributeItems: string[] = [];
  if (activeTab === "color" && colors) attributeItems = colors;
  else if (activeTab === "size" && sizes) attributeItems = sizes;
  else if (activeTab === "ageGroup" && ageGroups) attributeItems = ageGroups;

  return (
    <div className="attributes-manager">
      <div className="attributes-tabs">
        <button
          className={`tab-button ${activeTab === "color" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("color");
            setIsAdding(false);
            setIsEditing(null);
            setInputValue("");
          }}
        >
          ფერები
        </button>
        <button
          className={`tab-button ${activeTab === "size" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("size");
            setIsAdding(false);
            setIsEditing(null);
            setInputValue("");
          }}
        >
          ზომები
        </button>
        <button
          className={`tab-button ${activeTab === "ageGroup" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("ageGroup");
            setIsAdding(false);
            setIsEditing(null);
            setInputValue("");
          }}
        >
          ასაკობრივი ჯგუფები
        </button>
      </div>

      <div className="attributes-content">
        <div className="attributes-header">
          <h3 className="attributes-title">
            {activeTab === "color"
              ? "ფერები"
              : activeTab === "size"
              ? "ზომები"
              : "ასაკობრივი ჯგუფები"}
          </h3>
          {!isAdding && !isEditing && (
            <button className="btn-add" onClick={() => setIsAdding(true)}>
              + დამატება
            </button>
          )}
        </div>

        {(isAdding || isEditing) && (
          <form onSubmit={handleSubmit} className="attribute-form">
            <div className="form-group">
              <label htmlFor="attributeValue">
                {isEditing ? "რედაქტირება" : "ახალი მნიშვნელობა"}
              </label>
              <input
                type="text"
                id="attributeValue"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={
                  activeTab === "color"
                    ? "შეიყვანეთ ფერი..."
                    : activeTab === "size"
                    ? "შეიყვანეთ ზომა..."
                    : "შეიყვანეთ ასაკობრივი ჯგუფი..."
                }
                required
              />
            </div>
            <div className="form-actions">
              <button
                type="submit"
                className="btn-submit"
                disabled={isPending || !inputValue.trim()}
              >
                {isPending
                  ? "იტვირთება..."
                  : isEditing
                  ? "განახლება"
                  : "დამატება"}
              </button>
              <button
                type="button"
                className="btn-cancel"
                onClick={() => {
                  setIsAdding(false);
                  setIsEditing(null);
                  setInputValue("");
                }}
              >
                გაუქმება
              </button>
            </div>
          </form>
        )}

        {isLoading ? (
          <div className="loading-container">
            <Loader />
          </div>
        ) : (
          <div className="attributes-list">
            {attributeItems.length > 0 ? (
              attributeItems.map((item) => (
                <div key={item} className="attribute-item">
                  <span className="attribute-value">{item}</span>
                  <div className="attribute-actions">
                    <button
                      className="btn-edit"
                      onClick={() => startEditing(item)}
                      disabled={isEditing === item}
                    >
                      რედაქტირება
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(item)}
                      disabled={isPending}
                    >
                      წაშლა
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-attributes">
                <p>მონაცემები არ მოიძებნა</p>
              </div>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        .attributes-manager {
          padding: 20px 0;
        }

        .attributes-tabs {
          display: flex;
          margin-bottom: 20px;
          border-bottom: 1px solid #ddd;
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

        .attributes-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .attributes-title {
          font-size: 20px;
          color: #333;
          margin: 0;
        }

        .btn-add {
          background-color: #cf0a0a;
          color: #fff;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
        }

        .btn-add:hover {
          background-color: #b80a0a;
        }

        .attribute-form {
          background-color: #f8f8f8;
          padding: 20px;
          border-radius: 6px;
          margin-bottom: 20px;
          border: 1px solid #ddd;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 15px;
        }

        .form-group label {
          font-size: 14px;
          color: #555;
        }

        .form-group input[type="text"] {
          padding: 8px 12px;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 14px;
        }

        .form-actions {
          display: flex;
          gap: 10px;
        }

        .btn-submit {
          background-color: #cf0a0a;
          color: #fff;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
        }

        .btn-submit:hover {
          background-color: #b80a0a;
        }

        .btn-submit:disabled {
          background-color: #f0a0a0;
          cursor: not-allowed;
        }

        .btn-cancel {
          background-color: #f0f0f0;
          color: #666;
          border: 1px solid #ccc;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
        }

        .btn-cancel:hover {
          background-color: #e6e6e6;
        }

        .loading-container {
          display: flex;
          justify-content: center;
          padding: 40px 0;
        }

        .attributes-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .attribute-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          background-color: #f9f9f9;
          border: 1px solid #eee;
          border-radius: 4px;
        }

        .attribute-value {
          font-size: 16px;
          color: #333;
        }

        .attribute-actions {
          display: flex;
          gap: 8px;
        }

        .btn-edit {
          background-color: #f0f0f0;
          color: #666;
          border: 1px solid #ccc;
          padding: 6px 12px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
        }

        .btn-edit:hover {
          background-color: #e6e6e6;
        }

        .btn-edit:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .btn-delete {
          background-color: #fff;
          color: #cf0a0a;
          border: 1px solid #cf0a0a;
          padding: 6px 12px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
        }

        .btn-delete:hover {
          background-color: #fff0f0;
        }

        .btn-delete:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .no-attributes {
          text-align: center;
          padding: 40px 0;
          color: #999;
        }
      `}</style>
    </div>
  );
};
