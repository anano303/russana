import * as z from "zod";

const fileSchema = z.custom<File>((file) => {
  return file instanceof File;
}, "Must be a file");

export interface ProductFormData {
  name: string;
  nameEn?: string;
  description: string;
  descriptionEn?: string;
  brand: string;
  category: string;
  subcategory: string;
  categoryId?: string;
  ageGroups?: string[];
  sizes?: string[];
  colors?: string[];
  price: number;
  countInStock: number;
  images: Array<File | string>;
  brandLogo?: File | string;
  deliveryType?: "SELLER" | "SoulArt";
  minDeliveryDays?: number | string;
  maxDeliveryDays?: number | string;
}

export const productSchema = z.object({
  name: z.string().min(1, "პროდუქტის სახელი სავალდებულოა"),
  nameEn: z.string().optional(),
  description: z.string().min(5, "აღწერა უნდა იყოს მინიმუმ 5 სიმბოლო"),
  descriptionEn: z.string().optional(),
  brand: z.string().min(1, "ბრენდის სახელი სავალდებულოა"),
  category: z.string().min(1, "კატეგორია სავალდებულოა"),
  subcategory: z
    .string()
    .refine(
      (value) => value !== "" && value !== "default" && value !== undefined,
      {
        message: "გთხოვთ აირჩიოთ ქვეკატეგორია",
      }
    ),
  categoryId: z.string().optional(),
  ageGroups: z.array(z.string()).optional(),
  sizes: z.array(z.string()).optional(),
  colors: z.array(z.string()).optional(),
  price: z.coerce.number().positive("ფასი უნდა იყოს დადებითი რიცხვი"),
  countInStock: z.coerce
    .number()
    .min(0, "მარაგის რაოდენობა არ შეიძლება იყოს უარყოფითი"),
  images: z.array(fileSchema).min(1, "მინიმუმ ერთი სურათი სავალდებულოა"),
  brandLogo: fileSchema.optional().nullable().or(z.literal("")),
  deliveryType: z
    .enum(["SELLER", "SoulArt"], {
      errorMap: () => ({ message: "მიწოდების ტიპი სავალდებულოა" }),
    })
    .optional()
    .nullable(),
  minDeliveryDays: z.number().optional().nullable(),
  maxDeliveryDays: z.number().optional().nullable(),
});

// Helper function to validate the form before submission
export const validateProductForm = (data: unknown) => {
  const result = productSchema.safeParse(data);
  if (!result.success) {
    // Format errors for display
    const formattedErrors = result.error.format();
    return { success: false, errors: formattedErrors };
  }
  return { success: true, data: result.data };
};
