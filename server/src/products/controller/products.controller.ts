import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { RolesGuard } from '@/guards/roles.guard';
import { JwtAuthGuard } from '@/guards/jwt-auth.guard';
import { ProductDto, FindAllProductsDto } from '../dtos/product.dto';
import { ReviewDto } from '../dtos/review.dto';
import { ProductsService } from '../services/products.service';
import { UserDocument } from '@/users/schemas/user.schema';
import { CurrentUser } from '@/decorators/current-user.decorator';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { AppService } from '@/app/services/app.service';
import { Roles } from '@/decorators/roles.decorator';
import { Role } from '@/types/role.enum';
import { ProductStatus } from '../schemas/product.schema';
import { AgeGroup } from '@/types';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(
    private productsService: ProductsService,
    private appService: AppService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get products with filters' })
  getProducts(
    @Query('keyword') keyword: string,
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('brand') brand: string,
    @Query('mainCategory') mainCategory: string,
    @Query('subCategory') subCategory: string,
    @Query('sortBy') sortBy: string,
    @Query('sortDirection') sortDirection: 'asc' | 'desc',
    @Query('ageGroup') ageGroup: string,
    @Query('size') size: string,
    @Query('color') color: string,
    @Query('includeVariants') includeVariants: string,
  ) {
    console.log('Getting products with filters:', {
      mainCategory,
      subCategory,
      ageGroup,
      size,
      color,
    });

    return this.productsService.findMany({
      keyword,
      page,
      limit,
      status: ProductStatus.APPROVED,
      brand,
      mainCategory,
      subCategory,
      sortBy,
      sortDirection,
      ageGroup,
      size,
      color,
      includeVariants: includeVariants === 'true',
    });
  }

  @Get('user')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  getUserProducts(
    @CurrentUser() user: UserDocument,
    @Query('keyword') keyword: string,
    @Query('page') page: string,
    @Query('limit') limit: string,
  ) {
    return this.productsService.findMany({
      keyword,
      page,
      limit,
      user: user.role === Role.Admin ? undefined : user,
    });
  }

  @Get('pending')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async getPendingProducts() {
    console.log('Getting pending products');
    return this.productsService.findByStatus(ProductStatus.PENDING);
  }

  @Get('topRated')
  async getTopRatedProducts() {
    const products = await this.productsService.findTopRated();
    // Return in a consistent format for the frontend
    return {
      items: products,
      total: products.length,
      page: 1,
      pages: 1,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product by ID' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  getProduct(@Param('id') id: string) {
    return this.productsService.findById(id);
  }

  @Get(':id/variants')
  @ApiOperation({ summary: 'Get available sizes and colors for a product' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns available sizes, colors and variants',
    schema: {
      properties: {
        sizes: { type: 'array', items: { type: 'string' } },
        colors: { type: 'array', items: { type: 'string' } },
        variants: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              size: { type: 'string' },
              color: { type: 'string' },
              stock: { type: 'number' },
              sku: { type: 'string' },
            },
          },
        },
        hasVariants: { type: 'boolean' },
        countInStock: { type: 'number' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Product not found' })
  getProductVariants(@Param('id') id: string) {
    return this.productsService.getProductVariants(id);
  }

  @Get('find-all')
  async findAll(@Query() query: FindAllProductsDto) {
    return this.productsService.findAll(query);
  }

  @UseGuards(RolesGuard)
  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    return this.productsService.deleteOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Post()
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'images', maxCount: 10 },
        { name: 'brandLogo', maxCount: 1 },
      ],
      {
        fileFilter: (req, file, cb) => {
          const allowedMimeTypes = [
            'image/jpeg',
            'image/png',
            'image/jpg',
            'image/gif',
          ];
          if (!allowedMimeTypes.includes(file.mimetype)) {
            return cb(new Error('Only image files are allowed!'), false);
          }
          cb(null, true);
        },
      },
    ),
  )
  async createProduct(
    @CurrentUser() user: UserDocument,
    @Body() productData: Omit<ProductDto, 'images'>,
    @UploadedFiles()
    allFiles: {
      images: Express.Multer.File[];
      brandLogo?: Express.Multer.File[];
    },
  ) {
    const files = allFiles.images;
    const { brandLogo } = allFiles;

    if (!files || files.length === 0) {
      throw new BadRequestException('At least one image is required');
    }

    try {
      const imageUrls = await Promise.all(
        files.map((file) => this.appService.uploadImageToCloudinary(file)),
      );

      let brandLogoUrl = null;

      if (brandLogo && brandLogo.length > 0) {
        brandLogoUrl = await this.appService.uploadImageToCloudinary(
          brandLogo[0],
        );
      } else if (productData.brandLogoUrl) {
        brandLogoUrl = productData.brandLogoUrl;
      }

      // Extract the main category data
      const {
        mainCategory,
        subCategory,
        ageGroup,
        size,
        color,
        ...otherProductData
      } = productData;

      // Create the product with proper category references
      return this.productsService.create({
        ...otherProductData,
        // Keep legacy fields for backward compatibility
        category: otherProductData.category || 'Other',
        categoryStructure:
          typeof productData.categoryStructure === 'string'
            ? JSON.parse(productData.categoryStructure)
            : productData.categoryStructure,
        // New category system
        mainCategory,
        subCategory,
        ageGroup,
        size,
        color,
        user,
        images: imageUrls,
        brandLogo: brandLogoUrl,
      });
    } catch (error) {
      console.error('Error creating product:', error);
      throw new InternalServerErrorException(
        'Failed to process images or create product ',
        error.message,
      );
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Put(':id')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'images', maxCount: 10 },
      { name: 'brandLogo', maxCount: 1 },
    ]),
  )
  async updateProduct(
    @Param('id') id: string,
    @CurrentUser() user: UserDocument,
    @Body() productData: Omit<ProductDto, 'images'>,
    @UploadedFiles()
    files: {
      images?: Express.Multer.File[];
      brandLogo?: Express.Multer.File[];
    },
  ) {
    console.log('Update request received:', { id, productData, files });

    const product = await this.productsService.findById(id);
    if (
      user.role !== Role.Admin &&
      product.user.toString() !== user._id.toString()
    ) {
      throw new UnauthorizedException('You can only edit your own products');
    }

    try {
      let imageUrls;
      let brandLogoUrl;

      if (files?.images?.length) {
        imageUrls = await Promise.all(
          files.images.map((file) =>
            this.appService.uploadImageToCloudinary(file),
          ),
        );
      }

      if (files?.brandLogo?.length) {
        brandLogoUrl = await this.appService.uploadImageToCloudinary(
          files.brandLogo[0],
        );
      } else if (productData.brandLogoUrl) {
        brandLogoUrl = productData.brandLogoUrl;
      }

      // Handle category structure if it exists in the request
      let categoryStructure;
      if (productData.categoryStructure) {
        try {
          // If it's a string (from form data), parse it
          if (typeof productData.categoryStructure === 'string') {
            categoryStructure = JSON.parse(productData.categoryStructure);
          } else {
            categoryStructure = productData.categoryStructure;
          }
        } catch (error) {
          console.error('Error parsing category structure:', error);
        }
      }

      // Remove user property if it exists in productData to avoid schema conflicts
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { user: userFromData, ...productDataWithoutUser } =
        productData as any;

      // Create update data object
      const updateData = {
        ...productDataWithoutUser,
        ...(imageUrls && { images: imageUrls }),
        ...(brandLogoUrl && { brandLogo: brandLogoUrl }),
        ...(categoryStructure && { categoryStructure }),
      };

      console.log('Updating product with data:', updateData);
      const updatedProduct = await this.productsService.update(id, updateData);

      console.log('Product updated successfully:', updatedProduct);
      return updatedProduct;
    } catch (error) {
      console.error('Update error:', error);
      throw new InternalServerErrorException(
        'Failed to update product',
        error.message,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/review')
  createReview(
    @Param('id') id: string,
    @Body() { rating, comment }: ReviewDto,
    @CurrentUser() user: UserDocument,
  ) {
    return this.productsService.createReview(id, user, rating, comment);
  }

  @Put(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async updateProductStatus(
    @Param('id') id: string,
    @Body()
    {
      status,
      rejectionReason,
    }: { status: ProductStatus; rejectionReason?: string },
  ) {
    return this.productsService.updateStatus(id, status, rejectionReason);
  }

  @Get('colors')
  @ApiOperation({ summary: 'Get all unique colors used in products' })
  @ApiResponse({
    status: 200,
    description: 'Returns all unique colors',
    schema: {
      type: 'array',
      items: { type: 'string' },
    },
  })
  getAllColors() {
    return this.productsService.getAllColors();
  }

  @Get('sizes')
  @ApiOperation({ summary: 'Get all unique sizes used in products' })
  @ApiResponse({
    status: 200,
    description: 'Returns all unique sizes',
    schema: {
      type: 'array',
      items: { type: 'string' },
    },
  })
  getAllSizes() {
    return this.productsService.getAllSizes();
  }

  @Get('age-groups')
  @ApiOperation({ summary: 'Get all unique age groups used in products' })
  @ApiResponse({
    status: 200,
    description: 'Returns all unique age groups',
    schema: {
      type: 'array',
      items: { type: 'string' },
    },
  })
  getAllAgeGroups() {
    return this.productsService.getAllAgeGroups();
  }
}
