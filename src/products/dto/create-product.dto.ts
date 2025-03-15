import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsUrl,
  IsNotEmpty,
  IsPositive,
  IsOptional,
} from 'class-validator';

export class CreateProductDto {

  @ApiProperty({
    description: 'The title of the product',
    example: 'Product Name',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: 'The price of the product',
    example: 99.99,
  })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  price: number;

  @ApiProperty({
    description: 'The description of the product',
    example: 'This is a detailed description of the product',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    description: 'The category of the product',
    example: 'electronics',
  })
  @IsNotEmpty()
  @IsString()
  category: string;

  @ApiProperty({
    description: 'The image URL of the product',
    example: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg',
  })
  @IsNotEmpty()
  @IsUrl()
  image: string;
}
