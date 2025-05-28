import {
  IsString,
  IsNumber,
  IsArray,
  IsEnum,
  IsOptional,
  IsObject,
  ValidateNested,
  IsMongoId,
} from 'class-validator';
import {
  ProductStatus,
  DeliveryType,
  MainCategory,
  AgeGroup,
} from '../schemas/product.schema';
import { Type } from 'class-transformer';

class CategoryStructureDto {
  @IsEnum(MainCategory)
  main: MainCategory;

  @IsString()
  sub: string;

  @IsEnum(AgeGroup)
  @IsOptional()
  ageGroup?: AgeGroup;

  @IsString()
  @IsOptional()
  size?: string;

  @IsString()
  @IsOptional()
  color?: string;
}

class ProductVariantDto {
  @IsString()
  size: string;

  @IsString()
  color: string;

  @IsNumber()
  stock: number;

  @IsString()
  @IsOptional()
  sku?: string;
}

export class ProductDto {
  @IsString()
  name!: string;

  @IsString()
  @IsOptional()
  nameEn?: string;

  @IsNumber()
  price!: number;

  @IsString()
  description!: string;

  @IsString()
  @IsOptional()
  descriptionEn?: string;

  @IsArray()
  @IsString({ each: true })
  images!: string[];

  @IsString()
  brand!: string;

  @IsString()
  category!: string;

  @IsMongoId()
  @IsOptional()
  mainCategory?: string;

  @IsMongoId()
  @IsOptional()
  subCategory?: string;

  @IsString()
  @IsOptional()
  ageGroup?: string;

  @IsString()
  @IsOptional()
  size?: string;

  @IsString()
  @IsOptional()
  color?: string;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => CategoryStructureDto)
  categoryStructure?: CategoryStructureDto;

  @IsNumber()
  countInStock!: number; // Legacy field

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ProductVariantDto)
  variants?: ProductVariantDto[];

  @IsString()
  @IsOptional()
  brandLogo?: string;

  @IsEnum(ProductStatus)
  status?: ProductStatus;

  @IsString()
  @IsOptional()
  rejectionReason?: string;

  @IsEnum(DeliveryType)
  @IsOptional()
  deliveryType?: DeliveryType;

  @IsNumber()
  @IsOptional()
  minDeliveryDays?: number;

  @IsNumber()
  @IsOptional()
  maxDeliveryDays?: number;

  @IsObject()
  @IsOptional()
  dimensions?: {
    width?: number;
    height?: number;
    depth?: number;
  };

  @IsString()
  @IsOptional()
  brandLogoUrl?: string;
}

export class FindAllProductsDto {
  @IsOptional()
  @IsString()
  keyword?: string;

  @IsOptional()
  @IsString()
  page?: string;

  @IsOptional()
  @IsString()
  limit?: string;

  // Legacy field, keeping for backward compatibility
  @IsOptional()
  @IsString()
  category?: string;

  // New category system fields
  @IsOptional()
  @IsMongoId()
  mainCategory?: string;

  @IsOptional()
  @IsMongoId()
  subCategory?: string;

  @IsOptional()
  @IsString()
  brand?: string;

  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsString()
  sortBy?: string;

  @IsOptional()
  @IsString()
  sortOrder?: string;

  // Attribute filters
  @IsOptional()
  @IsString()
  ageGroup?: string;

  @IsOptional()
  @IsString()
  size?: string;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsString()
  includeVariants?: string;
}

// We already have the correct DTO definitions with IsMongoId() decorators for mainCategory and subCategory
// Just ensure they're properly transformed to ObjectIds in the service
