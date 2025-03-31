/**
 * Data Transfer Object for updating a product's stock quantity.
 * Includes validation rules to ensure stock is a non-negative integer.
 */
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class UpdateStockDto {
  @ApiProperty({
    description: 'The stock quantity of the product',
    example: 50,
  })
  @IsNotEmpty({ message: 'Stock quantity is required' })
  @IsInt({ message: 'Stock must be an integer' })
  @Min(0, { message: 'Stock cannot be negative' })
  stock: number;
}
