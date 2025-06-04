"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { productSchema } from "@/modules/products/validation/product";
import { ZodError } from "zod";
import { ProductFormData as BaseProductFormData } from "@/modules/products/validation/product";
import { useLanguage } from "@/hooks/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import "./CreateProductForm.css";
import Image from "next/image";
import { getAccessToken } from "@/lib/auth";
import { useUser } from "@/modules/auth/hooks/use-user";
import { Category, SubCategory } from "@/types";
import { useStocks } from "@/hooks/useStocks";

// Extended ProductFormData to include all needed properties
interface ProductFormData extends BaseProductFormData {
  _id?: string;
  nameEn?: string;
  descriptionEn?: string;
  mainCategory?: string | { name: string; id?: string; _id?: string };
  subCategory?: string | { name: string; id?: string; _id?: string };
  ageGroups?: string[];
  sizes?: string[];
  colors?: string[];
  categoryId?: string;
  categoryStructure?: {
    main: string;
    sub: string;
    ageGroup?: string;
  };
}

interface CreateProductFormProps {
  initialData?: ProductFormData;
  onSuccess?: (data: {
    id: string;
    name: string;
    [key: string]: string | number | boolean | null | undefined;
  }) => void;
  isEdit?: boolean;
}

export function CreateProductForm({
  initialData,
  onSuccess,
  isEdit = !!initialData?._id,
}: CreateProductFormProps) {
  const { language } = useLanguage();
  const router = useRouter();
  const { user } = useUser();
  const isSeller = user?.role?.toLowerCase() === "seller";

  const [errors, setErrors] = useState<
    Partial<Record<keyof ProductFormData, string>>
  >({});
  const [formData, setFormData] = useState<ProductFormData & { _id?: string }>(
    initialData || {
      name: "",
      nameEn: "",
      price: 0,
      description: "",
      descriptionEn: "",
      images: [],
      brand: "",
      category: "",
      subcategory: "",
      countInStock: 0,
      brandLogo: undefined,
    }
  );

  // State for new category structure
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("");
  const [selectedAgeGroups, setSelectedAgeGroups] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);

  const [availableAgeGroups, setAvailableAgeGroups] = useState<string[]>([]);
  const [availableSizes, setAvailableSizes] = useState<string[]>([]);
  const [availableColors, setAvailableColors] = useState<string[]>([]);

  const [deliveryType, setDeliveryType] = useState<"SELLER" | "SoulArt">(
    "SoulArt"
  );
  const [minDeliveryDays, setMinDeliveryDays] = useState("");
  const [maxDeliveryDays, setMaxDeliveryDays] = useState("");

  const [pending, setPending] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetch categories
  const { data: categories, isLoading: isCategoriesLoading } = useQuery<
    Category[]
  >({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/categories?includeInactive=false`
      );
      return response.json();
    },
  });

  // Fetch subcategories based on selected category
  const { data: subcategories, isLoading: isSubcategoriesLoading } = useQuery<
    SubCategory[]
  >({
    queryKey: ["subcategories", selectedCategory],
    queryFn: async () => {
      if (!selectedCategory) return [];
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/subcategories?categoryId=${selectedCategory}&includeInactive=false`
      );
      return response.json();
    },
    enabled: !!selectedCategory,
  });

  // Update available attributes when subcategory changes
  useEffect(() => {
    if (subcategories && selectedSubcategory) {
      const subcategory = subcategories.find(
        (sub) => sub.id === selectedSubcategory
      );
      if (subcategory) {
        setAvailableAgeGroups(subcategory.ageGroups || []);
        setAvailableSizes(subcategory.sizes || []);
        setAvailableColors(subcategory.colors || []);
      }
    }
  }, [subcategories, selectedSubcategory]);

  // Auto-fill seller info when user data loads
  useEffect(() => {
    if (user && isSeller && !isEdit) {
      setFormData((prevData) => ({
        ...prevData,
        brand: user.name || user.storeName || "",
        brandLogo: user.storeLogo || undefined,
      }));
    }
  }, [user, isSeller, isEdit]);

  useEffect(() => {
    if (initialData) {
      // Basic form data setup
      setFormData((prev) => ({
        ...prev,
        _id: initialData._id,
        name: initialData.name || "",
        nameEn: initialData.nameEn || "",
        brand: initialData.brand || "",
        brandLogo:
          typeof initialData.brandLogo === "string"
            ? initialData.brandLogo
            : undefined,
        category: initialData.category || "",
        images: initialData.images || [],
        description: initialData.description || "",
        descriptionEn: initialData.descriptionEn || "",
        price: initialData.price || 0,
        countInStock: initialData.countInStock || 0,
        ageGroups: initialData.ageGroups || [],
        sizes: initialData.sizes || [],
        colors: initialData.colors || [],
      }));

      if (initialData.deliveryType) {
        setDeliveryType(initialData.deliveryType as "SELLER" | "SoulArt");
      }
      if (initialData.minDeliveryDays) {
        setMinDeliveryDays(initialData.minDeliveryDays.toString());
      }
      if (initialData.maxDeliveryDays) {
        setMaxDeliveryDays(initialData.maxDeliveryDays.toString());
      }

      // Extract category ID correctly, handling both object and string formats
      if (initialData.mainCategory) {
        const categoryId =
          typeof initialData.mainCategory === "object"
            ? initialData.mainCategory._id || initialData.mainCategory.id
            : initialData.mainCategory;

        setSelectedCategory(String(categoryId || ""));
      } else if (initialData.categoryId) {
        setSelectedCategory(String(initialData.categoryId || ""));
      }
    }
  }, [initialData]);

  // Add a separate effect for handling subcategory after category is set and subcategories are loaded
  useEffect(() => {
    // Only run this effect when editing and we have both initialData and subcategories loaded
    if (
      initialData &&
      selectedCategory &&
      subcategories &&
      subcategories.length > 0
    ) {
      // Extract subcategory ID correctly, handling both object and string formats
      if (initialData.subCategory) {
        const subcategoryId =
          typeof initialData.subCategory === "object"
            ? initialData.subCategory._id || initialData.subCategory.id
            : initialData.subCategory;

        setSelectedSubcategory(String(subcategoryId || ""));
      } else if (initialData.subcategory) {
        setSelectedSubcategory(String(initialData.subcategory || ""));
      }
    }
  }, [initialData, selectedCategory, subcategories]);

  // Reset form to initial state
  const resetForm = () => {
    setFormData({
      name: "",
      nameEn: "",
      price: 0,
      description: "",
      descriptionEn: "",
      images: [],
      brand: "",
      category: "",
      subcategory: "",
      countInStock: 0,
      brandLogo: undefined,
    });
    setErrors({});
    setServerError(null);
    setSuccess(null);

    setSelectedCategory("");
    setSelectedSubcategory("");
    setSelectedAgeGroups([]);
    setSelectedSizes([]);
    setSelectedColors([]);

    setDeliveryType("SoulArt");
    setMinDeliveryDays("");
    setMaxDeliveryDays("");
  };

  const validateField = (field: keyof ProductFormData, value: unknown) => {
    try {
      // Check if the field exists in productSchema before validating
      if (field in productSchema.shape) {
        const shape = productSchema.shape as Record<
          string,
          { parse(value: unknown): unknown }
        >;
        shape[field].parse(value);
      }
      setErrors((prev) => ({ ...prev, [field]: undefined }));
      return true;
    } catch (error) {
      if (error instanceof ZodError) {
        setErrors((prev) => ({ ...prev, [field]: error.errors[0].message }));
      }
      return false;
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "price" || name === "countInStock" ? Number(value) : value,
    }));
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const categoryId = e.target.value;
    setSelectedCategory(categoryId);
    setSelectedSubcategory("");
    setSelectedAgeGroups([]);
    setSelectedSizes([]);
    setSelectedColors([]);
    setAvailableAgeGroups([]);
    setAvailableSizes([]);
    setAvailableColors([]);
  };

  const handleSubcategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const subcategoryId = e.target.value;
    setSelectedSubcategory(subcategoryId);
    setSelectedAgeGroups([]);
    setSelectedSizes([]);
    setSelectedColors([]);
  };

  const handleAttributeChange = (
    type: "ageGroups" | "sizes" | "colors",
    value: string
  ) => {
    if (type === "ageGroups") {
      setSelectedAgeGroups((prev) =>
        prev.includes(value)
          ? prev.filter((item) => item !== value)
          : [...prev, value]
      );
    } else if (type === "sizes") {
      setSelectedSizes((prev) =>
        prev.includes(value)
          ? prev.filter((item) => item !== value)
          : [...prev, value]
      );
    } else if (type === "colors") {
      setSelectedColors((prev) =>
        prev.includes(value)
          ? prev.filter((item) => item !== value)
          : [...prev, value]
      );
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files) {
      const newImages = Array.from(files);
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...newImages],
      }));
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setPending(true);
    setServerError(null);
    setSuccess(null);

    try {
      // Use validateField for validating form fields
      const isNameValid = validateField("name", formData.name);
      const isPriceValid = validateField("price", formData.price);
      const isDescriptionValid = validateField(
        "description",
        formData.description
      );

      if (!isNameValid || !isPriceValid || !isDescriptionValid) {
        setPending(false);
        return;
      }

      // Validate required fields
      if (!selectedCategory) {
        setServerError("გთხოვთ აირჩიოთ კატეგორია");
        setPending(false);
        return;
      }

      if (!selectedSubcategory) {
        setServerError("გთხოვთ აირჩიოთ ქვეკატეგორია");
        setPending(false);
        return;
      }

      const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
      if (
        formData.images.some(
          (image) => image instanceof File && !allowedTypes.includes(image.type)
        )
      ) {
        setErrors((prev) => ({
          ...prev,
          images: "მხოლოდ JPG, JPEG და PNG ფორმატის სურათებია დაშვებული",
        }));
        setPending(false);
        return;
      }

      // Verify we have at least one image
      if (formData.images.length === 0) {
        setErrors((prev) => ({
          ...prev,
          images: "მინიმუმ ერთი სურათი მაინც უნდა აიტვირთოს",
        }));
        setPending(false);
        return;
      }

      if (deliveryType === "SELLER" && (!minDeliveryDays || !maxDeliveryDays)) {
        setServerError(
          "გთხოვთ მიუთითოთ მიწოდების დრო თუ გამყიდველი ასრულებს მიწოდებას."
        );
        setPending(false);
        return;
      }

      const token = getAccessToken();
      if (!token) {
        setServerError("ავტორიზაცია ვერ მოხერხდა. გთხოვთ, შეხვიდეთ თავიდან.");
        setPending(false);
        setTimeout(() => {
          window.location.href = "/login?redirect=/admin/products";
        }, 2000);
        return;
      }

      const formDataToSend = new FormData();

      // Add basic form fields
      formDataToSend.append("name", formData.name);
      formDataToSend.append("nameEn", formData.nameEn || "");
      formDataToSend.append("price", String(formData.price));
      formDataToSend.append("description", formData.description);
      formDataToSend.append("descriptionEn", formData.descriptionEn || "");
      formDataToSend.append("countInStock", String(totalCount));

      // Add new category structure - ensure we're sending strings, not objects
      formDataToSend.append("mainCategory", selectedCategory);
      formDataToSend.append("subCategory", selectedSubcategory);

      // Add selected attributes
      if (selectedAgeGroups.length > 0) {
        formDataToSend.append("ageGroups", JSON.stringify(selectedAgeGroups));
      }

      if (selectedSizes.length > 0) {
        formDataToSend.append("sizes", JSON.stringify(selectedSizes));
      }

      if (selectedColors.length > 0) {
        formDataToSend.append("colors", JSON.stringify(selectedColors));
      }

      if (stocks.length > 0) {
        formDataToSend.append("variants", JSON.stringify(stocks));
      }

      // Handle brand name
      if (isSeller) {
        formDataToSend.append(
          "brand",
          user?.name || user?.storeName || formData.brand
        );
      } else {
        formDataToSend.append("brand", formData.brand);
      }

      // SIMPLIFIED logo handling - THIS IS THE FIX
      // For new uploads (File objects)
      if (formData.brandLogo instanceof File) {
        formDataToSend.append("brandLogo", formData.brandLogo);
      }
      // For existing logo URLs - just pass the URL as a string
      else if (typeof formData.brandLogo === "string" && formData.brandLogo) {
        formDataToSend.append("brandLogoUrl", formData.brandLogo);
      }
      // For sellers with profiles - use their store logo
      else if (isSeller && user?.storeLogo) {
        formDataToSend.append("brandLogoUrl", user.storeLogo);
      }

      // Add delivery type
      formDataToSend.append("deliveryType", deliveryType);

      // Add delivery days if SELLER type
      if (deliveryType === "SELLER") {
        formDataToSend.append("minDeliveryDays", minDeliveryDays);
        formDataToSend.append("maxDeliveryDays", maxDeliveryDays);
      }

      // Handle images - separate existing images from new ones
      const existingImages: string[] = [];
      const newFiles: File[] = [];

      formData.images.forEach((image) => {
        if (typeof image === "string") {
          existingImages.push(image);
        } else if (image instanceof File) {
          newFiles.push(image);
        }
      });

      // Add existing images as JSON array
      if (existingImages.length > 0) {
        formDataToSend.append("existingImages", JSON.stringify(existingImages));
      }

      // Add new image files
      if (newFiles.length > 0) {
        newFiles.forEach((file) => {
          formDataToSend.append("images", file);
        });
      } else if (existingImages.length === 0) {
        // If no images are provided at all, throw an error
        setErrors((prev) => ({
          ...prev,
          images: "მინიმუმ ერთი სურათი მაინც უნდა აიტვირთოს",
        }));
        setPending(false);
        return;
      }

      // Double check that we're sending either existingImages or new images
      const hasImages =
        (formDataToSend.has("existingImages") &&
          JSON.parse(formDataToSend.get("existingImages") as string).length >
            0) ||
        formDataToSend.getAll("images").length > 0;

      if (!hasImages) {
        setErrors((prev) => ({
          ...prev,
          images: "მინიმუმ ერთი სურათი მაინც უნდა აიტვირთოს",
        }));
        setPending(false);
        return;
      }

      const method = isEdit ? "PUT" : "POST";
      const endpoint = isEdit ? `/products/${formData._id}` : "/products";

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`,
        {
          method,
          body: formDataToSend,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        let errorMessage = "ნამუშევრის დამატება/განახლება ვერ მოხერხდა";
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          errorMessage = `Error: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      const successMessage = isEdit
        ? "პროდუქტი წარმატებით განახლდა!"
        : "პროდუქტი წარმატებით დაემატა!";
      setSuccess(successMessage);

      toast({
        title: isEdit ? "პროდუქტი განახლდა" : "პროდუქტი დაემატა",
        description: "წარმატებით!",
      });

      if (!isEdit) {
        resetForm();
      }

      if (onSuccess) {
        // Set a flag to force refresh when we return to the products list
        sessionStorage.setItem("returnFromEdit", "true");
        onSuccess(data);
      } else {
        // Also set the flag for direct navigation
        sessionStorage.setItem("returnFromEdit", "true");
        setTimeout(() => {
          router.push("/admin/products");
        }, 1500);
      }
    } catch (error) {
      console.error("Error:", error);
      setServerError(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setPending(false);
    }
  };

  // Also add a useEffect to fetch subcategory details when selectedSubcategory changes
  useEffect(() => {
    if (selectedSubcategory && subcategories) {
      const subcategory = subcategories.find(
        (sub) => String(sub.id) === String(selectedSubcategory)
      );

      if (subcategory) {
        // Set available options based on subcategory
        setAvailableAgeGroups(subcategory.ageGroups || []);
        setAvailableSizes(subcategory.sizes || []);
        setAvailableColors(subcategory.colors || []);

        // If we have initial data with attribute selections, make sure they're valid
        // for this subcategory before applying them
        if (initialData) {
          if (initialData.ageGroups && Array.isArray(initialData.ageGroups)) {
            const validAgeGroups = initialData.ageGroups.filter((ag) =>
              subcategory.ageGroups.includes(ag)
            );
            setSelectedAgeGroups(validAgeGroups);
          }

          if (initialData.sizes && Array.isArray(initialData.sizes)) {
            const validSizes = initialData.sizes.filter((size) =>
              subcategory.sizes.includes(size)
            );
            setSelectedSizes(validSizes);
          }

          if (initialData.colors && Array.isArray(initialData.colors)) {
            const validColors = initialData.colors.filter((color) =>
              subcategory.colors.includes(color)
            );
            setSelectedColors(validColors);
          }
        }
      }
    }
  }, [selectedSubcategory, subcategories, initialData]);

  // Add a cleanup effect when the form unmounts
  useEffect(() => {
    return () => {
      // Clean up any lingering edit flags
      const returnFromEdit = sessionStorage.getItem("returnFromEdit");
      if (returnFromEdit) {
        sessionStorage.removeItem("returnFromEdit");
      }
    };
  }, []);

  const { stocks, totalCount, setStockCount } = useStocks({
    attributes: [selectedAgeGroups, selectedSizes, selectedColors],
  });

  return (
    <div className="create-product-form">
      {success && (
        <div className="success-message">
          <p className="text-center">{success}</p>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        {serverError && (
          <div className="server-error">
            <p className="create-product-error text-center">{serverError}</p>
          </div>
        )}
        <div>
          <label htmlFor="name">პროდუქტის სახელი (ქართულად)</label>
          <input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="create-product-input"
            required
          />
          {errors.name && <p className="create-product-error">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="nameEn">პროდუქტის სახელი (ინგლისურად)</label>
          <input
            id="nameEn"
            name="nameEn"
            value={formData.nameEn}
            onChange={handleChange}
            className="create-product-input"
            placeholder="Product name in English (optional)"
          />
          {errors.nameEn && (
            <p className="create-product-error">{errors.nameEn}</p>
          )}
        </div>

        <div>
          <label htmlFor="description">აღწერა (ქართულად)</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="create-product-textarea"
            required
          />
          {errors.description && (
            <p className="create-product-error">{errors.description}</p>
          )}
        </div>

        <div>
          <label htmlFor="descriptionEn">აღწერა (ინგლისურად)</label>
          <textarea
            id="descriptionEn"
            name="descriptionEn"
            value={formData.descriptionEn}
            onChange={handleChange}
            className="create-product-textarea"
            placeholder="Product description in English (optional)"
          />
          {errors.descriptionEn && (
            <p className="create-product-error">{errors.descriptionEn}</p>
          )}
        </div>

        <div>
          <label htmlFor="price">ფასი</label>
          <input
            id="price"
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            className="create-product-input"
            required
          />
          {errors.price && (
            <p className="create-product-error">{errors.price}</p>
          )}
        </div>

        {/* New Category Structure */}
        <div>
          <label htmlFor="category">კატეგორია</label>
          <select
            id="category"
            name="category"
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="create-product-select"
            required
            disabled={isCategoriesLoading}
          >
            <option value="">
              {isCategoriesLoading ? "იტვირთება..." : "აირჩიეთ კატეგორია"}
            </option>
            {categories?.map((category) => (
              <option key={category.id} value={category.id}>
                {language === "en" && category.nameEn
                  ? category.nameEn
                  : category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="subcategory">ქვეკატეგორია</label>
          <select
            id="subcategory"
            name="subcategory"
            value={selectedSubcategory}
            onChange={handleSubcategoryChange}
            className="create-product-select"
            required
            disabled={!selectedCategory || isSubcategoriesLoading}
          >
            <option value="">აირჩიეთ ქვეკატეგორია</option>
            {subcategories?.map((subcategory) => (
              <option key={subcategory.id} value={subcategory.id}>
                {language === "en" && subcategory.nameEn
                  ? subcategory.nameEn
                  : subcategory.name}
              </option>
            ))}
          </select>
        </div>

        {/* Attributes Section */}
        {selectedSubcategory && (
          <div className="attributes-section">
            {availableAgeGroups.length > 0 && (
              <div className="attribute-group">
                <h3>ასაკობრივი ჯგუფები</h3>
                <div className="attribute-options">
                  {availableAgeGroups.map((ageGroup) => (
                    <label key={ageGroup} className="attribute-checkbox">
                      <input
                        type="checkbox"
                        checked={selectedAgeGroups.includes(ageGroup)}
                        onChange={() =>
                          handleAttributeChange("ageGroups", ageGroup)
                        }
                      />
                      <span>
                        {language === "en"
                          ? ageGroup === "ADULTS"
                            ? "Adults"
                            : ageGroup === "KIDS"
                            ? "Kids"
                            : ageGroup
                          : ageGroup === "ADULTS"
                          ? "უფროსები"
                          : ageGroup === "KIDS"
                          ? "ბავშვები"
                          : ageGroup}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {availableSizes.length > 0 && (
              <div className="attribute-group">
                <h3>ზომები</h3>
                <div className="attribute-options">
                  {availableSizes.map((size) => (
                    <label key={size} className="attribute-checkbox">
                      <input
                        type="checkbox"
                        checked={selectedSizes.includes(size)}
                        onChange={() => handleAttributeChange("sizes", size)}
                      />
                      <span>{size}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {availableColors.length > 0 && (
              <div className="attribute-group">
                <h3>ფერები</h3>
                <div className="attribute-options">
                  {availableColors.map((color) => (
                    <label key={color} className="attribute-checkbox">
                      <input
                        type="checkbox"
                        checked={selectedColors.includes(color)}
                        onChange={() => handleAttributeChange("colors", color)}
                      />
                      <span>{color}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {stocks &&
          stocks.map((stock) => (
            <div
              key={`${stock.ageGroup} - ${stock.size} - ${stock.color}`}
              className="stock-info"
            >
              <label>
                {stock.ageGroup} - {stock.size} - {stock.color}
              </label>
              <input
                id="countInStock"
                name="countInStock"
                type="number"
                value={stock.stock}
                onChange={(elem) => setStockCount(stock, +elem.target.value)}
                min={0}
                required
              />
            </div>
          ))}

        <div>
          <label htmlFor="countInStock">რაოდენობა მარაგში</label>
          <input
            id="countInStock"
            name="countInStock"
            type="number"
            disabled
            value={totalCount}
            onChange={handleChange}
            min={0}
            required
          />
          {errors.countInStock && (
            <p className="create-product-error">{errors.countInStock}</p>
          )}
        </div>

        {/* Delivery Section */}
        <div className="delivery-section">
          <h3>მიწოდების ტიპი</h3>
          <div className="delivery-type-options">
            <label>
              <input
                type="radio"
                name="deliveryType"
                value="SoulArt"
                checked={deliveryType === "SoulArt"}
                onChange={() => setDeliveryType("SoulArt")}
              />
              <span>SoulArt მიწოდება</span>
            </label>
            <label>
              <input
                type="radio"
                name="deliveryType"
                value="SELLER"
                checked={deliveryType === "SELLER"}
                onChange={() => setDeliveryType("SELLER")}
              />
              <span>გამყიდველის მიწოდება</span>
            </label>
          </div>

          {deliveryType === "SELLER" && (
            <div className="delivery-days">
              <div>
                <label htmlFor="minDeliveryDays">მინიმუმ დღეები</label>
                <input
                  id="minDeliveryDays"
                  type="number"
                  value={minDeliveryDays}
                  onChange={(e) => setMinDeliveryDays(e.target.value)}
                  min={1}
                  required
                />
              </div>
              <div>
                <label htmlFor="maxDeliveryDays">მაქსიმუმ დღეები</label>
                <input
                  id="maxDeliveryDays"
                  type="number"
                  value={maxDeliveryDays}
                  onChange={(e) => setMaxDeliveryDays(e.target.value)}
                  min={1}
                  required
                />
              </div>
            </div>
          )}
        </div>

        <div>
          <label htmlFor="brand">ბრენდი</label>
          <input
            id="brand"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            placeholder="Enter brand name"
            className={"create-product-input"}
            required
          />
          {errors.brand && (
            <p className="create-product-error">{errors.brand}</p>
          )}
        </div>

        <div>
          <label htmlFor="images">პროდუქტის სურათები</label>
          <input
            id="images"
            name="images"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="create-product-file"
            multiple
          />
          {formData.images.length === 0 && (
            <p className="upload-reminder">
              გთხოვთ აირჩიოთ მინიმუმ ერთი სურათი
            </p>
          )}
          <div className="image-preview-container">
            {formData.images.map((image, index) => {
              const imageUrl =
                image instanceof File ? URL.createObjectURL(image) : image;
              return (
                <div key={index} className="image-preview">
                  <Image
                    loader={({ src }) => src}
                    src={imageUrl}
                    alt="Product preview"
                    width={100}
                    height={100}
                    unoptimized
                    className="preview-image"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="remove-image-button"
                  >
                    ✕
                  </button>
                </div>
              );
            })}
          </div>
          {errors.images && (
            <p className="create-product-error">{errors.images}</p>
          )}
        </div>

        <div>
          <label htmlFor="brandLogo">
            მხატვრის/კომპანიის ლოგო (არასავალდებულო)
          </label>

          <div className="brand-logo-container">
            {(user?.storeLogo || typeof formData.brandLogo === "string") && (
              <div className="image-preview">
                <Image
                  loader={({ src }) => src}
                  alt="Brand logo"
                  src={
                    user?.storeLogo ||
                    (typeof formData.brandLogo === "string"
                      ? formData.brandLogo
                      : "")
                  }
                  width={100}
                  height={100}
                  unoptimized
                  className="preview-image"
                />
              </div>
            )}
            <input
              id="brandLogo"
              name="brandLogo"
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  setFormData((prev) => ({
                    ...prev,
                    brandLogo: e.target.files?.[0],
                  }));
                }
              }}
              className="create-product-file"
            />
          </div>
          {errors.brandLogo && (
            <p className="create-product-error">{errors.brandLogo}</p>
          )}
        </div>

        <button
          type="submit"
          className="create-product-button"
          disabled={pending || !formData.name}
        >
          {pending && <Loader2 className="loader" />}
          {isEdit ? "პროდუქტის განახლება" : "პროდუქტის დამატება"}
        </button>
      </form>
    </div>
  );
}
