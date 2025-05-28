import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { toast } from "react-hot-toast";

// Types for categories
export interface Category {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SubCategory {
  id: string;
  name: string;
  categoryId: string | Category;
  ageGroups: string[];
  sizes: string[];
  colors: string[];
  description?: string;
  isActive: boolean;
}

export interface CategoryCreateInput {
  name: string;
  description?: string;
  isActive?: boolean;
}

export interface CategoryUpdateInput {
  name?: string;
  description?: string;
  isActive?: boolean;
}

export interface SubCategoryCreateInput {
  name: string;
  categoryId: string;
  description?: string;
  ageGroups?: string[];
  sizes?: string[];
  colors?: string[];
  isActive?: boolean;
}

export interface SubCategoryUpdateInput {
  name?: string;
  categoryId?: string;
  description?: string;
  ageGroups?: string[];
  sizes?: string[];
  colors?: string[];
  isActive?: boolean;
}

export interface AttributeInput {
  value: string;
}

// Error interface to properly type error responses
interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

// Fetch categories
export const useCategories = (includeInactive = false) => {
  return useQuery<Category[]>({
    queryKey: ["categories", { includeInactive }],
    queryFn: async () => {
      const response = await apiClient.get(
        `/categories?includeInactive=${includeInactive}`
      );
      return response.data;
    },
  });
};

// Fetch a single category
export const useCategory = (id: string) => {
  return useQuery<Category>({
    queryKey: ["categories", id],
    queryFn: async () => {
      const response = await apiClient.get(`/categories/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
};

// Create a new category
export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CategoryCreateInput) => {
      const response = await apiClient.post("/categories", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("კატეგორია წარმატებით დაემატა");
    },
    onError: (error: unknown) => {
      const err = error as ApiError;
      toast.error(
        err.response?.data?.message || "კატეგორიის დამატება ვერ მოხერხდა"
      );
    },
  });
};

// Update a category
export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: CategoryUpdateInput;
    }) => {
      const response = await apiClient.put(`/categories/${id}`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["categories", variables.id] });
      toast.success("კატეგორია წარმატებით განახლდა");
    },
    onError: (error: unknown) => {
      const err = error as ApiError;
      toast.error(
        err.response?.data?.message || "კატეგორიის განახლება ვერ მოხერხდა"
      );
    },
  });
};

// Delete a category
export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.delete(`/categories/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("კატეგორია წარმატებით წაიშალა");
    },
    onError: (error: unknown) => {
      const err = error as ApiError;
      toast.error(
        err.response?.data?.message || "კატეგორიის წაშლა ვერ მოხერხდა"
      );
    },
  });
};

// Fetch subcategories
export const useSubCategories = (
  categoryId?: string,
  includeInactive = false
) => {
  return useQuery<SubCategory[]>({
    queryKey: ["subcategories", { categoryId, includeInactive }],
    queryFn: async () => {
      const url = categoryId
        ? `/categories/sub?categoryId=${categoryId}&includeInactive=${includeInactive}`
        : `/categories/sub?includeInactive=${includeInactive}`;

      const response = await apiClient.get(url);
      return response.data;
    },
  });
};

// Fetch a single subcategory
export const useSubCategory = (id: string) => {
  return useQuery<SubCategory>({
    queryKey: ["subcategories", id],
    queryFn: async () => {
      const response = await apiClient.get(`/categories/sub/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
};

// Create a new subcategory
export const useCreateSubCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: SubCategoryCreateInput) => {
      const response = await apiClient.post("/categories/sub", data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["subcategories"] });
      if (variables.categoryId) {
        queryClient.invalidateQueries({
          queryKey: ["subcategories", { categoryId: variables.categoryId }],
        });
      }
      toast.success("ქვეკატეგორია წარმატებით დაემატა");
    },
    onError: (error: unknown) => {
      const err = error as ApiError;
      toast.error(
        err.response?.data?.message || "ქვეკატეგორიის დამატება ვერ მოხერხდა"
      );
    },
  });
};

// Update a subcategory
export const useUpdateSubCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: SubCategoryUpdateInput;
    }) => {
      const response = await apiClient.put(`/categories/sub/${id}`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["subcategories"] });
      queryClient.invalidateQueries({
        queryKey: ["subcategories", variables.id],
      });
      toast.success("ქვეკატეგორია წარმატებით განახლდა");
    },
    onError: (error: unknown) => {
      const err = error as ApiError;
      toast.error(
        err.response?.data?.message || "ქვეკატეგორიის განახლება ვერ მოხერხდა"
      );
    },
  });
};

// Delete a subcategory
export const useDeleteSubCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.delete(`/categories/sub/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subcategories"] });
      toast.success("ქვეკატეგორია წარმატებით წაიშალა");
    },
    onError: (error: unknown) => {
      const err = error as ApiError;
      toast.error(
        err.response?.data?.message || "ქვეკატეგორიის წაშლა ვერ მოხერხდა"
      );
    },
  });
};

// Fetch all attributes (colors, sizes, age groups)
export const useAttributes = () => {
  return useQuery<{
    colors: string[];
    sizes: string[];
    ageGroups: string[];
  }>({
    queryKey: ["attributes"],
    queryFn: async () => {
      const response = await apiClient.get("/categories/attributes");
      return response.data;
    },
  });
};

// Colors
export const useColors = () => {
  return useQuery<string[]>({
    queryKey: ["colors"],
    queryFn: async () => {
      const response = await apiClient.get("/categories/attributes/colors");
      return response.data;
    },
  });
};

export const useCreateColor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: AttributeInput) => {
      const response = await apiClient.post(
        "/categories/attributes/colors",
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["colors"] });
      queryClient.invalidateQueries({ queryKey: ["attributes"] });
      toast.success("ფერი წარმატებით დაემატა");
    },
    onError: (error: unknown) => {
      const err = error as ApiError;
      toast.error(err.response?.data?.message || "ფერის დამატება ვერ მოხერხდა");
    },
  });
};

