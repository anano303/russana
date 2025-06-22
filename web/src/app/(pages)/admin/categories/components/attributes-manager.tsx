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
  Color,
} from "../hook/use-categories";
import { Loader } from "lucide-react";
import "./styles/attributes-manager.css";
import HeartLoading from "@/components/HeartLoading/HeartLoading";
import { useLanguage } from "@/hooks/LanguageContext";

type AttributeType = "color" | "size" | "ageGroup";

interface AttributeInputExtended extends AttributeInput {
  value?: string;
  nameEn?: string;
}

export const AttributesManager = () => {
  const { language } = useLanguage(); // Add language context

  // Debug the language value
  console.log("Current language in AttributesManager:", language);
  // For testing - force English to see if it works
  const testLanguage: string = "en"; // Change this to "ge" to test Georgian
  console.log("Using test language:", testLanguage);

  const [activeTab, setActiveTab] = useState<AttributeType>("color");
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [inputValueEn, setInputValueEn] = useState("");
  // Colors
  const { data: colors, isLoading: isLoadingColors } = useColors();

  // Debug colors data
  console.log("useColors data:", colors);
  console.log("Is colors array?", Array.isArray(colors));
  if (colors) {
    colors.forEach((color, index) => {
      console.log(`Color ${index} details:`, {
        type: typeof color,
        isObject: typeof color === "object",
        hasName: color && typeof color === "object" && "name" in color,
        hasNameEn: color && typeof color === "object" && "nameEn" in color,
        raw: color,
      });
    });
  }

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

    if (!inputValue.trim()) return; // Only include English translation for colors
    const data: AttributeInputExtended = {
      value: inputValue.trim(),
      ...(activeTab === "color" && inputValueEn.trim()
        ? { nameEn: inputValueEn.trim() }
        : {}),
    };

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
      setInputValueEn("");
    } catch (error) {
      console.error("Error submitting attribute:", error);
    }
  };
  const startEditing = (value: string, nameEn?: string) => {
    setIsAdding(false);
    setIsEditing(value);
    setInputValue(value);
    setInputValueEn(nameEn || "");
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
  interface AttributeItem {
    value: string;
    nameEn?: string;
  }
  let attributeItems: AttributeItem[] = [];
  if (activeTab === "color" && colors) {
    console.log("Raw colors from API:", colors);
    // For colors, we need both Georgian and English values
    attributeItems = colors.map((color, index) => {
      console.log(`Color ${index}:`, color);
      // Check if color is an object with name and nameEn properties
      if (typeof color === "object" && color !== null && "name" in color) {
        const result = {
          value: (color as Color).name,
          nameEn: (color as Color).nameEn,
        };
        console.log(`Mapped color ${index}:`, result);
        return result;
      }
      // Fallback for backward compatibility
      console.log(`Fallback for color ${index}:`, color);
      return { value: color as string, nameEn: "" };
    });
    console.log("Final attributeItems:", attributeItems);
  } else if (activeTab === "size" && sizes)
    attributeItems = sizes.map((size) => ({ value: size as string }));
  else if (activeTab === "ageGroup" && ageGroups)
    attributeItems = ageGroups.map((ageGroup) => ({
      value: ageGroup as string,
    }));

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
            setInputValueEn("");
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
            setInputValueEn("");
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
            setInputValueEn("");
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
                {isEditing ? "რედაქტირება" : "ახალი მნიშვნელობა"} (ქართულად)
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

            {/* Only show English input field for colors */}
            {activeTab === "color" && (
              <div className="form-group">
                <label htmlFor="attributeValueEn">
                  {isEditing ? "რედაქტირება" : "ახალი მნიშვნელობა"} (ინგლისურად)
                </label>
                <input
                  type="text"
                  id="attributeValueEn"
                  value={inputValueEn}
                  onChange={(e) => setInputValueEn(e.target.value)}
                  placeholder="Enter color in English..."
                />
              </div>
            )}

            <div className="form-actions">
              <button
                type="submit"
                className="btn-submit"
                disabled={isPending || !inputValue.trim()}
              >
                {isPending ? (
                  <HeartLoading size="medium" inline={true} />
                ) : isEditing ? (
                  "განახლება"
                ) : (
                  "დამატება"
                )}
              </button>
              <button
                type="button"
                className="btn-cancel"
                onClick={() => {
                  setIsAdding(false);
                  setIsEditing(null);
                  setInputValue("");
                  setInputValueEn("");
                }}
              >
                გაუქმება
              </button>
            </div>
          </form>
        )}

        {isLoading ? (
          <div className="loading-container">
            <Loader className="animate-spin text-amber-600" />
          </div>
        ) : (
          <div className="attributes-list">
            {attributeItems.length > 0 ? (
              attributeItems.map((item, index) => {
                console.log(`Rendering item ${index}:`, {
                  item,
                  language,
                  isColor: activeTab === "color",
                  shouldShowEnglish:
                    activeTab === "color" && language === "en" && item.nameEn,
                  shouldShowGeorgianWithEnglish:
                    activeTab === "color" && language === "ge" && item.nameEn,
                });
                return (
                  <div
                    key={`${item.value}-${index}`}
                    className="attribute-item"
                  >
                    <div className="attribute-value-container">
                      {" "}
                      <span className="attribute-value">
                        {activeTab === "color" &&
                        testLanguage === "en" &&
                        item.nameEn
                          ? item.nameEn
                          : item.value}
                      </span>
                      {activeTab === "color" &&
                        testLanguage === "ge" &&
                        item.nameEn && (
                          <span className="attribute-value-en">
                            ({item.nameEn})
                          </span>
                        )}
                    </div>
                    <div className="attribute-actions">
                      <button
                        className="btn-edit"
                        onClick={() => startEditing(item.value, item.nameEn)}
                        disabled={isEditing === item.value}
                      >
                        რედაქტირება
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(item.value)}
                      >
                        წაშლა
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="no-attributes">
                <p>მონაცემები არ მოიძებნა</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
