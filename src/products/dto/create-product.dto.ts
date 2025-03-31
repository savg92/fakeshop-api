/**
 * Data Transfer Object for creating a new product.
 * Includes validation rules for product properties.
 */
import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsUrl,
  IsNotEmpty,
  IsPositive,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    description: 'The title of the product',
    example: 'Product Name',
  })
  @IsNotEmpty({ message: 'Title is required' })
  @IsString({ message: 'Title must be a string' })
  title: string;

  @ApiProperty({
    description: 'The price of the product',
    example: 99.99,
  })
  @IsNotEmpty({ message: 'Price is required' })
  @IsNumber({}, { message: 'Price must be a number' })
  @IsPositive({ message: 'Price must be positive' })
  price: number;

  @ApiProperty({
    description: 'The description of the product',
    example: 'This is a detailed description of the product',
  })
  @IsNotEmpty({ message: 'Description is required' })
  @IsString({ message: 'Description must be a string' })
  description: string;

  @ApiProperty({
    description: 'The category of the product',
    example: 'electronics',
  })
  @IsNotEmpty({ message: 'Category is required' })
  @IsString({ message: 'Category must be a string' })
  category: string;

  @ApiProperty({
    description: 'The image URL of the product',
    example: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg',
  })
  @IsNotEmpty({ message: 'Image URL is required' })
  @IsUrl({}, { message: 'Image must be a valid URL' })
  image: string;
}
