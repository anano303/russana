import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { SubCategoryService } from '../services/subCategory.service';
import { AttributeDto } from '../dto/subcategory.dto';
import { JwtAuthGuard } from '@/guards/jwt-auth.guard';
import { RolesGuard } from '@/guards/roles.guard';
import { Role } from '@/types/role.enum';
import { Roles } from '@/decorators/roles.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('attributes')
@Controller('categories/attributes')
export class AttributesController {
  constructor(private readonly subCategoryService: SubCategoryService) {}

  @Get('all')
  @ApiOperation({ summary: 'Get attribute options for categories' })
  @ApiResponse({
    status: 200,
    description: 'Returns age groups, sizes, and colors',
  })
  getAttributeOptions() {
    return this.subCategoryService.getAttributeOptions();
  }

  // Color management
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
  async getAllColors() {
    try {
      console.log('Fetching all colors');
      const colors = await this.subCategoryService.getAllColors();
      console.log('Colors fetched:', colors);
      return colors;
    } catch (error) {
      console.error('Error fetching colors:', error);
      throw new BadRequestException('Failed to fetch colors: ' + error.message);
    }
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

  // Size management
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
  async getAllSizes() {
    try {
      console.log('Fetching all sizes');
      const sizes = await this.subCategoryService.getAllSizes();
      console.log('Sizes fetched:', sizes);
      return sizes;
    } catch (error) {
      console.error('Error fetching sizes:', error);
      throw new BadRequestException('Failed to fetch sizes: ' + error.message);
    }
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

  // Age group management
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
  async getAllAgeGroups() {
    try {
      console.log('Fetching all age groups');
      const ageGroups = await this.subCategoryService.getAllAgeGroups();
      console.log('Age groups fetched:', ageGroups);
      return ageGroups;
    } catch (error) {
      console.error('Error fetching age groups:', error);
      throw new BadRequestException(
        'Failed to fetch age groups: ' + error.message,
      );
    }
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
}
