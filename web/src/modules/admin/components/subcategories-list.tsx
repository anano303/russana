import { useState } from "react";
import {
  useSubCategories,
  useCreateSubCategory,
  useUpdateSubCategory,
  useDeleteSubCategory,
  useAttributes,
  SubCategory,
  SubCategoryCreateInput,
  SubCategoryUpdateInput,
  Category,
} from "../hooks/use-categories";
import { Loader } from "lucide-react";


interface SubcategoriesListProps {
  categoryId: string;
}

export const SubcategoriesList = ({ categoryId }: SubcategoriesListProps) => {
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [showInactive, setShowInactive] = useState(false);
  const [formData, setFormData] = useState<
    SubCategoryCreateInput | SubCategoryUpdateInput
  >({
    name: "",
    categoryId: categoryId,
    description: "",
    ageGroups: [],
    sizes: [],
    colors: [],
    isActive: true,
  });

  const { data: subcategories, isLoading } = useSubCategories(
    categoryId,
    showInactive
  );
  const { data: attributes, isLoading: isLoadingAttributes } = useAttributes();
  const createSubCategory = useCreateSubCategory();
  const updateSubCategory = useUpdateSubCategory();
  const deleteSubCategory = useDeleteSubCategory();

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createSubCategory.mutateAsync({
      ...(formData as SubCategoryCreateInput),
      categoryId,
    });
    setIsCreating(false);
    setFormData({
      name: "",
      categoryId,
      description: "",
      ageGroups: [],
      sizes: [],
      colors: [],
      isActive: true,
    });
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      await updateSubCategory.mutateAsync({
        id: isEditing,
        data: formData as SubCategoryUpdateInput,
      });
      setIsEditing(null);
      setFormData({
        name: "",
        categoryId,
        description: "",
        ageGroups: [],
        sizes: [],
        colors: [],
        isActive: true,
      });
    }
  };

  const startEditing = (subcategory: SubCategory) => {
    setIsEditing(subcategory.id);
    setFormData({
      name: subcategory.name,
      categoryId:
        typeof subcategory.categoryId === "string"
          ? subcategory.categoryId
          : (subcategory.categoryId as Category).id,
      description: subcategory.description || "",
      ageGroups: subcategory.ageGroups || [],
      sizes: subcategory.sizes || [],
      colors: subcategory.colors || [],
      isActive: subcategory.isActive,
    });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("დარწმუნებული ხართ, რომ გსურთ ქვეკატეგორიის წაშლა?")) {
      await deleteSubCategory.mutateAsync(id);
    }
  };

  const handleAttributeSelection = (
    type: "ageGroups" | "sizes" | "colors",
    value: string
  ) => {
    const currentValues = formData[type] || [];
    const updatedValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value];

    setFormData({ ...formData, [type]: updatedValues });
  };

  if (isLoading || isLoadingAttributes) {
    return (
      <div className="loading-container">
        <Loader />
      </div>
    );
  }

  return (
    <div className="subcategories-list-container">
      <div className="subcategories-header">
        <h3 className="subcategories-title">ქვეკატეგორიები</h3>
        <div className="subcategories-actions">
          <button
            className="btn-add"
            onClick={() => {
              setIsCreating(true);
              setIsEditing(null);
            }}
          >
            + დამატება
          </button>
          <label className="show-inactive">
            <input
              type="checkbox"
              checked={showInactive}
              onChange={() => setShowInactive(!showInactive)}
            />
            არააქტიურების ჩვენება
          </label>
        </div>
      </div>

      {isCreating && (
        <div className="subcategory-form-container">
          <h4>ახალი ქვეკატეგორიის დამატება</h4>
          <form onSubmit={handleCreateSubmit} className="subcategory-form">
            <div className="form-group">
              <label htmlFor="name">დასახელება*</label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">აღწერა</label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>

            <div className="attributes-section">
              <h5>ატრიბუტები</h5>

              {attributes && (
                <>
                  <div className="attribute-group">
                    <h6>ასაკობრივი ჯგუფები</h6>
                    <div className="attribute-options">
                      {attributes.ageGroups.map((ageGroup) => (
                        <label key={ageGroup} className="attribute-option">
                          <input
                            type="checkbox"
                            checked={(formData.ageGroups || []).includes(
                              ageGroup
                            )}
                            onChange={() =>
                              handleAttributeSelection("ageGroups", ageGroup)
                            }
                          />
                          {ageGroup}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="attribute-group">
                    <h6>ზომები</h6>
                    <div className="attribute-options">
                      {attributes.sizes.map((size) => (
                        <label key={size} className="attribute-option">
                          <input
                            type="checkbox"
                            checked={(formData.sizes || []).includes(size)}
                            onChange={() =>
                              handleAttributeSelection("sizes", size)
                            }
                          />
                          {size}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="attribute-group">
                    <h6>ფერები</h6>
                    <div className="attribute-options">
                      {attributes.colors.map((color) => (
                        <label key={color} className="attribute-option">
                          <input
                            type="checkbox"
                            checked={(formData.colors || []).includes(color)}
                            onChange={() =>
                              handleAttributeSelection("colors", color)
                            }
                          />
                          {color}
                        </label>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="form-group checkbox">
              <label>
                <input
                  type="checkbox"
                  checked={formData.isActive === true}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                />
                აქტიური
              </label>
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className="btn-submit"
                disabled={createSubCategory.isPending}
              >
                {createSubCategory.isPending ? "იტვირთება..." : "დამატება"}
              </button>
              <button
                type="button"
                className="btn-cancel"
                onClick={() => {
                  setIsCreating(false);
                  setFormData({
                    name: "",
                    categoryId,
                    description: "",
                    ageGroups: [],
                    sizes: [],
                    colors: [],
                    isActive: true,
                  });
                }}
              >
                გაუქმება
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="subcategories-list">
        {subcategories && subcategories.length > 0 ? (
          subcategories.map((subcategory) => (
            <div
              key={subcategory.id}
              className={`subcategory-item ${
                !subcategory.isActive ? "inactive" : ""
              }`}
            >
              {isEditing === subcategory.id ? (
                <form
                  onSubmit={handleUpdateSubmit}
                  className="subcategory-form"
                >
                  <div className="form-group">
                    <label htmlFor={`edit-name-${subcategory.id}`}>
                      დასახელება*
                    </label>
                    <input
                      type="text"
                      id={`edit-name-${subcategory.id}`}
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor={`edit-description-${subcategory.id}`}>
                      აღწერა
                    </label>
                    <textarea
                      id={`edit-description-${subcategory.id}`}
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="attributes-section">
                    <h5>ატრიბუტები</h5>

                    {attributes && (
                      <>
                        <div className="attribute-group">
                          <h6>ასაკობრივი ჯგუფები</h6>
                          <div className="attribute-options">
                            {attributes.ageGroups.map((ageGroup) => (
                              <label
                                key={ageGroup}
                                className="attribute-option"
                              >
                                <input
                                  type="checkbox"
                                  checked={(formData.ageGroups || []).includes(
                                    ageGroup
                                  )}
                                  onChange={() =>
                                    handleAttributeSelection(
                                      "ageGroups",
                                      ageGroup
                                    )
                                  }
                                />
                                {ageGroup}
                              </label>
                            ))}
                          </div>
                        </div>

                        <div className="attribute-group">
                          <h6>ზომები</h6>
                          <div className="attribute-options">
                            {attributes.sizes.map((size) => (
                              <label key={size} className="attribute-option">
                                <input
                                  type="checkbox"
                                  checked={(formData.sizes || []).includes(
                                    size
                                  )}
                                  onChange={() =>
                                    handleAttributeSelection("sizes", size)
                                  }
                                />
                                {size}
                              </label>
                            ))}
                          </div>
                        </div>

                        <div className="attribute-group">
                          <h6>ფერები</h6>
                          <div className="attribute-options">
                            {attributes.colors.map((color) => (
                              <label key={color} className="attribute-option">
                                <input
                                  type="checkbox"
                                  checked={(formData.colors || []).includes(
                                    color
                                  )}
                                  onChange={() =>
                                    handleAttributeSelection("colors", color)
                                  }
                                />
                                {color}
                              </label>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="form-group checkbox">
                    <label>
                      <input
                        type="checkbox"
                        checked={formData.isActive === true}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            isActive: e.target.checked,
                          })
                        }
                      />
                      აქტიური
                    </label>
                  </div>

                  <div className="form-actions">
                    <button
                      type="submit"
                      className="btn-submit"
                      disabled={updateSubCategory.isPending}
                    >
                      {updateSubCategory.isPending
                        ? "იტვირთება..."
                        : "განახლება"}
                    </button>
                    <button
                      type="button"
                      className="btn-cancel"
                      onClick={() => {
                        setIsEditing(null);
                        setFormData({
                          name: "",
                          categoryId,
                          description: "",
                          ageGroups: [],
                          sizes: [],
                          colors: [],
                          isActive: true,
                        });
                      }}
                    >
                      გაუქმება
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="subcategory-header">
                    <h4 className="subcategory-name">
                      {subcategory.name}
                      {!subcategory.isActive && (
                        <span className="inactive-label"> (არააქტიური)</span>
                      )}
                    </h4>
                    <div className="subcategory-actions">
                      <button
                        className="btn-edit"
                        onClick={() => startEditing(subcategory)}
                      >
                        რედაქტირება
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(subcategory.id)}
                      >
                        წაშლა
                      </button>
                    </div>
                  </div>

                  {subcategory.description && (
                    <p className="subcategory-description">
                      {subcategory.description}
                    </p>
                  )}

                  <div className="subcategory-attributes">
                    {subcategory.ageGroups &&
                      subcategory.ageGroups.length > 0 && (
                        <div className="attribute-list">
                          <strong>ასაკობრივი ჯგუფები:</strong>{" "}
                          {subcategory.ageGroups.join(", ")}
                        </div>
                      )}

                    {subcategory.sizes && subcategory.sizes.length > 0 && (
                      <div className="attribute-list">
                        <strong>ზომები:</strong> {subcategory.sizes.join(", ")}
                      </div>
                    )}

                    {subcategory.colors && subcategory.colors.length > 0 && (
                      <div className="attribute-list">
                        <strong>ფერები:</strong> {subcategory.colors.join(", ")}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          ))
        ) : (
          <div className="no-subcategories">
            <p>ქვეკატეგორიები არ მოიძებნა</p>
          </div>
        )}
      </div>
    </div>
  );
};
