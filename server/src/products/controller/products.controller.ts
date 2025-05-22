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
  UploadedFile,
  UploadedFiles,
  Res,
  BadRequestException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { RolesGuard } from '@/guards/roles.guard';
import { JwtAuthGuard } from '@/guards/jwt-auth.guard';
import { ProductDto, FindAllProductsDto } from '../dtos/product.dto';
import { FilterProductsDto } from '../dtos/filter-products.dto'; // Add this import
import { ProductResponseDto } from '../dtos/product-response.dto'; // Add this import
import { ReviewDto } from '../dtos/review.dto';
import { ProductsService } from '../services/products.service';
import { UserDocument } from '@/users/schemas/user.schema';
import { CurrentUser } from '@/decorators/current-user.decorator';
import {
  FileFieldsInterceptor,
  FileInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import { AppService } from '@/app/services/app.service';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';

import { Response } from 'express';
import { Roles } from '@/decorators/roles.decorator';
import { Role } from '@/types/role.enum';
import { ProductStatus } from '../schemas/product.schema';
import { MainCategory, AgeGroup } from '@/types';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(
    private productsService: ProductsService,
    private appService: AppService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get filtered products' })
  @ApiResponse({
    status: 200,
    description: 'Returns filtered products with pagination',
    type: ProductResponseDto,
  })
  async getProducts(
    @Query() filterDto: FilterProductsDto,
  ) {
    return this.productsService.findMany(
      filterDto.keyword,
      filterDto.page?.toString(),
      filterDto.limit?.toString(),
      undefined,
      undefined,
      undefined,
      filterDto.mainCategory,
      filterDto.subCategory,
      filterDto.sortBy,
      filterDto.sortDirection,
      filterDto.ageGroup,
    );
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
    return this.productsService.findMany(
      keyword,
      page,
      limit,
      user.role === Role.Admin ? undefined : user,
    );
  }

  @Get('pending')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async getPendingProducts() {
    console.log('Getting pending products');
    return this.productsService.findByStatus(ProductStatus.PENDING);
  }

  @Get('topRated')
  getTopRatedProducts() {
    return this.productsService.findTopRated();
  }

  @Get(':id')
  getProduct(@Param('id') id: string) {
    return this.productsService.findById(id);
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
        {
          name: 'images',
          maxCount: 10,
        },
        {
          name: 'brandLogo',
          maxCount: 1,
        },
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
    console.log('Received files:', files);
    console.log('Received brand logo:', brandLogo);
    console.log('Received product data:', productData);

    if (!files || files.length === 0) {
      throw new BadRequestException('At least one image is required');
    }

    try {
      const imageUrls = await Promise.all(
        files.map((file) => this.appService.uploadImageToCloudinary(file)),
      );

      let brandLogoUrl = null;

      if (brandLogo && brandLogo.length > 0) {
        console.log('Processing brand logo file upload');
        brandLogoUrl = await this.appService.uploadImageToCloudinary(
          brandLogo[0],
        );
      } else if (productData.brandLogoUrl) {
        console.log('Using provided brand logo URL:', productData.brandLogoUrl);
        brandLogoUrl = productData.brandLogoUrl;
      }

      console.log('Final brand logo URL:', brandLogoUrl);
      console.log('Creating product with data:', {
        ...productData,
        user,
        images: imageUrls,
        brandLogo: brandLogoUrl,
      });

      return this.productsService.create({
        ...productData,
        categoryStructure:
          typeof productData.categoryStructure === 'string'
            ? JSON.parse(productData.categoryStructure)
            : productData.categoryStructure,
        user,
        images: imageUrls,
        brandLogo: brandLogoUrl,
      });
    } catch (error: any) {
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

      // Create update data object - fix the duplicate spread operator
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
}
