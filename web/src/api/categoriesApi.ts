import api from "./api";

// Main categories
export const getCategories = () => api.get("/v1/categories");
export const getCategoryById = (id: string) => api.get(`/v1/categories/${id}`);
export const createCategory = (data: any) => api.post("/v1/categories", data);
export const updateCategory = (id: string, data: any) =>
  api.put(`/v1/categories/${id}`, data);
export const deleteCategory = (id: string) =>
  api.delete(`/v1/categories/${id}`);

// Subcategories
export const getSubcategories = (categoryId?: string) =>
  categoryId
    ? api.get(`/v1/categories/sub?categoryId=${categoryId}`)
    : api.get("/v1/categories/sub");

export const getSubcategoryById = (id: string) =>
  api.get(`/v1/categories/sub/${id}`);
export const createSubcategory = (data: any) =>
  api.post("/v1/categories/sub", data);
export const updateSubcategory = (id: string, data: any) =>
  api.put(`/v1/categories/sub/${id}`, data);
export const deleteSubcategory = (id: string) =>
  api.delete(`/v1/categories/sub/${id}`);

// Attribute management
export const getAllAttributes = () => api.get("/v1/categories/attributes/all");

// Colors
export const getColors = () => api.get("/v1/categories/attributes/colors");
export const createColor = (value: string) =>
  api.post("/v1/categories/attributes/colors", { value });
export const updateColor = (color: string, value: string) =>
  api.put(`/v1/categories/attributes/colors/${color}`, { value });
export const deleteColor = (color: string) =>
  api.delete(`/v1/categories/attributes/colors/${color}`);

// Sizes
export const getSizes = () => api.get("/v1/categories/attributes/sizes");
export const createSize = (value: string) =>
  api.post("/v1/categories/attributes/sizes", { value });
export const updateSize = (size: string, value: string) =>
  api.put(`/v1/categories/attributes/sizes/${size}`, { value });
export const deleteSize = (size: string) =>
  api.delete(`/v1/categories/attributes/sizes/${size}`);

// Age groups
export const getAgeGroups = () =>
  api.get("/v1/categories/attributes/age-groups");
export const createAgeGroup = (value: string) =>
  api.post("/v1/categories/attributes/age-groups", { value });
export const updateAgeGroup = (ageGroup: string, value: string) =>
  api.put(`/v1/categories/attributes/age-groups/${ageGroup}`, { value });
export const deleteAgeGroup = (ageGroup: string) =>
  api.delete(`/v1/categories/attributes/age-groups/${ageGroup}`);
