import { useState } from "react";
import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
  Category,
  CategoryCreateInput,
  CategoryUpdateInput,
} from "../hook/use-categories";
import { SubcategoriesList } from "./subcategories-list";
import { Loader } from "lucide-react";
import "./styles/categories-list.css";

export const CategoriesList = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [showInactive, setShowInactive] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [formData, setFormData] = useState<
    CategoryCreateInput | CategoryUpdateInput
  >({
    name: "",
    description: "",
    isActive: true,
  });

  const { data: categories, isLoading } = useCategories(showInactive);
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createCategory.mutateAsync(formData as CategoryCreateInput);
      setIsCreating(false);
      setFormData({ name: "", description: "", isActive: true });
    } catch (error) {
      console.error("Create category error:", error);
    }
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      try {
        // Only include fields that have changed to minimize the payload
        const updatedFields: CategoryUpdateInput = {};

        // Create a clean update payload with only changed fields
        if (formData.name !== undefined && formData.name.trim() !== "") {
          updatedFields.name = formData.name.trim();
        }

        if (formData.description !== undefined) {
          updatedFields.description = formData.description;
        }

        if (formData.isActive !== undefined) {
          updatedFields.isActive = formData.isActive;
        }

        console.log("Updating with:", updatedFields);

        await updateCategory.mutateAsync({
          id: isEditing,
          data: updatedFields,
        });

        setIsEditing(null);
        setFormData({ name: "", description: "", isActive: true });
      } catch (error) {
        console.error("Update category error:", error);
      }
    }
  };

  const startEditing = (category: Category) => {
    setIsEditing(category.id);
    setFormData({
      name: category.name,
      description: category.description || "",
      isActive: category.isActive,
    });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("დარწმუნებული ხართ, რომ გსურთ კატეგორიის წაშლა?")) {
      try {
        await deleteCategory.mutateAsync(id);
        if (selectedCategory === id) {
          setSelectedCategory(null);
        }
      } catch (error) {
        console.error("Delete category error:", error);
      }
    }
  };

  return (
    <div className="categories-container">
      <div className="categories-header">
        <h2 className="categories-title">კატეგორიები</h2>
        <div className="categories-actions">
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
        <div className="category-form-container">
          <h3>ახალი კატეგორიის დამატება</h3>
          <form onSubmit={handleCreateSubmit} className="category-form">
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
                disabled={createCategory.isPending}
              >
                {createCategory.isPending ? "იტვირთება..." : "დამატება"}
              </button>
              <button
                type="button"
                className="btn-cancel"
                onClick={() => {
                  setIsCreating(false);
                  setFormData({ name: "", description: "", isActive: true });
                }}
              >
                გაუქმება
              </button>
            </div>
          </form>
        </div>
      )}

      {isLoading ? (
        <div className="loading-container">
          <Loader />
        </div>
      ) : (
        <div className="categories-list">
          {categories && categories.length > 0 ? (
            categories.map((category) => (
              <div
                key={category.id}
                className={`category-item ${
                  !category.isActive ? "inactive" : ""
                }`}
              >
                {isEditing === category.id ? (
                  <form onSubmit={handleUpdateSubmit} className="category-form">
                    <div className="form-group">
                      <label htmlFor={`edit-name-${category.id}`}>
                        დასახელება*
                      </label>
                      <input
                        type="text"
                        id={`edit-name-${category.id}`}
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor={`edit-description-${category.id}`}>
                        აღწერა
                      </label>
                      <textarea
                        id={`edit-description-${category.id}`}
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            description: e.target.value,
                          })
                        }
                      />
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
                        disabled={updateCategory.isPending}
                      >
                        {updateCategory.isPending
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
                            description: "",
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
                    <div className="category-header">
                      <h3 className="category-name">
                        {category.name}
                        {!category.isActive && (
                          <span className="inactive-label"> (არააქტიური)</span>
                        )}
                      </h3>
                      <div className="category-actions">
                        <button
                          className="btn-edit"
                          onClick={(e) => {
                            e.stopPropagation();
                            startEditing(category);
                          }}
                        >
                          რედაქტირება
                        </button>
                        <button
                          className="btn-delete"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(category.id);
                          }}
                        >
                          წაშლა
                        </button>
                      </div>
                    </div>
                    {category.description && (
                      <p className="category-description">
                        {category.description}
                      </p>
                    )}

                    {/* Always show subcategories */}
                    <div className="subcategories-container">
                      <SubcategoriesList categoryId={category.id} />
                    </div>
                  </>
                )}
              </div>
            ))
          ) : (
            <div className="no-categories">
              <p>კატეგორიები არ მოიძებნა</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
