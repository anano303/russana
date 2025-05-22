import { ApiProperty } from '@nestjs/swagger';
import { Product } from '../schemas/product.schema';

export class ProductResponseDto {
  @ApiProperty({ type: [Product] })
  products: Product[];

  @ApiProperty()
  page: number;

  @ApiProperty()
  pages: number;

  @ApiProperty()
  total: number;
}