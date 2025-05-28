import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from '../services/category.service';
import { SubCategoryService } from '../services/subcategory.service';
import { CreateCategoryDto, UpdateCategoryDto } from '../dto/category.dto';
import {
  CreateSubCategoryDto,
  UpdateSubCategoryDto,
  AttributeDto,
  AttributesArrayDto,
} from '../dto/subcategory.dto';
import { JwtAuthGuard } from '@/guards/jwt-auth.guard';
import { RolesGuard } from '@/guards/roles.guard';
import { Role } from '@/types/role.enum';
import { Roles } from '@/decorators/roles.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CategoryResponseDto } from '../dto/category.dto';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly subCategoryService: SubCategoryService,
  ) {}

  // Category endpoints
  @Get()
  @ApiOperation({ summary: 'Get all categories' })
  @ApiQuery({
    name: 'includeInactive',
    required: false,
    type: Boolean,
    description: 'Include inactive categories',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns all categories',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '60d21b4667d0d8992e610c85' },
          name: { type: 'string', example: 'ტანსაცმელი' },
          description: {
            type: 'string',
            example: 'სხვადასხვა ტიპის ტანსაცმელი',
          },
          isActive: { type: 'boolean', example: true },
          createdAt: {
            type: 'string',
            format: 'date-time',
            example: '2023-06-20T12:00:00Z',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            example: '2023-06-20T12:00:00Z',
          },
        },
      },
    },
  })
  findAllCategories(@Query('includeInactive') includeInactive?: string) {
    return this.categoryService.findAll(includeInactive === 'true');
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get category by ID' })
  @ApiParam({ name: 'id', description: 'Category ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns the category',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: '60d21b4667d0d8992e610c85' },
        name: { type: 'string', example: 'ტანსაცმელი' },
        description: { type: 'string', example: 'სხვადასხვა ტიპის ტანსაცმელი' },
        isActive: { type: 'boolean', example: true },
        createdAt: {
          type: 'string',
          format: 'date-time',
          example: '2023-06-20T12:00:00Z',
        },
        updatedAt: {
          type: 'string',
          format: 'date-time',
          example: '2023-06-20T12:00:00Z',
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Category not found' })
  findCategoryById(@Param('id') id: string) {
    return this.categoryService.findById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new category' })
  @ApiResponse({
    status: 201,
    description: 'The category has been created',
    type: CategoryResponseDto,
  })
  createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a category' })
  @ApiParam({ name: 'id', description: 'Category ID' })
  @ApiResponse({ status: 200, description: 'The category has been updated' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  updateCategory(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a category' })
  @ApiParam({ name: 'id', description: 'Category ID' })
  @ApiResponse({ status: 200, description: 'The category has been deleted' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  removeCategory(@Param('id') id: string) {
    return this.categoryService.remove(id);
  }

  // Subcategory endpoints
  @Get('sub')
  @ApiOperation({ summary: 'Get all subcategories' })
  @ApiQuery({
    name: 'categoryId',
    required: false,
    description: 'Filter by category ID',
  })
  @ApiQuery({
    name: 'includeInactive',
    required: false,
    type: Boolean,
    description: 'Include inactive subcategories',
  })
  @ApiResponse({ status: 200, description: 'Returns all subcategories' })
  findAllSubCategories(
    @Query('categoryId') categoryId?: string,
    @Query('includeInactive') includeInactive?: string,
  ) {
    return this.subCategoryService.findAll(
      categoryId,
      includeInactive === 'true',
    );
  }

  @Get('sub/:id')
  @ApiOperation({ summary: 'Get subcategory by ID' })
  @ApiParam({ name: 'id', description: 'Subcategory ID' })
  @ApiResponse({ status: 200, description: 'Returns the subcategory' })
  @ApiResponse({ status: 404, description: 'Subcategory not found' })
  findSubCategoryById(@Param('id') id: string) {
    return this.subCategoryService.findById(id);
  }

  @Post('sub')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new subcategory' })
  @ApiResponse({
    status: 201,
    description: 'The subcategory has been created successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: '60d21b4667d0d8992e610c86' },
        name: { type: 'string', example: 'მაისურები' },
        category: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '60d21b4667d0d8992e610c85' },
            name: { type: 'string', example: 'ტანსაცმელი' },
          },
        },
        ageGroups: {
          type: 'array',
          items: { type: 'string' },
          example: ['ბავშვები', 'მოზრდილები'],
        },
        sizes: {
          type: 'array',
          items: { type: 'string' },
          example: ['S', 'M', 'L', 'XL'],
        },
        colors: {
          type: 'array',
          items: { type: 'string' },
          example: ['შავი', 'თეთრი', 'წითელი'],
        },
        description: { type: 'string', example: 'მაისურები ყველა სეზონისთვის' },
        isActive: { type: 'boolean', example: true },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid data or duplicate subcategory',
  })
  @ApiResponse({ status: 404, description: 'Category not found' })
  createSubCategory(@Body() createSubCategoryDto: CreateSubCategoryDto) {
    return this.subCategoryService.create(createSubCategoryDto);
  }

  @Put('sub/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a subcategory' })
  @ApiParam({ name: 'id', description: 'Subcategory ID' })
  @ApiResponse({ status: 200, description: 'The subcategory has been updated' })
  @ApiResponse({ status: 404, description: 'Subcategory not found' })
  updateSubCategory(
    @Param('id') id: string,
    @Body() updateSubCategoryDto: UpdateSubCategoryDto,
  ) {
    return this.subCategoryService.update(id, updateSubCategoryDto);
  }

  @Delete('sub/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a subcategory' })
  @ApiParam({ name: 'id', description: 'Subcategory ID' })
  @ApiResponse({ status: 200, description: 'The subcategory has been deleted' })
  @ApiResponse({ status: 404, description: 'Subcategory not found' })
  removeSubCategory(@Param('id') id: string) {
    return this.subCategoryService.remove(id);
  }

  // Attribute management endpoints for subcategories
  @Get('attributes')
  @ApiOperation({ summary: 'Get attribute options for categories' })
  @ApiResponse({
    status: 200,
    description: 'Returns age groups, sizes, and colors',
  })
  getAttributeOptions() {
    return this.subCategoryService.getAttributeOptions();
  }

  // Color management - global endpoints
  @Get('colors')
  @ApiOperation({ summary: 'Get all available colors from subcategories' })
  @ApiResponse({
    status: 200,
    description: 'Returns all available colors',
    schema: {
      type: 'array',
      items: { type: 'string' },
    },
  })
  getAllColors() {
    return this.subCategoryService.getAllColors();
  }

  @Post('colors')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new color' })
  @ApiResponse({ status: 201, description: 'The color has been created' })
  createColor(@Body() { value }: AttributeDto) {
    return this.subCategoryService.createColor(value);
  }

  @Put('colors/:color')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a color name' })
  @ApiParam({ name: 'color', description: 'Color to update' })
  @ApiResponse({ status: 200, description: 'The color has been updated' })
  @ApiResponse({ status: 404, description: 'Color not found' })
  updateColor(@Param('color') color: string, @Body() { value }: AttributeDto) {
    return this.subCategoryService.updateColor(color, value);
  }

  @Delete('colors/:color')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a color' })
  @ApiParam({ name: 'color', description: 'Color to delete' })
  @ApiResponse({ status: 200, description: 'The color has been deleted' })
  @ApiResponse({ status: 404, description: 'Color not found' })
  deleteColor(@Param('color') color: string) {
    return this.subCategoryService.deleteColor(color);
  }

  // Size management - global endpoints
  @Get('sizes')
  @ApiOperation({ summary: 'Get all available sizes from subcategories' })
  @ApiResponse({
    status: 200,
    description: 'Returns all available sizes',
    schema: {
      type: 'array',
      items: { type: 'string' },
    },
  })
  getAllSizes() {
    return this.subCategoryService.getAllSizes();
  }

  @Post('sizes')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new size' })
  @ApiResponse({ status: 201, description: 'The size has been created' })
  createSize(@Body() { value }: AttributeDto) {
    return this.subCategoryService.createSize(value);
  }

  @Put('sizes/:size')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a size name' })
  @ApiParam({ name: 'size', description: 'Size to update' })
  @ApiResponse({ status: 200, description: 'The size has been updated' })
  @ApiResponse({ status: 404, description: 'Size not found' })
  updateSize(@Param('size') size: string, @Body() { value }: AttributeDto) {
    return this.subCategoryService.updateSize(size, value);
  }

  @Delete('sizes/:size')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a size' })
  @ApiParam({ name: 'size', description: 'Size to delete' })
  @ApiResponse({ status: 200, description: 'The size has been deleted' })
  @ApiResponse({ status: 404, description: 'Size not found' })
  deleteSize(@Param('size') size: string) {
    return this.subCategoryService.deleteSize(size);
  }

  // Age group management - global endpoints
  @Get('age-groups')
  @ApiOperation({ summary: 'Get all available age groups from subcategories' })
  @ApiResponse({
    status: 200,
    description: 'Returns all available age groups',
    schema: {
      type: 'array',
      items: { type: 'string' },
    },
  })
  getAllAgeGroups() {
    return this.subCategoryService.getAllAgeGroups();
  }

  @Post('age-groups')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new age group' })
  @ApiResponse({ status: 201, description: 'The age group has been created' })
  createAgeGroup(@Body() { value }: AttributeDto) {
    return this.subCategoryService.createAgeGroup(value);
  }

  @Put('age-groups/:ageGroup')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update an age group name' })
  @ApiParam({ name: 'ageGroup', description: 'Age group to update' })
  @ApiResponse({ status: 200, description: 'The age group has been updated' })
  @ApiResponse({ status: 404, description: 'Age group not found' })
  updateAgeGroup(
    @Param('ageGroup') ageGroup: string,
    @Body() { value }: AttributeDto,
  ) {
    return this.subCategoryService.updateAgeGroup(ageGroup, value);
  }

  @Delete('age-groups/:ageGroup')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete an age group' })
  @ApiParam({ name: 'ageGroup', description: 'Age group to delete' })
  @ApiResponse({ status: 200, description: 'The age group has been deleted' })
  @ApiResponse({ status: 404, description: 'Age group not found' })
  deleteAgeGroup(@Param('ageGroup') ageGroup: string) {
    return this.subCategoryService.deleteAgeGroup(ageGroup);
  }

  // ...existing code for subcategory-specific attribute management...
}
