import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UserDocument } from 'src/users/schemas/user.schema';
import {
  Product,
  ProductDocument,
  ProductStatus,
  MainCategory,
  AgeGroup,
} from '../schemas/product.schema';
import { PaginatedResponse } from '@/types';
import { Order } from '../../orders/schemas/order.schema';
import { sampleProduct } from '@/utils/data/product';
import { Role } from '@/types/role.enum';
import {
  HANDMADE_CATEGORIES,
  PAINTING_CATEGORIES,
  CLOTHING_CATEGORIES,
  ACCESSORIES_CATEGORIES,
  FOOTWEAR_CATEGORIES,
  SWIMWEAR_CATEGORIES,
  CATEGORY_MAPPING,
} from '@/utils/subcategories';
import { ProductDto, FindAllProductsDto } from '../dtos/product.dto';

interface FindManyParams {
  keyword?: string;
  page?: string;
  limit?: string;
  user?: UserDocument;
  status?: ProductStatus;
  brand?: string;
  mainCategory?: string;
  subCategory?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  ageGroup?: string;
  size?: string;
  color?: string;
  includeVariants?: boolean;
}

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(Order.name) private orderModel: Model<Order>,
  ) {}

  async findTopRated(): Promise<ProductDocument[]> {
    const products = await this.productModel
      .find({})
      .sort({ rating: -1 })
      .limit(3);

    return products;
  }

  async findMany(
    params: FindManyParams,
  ): Promise<{ products: Product[]; page: number; pages: number }> {
    const {
      keyword,
      page = '1',
      limit = '10',
      user,
      status,
      brand,
      mainCategory,
      subCategory,
      sortBy = 'createdAt',
      sortDirection = 'desc',
      ageGroup,
      size,
      color,
      includeVariants = false,
    } = params;

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const skip = (pageNumber - 1) * limitNumber;

    const filter: any = {};

    if (keyword) {
      filter.$or = [
        { name: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
      ];
    }

    if (user) {
      filter.user = user._id;
    }

    if (status) {
      filter.status = status;
    }

    if (brand) {
      filter.brand = brand;
    }

    // Handle category filtering with the new structure
    if (mainCategory) {
      // Try to convert to ObjectId if it's a valid ID
      try {
        filter.mainCategory = new Types.ObjectId(mainCategory);
      } catch (error) {
        // If it's not a valid ObjectId, use as is
        filter.mainCategory = mainCategory;
      }
    }

    if (subCategory) {
      try {
        filter.subCategory = new Types.ObjectId(subCategory);
      } catch (error) {
        filter.subCategory = subCategory;
      }
    }

    // Filter by attributes
    if (ageGroup) {
      filter.ageGroup = ageGroup;
    }

    if (size || color) {
      // Add filter for size and color in variants if they exist
      const variantFilter = [];
      if (size) {
        variantFilter.push({ 'variants.size': size });
      }
      if (color) {
        variantFilter.push({ 'variants.color': color });
      }

      if (variantFilter.length > 0) {
        filter.$or = [
          // Check in the direct fields first
          ...(size ? [{ size }] : []),
          ...(color ? [{ color }] : []),
          // Then check in variants
          { $and: variantFilter },
        ];
      }
    }

    const sort: any = {};
    sort[sortBy] = sortDirection === 'asc' ? 1 : -1;

    const count = await this.productModel.countDocuments(filter);
    const productQuery = this.productModel
      .find(filter)
      .sort(sort)
      .populate('user', 'name')
      .populate('mainCategory', 'name')
      .populate('subCategory', 'name ageGroups sizes colors')
      .skip(skip)
      .limit(limitNumber);

    // Only include variants if explicitly requested to keep response size down
    if (!includeVariants) {
      productQuery.select('-variants');
    }

    const products = await productQuery.exec();

    return {
      products,
      page: pageNumber,
      pages: Math.ceil(count / limitNumber),
    };
  }

  async findById(id: string): Promise<ProductDocument> {
    if (!Types.ObjectId.isValid(id))
      throw new BadRequestException('Invalid product ID.');

    const product = await this.productModel.findById(id);

    if (!product) throw new NotFoundException('No product with given ID.');

    if (!product.categoryStructure) {
      let mainCat = MainCategory.CLOTHING; // Default to CLOTHING

      if (CLOTHING_CATEGORIES.includes(product.category)) {
        mainCat = MainCategory.CLOTHING;
      } else if (ACCESSORIES_CATEGORIES.includes(product.category)) {
        mainCat = MainCategory.ACCESSORIES;
      } else if (FOOTWEAR_CATEGORIES.includes(product.category)) {
        mainCat = MainCategory.FOOTWEAR;
      } else if (SWIMWEAR_CATEGORIES.includes(product.category)) {
        mainCat = MainCategory.SWIMWEAR;
      } else {
        // Handle legacy categories
        const mappedCategory = CATEGORY_MAPPING[product.category];
        if (mappedCategory) {
          if (CLOTHING_CATEGORIES.includes(mappedCategory)) {
            mainCat = MainCategory.CLOTHING;
          } else if (ACCESSORIES_CATEGORIES.includes(mappedCategory)) {
            mainCat = MainCategory.ACCESSORIES;
          } else if (FOOTWEAR_CATEGORIES.includes(mappedCategory)) {
            mainCat = MainCategory.FOOTWEAR;
          } else if (SWIMWEAR_CATEGORIES.includes(mappedCategory)) {
            mainCat = MainCategory.SWIMWEAR;
          }
          product.category = mappedCategory;
        }
      }

      product.categoryStructure = {
        main: mainCat,
        sub: product.category,
      };
    }

    return product;
  }

  async createMany(products: Partial<Product>[]): Promise<ProductDocument[]> {
    const createdProducts = await this.productModel.insertMany(products);

    return createdProducts as unknown as ProductDocument[];
  }

  async createSample(): Promise<ProductDocument> {
    const createdProduct = await this.productModel.create(sampleProduct);

    return createdProduct;
  }

  async update(id: string, attrs: Partial<Product>): Promise<ProductDocument> {
    const {
      name,
      price,
      description,
      images,
      brandLogo,
      brand,
      category,
      categoryStructure,
      countInStock,
      status,
      deliveryType,
      minDeliveryDays,
      maxDeliveryDays,
      dimensions,
    } = attrs;

    if (!Types.ObjectId.isValid(id))
      throw new BadRequestException('Invalid product ID.');

    const product = await this.productModel.findById(id);
    if (!product) throw new NotFoundException('No product with given ID.');

    product.name = name ?? product.name;
    product.price = price ?? product.price;
    product.description = description ?? product.description;
    product.images = images ?? product.images;
    product.brandLogo = brandLogo ?? product.brandLogo;
    product.brand = brand ?? product.brand;
    product.category = category ?? product.category;
    product.categoryStructure = categoryStructure ?? product.categoryStructure;
    product.countInStock = countInStock ?? product.countInStock;
    product.status = status ?? product.status;
    product.deliveryType = deliveryType ?? product.deliveryType;
    product.minDeliveryDays = minDeliveryDays ?? product.minDeliveryDays;
    product.maxDeliveryDays = maxDeliveryDays ?? product.maxDeliveryDays;
    product.dimensions = dimensions ?? product.dimensions;

    return product.save();
  }

  async updateStatus(
    id: string,
    status: ProductStatus,
    rejectionReason?: string,
  ): Promise<ProductDocument> {
    const product = await this.findById(id);

    product.status = status;
    if (rejectionReason) {
      product.rejectionReason = rejectionReason;
    }

    return product.save();
  }

  async findByStatus(status: ProductStatus): Promise<Product[]> {
    return this.productModel
      .find({ status })
      .populate('user', 'name')
      .populate('mainCategory', 'name')
      .populate('subCategory', 'name ageGroups sizes colors')
      .sort({ createdAt: -1 })
      .exec();
  }

  async createReview(
    id: string,
    user: UserDocument,
    rating: number,
    comment: string,
  ): Promise<ProductDocument> {
    if (!Types.ObjectId.isValid(id))
      throw new BadRequestException('Invalid product ID.');

    const product = await this.productModel.findById(id);

    if (!product) throw new NotFoundException('No product with given ID.');

    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === user._id.toString(),
    );

    if (alreadyReviewed)
      throw new BadRequestException('Product already reviewed!');

    const hasPurchased = await this.orderModel.findOne({
      user: user._id,
      'orderItems.productId': id,
      status: 'delivered',
    });

    if (!hasPurchased)
      throw new BadRequestException(
        'You can only review products you have purchased',
      );

    const review = {
      name: user.name,
      rating,
      comment,
      user,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    product.reviews.push(review);

    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    product.numReviews = product.reviews.length;

    const updatedProduct = await product.save();

    return updatedProduct;
  }

  async deleteOne(id: string): Promise<void> {
    if (!Types.ObjectId.isValid(id))
      throw new BadRequestException('Invalid product ID.');

    const product = await this.productModel.findById(id);

    if (!product) throw new NotFoundException('No product with given ID.');

    await product.deleteOne();
  }

  async deleteMany(): Promise<void> {
    await this.productModel.deleteMany({});
  }

  async create(productData: Partial<Product>): Promise<ProductDocument> {
    // Convert string IDs to ObjectIds for category references
    const data = { ...productData };

    // Handle category references properly
    if (typeof data.mainCategory === 'string' && data.mainCategory) {
      try {
        data.mainCategory = new Types.ObjectId(data.mainCategory);
      } catch (error) {
        // If conversion fails, use as is
        console.warn('Invalid mainCategory ID format', data.mainCategory);
      }
    }

    if (typeof data.subCategory === 'string' && data.subCategory) {
      try {
        data.subCategory = new Types.ObjectId(data.subCategory);
      } catch (error) {
        console.warn('Invalid subCategory ID format', data.subCategory);
      }
    }

    const status =
      productData.user.role === Role.Admin
        ? ProductStatus.APPROVED
        : ProductStatus.PENDING;

    const category = productData.category;
    const isClothingCategory = CLOTHING_CATEGORIES.includes(category);
    const isAccessoriesCategory = ACCESSORIES_CATEGORIES.includes(category);
    const isFootwearCategory = FOOTWEAR_CATEGORIES.includes(category);
    const isSwimwearCategory = SWIMWEAR_CATEGORIES.includes(category);

    let mainCat = MainCategory.CLOTHING; // Default to CLOTHING
    if (isClothingCategory) {
      mainCat = MainCategory.CLOTHING;
    } else if (isAccessoriesCategory) {
      mainCat = MainCategory.ACCESSORIES;
    } else if (isFootwearCategory) {
      mainCat = MainCategory.FOOTWEAR;
    } else if (isSwimwearCategory) {
      mainCat = MainCategory.SWIMWEAR;
    }

    if (!productData.categoryStructure) {
      productData.categoryStructure = {
        main: mainCat,
        sub: category,
      };
    }

    const product = await this.productModel.create({
      ...productData,
      status,
      rating: 0,
      numReviews: 0,
      reviews: [],
    });

    return product;
  }

  async findAll(options: FindAllProductsDto): Promise<any> {
    let query = {};
    if (options.mainCategory) {
      query = { ...query, 'categoryStructure.main': options.mainCategory };
    }
    if (options.ageGroup) {
      query = { ...query, 'categoryStructure.ageGroup': options.ageGroup };
    }

    // Additional logic for fetching products based on the query
    return this.productModel.find(query).exec();
  }

  // Add a method to check stock availability by size and color
  async checkStockAvailability(
    productId: string,
    size: string,
    color: string,
    quantity: number = 1,
  ): Promise<boolean> {
    const product = await this.productModel.findById(productId).exec();

    if (!product) {
      return false;
    }

    // If the product has variants
    if (product.variants && product.variants.length > 0) {
      const variant = product.variants.find(
        (v) => v.size === size && v.color === color,
      );
      if (!variant) {
        return false;
      }
      return variant.stock >= quantity;
    }

    // Fall back to legacy countInStock if no variants
    return product.countInStock >= quantity;
  }

  // Update inventory after a purchase
  async updateInventory(
    productId: string,
    size: string,
    color: string,
    quantity: number = 1,
  ): Promise<void> {
    const product = await this.productModel.findById(productId).exec();

    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    // If the product has variants
    if (product.variants && product.variants.length > 0) {
      const variantIndex = product.variants.findIndex(
        (v) => v.size === size && v.color === color,
      );
      if (variantIndex === -1) {
        throw new NotFoundException(
          `Variant with size ${size} and color ${color} not found`,
        );
      }

      if (product.variants[variantIndex].stock < quantity) {
        throw new BadRequestException(
          `Not enough stock for size ${size} and color ${color}`,
        );
      }

      // Update the specific variant's stock
      product.variants[variantIndex].stock -= quantity;
      await product.save();
    } else {
      // Fall back to legacy countInStock if no variants
      if (product.countInStock < quantity) {
        throw new BadRequestException('Not enough stock');
      }

      product.countInStock -= quantity;
      await product.save();
    }
  }

  /**
   * Get available variants (sizes and colors) for a product
   */
  async getProductVariants(productId: string) {
    const product = await this.productModel.findById(productId).exec();

    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    // If the product has variants defined
    if (product.variants && product.variants.length > 0) {
      // Extract unique sizes and colors
      const sizes = [...new Set(product.variants.map((v) => v.size))];
      const colors = [...new Set(product.variants.map((v) => v.color))];

      // Map variants to include stock information
      const variantsWithStock = product.variants.map((v) => ({
        size: v.size,
        color: v.color,
        stock: v.stock,
        sku: v.sku,
      }));

      return {
        sizes,
        colors,
        variants: variantsWithStock,
        hasVariants: true,
      };
    }

    // For products without explicit variants, use the general attributes
    return {
      sizes: product.size ? [product.size] : [],
      colors: product.color ? [product.color] : [],
      variants: [],
      hasVariants: false,
      countInStock: product.countInStock,
    };
  }

  /**
   * Get all unique colors used in products
   */
  async getAllColors(): Promise<string[]> {
    // Find colors from both direct fields and variants
    const productsWithColors = await this.productModel
      .find({
        $or: [
          { color: { $exists: true, $nin: [null, ''] } },
          { 'variants.color': { $exists: true } },
        ],
      })
      .exec();

    const colors = new Set<string>();

    // Add colors from direct fields
    productsWithColors.forEach((product) => {
      if (product.color) {
        colors.add(product.color);
      }

      // Add colors from variants
      if (product.variants && product.variants.length > 0) {
        product.variants.forEach((variant) => {
          if (variant.color) {
            colors.add(variant.color);
          }
        });
      }
    });

    return Array.from(colors).sort();
  }

  /**
   * Get all unique sizes used in products
   */
  async getAllSizes(): Promise<string[]> {
    // Find sizes from both direct fields and variants
    const productsWithSizes = await this.productModel
      .find({
        $or: [
          { size: { $exists: true, $nin: [null, ''] } },
          { 'variants.size': { $exists: true } },
        ],
      })
      .exec();

    const sizes = new Set<string>();

    // Add sizes from direct fields
    productsWithSizes.forEach((product) => {
      if (product.size) {
        sizes.add(product.size);
      }

      // Add sizes from variants
      if (product.variants && product.variants.length > 0) {
        product.variants.forEach((variant) => {
          if (variant.size) {
            sizes.add(variant.size);
          }
        });
      }
    });

    return Array.from(sizes).sort();
  }

  /**
   * Get all unique age groups used in products
   */
  async getAllAgeGroups(): Promise<string[]> {
    // Find all products with age groups
    const productsWithAgeGroups = await this.productModel
      .find({
        ageGroup: { $exists: true, $nin: [null, ''] },
      })
      .exec();

    const ageGroups = new Set<string>();

    productsWithAgeGroups.forEach((product) => {
      if (product.ageGroup) {
        ageGroups.add(product.ageGroup);
      }
    });

    return Array.from(ageGroups).sort();
  }
}