export const useUpdateColor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      color,
      data,
    }: {
      color: string;
      data: AttributeInput;
    }) => {
      const response = await apiClient.put(
        `/categories/attributes/colors/${color}`,
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["colors"] });
      queryClient.invalidateQueries({ queryKey: ["attributes"] });
      toast.success("ფერი წარმატებით განახლდა");
    },
    onError: (error: unknown) => {
      const err = error as ApiError;
      toast.error(
        err.response?.data?.message || "ფერის განახლება ვერ მოხერხდა"
      );
    },
  });
};

export const useDeleteColor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (color: string) => {
      const response = await apiClient.delete(
        `/categories/attributes/colors/${color}`
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["colors"] });
      queryClient.invalidateQueries({ queryKey: ["attributes"] });
      toast.success("ფერი წარმატებით წაიშალა");
    },
    onError: (error: unknown) => {
      const err = error as ApiError;
      toast.error(err.response?.data?.message || "ფერის წაშლა ვერ მოხერხდა");
    },
  });
};

// Sizes
export const useSizes = () => {
  return useQuery<string[]>({
    queryKey: ["sizes"],
    queryFn: async () => {
      const response = await apiClient.get("/categories/attributes/sizes");
      return response.data;
    },
  });
};

export const useCreateSize = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: AttributeInput) => {
      const response = await apiClient.post(
        "/categories/attributes/sizes",
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sizes"] });
      queryClient.invalidateQueries({ queryKey: ["attributes"] });
      toast.success("ზომა წარმატებით დაემატა");
    },
    onError: (error: unknown) => {
      const err = error as ApiError;
      toast.error(err.response?.data?.message || "ზომის დამატება ვერ მოხერხდა");
    },
  });
};

export const useUpdateSize = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      size,
      data,
    }: {
      size: string;
      data: AttributeInput;
    }) => {
      const response = await apiClient.put(
        `/categories/attributes/sizes/${size}`,
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sizes"] });
      queryClient.invalidateQueries({ queryKey: ["attributes"] });
      toast.success("ზომა წარმატებით განახლდა");
    },
    onError: (error: unknown) => {
      const err = error as ApiError;
      toast.error(
        err.response?.data?.message || "ზომის განახლება ვერ მოხერხდა"
      );
    },
  });
};

export const useDeleteSize = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (size: string) => {
      const response = await apiClient.delete(
        `/categories/attributes/sizes/${size}`
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sizes"] });
      queryClient.invalidateQueries({ queryKey: ["attributes"] });
      toast.success("ზომა წარმატებით წაიშალა");
    },
    onError: (error: unknown) => {
      const err = error as ApiError;
      toast.error(err.response?.data?.message || "ზომის წაშლა ვერ მოხერხდა");
    },
  });
};

// Age Groups
export const useAgeGroups = () => {
  return useQuery<string[]>({
    queryKey: ["ageGroups"],
    queryFn: async () => {
      const response = await apiClient.get("/categories/attributes/age-groups");
      return response.data;
    },
  });
};

export const useCreateAgeGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: AttributeInput) => {
      const response = await apiClient.post(
        "/categories/attributes/age-groups",
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ageGroups"] });
      queryClient.invalidateQueries({ queryKey: ["attributes"] });
      toast.success("ასაკობრივი ჯგუფი წარმატებით დაემატა");
    },
    onError: (error: unknown) => {
      const err = error as ApiError;
      toast.error(
        err.response?.data?.message || "ასაკობრივი ჯგუფის დამატება ვერ მოხერხდა"
      );
    },
  });
};

export const useUpdateAgeGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      ageGroup,
      data,
    }: {
      ageGroup: string;
      data: AttributeInput;
    }) => {
      const response = await apiClient.put(
        `/categories/attributes/age-groups/${ageGroup}`,
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ageGroups"] });
      queryClient.invalidateQueries({ queryKey: ["attributes"] });
      toast.success("ასაკობრივი ჯგუფი წარმატებით განახლდა");
    },
    onError: (error: unknown) => {
      const err = error as ApiError;
      toast.error(
        err.response?.data?.message ||
          "ასაკობრივი ჯგუფის განახლება ვერ მოხერხდა"
      );
    },
  });
};

export const useDeleteAgeGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ageGroup: string) => {
      const response = await apiClient.delete(
        `/categories/attributes/age-groups/${ageGroup}`
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ageGroups"] });
      queryClient.invalidateQueries({ queryKey: ["attributes"] });
      toast.success("ასაკობრივი ჯგუფი წარმატებით წაიშალა");
    },
    onError: (error: unknown) => {
      const err = error as ApiError;
      toast.error(
        err.response?.data?.message || "ასაკობრივი ჯგუფის წაშლა ვერ მოხერხდა"
      );
    },
  });
};
