import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';
import { MainCategory, AgeGroup } from '../schemas/product.schema';

export class FilterProductsDto {
  @ApiProperty({
    enum: MainCategory,
    description: 'Main category filter',
    example: MainCategory.CLOTHING,
    required: false,
  })
  @IsOptional()
  @IsEnum(MainCategory)
  mainCategory?: MainCategory;

  @ApiProperty({
    description: 'Sub category filter',
    example: 'T-SHIRTS',
    required: false,
  })
  @IsOptional()
  @IsString()
  subCategory?: string;

  @ApiProperty({
    enum: AgeGroup,
    description: 'Age group filter',
    example: AgeGroup.ADULTS,
    required: false,
  })
  @IsOptional()
  @IsEnum(AgeGroup)
  ageGroup?: AgeGroup;

  @ApiProperty({
    description: 'Search keyword',
    example: 'blue t-shirt',
    required: false,
  })
  @IsOptional()
  @IsString()
  keyword?: string;

  @ApiProperty({
    type: Number,
    description: 'Page number',
    example: 1,
    required: false,
    minimum: 1,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  page: number = 1;

  @ApiProperty({
    type: Number,
    description: 'Items per page',
    example: 10,
    required: false,
    minimum: 1,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  limit: number = 10;

  @ApiProperty({
    description: 'Sort by field',
    example: 'price',
    required: false,
    enum: ['price', 'createdAt', 'rating'],
  })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiProperty({
    description: 'Sort direction',
    example: 'desc',
    required: false,
    enum: ['asc', 'desc'],
  })
  @IsOptional()
  @IsString()
  sortDirection: 'asc' | 'desc' = 'desc';
}