import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type CategoryDocument = HydratedDocument<Category>;

@Schema({ timestamps: true, toJSON: { virtuals: true } })
export class Category {
  @ApiProperty({
    description: 'Category ID (auto-generated)',
    example: '60d21b4667d0d8992e610c85',
  })
  id: string;

  @ApiProperty({ description: 'Category name', example: 'ტანსაცმელი' })
  @Prop({
    required: true,
    unique: true,
  })
  name: string;

  @ApiProperty({
    description: 'Category description',
    example: 'სხვადასხვა ტიპის ტანსაცმელი',
  })
  @Prop()
  description?: string;

  @ApiProperty({ description: 'Is category active', default: true })
  @Prop({ default: true })
  isActive: boolean;

  @ApiProperty({
    description: 'Creation date',
    example: '2023-06-20T12:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update date',
    example: '2023-06-20T12:00:00Z',
  })
  updatedAt: Date;
}

export const CategorySchema = SchemaFactory.createForClass(Category);

// Ensure the virtual id field is properly included in serialization
CategorySchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});
