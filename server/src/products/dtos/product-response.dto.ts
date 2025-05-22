import { ApiProperty } from '@nestjs/swagger';
import { Product } from '../schemas/product.schema';

export class ProductResponseDto {
  @ApiProperty({ 
    type: [Product],
    description: 'Array of products matching the filter criteria'
  })
  products: Product[];

  @ApiProperty({
    type: Number,
    description: 'Current page number'
  })
  page: number;

  @ApiProperty({
    type: Number,
    description: 'Total number of pages'
  })
  pages: number;

  @ApiProperty({
    type: Number,
    description: 'Total number of products'
  })
  total: number;
}