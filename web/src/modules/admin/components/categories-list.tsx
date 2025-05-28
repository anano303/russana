import { useState } from "react";
import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
  Category,
  CategoryCreateInput,
  CategoryUpdateInput,
} from "../hooks/use-categories";
import { SubcategoriesList } from "./subcategories-list";
import { Loader } from "lucide-react";

export const CategoriesList = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [showInactive, setShowInactive] = useState(false);
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

  const handleCategorySelect = (id: string) => {
    setSelectedCategory(id === selectedCategory ? null : id);
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
                } ${selectedCategory === category.id ? "selected" : ""}`}
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
                    <div
                      className="category-header"
                      onClick={() => handleCategorySelect(category.id)}
                    >
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

                    {selectedCategory === category.id && (
                      <div className="subcategories-container">
                        <SubcategoriesList categoryId={category.id} />
                      </div>
                    )}
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

      <style jsx>{`
        .categories-container {
          padding: 20px 0;
        }

        .categories-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .categories-title {
          font-size: 20px;
          color: #333;
          margin: 0;
        }

        .categories-actions {
          display: flex;
          align-items: center;
          gap: 15px;
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

        .show-inactive {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: #666;
        }

        .category-form-container {
          background-color: #f8f8f8;
          padding: 20px;
          border-radius: 6px;
          margin-bottom: 20px;
          border: 1px solid #ddd;
        }

        .category-form {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .form-group label {
          font-size: 14px;
          color: #555;
        }

        .form-group input[type="text"],
        .form-group textarea {
          padding: 8px 12px;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 14px;
          width: 100%;
        }

        .form-group textarea {
          min-height: 80px;
          resize: vertical;
        }

        .form-group.checkbox {
          flex-direction: row;
          align-items: center;
        }

        .form-actions {
          display: flex;
          gap: 10px;
          margin-top: 10px;
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

        .categories-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .category-item {
          border: 1px solid #ddd;
          border-radius: 6px;
          padding: 16px;
          background-color: #fff;
        }

        .category-item.inactive {
          background-color: #f9f9f9;
        }

        .category-item.selected {
          border-color: #cf0a0a;
        }

        .category-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
        }

        .category-name {
          font-size: 18px;
          color: #333;
          margin: 0;
        }

        .inactive-label {
          color: #999;
          font-weight: normal;
          font-size: 14px;
        }

        .category-actions {
          display: flex;
          gap: 10px;
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

        .category-description {
          margin-top: 10px;
          font-size: 14px;
          color: #666;
        }

        .no-categories {
          text-align: center;
          padding: 40px 0;
          color: #999;
        }

        .subcategories-container {
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px dashed #ccc;
        }
      `}</style>
    </div>
  );
};
