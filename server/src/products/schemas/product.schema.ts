import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from '../../users/schemas/user.schema';
import { HydratedDocument } from 'mongoose';
import { Category } from '../../categories/schemas/category.schema';
import { SubCategory } from '../../categories/schemas/subcategory.schema';

export type ProductDocument = HydratedDocument<Product>;

@Schema({ timestamps: true })
export class Review {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
    default: null,
  })
  user!: User;

  @Prop({ required: true })
  name!: string;

  @Prop({ required: true })
  rating!: number;

  @Prop({ required: true })
  comment!: string;
}

export enum ProductStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export enum DeliveryType {
  SELLER = 'SELLER',
  SoulArt = 'SoulArt',
}

export enum MainCategory {
  CLOTHING = 'CLOTHING',
  ACCESSORIES = 'ACCESSORIES',
  FOOTWEAR = 'FOOTWEAR',
  SWIMWEAR = 'SWIMWEAR',
}

export enum AgeGroup {
  ADULTS = 'ADULTS',
  KIDS = 'KIDS',
}

export interface CategoryStructure {
  main: MainCategory;
  sub: string;
  ageGroup?: AgeGroup;
  size?: string;
  color?: string;
}

// New variant schema for tracking inventory by size/color
@Schema()
export class ProductVariant {
  @Prop({ required: false })
  size?: string;

  @Prop({ required: false })
  color?: string;

  @Prop({ required: false })
  ageGroup?: string;

  @Prop({ required: true, default: 0 })
  stock: number;

  @Prop({ required: false })
  sku?: string;
}

export const ProductVariantSchema =
  SchemaFactory.createForClass(ProductVariant);

@Schema({ timestamps: true })
export class Product {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
    default: null,
  })
  user!: User;

  @Prop({ required: true })
  name!: string;

  @Prop({ required: false })
  nameEn?: string;

  @Prop({ required: true })
  brand!: string;

  @Prop({})
  brandLogo?: string;

  // Legacy category field (keeping for backward compatibility)
  @Prop({ required: true })
  category!: string;

  // New category relationships
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  })
  mainCategory?: mongoose.Types.ObjectId | string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SubCategory',
  })
  subCategory?: mongoose.Types.ObjectId | string;

  // Product attributes based on subcategory
  @Prop({ type: [String], default: [] })
  ageGroups?: string[];

  @Prop({ type: [String], default: [] })
  sizes?: string[];

  @Prop({ type: [String], default: [] })
  colors?: string[];

  // Add categoryStructure field
  @Prop({ type: Object })
  categoryStructure?: CategoryStructure;

  @Prop({ required: true, type: [String], default: [] })
  images!: string[];

  @Prop({ required: true })
  description!: string;

  @Prop({ required: false })
  descriptionEn?: string;

  @Prop({ required: true })
  reviews!: Review[];

  @Prop({ required: true, default: 0 })
  rating!: number;

  @Prop({ required: true, default: 0 })
  numReviews!: number;

  @Prop({ required: true, default: 0 })
  price!: number;

  // Legacy single inventory field (keeping for backward compatibility)
  @Prop({ required: true, default: 0 })
  countInStock!: number;

  // New inventory tracking by variants
  @Prop({ type: [ProductVariantSchema], default: [] })
  variants: ProductVariant[];

  @Prop({ required: true, default: ProductStatus.PENDING })
  status!: ProductStatus;

  @Prop({ type: String })
  rejectionReason?: string;

  @Prop({ type: String, enum: DeliveryType, default: DeliveryType.SoulArt })
  deliveryType?: DeliveryType;

  @Prop({ type: Number })
  minDeliveryDays?: number;

  @Prop({ type: Number })
  maxDeliveryDays?: number;

  @Prop({ type: Object })
  dimensions?: {
    width?: number;
    height?: number;
    depth?: number;
  };
}

export const ProductSchema = SchemaFactory.createForClass(Product);

// IMPORTANT: Do NOT create compound indexes on multiple array fields!
// Only create simple single-field indexes

// Safe indexes (non-array fields)
ProductSchema.index({ mainCategory: 1 });
ProductSchema.index({ subCategory: 1 });
ProductSchema.index({ brand: 1 });
ProductSchema.index({ status: 1 });
ProductSchema.index({ createdAt: -1 });

// DO NOT create any indexes on the array fields to avoid parallel array indexing error
// MongoDB cannot index multiple array fields in the same document
