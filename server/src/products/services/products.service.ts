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

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
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
    keyword?: string,
    page?: string,
    limit?: string,
    user?: UserDocument,
    status?: ProductStatus,
    brand?: string,
    mainCategory?: MainCategory,
    subCategory?: string,
    sortBy?: string,
    sortDirection: 'asc' | 'desc' = 'desc',
    ageGroup?: AgeGroup,
  ) {
    const query: any = {};
    
    if (keyword) {
      query.$or = [
        { name: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
      ];
    }

    if (user) {
      query.user = user._id;
    }

    if (status) {
      query.status = status;
    }

    if (brand) {
      query.brand = brand;
    }

    if (mainCategory) {
      query['categoryStructure.main'] = mainCategory;
    }

    if (subCategory) {
      query['categoryStructure.sub'] = subCategory;
    }

    if (ageGroup) {
      query['categoryStructure.ageGroup'] = ageGroup;
    }

    const sortOptions: any = {};
    if (sortBy) {
      sortOptions[sortBy] = sortDirection === 'asc' ? 1 : -1;
    }

    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const skip = (pageNum - 1) * limitNum;

    const [products, total] = await Promise.all([
      this.productModel
        .find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNum)
        .populate({
          path: 'user',
          select: 'name email phoneNumber seller',
        })
        .exec(),
      this.productModel.countDocuments(query),
    ]);

    return {
      products,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      total,
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

  async findByStatus(status: ProductStatus): Promise<ProductDocument[]> {
    return this.productModel
      .find({ status })
      .populate({
        path: 'user',
        select: 'name email phoneNumber seller',
      })
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
    const status =
      productData.user?.role === Role.Admin
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
        sub: productData.category,
        ageGroup: productData.categoryStructure?.ageGroup || undefined
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

  async getFilteredProducts(
    main?: MainCategory,
    sub?: string,
    ageGroup?: AgeGroup
  ): Promise<Product[]> {
    const query: any = {};

    if (main) {
      query['categoryStructure.main'] = main;
    }
    
    if (sub) {
      query['categoryStructure.sub'] = sub;
    }

    if (ageGroup) {
      query['categoryStructure.ageGroup'] = ageGroup;
    }

    return this.productModel
      .find(query)
      .populate({
        path: 'user',
        select: 'name email phoneNumber seller',
      })
      .exec();
  }
}

// Example API calls:
// GET /products                                     // Get all products
// GET /products?mainCategory=CLOTHING               // Filter by main category
// GET /products?mainCategory=CLOTHING&subCategory=T-SHIRTS  // Filter by main and sub category
// GET /products?ageGroup=ADULTS                    // Filter by age group
// GET /products?keyword=shirt                      // Search by keyword
// GET /products?sortBy=price&sortDirection=desc    // Sort by price descending
